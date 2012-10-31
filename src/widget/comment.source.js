// comment using hunantv.com and i.hunantv.com 
// Lian Hsueh 10.24/2012
// modified: none
// 注：此文件采用无分号风格


honey.def('lib:jquery, lib:mustache', function(H) {
    
    // TODO
    //  if css loader errors, must do something
    H.css(CSS +'/widget/comment.css')

    var 
    api = 'http://comment.hunantv.com',
    current_url = window.location.href.split('#')[0],
    methods = {
        ihunantv: 'icomment',
        enthunantv: 'list'
    },
    win = $(window),
    current_user,
    no = 1, // 楼号
    page_number = 15, //每页条数
    total_number = 0, //总条数
    current_page = 1 // 当前页码


    var comment = function(_options) {
        var _ = this
        _.project = _options.project
        _.type = _options.type
        _.subject = _options.subject_id
        _.tpl = H.commentTpl[_.project]
        _.box = $('#honey-comment')
        _.listbox = _.box.find('ul')
        _.getList(current_page) 
        _.buildActions()
        _.bindEvents()
        _.buildForm()
    }
    
    // 构建提交表单
    comment.prototype.buildForm = function() {
        /*
        url:http://comment.hunantv.com/comment/post?
        type:(string) 频道
        subject_id:(int) 对象ID
        content:(string) 内容
        fid:(int) 被回复的ID 非必填
        mood:(int)心情ID 非必填
        */
        var 
        _ = this
        , id = 'honey-comment-iframe'
        , iframe = $('<iframe '
                + 'frameborder="0" '
                + 'height="0" '
                + 'name="'+ id +'" '
                + 'id="'+ id +'" '
                + 'width="0"/>')
            .appendTo('body')
        , form = $('<form />')
            .attr({
                action: api +'/comment/post',
                target: id,
                method: 'POST'
            })
            .appendTo('body')
        , upform = $('<form />')
            .attr({
                action: api +'/comment/up',
                target: id,
                method: 'POST'
            })
            .appendTo('body')
        , hiddens = {}
        
        $.each({
            type: _.type,
            subject_id: _.subject,
            content: '',
            fid: 0,
            mood: 0,
            method: 'post',
            url: current_url,
            comment_id: 0
        }, function(_name, _value) {
            hiddens[_name] = $('<input />')
                .attr({
                    type: 'hidden',
                    name: _name,
                    value: _value
                })
            hiddens[_name].appendTo(upform)
            hiddens[_name].clone().appendTo(form)

        })
        
        //hiddens['comment_id'] = $('<input />')
        //    .attr({
        //        type: 'hidden',
        //        name: 'comment_id',
        //        value: 0
        //    }).appendTo(upform)
        _.form = form
        _.upform = upform
        _.hiddens = hiddens
        _.iframe = iframe
    }

    comment.prototype.bindEvents = function() {

        var 
        _ = this,
        box = _.box
        _.timer = null
        
        // 表情
        box.on('click', '.comment-input>i', function(e) {
            var 
            o = $(this),
            mood = o.attr('class').split('-')[1],
            select_ico = o.parent().find('.selected')
            if (!select_ico.length)
                select_ico = $('<i class="selected" ></i>').insertAfter(o)
            select_ico.css('left', o.position().left)
            _.hiddens.mood.val(mood)
            return false
        }) 
        
        // 分页
        box.on('click', '.honey-comment-pages>a', function(e) {
            var page = ~~$(this).attr('href').split('#')[1] 
            if (page === current_page) return
            _.getList(page)
            return false 
        })

        // 显示回复框
        box.on('click', '.add-reply', function(e) {
            var 
            o = $(this),
            id = o.attr('href').split('#')[1],
            tpl = current_user ? _.tpl.reply : _.tpl.reply_nologin,
            item_box = $('#honey-comment-item-'+ id).find('.honey-comment-body'),
            reply_box = $('#reply-'+ id)
            //console.log(current_user)
             
            if (reply_box.data('show')) {
                reply_box.data('show', false).hide()
                return false
            } else {
                reply_box.data('show', true).hide()
                reply_box.show()
            }
            if (!reply_box.length) {
                reply_box = $(Mustache.render(tpl, id))
                reply_box.data({
                    id: id,
                    show: true
                })
                item_box.append(reply_box)
            }
            reply_box.find('input').focus()
             
            return false 
        })

        // 回复
        box.on('click', '.reply-button>button.btn', function() {
            var o = $(this)
            if (o.data('lock')) return false
            o.data('lock', true)

            var 
            reply_box = $('#'+ o.val()),
            fid = reply_box.data('id'),
            input = reply_box.find('input'),
            v = input.val(),
            scroll = win.scrollTop()
            if ($.trim(v) == '') {
                // 不能为空
                return false
            }
            _.hiddens.content.val(v)
            _.hiddens.fid.val(fid)
            _.form.submit()
            listenAPI(function(_data) {
                o.data('lock', false)
                if (hash.err) {
                    alert(hash.msg)
                } else {
                    _.getList(current_page, function() {
                        _.hiddens.content.val('')
                        _.hiddens.fid.val(0)
                        win.scrollTop(scroll)   
                    })
                }
            })
            return false
        })

        // 提交评论
        box.on('click', '.comment-submit', function(e) {
            var 
            content = box.find('textarea'),
            v = content.val()
            if ($.trim(v) == '') {
                // 不能为空
                return false
            }
            _.hiddens.content.val(v)
            _.form.submit()
            listenAPI(function(_data) {
                if (hash.err) {
                    alert(hash.msg)
                } else {
                    content.val('')
                    _.hiddens.mood.val(0)
                    _.getList(1)
                }
            }) 
            return false
        })

        // 登录
        box.on('click', '.submit', function(e) {
            var 
            btn = $(this),
            form = $('#'+ btn.val()).find('form'),
            email = form.find('.honey-comment-email'),
            pass = form.find('.honey-comment-pass'),
            passv = pass.val()
            
            if ($.trim(passv) == '') {
                alert('密码不能为空')
                return false;
            }
             
            pass.val(honey.encodePassword(passv))
            form.submit()
            return false;
        })

        // 顶一条评论
        box.on('click', '.up-comment', function(e) {
            var 
            o = $(this),
            id = o.attr('href').split('#')[1]

            if (o.data('lock')) return false
            o.data('lock', true)
            
            _.hiddens.comment_id.val(id)
            _.upform.submit()
            listenAPI(function(_data) {
                if (hash.err) {
                    alert(hash.msg)
                } else {
                    _.hiddens.comment_id.val(0)
                    o.find('strong').html('[ '+ _data.msg +' ]')
                    window.location.hash = 'position-'+ id
                }
            })
            
            return false
        })
        
        // 监听iframe返回
        var count = 1
        function listenAPI(_fn) {
            _.timer = setInterval(function() {
                var 
                href = window.location.href
                hash = href.split('#')[1]
                hash = decodeURIComponent(hash)
                if (hash && hash.indexOf('err') > 0) {
                    clearInterval(_.timer) 
                    _.timer = null
                    window.location.hash = ''
                    hash = $.parseJSON(hash)
                    count = 1
                    _fn(hash)
                    return 
                }
                count ++
                if (count > 150) {
                    clearInterval(_.timer) 
                    _.timer = null
                    count = 1
                    alert('timeout')
                }
            }, 200)
        }
    }

    //var page = 1
    comment.prototype.getList = function(_page, _fn) {
        var 
        _ = this,
        method = methods[_.project]
        url = api +'/comment/'+ method +'/?callback=?'
        current_page = _page
        _.listbox.empty().css('opacity', '0.5')
        $.getJSON(url, {
            type: _.type,
            subject_id: _.subject,
            page: _page
        }, function(_data) {
            var comments = _data.comments
            total_number = _data.total_number
            no = total_number - (_page * page_number)
            if (no < 0) no = 0

            if (!comments || !comments.length) {
                total_number = 0
                comments = []
            }

            _.box.find('h3>span').html('( 全部 '+ total_number +' )')
            while (comments.length)
                _.renderItem(comments.pop())
            _.listbox.animate({opacity: 1}, 500)
            _.buildPages(total_number)
            _fn && _fn()
        })

    }
    
    comment.prototype.buildPages = function(_total) {

        var 
        box = this.box.find('.honey-comment-pages'),
        max_page = Math.ceil(_total / page_number),
        tpl = this.tpl.pageList,
        page_len = 5,
        current = function() {
            return this == current_page
        },
        pages = []

        if (max_page < 2) return
        
        if (page_len < max_page || current_page - 3 < 1) {
            for (var i = 0; i < Math.min(max_page, page_len); i++)
                pages.push(i+1)
        } else {
            pages = [current_page - 2, current_page - 1, current_page, current_page + 1,  current_page + 2]
        }

        var data = {
            first: 1,
            prev: (current_page - 1 < 1) ? 1 : (current_page - 1),
            pages: pages,
            current: current,
            next: (current_page + 1 > max_page) ? max_page : (current_page + 1),
            end: max_page
        },
        html = Mustache.render(tpl, data)
        box.html(html)
        
    }
    comment.prototype.buildActions = function() {
        var 
        tpl = this.tpl.actions,
        tpl_nologin = this.tpl.actions_nologin,
        box = this.box.find('.honey-comment-text'),
        url = api +'/user?callback=?'
        
        $.getJSON(url, function(_data) {
            var html = (~~_data.login)
                ? (current_user = _data.user, Mustache.render(tpl, _data))
                : Mustache.render(tpl_nologin, _data)
            box.html(html)
        })
    }
    
    comment.prototype.renderItem = function(_item) {
        var item = {}
        if ($.isArray(_item)) {
            item.comment = _item.pop()
            item.comments = _item
            $.each(item.comments, function(i, v) {
                v.no = i+1
            })
        } else {
            item = _item
        }
        item.no = ++ no
        item.ie = honey.ie && honey.ie < 7
        
        var 
        html = Mustache.render(this.tpl.list, item)
        this.listbox.prepend(html)
    }
     
    H.comment = comment
})