// photoview template style 2
//
// Lian Hsueh
//

honey.def('lib:mustache', function(H) {
    H.photoview_tpl_style_2 = '<div class="mod-photo-view">'
        + '<div class="mod-photo-view-con clearfix">'
        + '<span class="close-btn"></span>'
        + '<div class="clearfix"></div>'
        + '<div class="con-left">'
        + '<a class="prev-cur" href="javascript:void(0);" hidefocus="true" target="_self" id="photo-prev"></a>'
        + '<a class="next-cur photo-next" href="javascript:void(0);" hidefocus="true" target="_self" id="photo-next"></a>'
        + '<div class="con-lpic-box" id="big_pic">'
        + '<span id="photo-view-loading" class="img-loading"></span>'
        + '<img src="{{current.big}}" id="big-box">'
        + '</div>'
        + '<div class="con-left-handle">'
        + '<span class="btn-left-rotate"></span><span class="btn-right-rotate right-s"></span>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '<div class="photo-vlist">'
        + '<div class="mod-photo-view-ulbg clearfix"></div>'
        + '<div class="mod-photo-view-ulbox" id="honey-photoview-slide">'
        + '<a href="javascript:" class="ulbox-btn hn-slide-prev"></a>'
        + '<div class="ulbox-list hn-slide-con">'
        + '<ul class="hn-slide-box mod-photo-view-ullist clearfix">'
        + '{{#photos}}'
        + '<li '
        + '{{#isCurrent}}'
        + 'class="on" '
        + '{{/isCurrent}}'
        + ' id="photos-{{id}}"><a href="javascript:"><img src="{{small}}"></a></li>'
        + '{{/photos}}'
        + ''
        + '</ul>'
        + '</div>'
        + '<a href="javascript:" class="ulbox-btn r-btn hn-slide-next"></a>'
        + '</div>'
        + '</div>'
        + '</div>' 
})
