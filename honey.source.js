/*
 * 这是一个热的不得了的日子
 * honey, just a loader, based headjs ( headjs.com )
 * version 2.0
 * 
 * mod 约定 *dir_modname*
 *  mod_dialog    mod/dialog.js ( mod/dialog.source.js )
 *  lib_jquery    lib/jquery.js ( mod/jquery.source.js )
 *
 * 文件被多次 honey.go 的处理 OK
 * IE等不能按顺序并行下载的浏览器 OK
 * IE等浏览器下combo合并 OK
 * 合并应该限制合成后文件大小 (  )
 */

var PROJECT = 'revive',
    VERSION = '2011080301',
    DEV = true,
    COMBO = true,
    COMBOURL = 'http://lab.local:8888/',
    ROOT = 'http://beta.hunantv.com:9000/js/';

(function( doc, undef ) {
    
    var
    combos = [],
    isHeadReady,
    isDomReady,
    scripts = {},
    queue = [],        // waiters for the "head ready" event
    handlers = {},     // user functions waiting for events
    scripts = {},      // loadable scripts in different states
    isAsync = 
        doc.createElement("script").async === true ||
        "MozAppearance" in doc.documentElement.style || 
        window.opera;

    
    var H = window.honey = window.HN = ( window.HN || function() {
        
    } );

    // states
    var PRELOADED = 1,
        PRELOADING = 2,
        LOADING = 3,
        LOADED = 4;
    
    H.go = isAsync ?
    
    // Method 1: simply load and let browser take care of ordering
    function( $mods, $fn ) {
        
        var 
        els = {},
        fn = $fn === undef ? false : $fn,
        mods = $mods.split( ',' );
         
        each( mods, function( $m, $i ) {
            
            $m = getScript( $m ); 
            els[$m.name] = $m;
            
            if ( !COMBO ) {
                load( $m, fn && $i == mods.length - 1 ? function() {
                    
                    if ( allLoaded( els ) ) {
                        one( fn );
                    }
            
                } : null ); 
            } else if ( COMBO && $i == mods.length - 1 ) {
                // use combo api loader
                loadCombo( els, fn );
            }
                
        } );

        return H;

    } : 

    // Method 2: preload with text/cache hack
    function( $mods, $fn ) {
        
        var
        els = {},
        fn = $fn === undef ? false : $fn,
        mods = $mods.split( ',' );

        if ( !isHeadReady ) {

            queue.push( function() {
                
                H.go.call( null, $mods, $fn );
            
            } );

            return H;
        }

        if ( COMBO ) {
            //How is going on? 
            // check for the combos list, 
            // if there one or more combos not loaded, 
            // preload this combo
            if ( hasComboNotLoaded() ) {
                 
                each( mods, function( $m, $i ) {

                    $m = getScript( $m, true ); 
                    els[$m.name] = $m;

                    if ( $i == mods.length - 1 ) {
                        // use combo api loader
                        loadCombo( els, fn, true );
                    }
                
                } );

            } else {

                each( mods, function( $m, $i ) {

                    $m = getScript( $m ); 
                    els[$m.name] = $m;

                    if ( $i == mods.length - 1 ) {
                        // use combo api loader
                        loadCombo( els, fn );
                    }
                
                } );

            }

            return H;
        }
        

        var excuteMod = mods.shift();
        
        if ( mods.length ) {
            //
            // load
            each( mods, function( $el ) {
                
                preload( getScript( $el ) );

            } );

            // execute
            load( getScript( excuteMod ), function() {

                H.go.call( null, mods.join(','), fn );

            });

        } else {
            
            load( getScript( excuteMod ), fn );
        
        }
        
        return H;

    };
     
    H.ready = function( key, fn) {

        // DOM ready check: head.ready(document, function() { });
        if ( key == doc ) {
            if ( isDomReady ) { 
                one(fn);  
            } else { 
                domWaiters.push(fn); 
            }
            return H;
        }

        // shift arguments
        if ( isFunc(key) ) {
            
            fn = key;
            key = "ALL";

        }    

        // make sure arguments are sane
        if (typeof key != 'string' || !isFunc(fn)) { return H; }

        var script = scripts[key];
        
        // script already loaded --> execute and return
        if (
            script && 
            script.state == LOADED || 
            key == 'ALL' && 
            allLoaded() && 
            isDomReady
        ) {

            one( fn );
            return H;

        }

        var arr = handlers[key];
        if ( !arr ) { 
            arr = handlers[key] = [fn]; 
        } else { 
            arr.push(fn); 
        }

        return H;

    };

    
    H.trim = function( $a ) {

        return $a.replace( /^\s+|\s+$/g, '' ); 

    };

    function getScript( $m, $justGiveScript ) {
        
        // m[0] dir, m[1] filename
        var 
        name = H.trim( $m ); 
        
        if ( scripts[name] ) {
            return scripts[name];
        }

        var
        m = name.split( '_' ),
        path = (COMBO ? '' : ROOT) + m[0] +'/'+ m[1] + (DEV ? '.source' : '') +'.js',
        script = { name: name, src: path };
        
        if ( !$justGiveScript ) {
            scripts[name] = script;
        }

        return script;
     
    }

    function each( arr, fn ) {
        if ( !arr ) { return; }

        // arguments special type
        if ( typeof arr == 'object' ) { arr = [].slice.call(arr); }

        // do the job
        for ( var i = 0; i < arr.length; i++ ) {
            fn.call(arr, arr[i], i);
        }
    }

    function allLoaded( els ) {

        els = els || scripts;

        var loaded;
        
        for ( var name in els ) {
            loaded = !( els.hasOwnProperty(name) 
                    && els[name].state != LOADED );
        }
        
        return loaded;
    }

    
    // call function once
    function one( fn ) {
        if ( fn._done ) { return; }
        fn();
        fn._done = 1;
    }

    // load combo 
    function loadCombo( $els, $fn, $preload ) {
        
        var 
        els = $els || scripts,
        notLoadedCombo = false,
        key = [],
        src = [],
        combourl = COMBOURL + PROJECT +'/'+ VERSION +'/?';

        for ( var name in els ) {
            if ( els[ name ].state == LOADED ) {

            } else if ( els[ name ].state == LOADING) {

            } else if ( els[ name ].state == PRELOADING ) {

            } else {

                key.push( name );
                src.push( els[ name ].src );
                els[ name ].state = (!$preload) && LOADING;
            }

        }
        
        combourl += src.join( '&' );
        key = key.join( ',' );
       
        if ( !$preload ) {

            combos[ key ] = { state: LOADING };
            scriptTag( combourl, function() {
                
                combos[ key ].state = LOADED;
                if ( $fn ) { $fn(); }

                for ( var name in els ) {
                    els[ name ].state = LOADED;
                    //fire event with the script
                    each( handlers[ els[name].name ], function( fn ) {
                        one( fn );
                    } );
                }
            
            } );

        } else  {

            if ( combos[ key ] ) {

                if ( combos[ key ].state == PRELOADED ) {
                    
                    //combos[ key ].fn.call();
                    loadCombo( combos[ key ].els, combos[ key ].fn );

                }
                
            } else {

                combos[ key ] = { state: PRELOADING, fn: $fn, els: $els }
                scriptTag( {src: combourl, type: 'cache'}, function() {

                    combos[ key ].state = PRELOADED;
                    H.go( key, function() {
                        $fn && $fn.call();
                    } );

                } );

            }
        }

        return H;
        
    }

    function load( script, callback ) {

        if ( script.state == LOADED ) {
            return callback && callback();
        }

        if ( script.state == LOADING ) {
            return H.ready( script.name, callback );
        }

        if ( script.state == PRELOADING ) {
            return script.onpreload.push( function() {

                load( script, callback );

            } );
        }

        script.state = LOADING;

        scriptTag( script.src, function() {

            script.state = LOADED;
            if ( callback ) { callback(); }

            // handlers for this script
            each( handlers[script.name], function( fn ) {
                one( fn );
            } );

            // everything ready
            if ( allLoaded() && isDomReady ) {
                each(handlers.ALL, function(fn) {
                    one( fn );
                });
            }
        });
    }

    function hasComboNotLoaded () {
        
        for ( var m in combos ) {
            if ( LOADED != combos[ m ].state ) return m;
        }

        return false;
    
    }

    function preload( script ) {

        if ( script.state === undefined ) {

            script.state = PRELOADING;
            script.onpreload = [];

            scriptTag( { src: script.src, type: 'cache' }, function() {

                onPreload( script );

            });
        }
    }

    function onPreload( script ) {

        script.state = PRELOADED;
        each( script.onpreload, function( el ) {
            el.call();
        } );
    }

    
    function scriptTag( src, callback ) {

        var s = doc.createElement('script');
        s.type = 'text/' + (src.type || 'javascript');
        s.src = src.src || src;
        s.async = false;

        s.onreadystatechange = s.onload = function() {

            var state = s.readyState;

            if (!callback.done && (!state || /loaded|complete/.test(state))) {
                callback.done = true;
                callback();
            }
        };

        // use body if available. more safe in IE
        (doc.body || head).appendChild(s);
    }

    function isFunc(el) {
        return Object.prototype.toString.call(el) == '[object Function]';
    }

    /*
        We wait for 300 ms before script loading starts. for some reason this is needed
        to make sure scripts are cached. Not sure why this happens yet. A case study:

        https://github.com/headjs/headjs/issues/closed#issue/83
    */
    setTimeout(function() {

        isHeadReady = true;
        each( queue, function( fn ) { fn(); });

    }, 300);

    
})( document );
