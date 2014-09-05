;(function(){
'use strict';

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    throwError()
    return
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  function throwError () {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.exts = [
    '',
    '.js',
    '.json',
    '/index.js',
    '/index.json'
 ];

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  for (var i = 0; i < 5; i++) {
    var fullPath = path + require.exts[i];
    if (require.modules.hasOwnProperty(fullPath)) return fullPath;
    if (require.aliases.hasOwnProperty(fullPath)) return require.aliases[fullPath];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {

  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' === path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }
  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throwError()
    return
  }
  require.aliases[to] = from;

  function throwError () {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' === c) return path.slice(1);
    if ('.' === c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = segs.length;
    while (i--) {
      if (segs[i] === 'deps') {
        break;
      }
    }
    path = segs.slice(0, i + 2).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("ksanaforge-boot/index.js", function(exports, require, module){
var ksana={"platform":"remote"};

if (typeof process !="undefined") {
	if (process.versions["node-webkit"]) {
  	ksana.platform="node-webkit"
  	if (typeof nodeRequire!="undefined") ksana.require=nodeRequire;
  }
} else if (typeof chrome!="undefined" && chrome.fileSystem){
	ksana.platform="chrome";
}

if (typeof React=="undefined") window.React=require('../react');
//require("../cortex");
var Require=function(arg){return require("../"+arg)};
var boot=function(appId,main,maindiv) {
	main=main||"main";
	maindiv=maindiv||"main";
	ksana.appId=appId;
	ksana.mainComponent=React.renderComponent(Require(main)(),document.getElementById(maindiv));
}
window.ksana=ksana;
window.Require=Require;
module.exports=boot;
});
require.register("brighthas-bootstrap/dist/js/bootstrap.js", function(exports, require, module){
/*!
* Bootstrap v3.0.0 by @fat and @mdo
* Copyright 2013 Twitter, Inc.
* Licensed under http://www.apache.org/licenses/LICENSE-2.0
*
* Designed and built with all the love in the world by @mdo and @fat.
*/

// if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

/* ========================================================================
 * Bootstrap: transition.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */
//if (typeof jQuery=="undefined") var jQuery =  require("jquery");

+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
        .prop('checked', !this.$element.hasClass('active'))
        .trigger('change')
      if ($input.prop('type') === 'radio') $parent.find('.active').removeClass('active')
    }

    this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#collapse
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#dropdowns
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    var $el = $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('dropdown')

      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#popovers
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#scrollspy
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#tabs
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#affix
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);
});
require.register("ksana-document/index.js", function(exports, require, module){
﻿var API={document:require('./document')
	,xml:require('./xml')
	,api:require('./api')
	,tokenizers:require('./tokenizers')
	,typeset:require('./typeset')
	,crypto:require('./sha1')
	,customfunc:require('./customfunc')
	,configs:require('./configs')
	,languages:require('./languages')
	,kde:require("./kde") //database engine
	,kse:require('./kse') // search engine
	,kdb:require("./kdb")
	,html5fs:require("./html5fs")
	,plist:require("./plist")
	,bsearch:require("./bsearch")
}
if (typeof process!="undefined") {
	API.persistent=require('./persistent');
	API.indexer_kd=require('./indexer_kd');
	API.indexer=require('./indexer');
	API.projects=require('./projects');
	//API.kdb=require('./kdb');  // file format
	API.kdbw=require('./kdbw');  // create ydb
	API.xml4kdb=require('./xml4kdb');  
	API.build=require("./buildfromxml");
	API.tei=require("./tei");
	API.regex=require("./regex");
	API.setPath=function(path) {
		console.log("API set path ",path)
		API.kde.setPath(path);
	}
}
module.exports=API;
});
require.register("ksana-document/document.js", function(exports, require, module){
/*
  Multiversion text with external durable markups
  define a "fail to migrate markup" by setting length to -1
*/
(function(){"use strict";})();
var createMarkup=function(textlen,start,len,payload) {
	if (textlen==-1) textlen=1024*1024*1024; //max string size 1GB
	//the only function create a new markup instance, be friendly to V8 Hidden Class

	if (len<0) len=textlen;
	if (start<0) start=0;
	if (start>textlen) start=textlen;
	if (start+len>textlen) {
		len-=start+len-textlen;
		if (len<0) len=0;
	}

	return {start:start,len:len,payload:payload};
};
var cloneMarkup=function(m) {
	if (typeof m=='undefined') return null;
	return createMarkup(-1,m.start,m.len,JSON.parse(JSON.stringify(m.payload)));
};
/*
TODO , handle migration of fission page
*/
var migrateMarkup=function(markup, rev) {
	var end=markup.start+markup.len;
	var text=rev.payload.text||"";
	var newlen=(text.length-rev.len);
	var revend=rev.start+rev.len;
	var m=cloneMarkup(markup); //return a new copy

	if (end<=rev.start) return m;
	else if (revend<=markup.start) {
		m.start+=newlen;
		return m;
	} else { //overlap
		//  markup    x    xx      xx    xyz      xyyyz        xyz  
		//  delete   ---   ---    ---     ---      ---        ---     
		//  dout     |     |      |		   x        xz          z            
		//  insert   +++   +++    +++     +++      +++        +++
		//  iout     +++x  +++xx  +++xx  x+++yz   x+++yyyz    +++ xyz
		if (rev.start>markup.start) {
			var adv=rev.start-markup.start;  //markup in advance of rev
			var remain=( markup.len -adv) + newlen ; // remaining character after 
			if (remain<0) remain=0;
			m.len = adv + remain ;
		} else {
			m.start=rev.start;
			var behind=markup.start-rev.start;
			m.len=markup.len - (rev.len-behind);
		}
		if (m.len<0) m.len=0;
		return m;
	}
};
var applyChanges=function(sourcetext ,revisions) {
	revisions.sort(function(r1,r2){return r2.start-r1.start;});
	var text2=sourcetext;
	revisions.map(function(r){
		text2=text2.substring(0,r.start)+r.payload.text+text2.substring(r.start+r.len);
	});
	return text2;
};
var addMarkup=function(start,len,payload) {
	this.__markups__().push(createMarkup(this.inscription.length,start, len, payload ));
	this.doc.markDirty();
};
var addRevision=function(start,len,str) {
	var valid=this.__revisions__().every(function(r) {
		return (r.start+r.len<=start || r.start>=start+len);
	});
	var newrevision=createMarkup(this.inscription.length,start,len,{text:str});
	if (valid) this.__revisions__().push(newrevision);
	this.doc.markDirty();
	return valid;
};

var diff2revision=function(diff) {
	var out=[],offset=0,i=0;
	while (i<diff.length) {
		var d=diff[i];
		if (0==d[0]) {
			offset+=d[1].length;
		} else  if (d[0]<0) { //delete
			if (i<diff.length-1 && diff[i+1][0]==1) { //combine to modify
				out.push({start:offset,len:d[1].length,payload:{text:diff[i+1][1]}});
				i++;
			} else {
				out.push({start:offset,len:d[1].length,payload:{text:""}});
			}
			offset+=d[1].length;
		} else { //insert
			out.push({start:offset,len:0,payload:{text:d[1]}});
			//offset-=d[1].length;
		}
		i++;
	}
	return out;
}


var addRevisionsFromDiff=function(diff,opts) { //Google Diff format
	var revisions=diff2revision(diff);
	this.addRevisions(revisions,opts);
	return revisions.length;
}

var addMarkups=function(newmarkups,opts) {
	if (!newmarkups) return;
	if (!newmarkups.length) return;
	if (opts &&opts.clear) this.clearMarkups();
	var maxlength=this.inscription.length;
	var markups=this.__markups__();
	for (var i=0;i<newmarkups.length;i++) {
		var m=newmarkups[i];
		var newmarkup=createMarkup(maxlength, m.start, m.len, m.payload);
		markups.push(newmarkup);
	}
};
var addRevisions=function(newrevisions,opts) {
	if (!(newrevisions instanceof Array)) return;
	if (!newrevisions.length) return;
	if (opts &&opts.clear) this.clearRevisions();
	var revisions=this.__revisions__();
	var maxlength=this.inscription.length;
	for (var i=0;i<newrevisions.length;i++) {
		var m=newrevisions[i];
		var newrevision=createMarkup(maxlength, m.start, m.len, m.payload );
		revisions.push(newrevision);	
	}
};
var downgradeMarkups=function(markups) {
	var downgraded=[];

	for (var i in markups) {
		var m=markups[i];
		for (var j=0;j<this.revert.length;j++) {
			m=migrateMarkup(m,this.revert[j]);
		}
		downgraded.push(m);
	}
	return downgraded;
};
var upgradeMarkups=function(markups,revs) {
	var migratedmarkups=[];
	markups.map(function(m){
		var s=m.start, l=m.len, delta=0, deleted=false;
		revs.map(function(rev){
			if (rev.start<=s) { //this will affect the offset
				delta+= (rev.payload.text.length-rev.len);
			}
			if (rev.start<=s && rev.start+rev.len>=s+l) {
				deleted=true;
			}
		});
		var m2=cloneMarkup(m);
		m2.start+=delta;
		if (deleted) m2.len=0;
		migratedmarkups.push(m2);
	});
	return migratedmarkups;
};
var upgradeMarkupsTo=function(M,targetPage) {
	var pg=targetPage, lineage=[], doc=this.doc;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			if (pid==pg.id)break;
			lineage.unshift(pg);
			pg=doc.getPage(pid);
	}
	lineage.map(function(pg){
		var parentPage=doc.getPage(pg.parentId);
		var rev=revertRevision(pg.revert,parentPage.inscription);
		M=parentPage.upgradeMarkups(M,rev);
	});
	return M;
};

var downgradeMarkupsTo=function(M,targetPage) {
	var pg=this,doc=this.doc;
	var ancestorId=targetPage.id;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			M=pg.downgradeMarkups(M);
			if (pid==ancestorId)break;
			pg=doc.getPage(pid);
	}
	return M;
};
var offsprings=function() {
	var out=[];
	var page=this;
	while (page.__mutant__().length) {
		var mu=page.__mutant__();
		page=mu[mu.length-1];
		out.push(page);
	}
	return out;
}
var version=function() {  //return version number of this page
	var v=0, page=this, doc=this.doc;
	while (page.parentId) {
		v++;
		page=doc.getPage(page.parentId);
	}
	return v;
}

var hasAncestor=function(ancestor) {
	var ancestorId=ancestor.id;
	var pg=this,doc=this.doc;
	
	while (true) {
		if (!pg.parentId) return false; // root	
		if (pg.parentId==ancestorId) return true;
		pg=doc.getPage(pg.parentId);
	}
	return false;
};
var getAncestors=function() {
	var pg=this,ancestor=[], doc=this.doc;
	while (true) {
			var pid=pg.parentId;
			if (!pid) break; // root	
			pg=doc.getPage(pid);
			ancestor.unshift(pg);
	}
	return ancestor;
};

var clear=function(M,start,len,author) { //return number of item removed
	var count=0;
	if (typeof start=='undefined') {
		count=M.length;
	  M.splice(0, M.length);
	  return count;
	}
	if (len<0) len=this.inscription.length;
	var end=start+len;
	for (var i=M.length-1;i>=0;--i) {
		if (M[i].start>=start && M[i].start+M[i].len<=end) {
			if (author && author!=M[i].payload.author) continue;
			M.splice(i,1);
			count++;
		}
	}
	this.doc.markDirty();
	return count;
};
var clearRevisions=function(start,len,author) {
	clear.apply(this,[this.__revisions__(),start,len,author]);
	this.doc.markDirty();
};
var clearMarkups=function(start,len,author) {
	clear.apply(this,[this.__markups__(),start,len,author]);
	this.doc.markDirty();
};
var getOrigin=function() {
	var pg=this;
	while (pg && pg.parentId) {
		pg=this.doc.getPage(pg.parentId);
	}
	return pg;
}
var isLeafPage=function() {
	return (this.__mutant__().length===0);
};
//convert revert and revision back and forth
var revertRevision=function(revs,parentinscription) {
	var revert=[], offset=0;
	revs.sort(function(m1,m2){return m1.start-m2.start;});
	revs.map(function(r){
		var newinscription="";
		var	m=cloneMarkup(r);
		var newtext=parentinscription.substr(r.start,r.len);
		m.start+=offset;
		var text=m.payload.text||"";
		m.len=text.length;
		m.payload.text=newtext;
		offset+=m.len-newtext.length;
		revert.push(m);
	});
	revert.sort(function(a,b){return b.start-a.start;});
	return revert;
};
var markupAt=function(pos,markups) {
	var markups=markups||this.__markups__();
	return markups.filter(function(m){
		var len=m.len;if (!m.len) len=1;
		return (pos>=m.start && pos<m.start+len);
	});
};
var revisionAt=function(pos) {
	return this.__revisions__().filter(function(m){
		return (pos>=m.start && pos<=m.start+m.len);
	});
};

var compressRevert=function(R) {
	var out=[];
	for (var i in R) {
		if (R[i].payload.text==="") {
			out.push([R[i].start,R[i].len]);
		} else out.push([R[i].start,R[i].len,R[i].payload.text]);
	}
	return out;
};
var decompressRevert=function(R) {
	var out=[];
	for (var i=0;i<R.length;i++) {
		if (R[i].length) { //array format
			out.push({start:R[i][0],len:R[i][1], payload:{text:R[i][2]||""}})
		} else {
			out.push({start:R[i].s,len:R[i].l, payload:{text:R[i].t||""}});	
		}
	}
	return out;
};

var toJSONString=function(opts) {
	var obj={};
	opts=opts||{};
	if (this.name) obj.n=this.name;
	if (opts.withtext) obj.t=this.inscription;
	if (this.parentId) obj.p=this.parentId;
	if (this.revert) obj.r=compressRevert(this.revert);
	var meta=this.__meta__();
	/*
	if (meta.daugtherStart) {
		obj.ds=meta.daugtherStart;
		obj.dc=meta.daugtherCount;
	}
	*/
	return JSON.stringify(obj);
};
var compressedRevert=function() {
	return compressRevert(this.revert);
}
var filterMarkup=function(cb) {
	return this.__markups__().filter(function(m){
		return cb(m);
	});
}
var findMarkup=function(query) { //same like jquery
	var name=query.name;
	var output=[];
	this.__markups__().map(function(M){
		if (M.payload.name==name) {
			output.push(M);
		}
	});
	return output;
};
/*
var fission=function(breakpoints,opts){
	var meta=this.__meta__();
	var movetags=function(newpage,start,end) {
		var M=this.__markups__();
		M.map(function(m){
			if (m.start>=start && m.start<end) {
				newpage.addMarkup(m.start-start,m.len, m.payload);
			}
		});
	};
	meta.daugtherStart=this.doc.version;
	meta.daugtherCount=breakpoints.length+1;
	// create page ,add transclude from
	var start=0, t="";
	for (var i=0;i<=breakpoints.length;i++) {
		var end=breakpoints[i]||this.inscription.length;
		t=this.inscription.substring(start,end);
		var transclude={id:this.id, start:start };//
		var newpage=this.doc.createPage({text:t, transclude:transclude});
		newpage.__setParentId__(this.id);
		movetags.apply(this,[newpage,start,end]);
		start=end;
	}

	//when convert to json, remove the inscription in origin text
	//and retrived from fission mutant
};
*/
var toggleMarkup=function(start,len,payload) {
	var M=this.__markups__();
	for (var i=0;i<M.length;i++){
		if (start===M[i].start && len==M[i].len && payload.type==M[i].payload.type) {
			M.splice(i, 1);
			return;
		} 
	}
	this.addMarkup(start,len,payload);
};

var mergeMarkup = function(markups,offsets,type) {
	markups=markups||this.__markups__();
	var M=require("./markup");
	M.addTokenOffset(markups,offsets);
	var res= M.merge(markups, type||"suggest");
	return M.applyTokenOffset(res,offsets);
}

var strikeout=function(start,length,user,type) {
	this.clearMarkups(start,length,user);
	var markups=this.__markups__();
	var M=require("./markup");
	type=type||"suggest";
	return M.strikeout(markups,start,length,user,type);
}

var preview=function(opts) { 
	//suggestion is from UI , with insert in payload
	var revisions=require("./markup").suggestion2revision(opts.suggestions);
	return this.doc.evolvePage(this,{preview:true,revisions:revisions,markups:[]});
}

/*
  change to prototype
*/
var newPage = function(opts) {
	var PG={};
	var inscription="";
	var hasInscription=false;
	var markups=[];
	var revisions=[];
	var mutant=[];

	opts=opts||{};
	opts.id=opts.id || 0; //root id==0
	var parentId=0 ,name="";
	if (typeof opts.parent==='object') {
		inscription=opts.parent.inscription;
		name=opts.parent.name;
		hasInscription=true;
		parentId=opts.parent.id;
	}
	var doc=opts.doc;
	var meta= {name:name,id:opts.id, parentId:parentId, revert:null };

	//these are the only 2 function changing inscription,use by Doc only
	var checkLength=function(ins) {
		if (ins.length>doc.maxInscriptionLength) {
			console.error("exceed size",ins.length, ins.substring(0,100));
			ins=ins.substring(0,doc.maxInscriptionLength);
		}
		return ins;
	};
	PG.__selfEvolve__  =function(revs,M) { 
		//TODO ;make sure inscription is loaded
		var newinscription=applyChanges(inscription, revs);
		var migratedmarkups=[];
		meta.revert=revertRevision(revs,inscription);
		inscription=checkLength(newinscription);
		hasInscription=true;
		markups=upgradeMarkups(M,revs);
	};
	Object.defineProperty(PG,'inscription',{
		get : function() {
			if (meta.id===0) return ""; //root page
			if (hasInscription) return inscription;
			/*
			if (meta.daugtherStart) {
				inscription="";
				for (var i=0;i<meta.daugtherCount;i++) {//combine from daugther
					var pg=this.doc.getPage(meta.daugtherStart+i);
					inscription+=pg.inscription;
				}
			} else {
			*/
				var mu=this.getMutant(0); //revert from Mutant
				inscription=checkLength(applyChanges(mu.inscription,mu.revert));				
			//}
			hasInscription=true;
			return inscription;
	}});
	//protected functions

	PG.__markups__     = function() { return markups;} ; 
	PG.__revisions__   = function() { return revisions;} ;
	PG.hasRevision     = function() { return revisions.length>0;} ;
	Object.defineProperty(PG,'id',{value:meta.id});
	Object.defineProperty(PG,'doc',{value:doc});
	Object.defineProperty(PG,'parentId',{get:function() {return meta.parentId;}});
	PG.__setParentId__ = function(i) { meta.parentId=i;	};
	PG.getMarkup       = function(i){ return cloneMarkup(markups[i]);} ;//protect from modification
	Object.defineProperty(PG,'markupCount',{get:function(){return markups.length;}});

	Object.defineProperty(PG,'revert',{get:function(){return meta.revert;}});
	PG.__setRevert__   = function(r) { meta.revert=decompressRevert(r);};
	//PG.__setDaugther__ = function(s,c) { meta.daugtherStart=s;meta.daugtherCount=c;};
	PG.getRevision     = function(i) { return cloneMarkup(revisions[i]);};
	PG.getMutant       = function(i) { return mutant[i]; };
	PG.__mutant__      = function()  { return mutant;};
	PG.__setmutant__   = function(c)  { mutant=c;};
	Object.defineProperty(PG,'revisionCount',{get:function(){return revisions.length;}});
		
	PG.setName           = function(n){ meta.name=n; return this;};
	Object.defineProperty(PG,'name',{get:function(){return meta.name;}});
	PG.__meta__        = function() {return meta;};
	Object.defineProperty(PG,'version',{get:version});
	//Object.defineProperty(PG,'daugtherStart',{get:function(){return meta.daugtherStart;}});
	//Object.defineProperty(PG,'daugtherCount',{get:function(){return meta.daugtherCount;}});
	PG.clearRevisions    = clearRevisions;
	PG.clearMarkups      = clearMarkups;
	PG.addMarkup         = addMarkup;
	PG.toggleMarkup      = toggleMarkup;
	PG.addMarkups        = addMarkups;
	PG.addRevision       = addRevision;
	PG.addRevisions      = addRevisions;
	PG.addRevisionsFromDiff=addRevisionsFromDiff;
	PG.hasAncestor       = hasAncestor;
	PG.upgradeMarkups    = upgradeMarkups;
	PG.downgradeMarkups  = downgradeMarkups;
	PG.upgradeMarkupsTo  = upgradeMarkupsTo;
	PG.downgradeMarkupsTo=downgradeMarkupsTo;
	PG.getAncestors      = getAncestors;
	PG.isLeafPage        = isLeafPage;
	PG.markupAt          = markupAt;
	PG.revisionAt        = revisionAt;
//	PG.getmutant          = getmutant;
	PG.toJSONString      = toJSONString;
	PG.findMarkup				 = findMarkup;
	PG.filterMarkup			 = filterMarkup;
//	PG.fission           = fission;
	PG.mergeMarkup       = mergeMarkup;
	PG.strikeout         = strikeout;
	PG.preview           = preview;
	PG.getOrigin       = getOrigin;
	PG.revertRevision = revertRevision;
	PG.offsprings       = offsprings;
	PG.compressedRevert=compressedRevert;
	Object.freeze(PG);
	return PG;
};
var createDocument = function(docjson,markupjson) {
	var DOC={};
	var pages=[];
	var names={};
	var meta={doctype:"dg1.0",filename:""};
	var dirty=0;
	var tags={};
	var sep="_.id";


	var createFromJSON=function(json) {
			rootPage.clearRevisions();
			var t=json.text||json.t ,page;
			if (t) {
				rootPage.addRevision(0,0,json.text || json.t);
				page=evolvePage(rootPage);				
			} else {
				page=createPage();
			}
			var name=json.n||json.name||"";
			if (!names[name]) {
				names[name]=pages.length-1;
			} else if (!json.p) {
				console.warn("repeat name "+name);
			}
			page.setName(name);
			if (json.p) page.__setParentId__(json.p);
			if (json.r) page.__setRevert__(json.r);
			/*
			if (json.ds) {
				page.__setDaugther__(json.ds,json.dc);
			}
			*/
			page.addMarkups(json.markups,true);
			page.addRevisions(json.revisions,true);
			return page;
	};
	var endCreatePages=function(opts) {
		//build mutant array
		if (opts&&opts.clear) pages.map(function(P){
			var mu=P.__mutant__();
			mu=[];
		});
		pages.map(function(P,idx,pages){
			if (P.parentId) pages[P.parentId].__mutant__().push(P);
		});		
	}
	var addMarkups=function(markups) {
		if (markups) for (var i=0;i<markups.length;i++){
			var m=markups[i];
			var pageid=m.i;
			pages[pageid].addMarkup(m.start,m.len,m.payload);
		}		
	}
	var createPages=function(json,markups) {
		var count=0,i;
		for (i=0;i<json.length;i++) {
			if (i==0 && !json[i].t) continue; //might be header
			createPage(json[i]);
		}

		endCreatePages({clear:true});
		addMarkups(markups);
		return this;
	};
	var createPage=function(input) {
		var id=pages.length,page;
		if (typeof input=='undefined' || typeof input.getMarkup=='function') {
			//root page
			var parent=input||0;
			page=newPage({id:id,parent:parent,doc:DOC});
			pages.push(page) ;
		} else if (typeof input=='string') { 
			page=createFromJSON({text:input});
		} else {
			page=createFromJSON(input);
		}
		return page;
	};
	var evolvePage=function(pg,opts) {//apply revisions and upgrate markup
		var nextgen;
		opts=opts||{};
		if (opts.preview) { 
			nextgen=newPage({parent:pg,doc:DOC,id:-1});  //id cannot null
		} else {
			nextgen=createPage(pg);	
		}
		if (pg.id) pg.__mutant__().push(nextgen);
		var revisions=opts.revisions||pg.__revisions__();
		var markups=opts.markups||pg.__markups__();
		nextgen.__selfEvolve__( revisions ,markups );

		return nextgen;
	};

	var findMRCA=function(pg1,pg2) {
		var ancestors1=pg1.getAncestors();
		var ancestors2=pg2.getAncestors();
		var common=0; //rootPage id
		while (ancestors1.length && ancestors2.length &&
		   ancestors1[0].id==ancestors2[0].id) {
			common=ancestors1[0];
			ancestors1.shift();ancestors2.shift();
		}
		return common;
	};

	var migrate=function(from,to) { //migrate markups of A to B
		if (typeof from=='number') from=this.getPage(from);
		var M=from.__markups__();
		var out=null;
		if (typeof to=='undefined') {
			out=from.downgradeMarkups(M);
		} else {
			if (typeof to=='number') to=this.getPage(to);
			if (from.id===to.id) {
				return M;
			} else if (to.hasAncestor(from)) {
				out=from.upgradeMarkupsTo(M,to);
			} else if (from.hasAncestor(to)){
				out=from.downgradeMarkupsTo(M,to);
			} else {
				var ancestor=findMRCA(from,to);
				out=from.downgradeMarkupsTo(M,ancestor);
				out=ancestor.upgradeMarkupsTo(out,to);
			}
		}
		return out;
	};
	var findPage=function(name) {
		for (var i=0;i<this.pageCount;i++) {
			if (name===pages[i].name) return pages[i];
		}
		return null;
	};
	var getLeafPages=function() {
		var arr=[],i=0;
		for (i=0;i<this.pageCount;i++) {arr[i]=true;}
		for (i=0;i<this.pageCount;i++) {
			var pid=pages[i].parentId;
			arr[pid]=false;
		}
		var leafpages=[];
		arr.map(function(p,i){ if (p) leafpages.push(i); });
		return {leafPages:leafpages, isLeafPages:arr};
	};
	/*
		convert revert to a string.
		starting with ascii 1
	*/
	var toJSONString=function() {
		var out=["["+JSON.stringify(meta)], s=",";
		var isLeafPages=this.getLeafPages().isLeafPages;
		for (var i=0;i<pages.length;i++) {
			if (i===0) continue;
			s+=pages[i].toJSONString({"withtext":isLeafPages[i]});
			out.push(s);
			s=",";
		}
		out[out.length-1]+="]";
		//make line number save as version number
		return out.join('\n');
	};

	//get a page , if version is not specified, return lastest
	//version ==0 first version, version==1 second ..
	var pageByName=function(name,version) {
		var parr=names[name];
		if (!parr) {
			return null; //pagename not found
		}
		if (typeof version=="undefined") {
			version=-1; //lastest
		}
		var pg=pages[parr];
		if (version==0) return pg; //the first version
		while (pg.__mutant__().length) {
			var mu=pg.__mutant__();
			pg=mu[mu.length-1];
			version--; 
			if  (version==0) break;
		}
		return pg;
	};

	var map=function(context,callback) {
		var cb=callback,ctx=context;
		if (typeof context=="function") {
			cb=context;
			ctx=this;
		}
		for (var i=1;i<this.pageCount;i++) {
			var pg=pages[i];
			if (pg.parentId!=0)  continue; //not a root page, 
			while (pg.__mutant__().length) {
				var mu=pg.__mutant__();
				pg=mu[mu.length-1];
			}
			cb.apply(ctx,[pg,i-1]);
		}
	}
	var pageNames=function() {
		out=[];
		for (var i=1;i<this.pageCount;i++) {
			var pg=pages[i];
			if (pg.parentId!=0)  continue; //not a root page, 
			out.push(pg.name);
		}
		return out;
	}

	var rootPage=createPage();

	DOC.getPage=function(id) {return pages[id];};
	DOC.markDirty=function() {dirty++;};
	DOC.markClean=function() {dirty=0;};
	DOC.setTags=function(T)  {tags=T;};
	DOC.setSep=function(s)  {sep=s;};
	/*
		external markups must be saved with version number.
	*/


	Object.defineProperty(DOC,'meta',{value:meta});
	Object.defineProperty(DOC,'maxInscriptionLength',{value:8192});
	Object.defineProperty(DOC,'version',{get:function(){return pages.length;}});
	Object.defineProperty(DOC,'pageCount',{get:function(){return pages.length;}});
	Object.defineProperty(DOC,'dirty',{get:function() {return dirty>0; }});
	Object.defineProperty(DOC,'ags',{get:function() {return tags;}});
	Object.defineProperty(DOC,'sep',{get:function() {return sep;}});

	
	DOC.createPage=createPage;
	DOC.createPages=createPages;
	DOC.addMarkups=addMarkups;
	DOC.evolvePage=evolvePage;
	DOC.findMRCA=findMRCA;
	DOC.migrate=migrate; 
	DOC.downgrade=migrate; //downgrade to parent
	DOC.migrateMarkup=migrateMarkup; //for testing
	DOC.getLeafPages=getLeafPages;
	DOC.findPage=findPage;
	DOC.pageByName=pageByName;
	DOC.toJSONString=toJSONString;

	DOC.map=map;
	DOC.pageNames=pageNames;
	DOC.endCreatePages=endCreatePages;

	if (docjson) DOC.createPages(docjson,markupjson);
	dirty=0;
	
	Object.freeze(DOC);
	return DOC;
};
/*
	TODO move user markups to tags
*/
/*
var splitInscriptions=function(doc,starts) {
	var combined="",j=0;
	var inscriptions=[],oldunitoffsets=[0];
	for (var i=1;i<doc.pageCount;i++) {
		var page=doc.getPage(i);
		var pageStart=doc.maxInscriptionLength*i;
 		combined+=page.inscription;
		oldunitoffsets.push(combined.length);
	}
	var last=0,newunitoffsets=[0];
	starts.map(function(S){
		var till=oldunitoffsets[ S[0] ]+ S[1];
		newunitoffsets.push(till);
		inscriptions.push( combined.substring(last,till));
		last=till;
	})
	inscriptions.push( combined.substring(last));
	newunitoffsets.push(combined.length);
	return {inscriptions:inscriptions,oldunitoffsets:oldunitoffsets , newunitoffsets:newunitoffsets};
}

var sortedIndex = function (array, tofind) {
  var low = 0, high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    array[mid] < tofind ? low = mid + 1 : high = mid;
  }
  return low;
};

var addOldUnit=function() {
// convert old unit into tags 
}

var reunitTags=function(tags,R,newtagname) {
	var out=[];
	tags.map(function(T){
		if (T.name===newtagname) return;
		var tag=JSON.parse(JSON.stringify(T));
		var pos=R.oldunitoffsets[T.sunit]+T.soff;
		var p=sortedIndex(R.newunitoffsets,pos+1)-1;
		if (p==-1) p=0;
		tag.sunit=p;tag.soff=pos-R.newunitoffsets[p];

		eunit=T.eunit||T.sunit;eoff=T.eoff||T.soff;
		if (eunit!=T.sunit || eoff!=T.soff) {
			pos=R.oldunitoffsets[eunit]+eoff;
			p=sortedIndex(R.newunitoffsets,pos)-1;
			if (p==-1) p=0;
			if (eunit!=T.sunit) tag.eunit=p;
			if (eoff!=T.soff)   tag.eoff=pos-R.newunitoffsets[p];
		}
		out.push(tag);
	});
	return out;
}
var reunit=function(doc,tagname,opts) {
	var unitstarts=[];
	doc.tags.map(function(T){
		if (T.name===tagname)	unitstarts.push([T.sunit,T.soff]);
	});

	var R=splitInscriptions(doc,unitstarts);
	var newdoc=createDocument();
	R.inscriptions.map(function(text){newdoc.createPage(text)});

	newdoc.tags=reunitTags(doc.tags,R,tagname);
	return newdoc;
}
*/
// reunit is too complicated, change to fission
// a big chunk of text divide into smaller unit
//
module.exports={ createDocument: createDocument};
});
require.register("ksana-document/api.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')var nodeRequire=require;
var appPath=""; //for servermode
var getProjectPath=function(p) {
  var path=nodeRequire('path');
  return path.resolve(p.filename);
};


var enumProject=function() { 
  return nodeRequire("ksana-document").projects.names();
};
var enumKdb=function(paths) {
  if (typeof paths=="string") {
    paths=[paths];
  }
  if (appPath) {
	  for (var i in paths) {
	  	  paths[i]=require('path').resolve(appPath,paths[i]);
	  }
  }
  var db=nodeRequire("ksana-document").projects.getFiles(paths,function(p){
    return p.substring(p.length-4)==".kdb";
  });
  return db.map(function(d){
    return d.shortname.substring(0,d.shortname.length-4)
  });
}
var loadDocumentJSON=function(opts) {
  var persistent=nodeRequire('ksana-document').persistent;
  var ppath=getProjectPath(opts.project);
  var path=nodeRequire('path');
  //if empty file, create a empty
  var docjson=persistent.loadLocal(  path.resolve(ppath,opts.file));
  return docjson;
};
var findProjectPath=function(dbid) {
  var fs=nodeRequire("fs");
  var path=nodeRequire('path');
  var tries=[ //TODO , allow any depth
               "./ksana_databases/"+dbid
               ,"../ksana_databases/"+dbid
               ,"../../ksana_databases/"+dbid
               ,"../../../ksana_databases/"+dbid
               ];
    for (var i=0;i<tries.length;i++){
      if (fs.existsSync(tries[i])) {
        return path.resolve(tries[i]);
      }
    }
    return null;
}
var saveMarkup=function(opts) {
  var path=nodeRequire('path');
  var persistent=nodeRequire('ksana-document').persistent;
  var filename=opts.filename;
  if (opts.dbid) {
    var projectpath=findProjectPath(opts.dbid);
    if (projectpath) filename=path.resolve(projectpath,filename);
  } 
  return persistent.saveMarkup(opts.markups, filename,opts.pageid||opts.i);
};
var saveDocument=function(opts) {
  var persistent=nodeRequire('ksana-document').persistent;
  return persistent.saveDocument(opts.doc , opts.filename);
};
var getUserSettings=function(user) {
  var fs=nodeRequire('fs');
  var defsettingfilename='./settings.json';
  if (typeof user=="undefined") {
    if (fs.existsSync(defsettingfilename)) {
      return JSON.parse(fs.readFileSync(defsettingfilename,'utf8'));  
    }
  }
  return {};
}
var buildIndex=function(projname) {
  nodeRequire('ksana-document').indexer_kd.start(projname);
}
var buildStatus=function(session) {
  return nodeRequire("ksana-document").indexer_kd.status(session);
}
var stopIndex=function(session) {
  return nodeRequire("ksana-document").indexer_kd.stop(session);
} 
var getProjectFolders=function(p) {
  return nodeRequire("ksana-document").projects.folders(p.filename);
}
var getProjectFiles=function(p) {
  return nodeRequire("ksana-document").projects.files(p.filename);
}

var search=function(opts,cb) {
  var Kde=nodeRequire("ksana-document").kde;
  Kde.createLocalEngine(opts.dbid,function(engine){
    nodeRequire("./kse").search(engine,opts.q,opts,cb);
  });
};
search.async=true;
var get=function(opts,cb) {
  require("./kde").openLocal(opts.db,function(engine){
      if (!engine) {
        throw "database not found "+opts.db;
      }
      engine.get(opts.key,opts.recursive,function(data){cb(0,data)});
  });
}
var setPath=function(path) {
  appPath=path;
  nodeRequire("ksana-document").setPath(path);
}
get.async=true;

var markup=require('./markup.js');
var users=require('./users');
var installservice=function(services) {
	var API={ 
        enumProject:enumProject
        ,enumKdb:enumKdb
        ,getProjectFolders:getProjectFolders
        ,getProjectFiles:getProjectFiles
        ,loadDocumentJSON:loadDocumentJSON
        ,saveMarkup:saveMarkup
        ,saveDocument:saveDocument
        ,login:users.login
        ,getUserSettings:getUserSettings
        ,buildIndex:buildIndex
        ,buildStatus:buildStatus
        ,stopIndex:stopIndex
        ,search:search
        ,get:get
        ,setPath:setPath
	  ,version: function() { return require('./package.json').version; }
	};
	if (services) {
		services.document=API;
	}
	return API;
};

module.exports=installservice;
});
require.register("ksana-document/xml.js", function(exports, require, module){
var D=require('./document');
var template_accelon=require('./template_accelon');
var formatJSON = function(json,meta) {
		var out=["["],s="";
		if (meta) {
			out[0]+=JSON.stringify(meta);
			s=",";
		}
		json.map(function(obj) {
			if (obj.toJSONString) s+=obj.toJSONString();
			else s+=JSON.stringify(obj);
			out.push(s);
			s=",";
		});
		out[out.length-1]+="]";
		return out.join('\n');
};
var importXML=function(lines,opts) {
	opts=opts||{};
	if (opts.template=='accelon') {
		return template_accelon(lines,opts);
	}
	return null;
};
var exportXML=function() {
	
};
module.exports={importXML:importXML,exportXML:exportXML,
	formatJSON:formatJSON};
});
require.register("ksana-document/template_accelon.js", function(exports, require, module){
var D=require('./document');
var unitsep=/<pb n="([^"]*?)"\/>/g  ;
/*
	inline tag
*/
var tags=[];
var tagstack=[];
var parseXMLTag=function(s) {
	var name="",i=0;
	if (s[0]=='/') {
		return {name:s.substring(1),type:'end'};
	}

	while (s[i] && (s.charCodeAt(i)>0x30)) {name+=s[i];i++;}

	var type="start";
	if (s[s.length-1]=='/') { type="emtpy"; }
	var attr={},count=0;
	s=s.substring(name.length+1);
	s.replace(/(.*?)="([^"]*?)"/g,function(m,m1,m2) {
		attr[m1]=m2;
		count++;
	});
	if (!count) attr=undefined;
	return {name:name,type:type,attr:attr};
};
var parseUnit=function(unitseq,unittext,doc) {
	// name,sunit, soff, eunit, eoff , attributes
	var totaltaglength=0;
	var parsed=unittext.replace(/<(.*?)>/g,function(m,m1,off){
		var tag=parseXMLTag(m1);
		tag.seq=unitseq;
		var offset=off-totaltaglength;
		totaltaglength+=m.length;
		if (tag.type=='end') {
			tag=tagstack.pop();
			if (tag.name!=m1.substring(1)) {
				throw 'unbalanced tag at unit  '+unittext;
			}
			if (tag.sunit!=unitseq) tag.eunit=unitseq;
			if (tag.soff!=offset) tag.eoff=offset;
		} else {
			tag.sunit=unitseq;tag.soff=offset;
			if (tag.type=='start') tagstack.push(tag);
			tags.push(tag);
		}
		return ""; //remove the tag from inscription
	});
	return {inscription:parsed, tags:tags};
};
var splitUnit=function(buf,sep) {
	var units=[], unit="", last=0 ,name="";
	buf.replace(sep,function(m,m1,offset){
		units.push([name,buf.substring(last,offset)]);
		name=m1;
		last=offset+m.length; 
	});
	units.push([name,buf.substring(last)]);
	return units;
};
var addMarkups=function(tags,page){
	tags.map(function(T){
		var start=T.soff;
		var len=0;
		if (T.eoff>T.soff) len=T.eoff-T.soff;
		var payload={name:T.name};
		if (T.attr) payload.attr=T.attr;
		page.addMarkup(start,len,payload);
	});
};
var importxml=function(buf,opts) {
	var doc=D.createDocument();
	if (opts.whole) {
		var name=opts.name||"";
		var out=parseUnit(0,buf,doc);
		if (opts.trim) out.inscription=out.inscription.trim();
		var page=doc.createPage({name:name,text:out.inscription});
		addMarkups(out.tags,page);
	} else {
		var units=splitUnit(buf,opts.sep || unitsep);
		units.map(function(U,i){
			var out=parseUnit(i,U[1],doc);
			if (opts.trim) out.inscription=out.inscription.trim();
			doc.createPage({text:out.inscription,name:U[0]});
		});		
	}

	if (tagstack.length) {
		throw 'tagstack not null'+JSON.stringify(tagstack);
	}
	doc.setTags(tags);
	return doc;
};
module.exports=importxml;
});
require.register("ksana-document/persistent.js", function(exports, require, module){
if (typeof nodeRequire!="function") nodeRequire=require; 
var maxFileSize=512*1024;//for github
var D=require("./document");
var fs=nodeRequire("fs"); 
/*
var open=function(fn,mfn) {
	var kd,kdm="";
	var kd=fs.readFileSync(fn,'utf8');
	if (!mfn) mfn=fn+"m";
	if (fs.existsSync(mfn)) {
		kdm=fs.readFileSync(mfn,'utf8');	
	}

	return {kd:kd,kdm:kdm}
}
*/
var loadLocal=function(fn,mfn) {
//if (!fs.existsSync(fn)) throw "persistent.js::open file not found ";
	if (fs.existsSync(fn)){
		var content=fs.readFileSync(fn,'utf8');
		var kd=null,kdm=null;
		try {
			kd=JSON.parse(content);
		} catch (e) {
			kd=[{"create":new Date()}];
		}		
	}
		
	if (!mfn) mfn=fn.substr(0,fn.lastIndexOf("."))+".kdm";
	if (fs.existsSync(mfn)) {
		kdm=JSON.parse(fs.readFileSync(mfn,'utf8'));	
	}
	return {kd:kd,kdm:kdm};
}
/* load json and create document */
var createLocal=function(fn,mfn) {
	var json=loadLocal(fn,mfn);
	var doc=D.createDocument(json.kd,json.kdm);
	doc.meta.filename=fn;
	return doc;
};
var serializeDocument=function(doc) {
	var out=[];
	for (var i=1;i<doc.pageCount;i++) {
		var P=doc.getPage(i);
		var obj={n:P.name, t:P.inscription};
		if (P.parentId) obj.p=P.parentId;
		out.push(JSON.stringify(obj));
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};
var serializeXMLTag=function(doc) {
	if (!doc.tags)return;
	var out=[];
	for (var i=0;i<doc.tags.length;i++) {
		out.push(JSON.stringify(doc.tags[i]));
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};
var serializeMarkup=function(doc) {
	var out=[];
	var sortfunc=function(a,b) {
		return a.start-b.start;
	};
	for (var i=0;i<doc.pageCount;i++) {
		var M=doc.getPage(i).__markups__();

		var markups=JSON.parse(JSON.stringify(M)).sort(sortfunc);

		for (var j=0;j<markups.length;j++) {
			var m=markups[j];
			m.i=i;
			out.push(JSON.stringify(m));
		}
	}
	return 	"[\n"+out.join("\n,")+"\n]";
};


var saveMarkup=function(markups,filename,pageid) { //same author
	if (!markups || !markups.length) return null;
	var author=markups[0].payload.author, others=[];
	var mfn=filename+'m';
	var json=loadLocal(filename,mfn);
	if (!json.kdm || !json.kdm.length) {
		others=[];
	} else {
		others=json.kdm.filter(function(m){return m.i!=pageid || m.payload.author != author});	
	}
	for (var i=0;i<markups.length;i++) {
		markups[i].i=pageid;
	}
	others=others.concat(markups);
	var sortfunc=function(a,b) {
		//each page less than 64K
		return (a.i*65536 +a.start) - (b.i*65536 +b.start);
	}
	others.sort(sortfunc);
	var out=[];
	for (var i=0;i<others.length;i++) {
		out.push(JSON.stringify(others[i]));
	}
	return fs.writeFile(mfn,"[\n"+out.join("\n,")+"\n]",'utf8',function(err){
		//		
	});
}
var saveMarkupLocal=function(doc,mfn) {
	if (!doc.meta.filename && !mfn) throw "missing filename";
	if (!doc.dirty) return;
	if (typeof mfn=="undefined") {
		mfn=doc.meta.filename+"m";
	}
	var out=serializeMarkup(doc);
	return fs.writeFile(mfn,out,'utf8',function(err){
		if (!err) doc.markClean();
	});
};

var saveDocument=function(doc,fn) {
	if (!fn) fn=doc.meta.filename;
	var out=serializeDocument(doc);
	if (out.length>maxFileSize) {
		console.error('file size too big ',out.length);
	}
	return fs.writeFileSync(fn,out,'utf8');
};

var saveDocumentTags=function(doc,fn) {
	if (!fn) fn=doc.meta.filename;
	var out=serializeXMLTag(doc);
	return fs.writeFileSync(fn,out,'utf8');
};

module.exports={
	loadLocal:loadLocal,
	createLocal:createLocal,
	saveDocument:saveDocument,
	saveDocumentTags:saveDocumentTags,
	saveMarkup:saveMarkup,
	serializeDocument:serializeDocument,
	serializeMarkup:serializeMarkup,
	serializeXMLTag:serializeXMLTag
};
});
require.register("ksana-document/tokenizers.js", function(exports, require, module){
var tibetan =function(s) {
	//continuous tsheg grouped into same token
	//shad and space grouped into same token
	var offset=0;
	var tokens=[],offsets=[];
	s=s.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
	var arr=s.split('\n');

	for (var i=0;i<arr.length;i++) {
		var last=0;
		var str=arr[i];
		str.replace(/[།་ ]+/g,function(m,m1){
			tokens.push(str.substring(last,m1)+m);
			offsets.push(offset+last);
			last=m1+m.length;
		});
		if (last<str.length) {
			tokens.push(str.substring(last));
			offsets.push(last);
		}
		if (i===arr.length-1) break;
		tokens.push('\n');
		offsets.push(offset+last);
		offset+=str.length+1;
	}

	return {tokens:tokens,offsets:offsets};
};
var isSpace=function(c) {
	return (c==" ") || (c==",") || (c==".");
}
var isCJK =function(c) {return ((c>=0x3000 && c<=0x9FFF) 
|| (c>=0xD800 && c<0xDC00) || (c>=0xFF00) ) ;}
var simple1=function(s) {
	var offset=0;
	var tokens=[],offsets=[];
	s=s.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
	arr=s.split('\n');

	var pushtoken=function(t,off) {
		var i=0;
		if (t.charCodeAt(0)>255) {
			while (i<t.length) {
				var c=t.charCodeAt(i);
				offsets.push(off+i);
				tokens.push(t[i]);
				if (c>=0xD800 && c<=0xDFFF) {
					tokens[tokens.length-1]+=t[i]; //extension B,C,D
				}
				i++;
			}
		} else {
			tokens.push(t);
			offsets.push(off);	
		}
	}
	for (var i=0;i<arr.length;i++) {
		var last=0,sp="";
		str=arr[i];
		str.replace(/[_0-9A-Za-z]+/g,function(m,m1){
			while (isSpace(sp=str[last]) && last<str.length) {
				tokens[tokens.length-1]+=sp;
				last++;
			}
			pushtoken(str.substring(last,m1)+m , offset+last);
			offsets.push(offset+last);
			last=m1+m.length;
		});

		if (last<str.length) {
			while (isSpace(sp=str[last]) && last<str.length) {
				tokens[tokens.length-1]+=sp;
				last++;
			}
			pushtoken(str.substring(last), offset+last);
			
		}		
		offsets.push(offset+last);
		offset+=str.length+1;
		if (i===arr.length-1) break;
		tokens.push('\n');
	}

	return {tokens:tokens,offsets:offsets};

};

var simple=function(s) {
	var token='';
	var tokens=[], offsets=[] ;
	var i=0; 
	var lastspace=false;
	var addtoken=function() {
		if (!token) return;
		tokens.push(token);
		offsets.push(i);
		token='';
	}
	while (i<s.length) {
		var c=s.charAt(i);
		var code=s.charCodeAt(i);
		if (isCJK(code)) {
			addtoken();
			token=c;
			if (code>=0xD800 && code<0xDC00) { //high sorragate
				token+=s.charAt(i+1);i++;
			}
			addtoken();
		} else {
			if (c=='&' || c=='<' || c=='?'
			|| c=='|' || c=='~' || c=='`' || c==';' 
			|| c=='>' || c==':' || c=='{' || c=='}'
			|| c=='=' || c=='@' || c=='[' || c==']' || c=='(' || c==')' || c=="-"
			|| code==0xf0b || code==0xf0d // tibetan space
			|| (code>=0x2000 && code<=0x206f)) {
				addtoken();
				if (c=='&' || c=='<') {
					var endchar='>';
					if (c=='&') endchar=';'
					while (i<s.length && s.charAt(i)!=endchar) {
						token+=s.charAt(i);
						i++;
					}
					token+=endchar;
					addtoken();
				} else {
					token=c;
					addtoken();
				}
				token='';
			} else {
				if (isSpace(c)) {
					token+=c;
					lastspace=true;
				} else {
					if (lastspace) addtoken();
					lastspace=false;
					token+=c;
				}
			}
		}
		i++;
	}
	addtoken();
	return {tokens:tokens,offsets:offsets};
}
module.exports={simple:simple,tibetan:tibetan};
});
require.register("ksana-document/markup.js", function(exports, require, module){
/*
	merge needs token offset, not char offset
*/
var splitDelete=function(m) {
	var out=[];
	for (i=0;i<m.l;i++) {
		var m2=JSON.parse(JSON.stringify(m));
		m2.s=m.s+i;
		m2.l=1;
		out.push(m2);
	}
	return out;
}
var quantize=function(markup) {
	var out=[],i=0,m=JSON.parse(JSON.stringify(markup));
	if (m.payload.insert) {
			m.s=m.s+m.l-1;
			m.l=1;
			out.push(m)
	} else {
		if (m.payload.text=="") { //delete
			out=splitDelete(m);
		} else { //replace
			if (m.l>1) {//split to delete and replace
				var m2=JSON.parse(JSON.stringify(m));
				m.payload.text="";
				m.l--;
				out=splitDelete(m);
				m2.s=m2.s+m2.l-1;
				m2.l=1;
				out.push(m2);
			} else {
				out.push(m);
			}
		}
	}
	return out;
}
var plural={
	"suggest":"suggests"
}
var combinable=function(p1,p2) {
	var t="";
	for (var i=0;i<p1.choices.length;i++) t+=p1.choices[i].text;
	for (var i=0;i<p2.choices.length;i++) t+=p2.choices[i].text;
	return (t==="");
}
var combine=function(markups) {
	var out=[],i=1,at=0;

	while (i<markups.length) {
		if (combinable(markups[at].payload,markups[i].payload)) {
			markups[at].l++;
		} else {
			out.push(markups[at]);
			at=i;
		}
		i++;
	}
	out.push(markups[at]);
	return out;
}
var merge=function(markups,type){
	var out=[],i=0;
	for (i=0;i<markups.length;i++) {
		if (markups[i].payload.type===type)	out=out.concat(quantize(markups[i]));
	}
	var type=plural[type];
	if (typeof type=="undefined") throw "cannot merge "+type;
	if (!out.length) return [];
	out.sort(function(a,b){return a.s-b.s;});
	var out2=[{s:out[0].s, l:1, payload:{type:type,choices:[out[0].payload]}}];
	for (i=1;i<out.length;i++) {
		if (out[i].s===out2[out2.length-1].s ) {
			out2[out2.length-1].payload.choices.push(out[i].payload);
		} else {
			out2.push({s:out[i].s,l:1,payload:{type:type,choices:[out[i].payload]}});
		}
	}
	return combine(out2);
}
var addTokenOffset=function(markups,offsets) {
	for (var i=0;i<markups.length;i++) {
		var m=markups[i],at,at2;
		at=offsets.indexOf(m.start); //need optimized
		if (m.len) at2=offsets.indexOf(m.start+m.len);
		if (at==-1 || at2==-1) {
			console.trace("markup position not at token boundary");
			break;
		}

		m.s=at;
		if (m.len) m.l=at2-at;
	}
	return markups;
}

var applyTokenOffset=function(markups,offsets) {
	for (var i=0;i<markups.length;i++) {
		var m=markups[i];
		m.start=offsets[m.s];
		m.len=offsets[m.s+m.l] - offsets[m.s];
		delete m.s;
		delete m.l;
	}
	return markups;
}

var suggestion2revision=function(markups) {
	var out=[];
	for (var i=0;i<markups.length;i++) {
		var m=markups[i];
		var payload=m.payload;
		if (payload.insert) {
			out.push({start:m.start+m.len,len:0,payload:payload});
		} else {
			out.push({start:m.start,len:m.len,payload:payload});
		}
	}
	return out;
}

var strikeout=function(markups,start,len,user,type) {
	var payload={type:type,author:user,text:""};
	markups.push({start:start,len:len,payload:payload});
}
module.exports={merge:merge,quantize:quantize,
	addTokenOffset:addTokenOffset,applyTokenOffset:applyTokenOffset,
	strikeout:strikeout, suggestion2revision : suggestion2revision
}
});
require.register("ksana-document/typeset.js", function(exports, require, module){
/*
		if (=="※") {
			arr[i]=React.DOM.br();
		}
*/

var classical=function(arr) {
	var i=0,inwh=false,inwarichu=false,start=0;
	var out=[];

	var newwarichu=function(now) {
		var warichu=arr.slice(start,now);
		var height=Math.round( (warichu.length)/2);
		var w1=warichu.slice(0,height);
		var w2=warichu.slice(height);

		var w=[React.DOM.span({className:"warichu-right"},w1),
		       React.DOM.span({className:"warichu-left"},w2)];
		out.push(React.DOM.span({"className":"warichu"},w));
		start=now;
	}

	var linebreak=function(now) {
		if (inwarichu) {
			newwarichu(now,true);
			start++;
		}
		out.push(React.DOM.br());
	}
	while (i<arr.length) {
		var ch=arr[i].props.ch;
		if (ch=='※') {
			linebreak(i);
		}	else if (ch=='【') { //for shuowen
			start=i+1;
			inwh=true;
		}	else if (ch=='】') {
			var wh=arr.slice(start,i);
			out.push(React.DOM.span({"className":"wh"},wh));
			inwh=false;
		} else if (ch=='﹝') {

			start=i+1;
			inwarichu=true;
		} else if (ch=='﹞') {
			if (!inwarichu) { //in previous page
				out=[];
				inwarichu=true;
				start=0; //reset
				i=0;
				continue;
			}
			newwarichu(i);
			inwarichu=false;
		} else{
			if (!inwh && !inwarichu && ch!='↩') out.push(arr[i]);
		}
		i++;
	}
	if (inwarichu) newwarichu(arr.length-1);

	return React.DOM.span({"className":"vertical"},out);
}
module.exports={classical:classical}
});
require.register("ksana-document/sha1.js", function(exports, require, module){
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(e,m){var p={},j=p.lib={},l=function(){},f=j.Base={extend:function(a){l.prototype=this;var c=new l;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
n=j.WordArray=f.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=m?c:4*a.length},toString:function(a){return(a||h).stringify(this)},concat:function(a){var c=this.words,q=a.words,d=this.sigBytes;a=a.sigBytes;this.clamp();if(d%4)for(var b=0;b<a;b++)c[d+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((d+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[d+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=e.ceil(c/4)},clone:function(){var a=f.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*e.random()|0);return new n.init(c,a)}}),b=p.enc={},h=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++){var f=c[d>>>2]>>>24-8*(d%4)&255;b.push((f>>>4).toString(16));b.push((f&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d+=2)b[d>>>3]|=parseInt(a.substr(d,
2),16)<<24-4*(d%8);return new n.init(b,c/2)}},g=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],d=0;d<a;d++)b.push(String.fromCharCode(c[d>>>2]>>>24-8*(d%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],d=0;d<c;d++)b[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return new n.init(b,c)}},r=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(g.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return g.parse(unescape(encodeURIComponent(a)))}},
k=j.BufferedBlockAlgorithm=f.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=r.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,d=c.sigBytes,f=this.blockSize,h=d/(4*f),h=a?e.ceil(h):e.max((h|0)-this._minBufferSize,0);a=h*f;d=e.min(4*a,d);if(a){for(var g=0;g<a;g+=f)this._doProcessBlock(b,g);g=b.splice(0,a);c.sigBytes-=d}return new n.init(g,d)},clone:function(){var a=f.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=k.extend({cfg:f.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){k.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,b){return(new a.init(b)).finalize(c)}},_createHmacHelper:function(a){return function(b,f){return(new s.HMAC.init(a,
f)).finalize(b)}}});var s=p.algo={};return p}(Math);
(function(){var e=CryptoJS,m=e.lib,p=m.WordArray,j=m.Hasher,l=[],m=e.algo.SHA1=j.extend({_doReset:function(){this._hash=new p.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(f,n){for(var b=this._hash.words,h=b[0],g=b[1],e=b[2],k=b[3],j=b[4],a=0;80>a;a++){if(16>a)l[a]=f[n+a]|0;else{var c=l[a-3]^l[a-8]^l[a-14]^l[a-16];l[a]=c<<1|c>>>31}c=(h<<5|h>>>27)+j+l[a];c=20>a?c+((g&e|~g&k)+1518500249):40>a?c+((g^e^k)+1859775393):60>a?c+((g&e|g&k|e&k)-1894007588):c+((g^e^
k)-899497514);j=k;k=e;e=g<<30|g>>>2;g=h;h=c}b[0]=b[0]+h|0;b[1]=b[1]+g|0;b[2]=b[2]+e|0;b[3]=b[3]+k|0;b[4]=b[4]+j|0},_doFinalize:function(){var f=this._data,e=f.words,b=8*this._nDataBytes,h=8*f.sigBytes;e[h>>>5]|=128<<24-h%32;e[(h+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(h+64>>>9<<4)+15]=b;f.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=j.clone.call(this);e._hash=this._hash.clone();return e}});e.SHA1=j._createHelper(m);e.HmacSHA1=j._createHmacHelper(m)})();
module.exports=CryptoJS;
});
require.register("ksana-document/users.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')var nodeRequire=require;

var passwords=[];

var loadpasswd=function(){
	var defpasswdfilename='./passwd.json';
	var fs=nodeRequire('fs');
    if (fs.existsSync(defpasswdfilename)) {
    	passwords=JSON.parse(fs.readFileSync(defpasswdfilename,'utf8'));  
    }
}
var login=function(opts) {
	opts=opts||{};
	var password=opts.password||opts.pw;
	var out={name:opts.name,error:"user not found"};
	if (!passwords.length) loadpasswd();
	for (var i=0;i<passwords.length;i++) {
		var u=passwords[i];
		if (u.name==opts.name) {
			if (u.pw!=password) {
				out.error="wrong password";
			} else {
				out=JSON.parse(JSON.stringify(u));
				delete out.pw;
				out.error="";
				return out;
			}
		}
	}
	return out;
}
module.exports={login:login}
});
require.register("ksana-document/customfunc.js", function(exports, require, module){
/* 
  custom func for building and searching ydb

  keep all version
  
  getAPI(version); //return hash of functions , if ver is omit , return lastest
	
  postings2Tree      // if version is not supply, get lastest
  tokenize(text,api) // convert a string into tokens(depends on other api)
  normalizeToken     // stemming and etc
  isSpaceChar        // not a searchable token
  isSkipChar         // 0 vpos

  for client and server side
  
*/
var configs=require("./configs");
var config_simple="simple1";
var optimize=function(json,config) {
	config=config||config_simple;
	return json;
}

var getAPI=function(config) {
	config=config||config_simple;
	var func=configs[config].func;
	func.optimize=optimize;
	if (config=="simple1") {
		//add common custom function here
	} else if (config=="tibetan1") {

	} else throw "config "+config +"not supported";

	return func;
}

module.exports={getAPI:getAPI};
});
require.register("ksana-document/configs.js", function(exports, require, module){
var tokenizers=require('./tokenizers');

var normalize1=function(token) {
	return token.replace(/[ \.,]/g,'').trim();
}
var isSkip1=function(token) {
	var t=token.trim();
	return (t=="" || t=="　" || t=="※" || t=="\n");
}
var normalize_tibetan=function(token) {
	return token.replace(/[།་ ]/g,'').trim();
}

var isSkip_tibetan=function(token) {
	var t=token.trim();
	return (t=="" || t=="　" ||  t=="\n");	
}
var simple1={
	func:{
		tokenize:tokenizers.simple
		,normalize: normalize1
		,isSkip:	isSkip1
	}
	
}
var tibetan1={
	func:{
		tokenize:tokenizers.tibetan
		,normalize:normalize_tibetan
		,isSkip:isSkip_tibetan
	}
}
module.exports={"simple1":simple1,"tibetan1":tibetan1}
});
require.register("ksana-document/projects.js", function(exports, require, module){
/*
  given a project id, find all folders and files
  projects be should under ksana_databases, like node_modules
*/
if (typeof nodeRequire=='undefined')nodeRequire=require;
function getFiles(dirs,filtercb){	
  var fs=nodeRequire('fs');
  var path=nodeRequire('path');
  var out=[];
  var shortnames={}; //shortname must be unique
  if (typeof dirs=='string')dirs=[dirs];

  for (var j=0;j<dirs.length;j++ ) {
    var dir=dirs[j];
    if (!fs.existsSync(dir))continue;
    var files = fs.readdirSync(dir);
    for(var i in files){
      if (!files.hasOwnProperty(i)) continue;
      if (files[i][0]==".") continue;//skip hidden file
      var name = dir+'/'+files[i],config=null;
      if (filtercb(name)) {
          var json=name+'/ksana.json';
          if (fs.existsSync(json)) {          
            config=JSON.parse(fs.readFileSync(name+'/ksana.json','utf8'));
            var stat=fs.statSync(json);
            config.lastModified=stat.mtime;
            config.shortname=files[i];
            config.filename=name;
          } else {
            config={name:name,filename:name,shortname:files[i]};
          }
          var pathat=config.filename.lastIndexOf('/');
          config.withfoldername=config.filename.substring(1+config.filename.lastIndexOf('/',pathat-1));

          if (!shortnames[files[i]]) out.push(config);
          shortnames[files[i]]=true;
      }
    }
  }
  return out;
}

var listFolders=function(path) {
  var fs=nodeRequire('fs');
  var folders= getFiles( path ,function(name){
      return fs.statSync(name).isDirectory();
  });
  if (!folders.length)return folders;
  if (parseInt(folders[0].shortname)) {
    folders.sort(function(a,b) {
      return parseInt(a.shortname)-parseInt(b.shortname);
    });
  } else {
    folders.sort(function(a,b) {
      if (a.shortname==b.shortname) return 0; 
      else if (a.shortname>b.shortname) return 1; else return -1;
    });
  }
  return folders;
};
var listFiles=function(path) {
  var fs=nodeRequire('fs');
  var files= getFiles( path,function(name){
      return name.indexOf(".kd")===name.length-3;
  });
  if (!files.length)return files;
  if (parseInt(files[0].shortname)) {
    files.sort(function(a,b) {
      return parseInt(a.shortname)-parseInt(b.shortname);
    });
  } else {
    files.sort(function(a,b) {
      if (a.shortname==b.shortname) return 0; 
      else if (a.shortname>b.shortname) return 1; else return -1;
    });
  }
  return files;
};

var listProject=function() {
  var fs=nodeRequire('fs');
	//search for local 
	var folders= getFiles(['./ksana_databases','../ksana_databases','../../ksana_databases'],function(name){
      if (fs.statSync(name).isDirectory()){
        return fs.existsSync(name+'/ksana.json');
      }
  });

	return folders;
}

var fullInfo=function(projname) {
  var fs=nodeRequire('fs');
  if (fs.existsSync(projname+'/ksana.json')) {//user provide a folder
    var normalized=require('path').resolve(projname);
    normalized=normalized.substring(normalized.lastIndexOf(require('path').sep)+1);
    var projectpath=projname;
    var name=normalized;
  } else { //try id
    var proj=listProject().filter(function(f){ return f.shortname==projname});
    if (!proj.length) return null;
    var projectpath=proj[0].filename;
    var name=proj[0].shortname;
  }

  var files=[];  
  var ksana=JSON.parse(fs.readFileSync(projectpath+'/ksana.json','utf8'));    

  listFolders(projectpath).map(function(f){
    var ff=listFiles(f.filename);
    files=files.concat(ff);
  })
  return {name:name,filename:projectpath,ksana:ksana,files: files.map(function(f){return f.filename})};
}

module.exports={getFiles:getFiles,names:listProject,folders:listFolders,files:listFiles,fullInfo:fullInfo};
});
require.register("ksana-document/indexer.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;

var indexing=false; //only allow one indexing task
var status={pageCount:0,progress:0,done:false}; //progress ==1 completed
var session={};
var api=null;
var xml4kdb=null;
var isSkip=null;
var normalize=null;
var tokenize=null;

var putPosting=function(tk) {
	var	postingid=session.json.tokens[tk];
	var out=session.json, posting=null;
	if (!postingid) {
		out.postingCount++;
		posting=out.postings[out.postingCount]=[];
		session.json.tokens[tk]=out.postingCount;
	} else {
		posting=out.postings[postingid];
	}
	posting.push(session.vpos);
}
var putPage=function(inscription) {
	var tokenized=tokenize(inscription);
	var tokenOffset=0, tovpos=[];
	for (var i=0;i<tokenized.tokens.length;i++) {
		var t=tokenized.tokens[i];
		tovpos[tokenOffset]=session.vpos;
		tokenOffset+=t.length;
		if (isSkip(t)) {
			 session.vpos--;
		} else {
			var normalized=normalize(t);
			if (normalized) 	putPosting(normalized);
 		}
 		session.vpos++;
	}
	tovpos[tokenOffset]=session.vpos;
	session.indexedTextLength+= inscription.length;
	return tovpos;
}
var upgradeDocument=function(d,dnew) {
	var Diff=nodeRequire("./diff");	
	dnew.map(function(pg){
		var oldpage=d.pageByName(pg.name);
		var ninscription=dnew.inscription;
		if (oldpage) {
			var diff=new Diff();
			var oinscription=oldpage.inscription;
			var df=diff.diff_main(oinscription, pg.inscription);

			var revisioncount=oldpage.addRevisionsFromDiff(df);
			if (revisioncount) d.evolvePage(oldpage);
		} else {
			d.createPage({n:pgname,t:ninscription});
		}
	});	
}
var shortFilename=function(fn) {
	var arr=fn.split('/');
	while (arr.length>2) arr.shift();
	return arr.join('/');
}

var putFileInfo=function(fileContent) {
	var shortfn=shortFilename(status.filename);
	//session.json.files.push(fileInfo);
	session.json.fileContents.push(fileContent);
	session.json.fileNames.push(shortfn);
	session.json.fileOffsets.push(session.vpos);
	//fileInfo.pageOffset.push(session.vpos);
}
var putPages_new=function(parsed,cb) { //25% faster than create a new document
	//var fileInfo={pageNames:[],pageOffset:[]};
	var fileContent=[];
	parsed.tovpos=[];

	putFileInfo(fileContent);
	for (var i=0;i<parsed.texts.length;i++) {
		var t=parsed.texts[i];
		fileContent.push(t.t);
		var tovpos=putPage(t.t);
		parsed.tovpos[i]=tovpos;
		session.json.pageNames.push(t.n);
		session.json.pageOffsets.push(session.vpos);
	}
	
	cb(parsed);//finish
}

var putPages=function(doc,parsed,cb) {
	var fileInfo={parentId:[],reverts:[]};
	var fileContent=[];	
	var hasParentId=false, hasRevert=false;
	parsed.tovpos=[];

	putFileInfo(fileContent);
	if (!session.files) session.files=[];
	session.json.files.push(fileInfo);
	
	for (var i=1;i<doc.pageCount;i++) {
		var pg=doc.getPage(i);
		if (pg.isLeafPage()) {
			fileContent.push(pg.inscription);
			var tovpos=putPage(pg.inscription);
			parsed.tovpos[i-1]=tovpos;
		} else {
			fileContent.push("");
		}
		sesison.json.pageNames.push(pg.name);
		session.json.pageOffsets.push(session.vpos);

		fileInfo.parentId.push(pg.parentId);
		if (pg.parentId) hasParentId=true;
		var revertstr="";
		if (pg.parentId) revertstr=JSON.stringify(pg.compressedRevert());
		if (revertstr) hasRevert=true;
		fileInfo.reverts.push( revertstr );
	}
	if (!hasParentId) delete fileInfo["parentId"];
	if (!hasRevert) delete fileInfo["reverts"];
	cb(parsed);//finish
}
var putDocument=function(parsed,cb) {
	if (session.kdb) { //update an existing kdb
		var D=nodeRequire("./document");
		var dnew=D.createDocument(parsed.texts);
		session.kdb.getDocument(status.filename,function(d){
			if (d) {
				upgradeDocument(d,dnew);
				putPages(d,parsed,cb);
				status.pageCount+=d.pageCount-1;
			} else { //no such page in old kdb
				putPages(dnew,parsed,cb);
				status.pageCount+=dnew.pageCount-1;
			}
		});
	} else {
		putPages_new(parsed,cb);
		status.pageCount+=parsed.texts.length;//dnew.pageCount;
	}
}

var parseBody=function(body,sep,cb) {
	var res=xml4kdb.parseXML(body, {sep:sep,trim:!!session.config.trim});
	putDocument(res,cb);
}

var pat=/([a-zA-Z:]+)="([^"]+?)"/g;
var parseAttributesString=function(s) {
	var out={};
	s.replace(pat,function(m,m1,m2){out[m1]=m2});
	return out;
}
var storeFields=function(fields,json) {
	if (!json.fields) json.fields={};
	var root=json.fields;
	if (!(fields instanceof Array) ) fields=[fields];
	var storeField=function(field) {
		var path=field.path;
		storepoint=root;
		if (!(path instanceof Array)) path=[path];
		for (var i=0;i<path.length;i++) {
			if (!storepoint[path[i]]) {
				if (i<path.length-1) storepoint[path[i]]={};
				else storepoint[path[i]]=[];
			}
			storepoint=storepoint[path[i]];
		}
		if (typeof field.value=="undefined") {
			throw "empty field value of "+path;
		} 
		storepoint.push(field.value);
	}
	fields.map(storeField);
}
/*
	maintain a tag stack for known tag
*/
var tagStack=[];
var processTags=function(captureTags,tags,texts) {
	var getTextBetween=function(from,to,startoffset,endoffset) {
		if (from==to) return texts[from].t.substring(startoffset,endoffset);
		var first=texts[from].t.substr(startoffset);
		var middle="";
		for (var i=from+1;i<to;i++) {
			middle+=texts[i].t;
		}
		var last=texts[to].t.substr(0,endoffset);
		return first+middle+last;
	}
	for (var i=0;i<tags.length;i++) {

		for (var j=0;j<tags[i].length;j++) {
			var T=tags[i][j],tagname=T[1],tagoffset=T[0],attributes=T[2],tagvpos=T[3];	
			if (captureTags[tagname]) {
				attr=parseAttributesString(attributes);
				tagStack.push([tagname,tagoffset,attr,i]);
			}
			var handler=null;
			if (tagname[0]=="/") {
				handler=captureTags[tagname.substr(1)];
			} 
			if (handler) {
				var prev=tagStack[tagStack.length-1];
				if (tagname.substr(1)!=prev[0]) {
					console.error("tag unbalance",tagname,prev[0]);
				} else {
					tagStack.pop();
				}
				var text=getTextBetween(prev[3],i,prev[1],tagoffset);
				status.vpos=tagvpos; 
				status.tagStack=tagStack;
				var fields=handler(text, tagname, attr, status);
				
				if (fields) storeFields(fields,session.json);
			}
		}	
	}
}
var resolveTagsVpos=function(parsed) {
	var bsearch=require("ksana-document").bsearch;
	for (var i=0;i<parsed.tags.length;i++) {
		for (var j=0;j<parsed.tags[i].length;j++) {
			var t=parsed.tags[i][j];
			var pos=t[0];
			t[3]=parsed.tovpos[i][pos];
			while (pos && typeof t[3]=="undefined") t[3]=parsed.tovpos[i][--pos];
		}
	}
}
var putFile=function(fn,cb) {
	var fs=nodeRequire("fs");
	var texts=fs.readFileSync(fn,session.config.inputEncoding).replace(/\r\n/g,"\n");
	var bodyend=session.config.bodyend;
	var bodystart=session.config.bodystart;
	var captureTags=session.config.captureTags;
	var callbacks=session.config.callbacks||{};
	var started=false,stopped=false;

	if (callbacks.onFile) callbacks.onFile.apply(session,[fn,status]);
	var start=bodystart ? texts.indexOf(bodystart) : 0 ;
	var end=bodyend? texts.indexOf(bodyend): texts.length;
	if (!bodyend) bodyendlen=0;
	else bodyendlen=bodyend.length;
	//assert.equal(end>start,true);

	// split source xml into 3 parts, before <body> , inside <body></body> , and after </body>
	var body=texts.substring(start,end+bodyendlen);
	status.json=session.json;
	status.storeFields=storeFields;
	
	status.bodytext=body;
	status.starttext=texts.substring(0,start);
	status.fileStartVpos=session.vpos;

	if (callbacks.beforebodystart) callbacks.beforebodystart.apply(session,[texts.substring(0,start),status]);
	parseBody(body,session.config.pageSeparator,function(parsed){
		status.parsed=parsed;
		if (callbacks.afterbodyend) {
			resolveTagsVpos(parsed);
			if (captureTags) {
				processTags(captureTags, parsed.tags, parsed.texts);
			}
			var ending="";
			if (bodyend) ending=texts.substring(end+bodyend.length);
			if (ending) callbacks.afterbodyend.apply(session,[ending,status]);
			status.parsed=null;
			status.bodytext=null;
			status.starttext=null;
			status.json=null;
		}
		cb(); //parse body finished
	});	
}
var initSession=function(config) {
	var json={
		postings:[[0]] //first one is always empty, because tokenid cannot be 0
		,postingCount:0
		,fileContents:[]
		,fileNames:[]
		,fileOffsets:[]
		,pageNames:[]
		,pageOffsets:[]
		,tokens:{}
	};
	config.inputEncoding=config.inputEncoding||"utf8";
	var session={vpos:1, json:json , kdb:null, filenow:0,done:false
		           ,indexedTextLength:0,config:config,files:config.files,pagecount:0};
	return session;
}

var initIndexer=function(mkdbconfig) {
	var Kde=nodeRequire("./kde");

	session=initSession(mkdbconfig);
	api=nodeRequire("ksana-document").customfunc.getAPI(mkdbconfig.meta.config);
	xml4kdb=nodeRequire("ksana-document").xml4kdb;

	//mkdbconfig has a chance to overwrite API

	normalize=api["normalize"];
	isSkip=api["isSkip"];
	tokenize=api["tokenize"];

	var folder=session.config.outdir||".";
	session.kdbfn=require("path").resolve(folder, session.config.name+'.kdb');

	if (!session.config.reset && nodeRequire("fs").existsSync(session.kdbfn)) {
		//if old kdb exists and not reset 
		Kde.openLocal(session.kdbfn,function(db){
			session.kdb=db;
			setTimeout(indexstep,1);
		});
	} else {
		setTimeout(indexstep,1);
	}
}

var start=function(mkdbconfig) {
	if (indexing) return null;
	indexing=true;
	if (!mkdbconfig.files.length) return null;//nothing to index

	initIndexer(mkdbconfig);
  	return status;
}

var indexstep=function() {
	
	if (session.filenow<session.files.length) {
		status.filename=session.files[session.filenow];
		status.progress=session.filenow/session.files.length;
		status.filenow=session.filenow;
		putFile(status.filename,function(){
			session.filenow++;
			setTimeout(indexstep,1); //rest for 1 ms to response status			
		});
	} else {
		finalize(function() {
			status.done=true;
			indexing=false;
			if (session.config.finalized) {
				session.config.finalized(session,status);
			}
		});	
	}
}

var getstatus=function() {
  return status;
}
var stop=function() {
  status.done=true;
  status.message="User Abort";
  indexing=false;
  return status;
}
var backupFilename=function(ydbfn) {
	//user has a chance to recover from previous ydb
	return ydbfn+"k"; //todo add date in the middle
}

var backup=function(ydbfn) {
	var fs=nodeRequire("fs");
	var fs=nodeRequire('fs');
	if (fs.existsSync(ydbfn)) {
		var bkfn=ydbfn+'k';
		try {
			if (fs.existsSync(bkfn)) fs.unlinkSync(bkfn);
			fs.renameSync(ydbfn,bkfn);
		} catch (e) {
			console.log(e);
		}
	}
}
var createMeta=function() {
	var meta={};
	if (session.config.meta) for (var i in session.config.meta) {
		meta[i]=session.config.meta[i];
	}
	meta.name=session.config.name;
	meta.vsize=session.vpos;
	meta.pagecount=status.pageCount;
	return meta;
}
var guessSize=function() {
	var size=session.vpos * 5;
	if (size<1024*1024) size=1024*1024;
	return  size;
}
var buildpostingslen=function(tokens,postings) {
	var out=[];
	for (var i=0;i<tokens.length;i++) {
		out[i]=postings[i].length;
	}
	return out;
}
var optimize4kdb=function(json) {
	var keys=[];
	for (var key in json.tokens) {
		keys[keys.length]=[key,json.tokens[key]];
	}
	keys.sort(function(a,b){return a[1]-b[1]});//sort by token id
	var newtokens=keys.map(function(k){return k[0]});
	json.tokens=newtokens;
	for (var i=0;i<json.postings.length;i++) json.postings[i].sorted=true; //use delta format to save space
	json.postingslen=buildpostingslen(json.tokens,json.postings);
	json.fileOffsets.sorted=true;
	json.pageOffsets.sorted=true;
	return json;
}

var finalize=function(cb) {	
	var Kde=nodeRequire("./kde");

	if (session.kdb) Kde.closeLocal(session.kdbfn);

	session.json.fileOffsets.push(session.vpos); //serve as terminator
	session.json.pageOffsets.push(session.vpos); //serve as terminator
	session.json.meta=createMeta();
	
	if (!session.config.nobackup) backup(session.kdbfn);
	status.message='writing '+session.kdbfn;
	//output=api("optimize")(session.json,session.ydbmeta.config);
	var opts={size:session.config.estimatesize};
	if (!opts.size) opts.size=guessSize();
	var kdbw =nodeRequire("ksana-document").kdbw(session.kdbfn,opts);
	//console.log(JSON.stringify(session.json,""," "));
	if (session.config.finalizeField) {
		console.log("finalizing fields");
		session.config.finalizeField(session.fields);
	}
	console.log("optimizing");
	var json=optimize4kdb(session.json);

	console.log("output to",session.kdbfn);
	kdbw.save(json,null,{autodelete:true});
	
	kdbw.writeFile(session.kdbfn,function(total,written) {
		status.progress=written/total;
		status.outputfn=session.kdbfn;
		if (total==written) cb();
	});
}
module.exports={start:start,stop:stop,status:getstatus};
});
require.register("ksana-document/indexer_kd.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;

/*
  text:       [ [page_text][page_text] ]
  pagenames:  []
  tokentree:  []
  
  search engine API: 
  getToken        //return raw posting
  getText(vpos)   //return raw page text
    getPageText   
  vpos2pgoff      //virtual posting to page offset
  groupBy         //convert raw posting to group (with optional converted offset) 
  findMarkupInRange
*/


var indexing=false; //only allow one indexing task
var projinfo=null;
var status={progress:0,done:false}; //progress ==1 completed
var session={};
var api=null;
var isSkip=null;
var normalize=null;
var tokenize=null;

var putPosting=function(tk) {
	var	postingid=session.json.tokens[tk];
	var out=session.json;

	if (!postingid) {
		out.postingCount++;
		posting=out.postings[out.postingCount]=[];
		session.json.tokens[tk]=out.postingCount;
	} else {
		posting=out.postings[postingid];
	}
	posting.push(session.vpos);
}
var putExtra=function(arr_of_key_vpos_payload) {
	//which markup to be added in the index
	//is depended on application requirement...
	//convert markup start position to vpos
	// application  key-values  pairs
	//    ydb provide search for key , return array of vpos
	//        and given range of vpos, return all key in the range
  // structure
  // key , 
}

var putPage=function(docPage) {
	var tokenized=tokenize(docPage.inscription);

	for (var i=0;i<tokenized.tokens.length;i++) {
		var t=tokenized.tokens[i];

		if (isSkip(t)) {
			 session.vpos--;
		} else {
			var normalized=normalize(t);
			if (normalized) 	putPosting(normalized);
 		}
 		session.vpos++;
	}

	session.indexedTextLength+= docPage.inscription.length;
}
var shortFilename=function(fn) {
	var arr=fn.split('/');
	while (arr.length>2) arr.shift();
	return arr.join('/');
}
var putFile=function(fn) {
	var persistent=nodeRequire("ksana-document").persistent;
	var doc=persistent.createLocal(fn);
	var shortfn=shortFilename(fn);

	var fileInfo={pageNames:[],pageOffset:[]};
	var fileContent=[];
	session.json.files.push(fileInfo);
	session.json.fileContents.push(fileContent);
	session.json.fileNames.push(shortfn);
	session.json.fileOffsets.push(session.vpos);
	status.message="indexing "+fn;

	for (var i=1;i<doc.pageCount;i++) {
		var pg=doc.getPage(i);
		fileContent.push(pg.inscription);
		fileInfo.pageNames.push(pg.name);
		fileInfo.pageOffset.push(session.vpos);
		putPage(pg);
	}
	fileInfo.pageOffset.push(session.vpos); //ending terminator
}
var initSession=function() {
	var json={
		files:[]
		,fileContents:[]
		,fileNames:[]
		,fileOffsets:[]
		,postings:[[0]] //first one is always empty, because tokenid cannot be 0
		,tokens:{}
		,postingCount:0
	};
	var session={vpos:1, json:json ,
		           indexedTextLength:0,
		           options: projinfo.ksana.ydbmeta };
	return session;
}
var initIndexer=function() {
	session=initSession();
	session.filenow=0;
	session.files=projinfo.files;
	status.done=false;
	api=nodeRequire("ksana-document").customfunc.getAPI(session.options.config);
	
	normalize=api["normalize"];
	isSkip=api["isSkip"];
	tokenize=api["tokenize"];
	setTimeout(indexstep,1);
}

var getMeta=function() {
	var meta={};
	meta.config=session.options.config;
	meta.name=projinfo.name;
	meta.vsize=session.vpos;
	return meta;
}

var backupFilename=function(ydbfn) {
	//user has a chance to recover from previous ydb
	return ydbfn+"k"; //todo add date in the middle
}

var backup=function(ydbfn) {
	var fs=nodeRequire('fs');
	if (fs.existsSync(ydbfn)) {
		var bkfn=ydbfn+'k';
		if (fs.existsSync(bkfn)) fs.unlinkSync(bkfn);
		fs.renameSync(ydbfn,bkfn);
	}
}
var finalize=function(cb) {
	var opt=session.options;
	var kdbfn=projinfo.name+'.kdb';

	session.json.fileOffsets.push(session.vpos); //serve as terminator
	session.json.meta=getMeta();
	
	backup(kdbfn);
	status.message='writing '+kdbfn;
	//output=api("optimize")(session.json,session.ydbmeta.config);

	var kdbw =nodeRequire("ksana-document").kdbw(kdbfn);
	
	kdbw.save(session.json,null,{autodelete:true});
	
	kdbw.writeFile(kdbfn,function(total,written) {
		status.progress=written/total;
		status.outputfn=kdbfn;
		if (total==written) cb();
	});
}

var indexstep=function() {
	
	if (session.filenow<session.files.length) {
		status.filename=session.files[session.filenow];
		status.progress=session.filenow/session.files.length;
		putFile(status.filename);
		session.filenow++;
		setTimeout(indexstep,1); //rest for 1 ms to response status
	} else {
		finalize(function() {
			status.done=true;
			indexing=false;
		});	
	}
}

var status=function() {
  return status;
}
var start=function(projname) {
	if (indexing) return null;
	indexing=true;

	projinfo=nodeRequire("ksana-document").projects.fullInfo(projname);

	if (!projinfo.files.length) return null;//nothing to index

	initIndexer();
 	status.projectname=projname;
  	return status;
}

var stop=function() {
  status.done=true;
  status.message="User Abort";
  indexing=false;
  return status;
}
module.exports={start:start,stop:stop,status:status};
});
require.register("ksana-document/kdb.js", function(exports, require, module){
/*
	KDB version 3.0 GPL
	yapcheahshen@gmail.com
	2013/12/28
	asyncronize version of yadb

  remove dependency of Q, thanks to
  http://stackoverflow.com/questions/4234619/how-to-avoid-long-nesting-of-asynchronous-functions-in-node-js

  
*/
var Kfs=require('./kdbfs');	

var DT={
	uint8:'1', //unsigned 1 byte integer
	int32:'4', // signed 4 bytes integer
	utf8:'8',  
	ucs2:'2',
	bool:'^', 
	blob:'&',
	utf8arr:'*', //shift of 8
	ucs2arr:'@', //shift of 2
	uint8arr:'!', //shift of 1
	int32arr:'$', //shift of 4
	vint:'`',
	pint:'~',	

	array:'\u001b',
	object:'\u001a' 
	//ydb start with object signature,
	//type a ydb in command prompt shows nothing
}

var Create=function(path,opts,cb) {
	/* loadxxx functions move file pointer */
	// load variable length int
	if (typeof opts=="function") {
		cb=opts;
		opts={};
	}
	
	var loadVInt =function(opts,blocksize,count,cb) {
		//if (count==0) return [];
		var that=this;
		this.fs.readBuf_packedint(opts.cur,blocksize,count,true,function(o){
			opts.cur+=o.adv;
			cb.apply(that,[o.data]);
		});
	}
	var loadVInt1=function(opts,cb) {
		var that=this;
		loadVInt.apply(this,[opts,6,1,function(data){
			cb.apply(that,[data[0]]);
		}])
	}
	//for postings
	var loadPInt =function(opts,blocksize,count,cb) {
		var that=this;
		this.fs.readBuf_packedint(opts.cur,blocksize,count,false,function(o){
			opts.cur+=o.adv;
			cb.apply(that,[o.data]);
		});
	}
	// item can be any type (variable length)
	// maximum size of array is 1TB 2^40
	// structure:
	// signature,5 bytes offset, payload, itemlengths
	var getArrayLength=function(opts,cb) {
		var that=this;
		var dataoffset=0;

		this.fs.readUI8(opts.cur,function(len){
			var lengthoffset=len*4294967296;
			opts.cur++;
			that.fs.readUI32(opts.cur,function(len){
				opts.cur+=4;
				dataoffset=opts.cur; //keep this
				lengthoffset+=len;
				opts.cur+=lengthoffset;

				loadVInt1.apply(that,[opts,function(count){
					loadVInt.apply(that,[opts,count*6,count,function(sz){						
						cb({count:count,sz:sz,offset:dataoffset});
					}]);
				}]);
				
			});
		});
	}

	var loadArray = function(opts,blocksize,cb) {
		var that=this;
		getArrayLength.apply(this,[opts,function(L){
				var o=[];
				var endcur=opts.cur;
				opts.cur=L.offset;

				if (opts.lazy) { 
						var offset=L.offset;
						L.sz.map(function(sz){
							o[o.length]="\0"+offset.toString(16)
								   +"\0"+sz.toString(16);
							offset+=sz;
						})
				} else {
					var taskqueue=[];
					for (var i=0;i<L.count;i++) {
						taskqueue.push(
							(function(sz){
								return (
									function(data){
										if (typeof data=='object' && data.__empty) {
											 //not pushing the first call
										}	else o.push(data);
										opts.blocksize=sz;
										load.apply(that,[opts, taskqueue.shift()]);
									}
								);
							})(L.sz[i])
						);
					}
					//last call to child load
					taskqueue.push(function(data){
						o.push(data);
						opts.cur=endcur;
						cb.apply(that,[o]);
					});
				}

				if (opts.lazy) cb.apply(that,[o]);
				else {
					taskqueue.shift()({__empty:true});
				}
			}
		])
	}		
	// item can be any type (variable length)
	// support lazy load
	// structure:
	// signature,5 bytes offset, payload, itemlengths, 
	//                    stringarray_signature, keys
	var loadObject = function(opts,blocksize,cb) {
		var that=this;
		var start=opts.cur;
		getArrayLength.apply(this,[opts,function(L) {
			opts.blocksize=blocksize-opts.cur+start;
			load.apply(that,[opts,function(keys){ //load the keys
				if (opts.keys) { //caller ask for keys
					keys.map(function(k) { opts.keys.push(k)});
				}

				var o={};
				var endcur=opts.cur;
				opts.cur=L.offset;
				if (opts.lazy) { 
					var offset=L.offset;
					for (var i=0;i<L.sz.length;i++) {
						//prefix with a \0, impossible for normal string
						o[keys[i]]="\0"+offset.toString(16)
							   +"\0"+L.sz[i].toString(16);
						offset+=L.sz[i];
					}
				} else {
					var taskqueue=[];
					for (var i=0;i<L.count;i++) {
						taskqueue.push(
							(function(sz,key){
								return (
									function(data){
										if (typeof data=='object' && data.__empty) {
											//not saving the first call;
										} else {
											o[key]=data; 
										}
										opts.blocksize=sz;
										load.apply(that,[opts, taskqueue.shift()]);
									}
								);
							})(L.sz[i],keys[i-1])

						);
					}
					//last call to child load
					taskqueue.push(function(data){
						o[keys[keys.length-1]]=data;
						opts.cur=endcur;
						cb.apply(that,[o]);
					});
				}
				if (opts.lazy) cb.apply(that,[o]);
				else {
					taskqueue.shift()({__empty:true});
				}
			}]);
		}]);
	}

	//item is same known type
	var loadStringArray=function(opts,blocksize,encoding,cb) {
		var that=this;
		this.fs.readStringArray(opts.cur,blocksize,encoding,function(o){
			opts.cur+=blocksize;
			cb.apply(that,[o]);
		});
	}
	var loadIntegerArray=function(opts,blocksize,unitsize,cb) {
		var that=this;
		loadVInt1.apply(this,[opts,function(count){
			var o=that.fs.readFixedArray(opts.cur,count,unitsize,function(o){
				opts.cur+=count*unitsize;
				cb.apply(that,[o]);
			});
		}]);
	}
	var loadBlob=function(blocksize,cb) {
		var o=this.fs.readBuf(this.cur,blocksize);
		this.cur+=blocksize;
		return o;
	}	
	var loadbysignature=function(opts,signature,cb) {
		  var blocksize=opts.blocksize||this.fs.size; 
			opts.cur+=this.fs.signature_size;
			var datasize=blocksize-this.fs.signature_size;
			//basic types
			if (signature===DT.int32) {
				opts.cur+=4;
				this.fs.readI32(opts.cur-4,cb);
			} else if (signature===DT.uint8) {
				opts.cur++;
				this.fs.readUI8(opts.cur-1,cb);
			} else if (signature===DT.utf8) {
				var c=opts.cur;opts.cur+=datasize;
				this.fs.readString(c,datasize,'utf8',cb);
			} else if (signature===DT.ucs2) {
				var c=opts.cur;opts.cur+=datasize;
				this.fs.readString(c,datasize,'ucs2',cb);	
			} else if (signature===DT.bool) {
				opts.cur++;
				this.fs.readUI8(opts.cur-1,function(data){cb(!!data)});
			} else if (signature===DT.blob) {
				loadBlob(datasize,cb);
			}
			//variable length integers
			else if (signature===DT.vint) {
				loadVInt.apply(this,[opts,datasize,datasize,cb]);
			}
			else if (signature===DT.pint) {
				loadPInt.apply(this,[opts,datasize,datasize,cb]);
			}
			//simple array
			else if (signature===DT.utf8arr) {
				loadStringArray.apply(this,[opts,datasize,'utf8',cb]);
			}
			else if (signature===DT.ucs2arr) {
				loadStringArray.apply(this,[opts,datasize,'ucs2',cb]);
			}
			else if (signature===DT.uint8arr) {
				loadIntegerArray.apply(this,[opts,datasize,1,cb]);
			}
			else if (signature===DT.int32arr) {
				loadIntegerArray.apply(this,[opts,datasize,4,cb]);
			}
			//nested structure
			else if (signature===DT.array) {
				loadArray.apply(this,[opts,datasize,cb]);
			}
			else if (signature===DT.object) {
				loadObject.apply(this,[opts,datasize,cb]);
			}
			else {
				console.error('unsupported type',signature,opts)
				cb.apply(this,[null]);//make sure it return
				//throw 'unsupported type '+signature;
			}
	}

	var load=function(opts,cb) {
		opts=opts||{}; // this will served as context for entire load procedure
		opts.cur=opts.cur||0;
		var that=this;
		this.fs.readSignature(opts.cur, function(signature){
			loadbysignature.apply(that,[opts,signature,cb])
		});
		return this;
	}
	var CACHE=null;
	var KEY={};
	var reset=function(cb) {
		if (!CACHE) {
			load.apply(this,[{cur:0,lazy:true},function(data){
				CACHE=data;
				cb.call(this);
			}]);	
		} else {
			cb.call(this);
		}
	}

	var exists=function(path,cb) {
		if (path.length==0) return true;
		var key=path.pop();
		var that=this;
		get.apply(this,[path,false,function(data){
			if (!path.join('\0')) return (!!KEY[key]);
			var keys=KEY[path.join('\0')];
			path.push(key);//put it back
			if (keys) cb.apply(that,[keys.indexOf(key)>-1]);
			else cb.apply(that,[false]);
		}]);
	}

	var getSync=function(path) {
		if (!CACHE) return undefined;	
		var o=CACHE;
		for (var i=0;i<path.length;i++) {
			var r=o[path[i]] ;
			if (r===undefined) return undefined;
			o=r;
		}
		return o;
	}
	var get=function(path,recursive,cb) {
		if (typeof path=='undefined') path=[];
		if (typeof path=="string") path=[path];
		if (typeof recursive=='function') {
			cb=recursive;
			recursive=false;
		}
		recursive=recursive||false;
		var that=this;
		if (typeof cb!='function') return getSync(path);

		reset.apply(this,[function(){

			var o=CACHE;

			if (path.length==0) {
				cb(Object.keys(CACHE));
				return;
			} 
			
			var pathnow="",taskqueue=[],opts={},r=null;
			var lastkey="";


			for (var i=0;i<path.length;i++) {
				var task=(function(key,k){

					return (function(data){
						if (!(typeof data=='object' && data.__empty)) {
							if (typeof o[lastkey]=='string' && o[lastkey][0]=="\0") o[lastkey]={};
							o[lastkey]=data; 
							o=o[lastkey];
							r=data[key];
							KEY[pathnow]=opts.keys;
						} else {
							data=o[key];
							r=data;
						}

						if (r===undefined) {
							taskqueue=null;
							cb.apply(that,[r]); //return empty value
						} else {							
							if (parseInt(k)) pathnow+="\0";
							pathnow+=key;
							if (typeof r=='string' && r[0]=="\0") { //offset of data to be loaded
								var p=r.substring(1).split("\0").map(function(item){return parseInt(item,16)});
								var cur=p[0],sz=p[1];
								opts.lazy=!recursive || (k<path.length-1) ;
								opts.blocksize=sz;opts.cur=cur,opts.keys=[];
								load.apply(that,[opts, taskqueue.shift()]);
								lastkey=key;
							} else {
								var next=taskqueue.shift();
								next.apply(that,[r]);
							}
						}
					})
				})
				(path[i],i);
				
				taskqueue.push(task);
			}

			if (taskqueue.length==0) {
				cb.apply(that,[o]);
			} else {
				//last call to child load
				taskqueue.push(function(data){
					var key=path[path.length-1];
					o[key]=data; KEY[pathnow]=opts.keys;
					cb.apply(that,[data]);
				});
				taskqueue.shift()({__empty:true});			
			}

		}]); //reset
	}
	// get all keys in given path
	var getkeys=function(path,cb) {
		if (!path) path=[]
		var that=this;
		get.apply(this,[path,false,function(){
			if (path && path.length) {
				cb.apply(that,[KEY[path.join("\0")]]);
			} else {
				cb.apply(that,[Object.keys(CACHE)]); 
				//top level, normally it is very small
			}
		}]);
	}

	var setupapi=function() {
		this.load=load;
//		this.cur=0;
		this.cache=function() {return CACHE};
		this.key=function() {return KEY};
		this.free=function() {
			CACHE=null;
			KEY=null;
			this.fs.free();
		}
		this.setCache=function(c) {CACHE=c};
		this.keys=getkeys;
		this.get=get;   // get a field, load if needed
		this.exists=exists;
		this.DT=DT;
		
		//install the sync version for node
		if (typeof process!="undefined") require("./kdb_sync")(this);
		//if (cb) setTimeout(cb.bind(this),0);
		if (cb) cb(this);
	}
	var that=this;
	var kfs=new Kfs(path,opts,function(){
		that.size=this.size;
		setupapi.call(that);
	});
	this.fs=kfs;
	return this;
}

Create.datatypes=DT;

if (module) module.exports=Create;
//return Create;

});
require.register("ksana-document/kdbfs.js", function(exports, require, module){
/* OS dependent file operation */

if (typeof process=="undefined") {
	var fs=require('./html5fs');
	var Buffer=function(){ return ""};
	var html5fs=true; 
} else {
	if (typeof nodeRequire=="undefined") {
		if (typeof ksana!="undefined") var nodeRequire=ksana.require;
		else var nodeRequire=require;
	} 
	var fs=nodeRequire('fs');
	var Buffer=nodeRequire("buffer").Buffer;
}

var signature_size=1;
var verbose=0, readLog=function(){};
var _readLog=function(readtype,bytes) {
	console.log(readtype,bytes,"bytes");
}
if (verbose) readLog=_readLog;

var unpack_int = function (ar, count , reset) {
   count=count||ar.length;
   /*
	if (typeof ijs_unpack_int == 'function') {
		var R = ijs_unpack_int(ar, count, reset)
		return R
	};
	*/
  var r = [], i = 0, v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;	  
	} while (ar[++i] & 0x80);
	r.push(v); if (reset) v=0;
	count--;
  } while (i<ar.length && count);
  return {data:r, adv:i };
}
var Open=function(path,opts,cb) {
	opts=opts||{};

	var readSignature=function(pos,cb) {
		var buf=new Buffer(signature_size);
		var that=this;
		fs.read(this.handle,buf,0,signature_size,pos,function(err,len,buffer){
			if (html5fs) var signature=String.fromCharCode((new Uint8Array(buffer))[0])
			else var signature=buffer.toString('utf8',0,signature_size);
			cb.apply(that,[signature]);
		});
	}

	//this is quite slow
	//wait for StringView +ArrayBuffer to solve the problem
	//https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/ylgiNY_ZSV0
	//if the string is always ucs2
	//can use Uint16 to read it.
	//http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  var decodeutf8 = function (utftext) {
        var string = "";
        var i = 0;
        var c=0,c1 = 0, c2 = 0;
 				for (var i=0;i<utftext.length;i++) {
 					if (utftext.charCodeAt(i)>127) break;
 				}
 				if (i>=utftext.length) return utftext;

        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += utftext[i];
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
  }

	var readString= function(pos,blocksize,encoding,cb) {
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		var that=this;
		fs.read(this.handle,buffer,0,blocksize,pos,function(err,len,buffer){
			readLog("string",len);
			if (html5fs) {
				if (encoding=='utf8') {
					var str=decodeutf8(String.fromCharCode.apply(null, new Uint8Array(buffer)))
				} else { //ucs2 is 3 times faster
					var str=String.fromCharCode.apply(null, new Uint16Array(buffer))	
				}
				
				cb.apply(that,[str]);
			} 
			else cb.apply(that,[buffer.toString(encoding)]);	
		});
	}

	//work around for chrome fromCharCode cannot accept huge array
	//https://code.google.com/p/chromium/issues/detail?id=56588
	var buf2stringarr=function(buf,enc) {
		if (enc=="utf8") 	var arr=new Uint8Array(buf);
		else var arr=new Uint16Array(buf);
		var i=0,codes=[],out=[];
		while (i<arr.length) {
			if (arr[i]) {
				codes[codes.length]=arr[i];
			} else {
				var s=String.fromCharCode.apply(null,codes);
				if (enc=="utf8") out[out.length]=decodeutf8(s);
				else out[out.length]=s;
				codes=[];				
			}
			i++;
		}
		
		s=String.fromCharCode.apply(null,codes);
		if (enc=="utf8") out[out.length]=decodeutf8(s);
		else out[out.length]=s;

		return out;
	}
	var readStringArray = function(pos,blocksize,encoding,cb) {
		var that=this,out=null;
		if (blocksize==0) return [];
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.read(this.handle,buffer,0,blocksize,pos,function(err,len,buffer){
		  
		  if (html5fs) {
	  		readLog("stringArray",buffer.byteLength);
			if (encoding=='utf8') {
				out=buf2stringarr(buffer,"utf8");
			} else { //ucs2 is 3 times faster
				out=buf2stringarr(buffer,"ucs2");
			}
		  } else {
			readLog("stringArray",buffer.length);
			out=buffer.toString(encoding).split('\0');
		  } 	
		  cb.apply(that,[out]);
		});
	}
	var readUI32=function(pos,cb) {
		var buffer=new Buffer(4);
		var that=this;
		fs.read(this.handle,buffer,0,4,pos,function(err,len,buffer){
			readLog("ui32",len);
			if (html5fs){
				//v=(new Uint32Array(buffer))[0];
				var v=new DataView(buffer).getUint32(0, false)
				cb(v);
			}
			else cb.apply(that,[buffer.readInt32BE(0)]);	
		});
		
	}

	var readI32=function(pos,cb) {
		var buffer=new Buffer(4);
		var that=this;
		fs.read(this.handle,buffer,0,4,pos,function(err,len,buffer){
			readLog("i32",len);
			if (html5fs){
				var v=new DataView(buffer).getInt32(0, false)
				cb(v);
			}
			else  	cb.apply(that,[buffer.readInt32BE(0)]);	
		});
	}
	var readUI8=function(pos,cb) {
		var buffer=new Buffer(1);
		var that=this;

		fs.read(this.handle,buffer,0,1,pos,function(err,len,buffer){
			readLog("ui8",len);
			if (html5fs)cb( (new Uint8Array(buffer))[0]) ;
			else  			cb.apply(that,[buffer.readUInt8(0)]);	
			
		});
	}
	var readBuf=function(pos,blocksize,cb) {
		var that=this;
		var buf=new Buffer(blocksize);
		fs.read(this.handle,buf,0,blocksize,pos,function(err,len,buffer){
			readLog("buf",len);
			/*
			var buff=[];
			for (var i=0;i<len;i++) {
				buff[i]=buffer.charCodeAt(i);
			}
			*/
			var buff=new Uint8Array(buffer)
			cb.apply(that,[buff]);
		});
	}
	var readBuf_packedint=function(pos,blocksize,count,reset,cb) {
		var that=this;
		readBuf.apply(this,[pos,blocksize,function(buffer){
			cb.apply(that,[unpack_int(buffer,count,reset)]);	
		}]);
		
	}
	var readFixedArray_html5fs=function(pos,count,unitsize,cb) {
		var func=null;
		/*
		var buf2UI32BE=function(buf,p) {
			return buf.charCodeAt(p)*256*256*256
					+buf.charCodeAt(p+1)*256*256
					+buf.charCodeAt(p+2)*256+buf.charCodeAt(p+3);
		}
		var buf2UI16BE=function(buf,p) {
			return buf.charCodeAt(p)*256
					+buf.charCodeAt(p+1);
		}
		var buf2UI8=function(buf,p) {
			return buf.charCodeAt(p);
		}
		*/
		if (unitsize===1) {
			func='getUint8';//Uint8Array;
		} else if (unitsize===2) {
			func='getUint16';//Uint16Array;
		} else if (unitsize===4) {
			func='getUint32';//Uint32Array;
		} else throw 'unsupported integer size';

		fs.read(this.handle,null,0,unitsize*count,pos,function(err,len,buffer){
			readLog("fix array",len);
			var out=[];
			if (unitsize==1) {
				out=new Uint8Array(buffer);
			} else {
				for (var i = 0; i < len / unitsize; i++) { //endian problem
				//	out.push( func(buffer,i*unitsize));
					out.push( v=new DataView(buffer)[func](i,false) );
				}
			}

			cb.apply(that,[out]);
		});
	}
	// signature, itemcount, payload
	var readFixedArray = function(pos ,count, unitsize,cb) {
		var func=null;
		var that=this;
		
		if (unitsize* count>this.size && this.size)  {
			console.log("array size exceed file size",this.size)
			return;
		}
		
		if (html5fs) return readFixedArray_html5fs.apply(this,[pos,count,unitsize,cb]);

		var items=new Buffer( unitsize* count);
		if (unitsize===1) {
			func=items.readUInt8;
		} else if (unitsize===2) {
			func=items.readUInt16BE;
		} else if (unitsize===4) {
			func=items.readUInt32BE;
		} else throw 'unsupported integer size';
		//console.log('itemcount',itemcount,'buffer',buffer);

		fs.read(this.handle,items,0,unitsize*count,pos,function(err,len,buffer){
			readLog("fix array",len);
			var out=[];
			for (var i = 0; i < items.length / unitsize; i++) {
				out.push( func.apply(items,[i*unitsize]));
			}
			cb.apply(that,[out]);
		});
	}

	var free=function() {
		//console.log('closing ',handle);
		fs.closeSync(this.handle);
	}
	var setupapi=function() {
		var that=this;
		this.readSignature=readSignature;
		this.readI32=readI32;
		this.readUI32=readUI32;
		this.readUI8=readUI8;
		this.readBuf=readBuf;
		this.readBuf_packedint=readBuf_packedint;
		this.readFixedArray=readFixedArray;
		this.readString=readString;
		this.readStringArray=readStringArray;
		this.signature_size=signature_size;
		this.free=free;
		if (html5fs) {
		    var fn=path;
		    if (path.indexOf("filesystem:")==0) fn=path.substr(path.lastIndexOf("/"));
		    fs.fs.root.getFile(fn,{},function(entry){
		      entry.getMetadata(function(metadata) { 
		        that.size=metadata.size;
		        if (cb) setTimeout(cb.bind(that),0);
		        });
		    });
		} else {
			var stat=fs.fstatSync(this.handle);
			this.stat=stat;
			this.size=stat.size;		
			if (cb)	setTimeout(cb.bind(this),0);	
		}
	}
	
	//handle=fs.openSync(path,'r');
	//console.log('watching '+path);
	var that=this;
	if (html5fs) {
		fs.open(path,function(h){
			that.handle=h;
			that.html5fs=true;
			setupapi.call(that);
			that.opened=true;
		})
	} else {
		this.handle=fs.openSync(path,'r');//,function(err,handle){
		this.opened=true;
		setupapi.call(this);
	}
	//console.log('file size',path,this.size);	
	return this;
}
module.exports=Open;

});
require.register("ksana-document/kdbw.js", function(exports, require, module){
/*
  convert any json into a binary buffer
  the buffer can be saved with a single line of fs.writeFile
*/

var DT={
	uint8:'1', //unsigned 1 byte integer
	int32:'4', // signed 4 bytes integer
	utf8:'8',  
	ucs2:'2',
	bool:'^', 
	blob:'&',
	utf8arr:'*', //shift of 8
	ucs2arr:'@', //shift of 2
	uint8arr:'!', //shift of 1
	int32arr:'$', //shift of 4
	vint:'`',
	pint:'~',	

	array:'\u001b',
	object:'\u001a' 
	//ydb start with object signature,
	//type a ydb in command prompt shows nothing
}
var key_writing="";//for debugging
var pack_int = function (ar, savedelta) { // pack ar into
  if (!ar || ar.length === 0) return []; // empty array
  var r = [],
  i = 0,
  j = 0,
  delta = 0,
  prev = 0;
  
  do {
	delta = ar[i];
	if (savedelta) {
		delta -= prev;
	}
	if (delta < 0) {
	  console.trace('negative',prev,ar[i],ar)
	  throw 'negetive';
	  break;
	}
	
	r[j++] = delta & 0x7f;
	delta >>= 7;
	while (delta > 0) {
	  r[j++] = (delta & 0x7f) | 0x80;
	  delta >>= 7;
	}
	prev = ar[i];
	i++;
  } while (i < ar.length);
  return r;
}
var Kfs=function(path,opts) {
	
	var handle=null;
	opts=opts||{};
	opts.size=opts.size||65536*2048; 
	console.log('kdb estimate size:',opts.size);
	var dbuf=new Buffer(opts.size);
	var cur=0;//dbuf cursor
	
	var writeSignature=function(value,pos) {
		dbuf.write(value,pos,value.length,'utf8');
		if (pos+value.length>cur) cur=pos+value.length;
		return value.length;
	}
	var writeOffset=function(value,pos) {
		dbuf.writeUInt8(Math.floor(value / (65536*65536)),pos);
		dbuf.writeUInt32BE( value & 0xFFFFFFFF,pos+1);
		if (pos+5>cur) cur=pos+5;
		return 5;
	}
	var writeString= function(value,pos,encoding) {
		encoding=encoding||'ucs2';
		if (value=="") throw "cannot write null string";
		if (encoding==='utf8')dbuf.write(DT.utf8,pos,1,'utf8');
		else if (encoding==='ucs2')dbuf.write(DT.ucs2,pos,1,'utf8');
		else throw 'unsupported encoding '+encoding;
			
		var len=Buffer.byteLength(value, encoding);
		dbuf.write(value,pos+1,len,encoding);
		
		if (pos+len+1>cur) cur=pos+len+1;
		return len+1; // signature
	}
	var writeStringArray = function(value,pos,encoding) {
		encoding=encoding||'ucs2';
		if (encoding==='utf8') dbuf.write(DT.utf8arr,pos,1,'utf8');
		else if (encoding==='ucs2')dbuf.write(DT.ucs2arr,pos,1,'utf8');
		else throw 'unsupported encoding '+encoding;
		
		var v=value.join('\0');
		var len=Buffer.byteLength(v, encoding);
		if (0===len) throw "empty string array " + key_writing;
		dbuf.write(v,pos+1,len,encoding);
		if (pos+len+1>cur) cur=pos+len+1;
		return len+1;
	}
	var writeI32=function(value,pos) {
		dbuf.write(DT.int32,pos,1,'utf8');
		dbuf.writeInt32BE(value,pos+1);
		if (pos+5>cur) cur=pos+5;
		return 5;
	}
	var writeUI8=function(value,pos) {
		dbuf.write(DT.uint8,pos,1,'utf8');
		dbuf.writeUInt8(value,pos+1);
		if (pos+2>cur) cur=pos+2;
		return 2;
	}
	var writeBool=function(value,pos) {
		dbuf.write(DT.bool,pos,1,'utf8');
		dbuf.writeUInt8(Number(value),pos+1);
		if (pos+2>cur) cur=pos+2;
		return 2;
	}		
	var writeBlob=function(value,pos) {
		dbuf.write(DT.blob,pos,1,'utf8');
		value.copy(dbuf, pos+1);
		var written=value.length+1;
		if (pos+written>cur) cur=pos+written;
		return written;
	}		
	/* no signature */
	var writeFixedArray = function(value,pos,unitsize) {
		//console.log('v.len',value.length,items.length,unitsize);
		if (unitsize===1) var func=dbuf.writeUInt8;
		else if (unitsize===4)var func=dbuf.writeInt32BE;
		else throw 'unsupported integer size';
		if (!value.length) {
			throw "empty fixed array "+key_writing;
		}
		for (var i = 0; i < value.length ; i++) {
			func.apply(dbuf,[value[i],i*unitsize+pos])
		}
		var len=unitsize*value.length;
		if (pos+len>cur) cur=pos+len;
		return len;
	}

	this.writeI32=writeI32;
	this.writeBool=writeBool;
	this.writeBlob=writeBlob;
	this.writeUI8=writeUI8;
	this.writeString=writeString;
	this.writeSignature=writeSignature;
	this.writeOffset=writeOffset; //5 bytes offset
	this.writeStringArray=writeStringArray;
	this.writeFixedArray=writeFixedArray;
	Object.defineProperty(this, "buf", {get : function(){ return dbuf; }});
	
	return this;
}

var Create=function(path,opts) {
	opts=opts||{};
	var kfs=new Kfs(path,opts);
	var cur=0;

	var handle={};
	
	//no signature
	var writeVInt =function(arr) {
		var o=pack_int(arr,false);
		kfs.writeFixedArray(o,cur,1);
		cur+=o.length;
	}
	var writeVInt1=function(value) {
		writeVInt([value]);
	}
	//for postings
	var writePInt =function(arr) {
		var o=pack_int(arr,true);
		kfs.writeFixedArray(o,cur,1);
		cur+=o.length;
	}
	
	var saveVInt = function(arr,key) {
		var start=cur;
		key_writing=key;
		cur+=kfs.writeSignature(DT.vint,cur);
		writeVInt(arr);
		var written = cur-start;
		pushitem(key,written);
		return written;		
	}
	var savePInt = function(arr,key) {
		var start=cur;
		key_writing=key;
		cur+=kfs.writeSignature(DT.pint,cur);
		writePInt(arr);
		var written = cur-start;
		pushitem(key,written);
		return written;	
	}

	
	var saveUI8 = function(value,key) {
		var written=kfs.writeUI8(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveBool=function(value,key) {
		var written=kfs.writeBool(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveI32 = function(value,key) {
		var written=kfs.writeI32(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}	
	var saveString = function(value,key,encoding) {
		encoding=encoding||stringencoding;
		key_writing=key;
		var written=kfs.writeString(value,cur,encoding);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveStringArray = function(arr,key,encoding) {
		encoding=encoding||stringencoding;
		key_writing=key;
		var written=kfs.writeStringArray(arr,cur,encoding);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	
	var saveBlob = function(value,key) {
		key_writing=key;
		var written=kfs.writeBlob(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}

	var folders=[];
	var pushitem=function(key,written) {
		var folder=folders[folders.length-1];	
		if (!folder) return ;
		folder.itemslength.push(written);
		if (key) {
			if (!folder.keys) throw 'cannot have key in array';
			folder.keys.push(key);
		}
	}	
	var open = function(opt) {
		var start=cur;
		var key=opt.key || null;
		var type=opt.type||DT.array;
		cur+=kfs.writeSignature(type,cur);
		cur+=kfs.writeOffset(0x0,cur); // pre-alloc space for offset
		var folder={
			type:type, key:key,
			start:start,datastart:cur,
			itemslength:[] };
		if (type===DT.object) folder.keys=[];
		folders.push(folder);
	}
	var openObject = function(key) {
		open({type:DT.object,key:key});
	}
	var openArray = function(key) {
		open({type:DT.array,key:key});
	}
	var saveInts=function(arr,key,func) {
		func.apply(handle,[arr,key]);
	}
	var close = function(opt) {
		if (!folders.length) throw 'empty stack';
		var folder=folders.pop();
		//jump to lengths and keys
		kfs.writeOffset( cur-folder.datastart, folder.datastart-5);
		var itemcount=folder.itemslength.length;
		//save lengths
		writeVInt1(itemcount);
		writeVInt(folder.itemslength);
		
		if (folder.type===DT.object) {
			//use utf8 for keys
			cur+=kfs.writeStringArray(folder.keys,cur,'utf8');
		}
		written=cur-folder.start;
		pushitem(folder.key,written);
		return written;
	}
	
	
	var stringencoding='ucs2';
	var stringEncoding=function(newencoding) {
		if (newencoding) stringencoding=newencoding;
		else return stringencoding;
	}
	
	var allnumber_fast=function(arr) {
		if (arr.length<5) return allnumber(arr);
		if (typeof arr[0]=='number'
		    && Math.round(arr[0])==arr[0] && arr[0]>=0)
			return true;
		return false;
	}
	var allstring_fast=function(arr) {
		if (arr.length<5) return allstring(arr);
		if (typeof arr[0]=='string') return true;
		return false;
	}	
	var allnumber=function(arr) {
		for (var i=0;i<arr.length;i++) {
			if (typeof arr[i]!=='number') return false;
		}
		return true;
	}
	var allstring=function(arr) {
		for (var i=0;i<arr.length;i++) {
			if (typeof arr[i]!=='string') return false;
		}
		return true;
	}
	var getEncoding=function(key,encs) {
		var enc=encs[key];
		if (!enc) return null;
		if (enc=='delta' || enc=='posting') {
			return savePInt;
		} else if (enc=="variable") {
			return saveVInt;
		}
		return null;
	}
	var save=function(J,key,opts) {
		opts=opts||{};
		
		if (typeof J=="null" || typeof J=="undefined") {
			throw 'cannot save null value of ['+key+'] folders'+JSON.stringify(folders);
			return;
		}
		var type=J.constructor.name;
		if (type==='Object') {
			openObject(key);
			for (var i in J) {
				save(J[i],i,opts);
				if (opts.autodelete) delete J[i];
			}
			close();
		} else if (type==='Array') {
			if (allnumber_fast(J)) {
				if (J.sorted) { //number array is sorted
					saveInts(J,key,savePInt);	//posting delta format
				} else {
					saveInts(J,key,saveVInt);	
				}
			} else if (allstring_fast(J)) {
				saveStringArray(J,key);
			} else {
				openArray(key);
				for (var i=0;i<J.length;i++) {
					save(J[i],null,opts);
					if (opts.autodelete) delete J[i];
				}
				close();
			}
		} else if (type==='String') {
			saveString(J,key);
		} else if (type==='Number') {
			if (J>=0&&J<256) saveUI8(J,key);
			else saveI32(J,key);
		} else if (type==='Boolean') {
			saveBool(J,key);
		} else if (type==='Buffer') {
			saveBlob(J,key);
		} else {
			throw 'unsupported type '+type;
		}
	}
	
	var free=function() {
		while (folders.length) close();
		kfs.free();
	}
	var currentsize=function() {
		return cur;
	}

	Object.defineProperty(handle, "size", {get : function(){ return cur; }});

	var writeFile=function(fn,opts,cb) {
		var fs=require('fs');
		var totalbyte=handle.currentsize();
		var written=0,batch=0;
		
		if (typeof cb=="undefined" || typeof opts=="function") { //do not have
			cb=opts;
		}
		opts=opts||{};
		batchsize=opts.batchsize||1024*1024*16; //16 MB

		if (fs.existsSync(fn)) fs.unlinkSync(fn);

		var writeCb=function(total,written,cb,next) {
			return function(err) {
				if (err) throw "write error"+err;
				cb(total,written);
				batch++;
				next();
			}
		}

		var next=function() {
			if (batch<batches) {
				var bufstart=batchsize*batch;
				var bufend=bufstart+batchsize;
				if (bufend>totalbyte) bufend=totalbyte;
				var sliced=kfs.buf.slice(bufstart,bufend);
				written+=sliced.length;
				fs.appendFile(fn,sliced,writeCb(totalbyte,written, cb,next));
			}
		}
		var batches=1+Math.floor(handle.size/batchsize);
		next();
	}
	handle.free=free;
	handle.saveI32=saveI32;
	handle.saveUI8=saveUI8;
	handle.saveBool=saveBool;
	handle.saveString=saveString;
	handle.saveVInt=saveVInt;
	handle.savePInt=savePInt;
	handle.saveInts=saveInts;
	handle.saveBlob=saveBlob;
	handle.save=save;
	handle.openArray=openArray;
	handle.openObject=openObject;
	handle.stringEncoding=stringEncoding;
	//this.integerEncoding=integerEncoding;
	handle.close=close;
	handle.writeFile=writeFile;
	handle.currentsize=currentsize;
	return handle;
}

module.exports=Create;
});
require.register("ksana-document/kdb_sync.js", function(exports, require, module){
/*
  syncronize version of kdb, taken from yadb
*/
var Kfs=require('./kdbfs_sync');

var Sync=function(kdb) {
	DT=kdb.DT;
	kfs=Kfs(kdb.fs);
	var cur=0;
	/* loadxxx functions move file pointer */
	// load variable length int
	var loadVInt =function(blocksize,count) {
		if (count==0) return [];
		var o=kfs.readBuf_packedintSync(cur,blocksize,count,true);
		cur+=o.adv;
		return o.data;
	}
	var loadVInt1=function() {
		return loadVInt(6,1)[0];
	}
	//for postings
	var loadPInt =function(blocksize,count) {
		var o=kfs.readBuf_packedintSync(cur,blocksize,count,false);
		cur+=o.adv;
		return o.data;
	}
	// item can be any type (variable length)
	// maximum size of array is 1TB 2^40
	// structure:
	// signature,5 bytes offset, payload, itemlengths
	var loadArray = function(blocksize,lazy) {
		var lengthoffset=kfs.readUI8Sync(cur)*4294967296;
		lengthoffset+=kfs.readUI32Sync(cur+1);
		cur+=5;
		var dataoffset=cur;
		cur+=lengthoffset;
		var count=loadVInt1();
		var sz=loadVInt(count*6,count);
		var o=[];
		var endcur=cur;
		cur=dataoffset; 
		for (var i=0;i<count;i++) {
			if (lazy) { 
				//store the offset instead of loading from disk
				var offset=dataoffset;
				for (var i=0;i<sz.length;i++) {
				//prefix with a \0, impossible for normal string
					o[o.length]="\0"+offset.toString(16)
						   +"\0"+sz[i].toString(16);
					offset+=sz[i];
				}
			} else {			
				o[o.length]=load({blocksize:sz[i]});
			}
		}
		cur=endcur;
		return o;
	}		
	// item can be any type (variable length)
	// support lazy load
	// structure:
	// signature,5 bytes offset, payload, itemlengths, 
	//                    stringarray_signature, keys
	var loadObject = function(blocksize,lazy, keys) {
		var start=cur;
		var lengthoffset=kfs.readUI8Sync(cur)*4294967296;
		lengthoffset+=kfs.readUI32Sync(cur+1);cur+=5;
		var dataoffset=cur;
		cur+=lengthoffset;
		var count=loadVInt1();
		var lengths=loadVInt(count*6,count);
		var keyssize=blocksize-cur+start;	
		var K=load({blocksize:keyssize});
		var o={};
		var endcur=cur;
		
		if (lazy) { 
			//store the offset instead of loading from disk
			var offset=dataoffset;
			for (var i=0;i<lengths.length;i++) {
				//prefix with a \0, impossible for normal string
				o[K[i]]="\0"+offset.toString(16)
					   +"\0"+lengths[i].toString(16);
				offset+=lengths[i];
			}
		} else {
			cur=dataoffset; 
			for (var i=0;i<count;i++) {
				o[K[i]]=(load({blocksize:lengths[i]}));
			}
		}
		if (keys) K.map(function(r) { keys.push(r)});
		cur=endcur;
		return o;
	}		
	//item is same known type
	var loadStringArray=function(blocksize,encoding) {
		var o=kfs.readStringArraySync(cur,blocksize,encoding);
		cur+=blocksize;
		return o;
	}
	var loadIntegerArray=function(blocksize,unitsize) {
		var count=loadVInt1();
		var o=kfs.readFixedArraySync(cur,count,unitsize);
		cur+=count*unitsize;
		return o;
	}
	var loadBlob=function(blocksize) {
		var o=kfs.readBufSync(cur,blocksize);
		cur+=blocksize;
		return o;
	}	
	
	var load=function(opts) {
		opts=opts||{};
		var blocksize=opts.blocksize||kfs.size; 
		var signature=kfs.readSignatureSync(cur);
		cur+=kfs.signature_size;
		var datasize=blocksize-kfs.signature_size;
		//basic types
		if (signature===DT.int32) {
			cur+=4;
			return kfs.readI32Sync(cur-4);
		} else if (signature===DT.uint8) {
			cur++;
			return kfs.readUI8Sync(cur-1);
		} else if (signature===DT.utf8) {
			var c=cur;cur+=datasize;
			return kfs.readStringSync(c,datasize,'utf8');	
		} else if (signature===DT.ucs2) {
			var c=cur;cur+=datasize;
			return kfs.readStringSync(c,datasize,'ucs2');	
		} else if (signature===DT.bool) {
			cur++;
			return !!(kfs.readUI8Sync(cur-1));
		} else if (signature===DT.blob) {
			return loadBlob(datasize);
		}
		//variable length integers
		else if (signature===DT.vint) return loadVInt(datasize);
		else if (signature===DT.pint) return loadPInt(datasize);
		//simple array
		else if (signature===DT.utf8arr) return loadStringArray(datasize,'utf8');
		else if (signature===DT.ucs2arr) return loadStringArray(datasize,'ucs2');
		else if (signature===DT.uint8arr) return loadIntegerArray(datasize,1);
		else if (signature===DT.int32arr) return loadIntegerArray(datasize,4);
		//nested structure
		else if (signature===DT.array) return loadArray(datasize,opts.lazy);
		else if (signature===DT.object) {
			return loadObject(datasize,opts.lazy,opts.keys);
		}
		else throw 'unsupported type '+signature;
	}
	var reset=function() {
		cur=0;
		kdb.setCache(load({lazy:true}));
	}
	var getall=function() {
		var output={};
		var keys=getkeys();
		for (var i in keys) {
			output[keys[i]]= get([keys[i]],true);
		}
		return output;
		
	}
	var exists=function(path) {
		if (path.length==0) return true;
		var key=path.pop();
		get(path);
		if (!path.join('\0')) return (!!kdb.key()[key]);
		var keys=kdb.key()[path.join('\0')];
		path.push(key);//put it back
		if (keys) return (keys.indexOf(key)>-1);
		else return false;
	}
	var get=function(path,recursive) {
		recursive=recursive||false;
		if (!kdb.cache()) reset();

		if (typeof path=="string") path=[path];
		var o=kdb.cache();
		if (path.length==0 &&recursive) return getall();
		var pathnow="";
		for (var i=0;i<path.length;i++) {
			var r=o[path[i]] ;

			if (r===undefined) return undefined;
			if (parseInt(i)) pathnow+="\0";
			pathnow+=path[i];
			if (typeof r=='string' && r[0]=="\0") { //offset of data to be loaded
				var keys=[];
				var p=r.substring(1).split("\0").map(
					function(item){return parseInt(item,16)});
				cur=p[0];
				var lazy=!recursive || (i<path.length-1) ;
				o[path[i]]=load({lazy:lazy,blocksize:p[1],keys:keys});
				kdb.key()[pathnow]=keys;
				o=o[path[i]];
			} else {
				o=r; //already in cache
			}
		}
		return o;
	}
	// get all keys in given path
	var getkeys=function(path) {
		if (!path) path=[]
		get(path); // make sure it is loaded
		if (path && path.length) {
			return kdb.key()[path.join("\0")];
		} else {
			return Object.keys(kdb.cache()); 
			//top level, normally it is very small
		}
		
	}

	kdb.loadSync=load;
	kdb.keysSync=getkeys;
	kdb.getSync=get;   // get a field, load if needed
	kdb.existsSync=exists;
	return kdb;
}

if (module) module.exports=Sync;

});
require.register("ksana-document/kdbfs_sync.js", function(exports, require, module){
/* OS dependent file operation */

var fs=require('fs');
var signature_size=1;

var unpack_int = function (ar, count , reset) {
   count=count||ar.length;
   /*
	if (typeof ijs_unpack_int == 'function') {
		var R = ijs_unpack_int(ar, count, reset)
		return R
	};
	*/
  var r = [], i = 0, v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;	  
	} while (ar[++i] & 0x80);
	r.push(v); if (reset) v=0;
	count--;
  } while (i<ar.length && count);
  return {data:r, adv:i };
}
var Sync=function(kfs) {
	var handle=kfs.handle;

	var readSignature=function(pos) {
		var buf=new Buffer(signature_size);
		fs.readSync(handle,buf,0,signature_size,pos);
		var signature=buf.toString('utf8',0,signature_size);
		return signature;
	}
	var readString= function(pos,blocksize,encoding) {
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.readSync(handle,buffer,0,blocksize,pos);
		return buffer.toString(encoding);
	}

	var readStringArray = function(pos,blocksize,encoding) {
		if (blocksize==0) return [];
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.readSync(handle,buffer,0,blocksize,pos);
		var out=buffer.toString(encoding).split('\0');
		return out;
	}
	var readUI32=function(pos) {
		var buffer=new Buffer(4);
		fs.readSync(handle,buffer,0,4,pos);
		return buffer.readUInt32BE(0);
	}
	var readI32=function(pos) {
		var buffer=new Buffer(4);
		fs.readSync(handle,buffer,0,4,pos);
		return buffer.readInt32BE(0);
	}
	var readUI8=function(pos) {
		var buffer=new Buffer(1);
		fs.readSync(handle,buffer,0,1,pos);
		return buffer.readUInt8(0);
	}
	var readBuf=function(pos,blocksize) {
		var buf=new Buffer(blocksize);
		fs.readSync(handle,buf,0,blocksize,pos);
	
		return buf;
	}
	var readBuf_packedint=function(pos,blocksize,count,reset) {
		var buf=readBuf(pos,blocksize);
		return unpack_int(buf,count,reset);
	}
	// signature, itemcount, payload
	var readFixedArray = function(pos ,count, unitsize) {
		var func;
		
		if (unitsize* count>this.size && this.size)  {
			throw "array size exceed file size"
			return;
		}
		
		var items=new Buffer( unitsize* count);
		if (unitsize===1) {
			func=items.readUInt8;
		} else if (unitsize===2) {
			func=items.readUInt16BE;
		} else if (unitsize===4) {
			func=items.readUInt32BE;
		} else throw 'unsupported integer size';
		//console.log('itemcount',itemcount,'buffer',buffer);
		fs.readSync(handle,items,0,unitsize*count,pos);
		var out=[];
		for (var i = 0; i < items.length / unitsize; i++) {
			out.push( func.apply(items,[i*unitsize]) );
		}
		return out;
	}
	
	kfs.readSignatureSync=readSignature;
	kfs.readI32Sync=readI32;
	kfs.readUI32Sync=readUI32;
	kfs.readUI8Sync=readUI8;
	kfs.readBufSync=readBuf;
	kfs.readBuf_packedintSync=readBuf_packedint;
	kfs.readFixedArraySync=readFixedArray;
	kfs.readStringSync=readString;
	kfs.readStringArraySync=readStringArray;
	kfs.signature_sizeSync=signature_size;
	
	return kfs;
}
module.exports=Sync;

});
require.register("ksana-document/html5fs.js", function(exports, require, module){
/*
http://stackoverflow.com/questions/3146483/html5-file-api-read-as-text-and-binary

automatic open file without user interaction
http://stackoverflow.com/questions/18251432/read-a-local-file-using-javascript-html5-file-api-offline-website

extension id
 chrome.runtime.getURL("vrimul.ydb")
"chrome-extension://nfdipggoinlpfldmfibcjdobcpckfgpn/vrimul.ydb"
 tell user to switch to the directory

 getPackageDirectoryEntry
*/

var read=function(handle,buffer,offset,length,position,cb) {	 //buffer and offset is not used
     var xhr = new XMLHttpRequest();
      xhr.open('GET', handle.url , true);
      var range=[position,length+position-1];
      xhr.setRequestHeader('Range', 'bytes='+range[0]+'-'+range[1]);
      xhr.responseType = 'arraybuffer';
      xhr.send();

      xhr.onload = function(e) {
        var that=this;
        setTimeout(function(){
          cb(0,that.response.byteLength,that.response);
        },0);
      }; 
}

var close=function(handle) {
	//nop
}
var fstatSync=function(handle) {
  throw "not implement yet";
}
var fstat=function(handle,cb) {
  throw "not implement yet";
}
var _open=function(fn_url,cb) {
    var handle={};
    if (fn_url.indexOf("filesystem:")==0){
      handle.url=fn_url;
      handle.fn=fn_url.substr( fn_url.lastIndexOf("/")+1);
    } else {
      handle.fn=fn_url;
      var url=API.files.filter(function(f){ return (f[0]==fn_url)});
      if (url.length) handle.url=url[0][1];
    }
    cb(handle);//url as handle
}
var open=function(fn_url,cb) {
    if (!API.initialized) {init(1024*1024,function(){
      _open.apply(this,[fn_url,cb]);
    },this)} else _open.apply(this,[fn_url,cb]);
}
var load=function(filename,mode,cb) {
  open(filename,mode,cb,true);
}
var get_date=function(url,callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET", //  to get only the header
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          callback(xhr.getResponseHeader("Last-Modified"));
        } else {
          if (this.status!==200&&this.status!==206) {
            callback("");
          }
        }
    };
    xhr.send();
}
var  getDownloadSize=function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET", //  to get only the header
    xhr.onreadystatechange = function() {
        if (this.readyState == this.DONE) {
          callback(parseInt(xhr.getResponseHeader("Content-Length")));
        } else {
          if (this.status!==200&&this.status!==206) {
            callback(0);//no such file     
          }
        }
    };
    xhr.send();
};
var checkUpdate=function(url,fn,cb) {
    if (!url) {
      cb(false);
      return;
    }
    get_date(url,function(d){
      API.fs.root.getFile(fn, {create: false, exclusive: false}, function(fileEntry) {
          fileEntry.getMetadata(function(metadata){
            var localDate=Date.parse(metadata.modificationTime);
            var urlDate=Date.parse(d);
            cb(urlDate>localDate);
          });
    },function(){//error
      cb(false); //missing local file
    });
  });
}
var download=function(url,fn,cb,statuscb,context) {
   var totalsize=0,batches=null,written=0;
   var createBatches=function(size) {
      var bytes=1024*1024, out=[];
      var b=Math.floor(size / bytes);
      var last=size %bytes;
      for (var i=0;i<=b;i++) {
        out.push(i*bytes);
      }
      out.push(b*bytes+last);
      return out;
   }
   var finish=function(srcEntry) { //remove old file and rename temp.kdb 
         rm(fn,function(){
            srcEntry.moveTo(srcEntry.filesystem.root, fn,function(){
              setTimeout( cb.bind(context,false) , 0) ; 
            },function(e){
              console.log("faile",e)
            });
         },this); 
   }
   var tempfn="temp.kdb";
    var batch=function(b) {
       var xhr = new XMLHttpRequest();
       var requesturl=url+"?"+Math.random();
       xhr.open('get', requesturl, true);
       xhr.setRequestHeader('Range', 'bytes='+batches[b]+'-'+(batches[b+1]-1));
       xhr.responseType = 'blob';    
       var create=(b==0);
       xhr.addEventListener('load', function() {
         var blob=this.response;
         API.fs.root.getFile(tempfn, {create: create, exclusive: false}, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
              fileWriter.seek(fileWriter.length);
              fileWriter.write(blob);
              written+=blob.size;
              fileWriter.onwriteend = function(e) {
                var abort=false;
                if (statuscb) {
                  abort=statuscb.apply(context,[ fileWriter.length / totalsize,totalsize ]);
                  if (abort) {
                      setTimeout( cb.bind(context,false) , 0) ;                     
                  }
                }
                b++;
                if (!abort) {
                  if (b<batches.length-1) {
                     setTimeout(batch.bind(this,b),0);
                  } else {
                      finish(fileEntry);
                  }                  
                }
              };
            }, console.error);
          }, console.error);
       },false);
       xhr.send();
    }
     //main
     getDownloadSize(url,function(size){
       totalsize=size;
       if (!size) {
          if (cb) cb.apply(context,[false]);
       } else {//ready to download
        rm(tempfn,function(){
           batches=createBatches(size);
           if (statuscb) statuscb.apply(context,[ 0, totalsize ]);
           batch(0);          
        },this);
      }
     });
}

var readFile=function(filename,cb,context) {
  API.fs.root.getFile(filename, function(fileEntry) {
      var reader = new FileReader();
      reader.onloadend = function(e) {
          if (cb) cb.apply(cb,[this.result]);
        };            
    }, console.error);
}
var writeFile=function(filename,buf,cb,context){
   API.fs.root.getFile(filename, {create: true, exclusive: true}, function(fileEntry) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.write(buf);
        fileWriter.onwriteend = function(e) {
          if (cb) cb.apply(cb,[buf.byteLength]);
        };            
      }, console.error);
    }, console.error);
}

var readdir=function(cb,context) {
   var dirReader = API.fs.root.createReader();
   var out=[],that=this;
    // Need to recursively read directories until there are no more results.
    dirReader.readEntries(function(entries) {
      if (entries.length) {
          for (var i = 0, entry; entry = entries[i]; ++i) {
            if (entry.isFile) {
              out.push([entry.name,entry.toURL ? entry.toURL() : entry.toURI()]);
            }
          }
      }
      API.files=out;
      if (cb) cb.apply(context,[out]);
    }, function(){
      if (cb) cb.apply(context,[null]);
    });
}
var getFileURL=function(filename) {
  if (!API.files ) return null;
  var file= API.files.filter(function(f){return f[0]==filename});
  if (file.length) return file[0][1];
}
var rm=function(filename,cb,context) {
   var url=getFileURL(filename);
   if (url) rmURL(url,cb,context);
   else if (cb) cb.apply(context,[false]);
}

var rmURL=function(filename,cb,context) {
    webkitResolveLocalFileSystemURL(filename, function(fileEntry) {
      fileEntry.remove(function() {
        if (cb) cb.apply(context,[true]);
      }, console.error);
    },  function(e){
      if (cb) cb.apply(context,[false]);//no such file
    });
}
var initfs=function(grantedBytes,cb,context) {
      webkitRequestFileSystem(PERSISTENT, grantedBytes,  function(fs) {
      API.fs=fs;
      API.quota=grantedBytes;
      readdir(function(){
        API.initialized=true;
        cb.apply(context,[grantedBytes,fs]);
      },context);
    }, console.error);
}
var init=function(quota,cb,context) {
  navigator.webkitPersistentStorage.requestQuota(quota, 
      function(grantedBytes) {

        initfs(grantedBytes,cb,context);
    }, console.error 
  );
}
var queryQuota=function(cb,context) {
    var that=this;
    navigator.webkitPersistentStorage.queryUsageAndQuota( 
     function(usage,quota){
        initfs(quota,function(){
          cb.apply(context,[usage,quota]);
        },context);
    });
}
//if (typeof navigator!="undefined" && navigator.webkitPersistentStorage) init(1024*1024);
var API={
  load:load
  ,open:open
  ,read:read
  ,fstatSync:fstatSync
  ,fstat:fstat,close:close
  ,init:init
  ,readdir:readdir
  ,checkUpdate:checkUpdate
  ,rm:rm
  ,rmURL:rmURL
  ,getFileURL:getFileURL
  ,getDownloadSize:getDownloadSize
  ,writeFile:writeFile
  ,readFile:readFile
  ,download:download
  ,queryQuota:queryQuota}

  module.exports=API;
});
require.register("ksana-document/kse.js", function(exports, require, module){
/*
  Ksana Search Engine.

  need a KDE instance to be functional
  
*/
var bsearch=require("./bsearch");

var _search=function(engine,q,opts,cb) {
	if (typeof engine=="string") {//browser only
		//search on remote server
		var kde=Require("ksana-document").kde;
		var $kse=Require("ksanaforge-kse").$yase; 
		opts.dbid=engine;
		opts.q=q;
		$kse.search(opts,cb);
	} else {//nw or brower
		return require("./search")(engine,q,opts,cb);		
	}
}

var _highlightPage=function(engine,fileid,pageid,opts,cb){
	if (opts.q) {
		_search(engine,opts.q,opts,function(Q){
			api.excerpt.highlightPage(Q,fileid,pageid,opts,cb);
		});
	} else {
		api.excerpt.getPage(engine,fileid,pageid,cb);
	}
}

var vpos2filepage=function(engine,vpos) {
    var pageOffsets=engine.get("pageOffsets");
    var fileOffsets=engine.get(["fileOffsets"]);
    var pageNames=engine.get("pageNames");
    var fileid=bsearch(fileOffsets,vpos+1,true);
    fileid--;
    var pageid=bsearch(pageOffsets,vpos+1,true);
    pageid--;

    var fileOffset=fileOffsets[fileid];
    var pageOffset=bsearch(pageOffsets,fileOffset+1,true);
    pageOffset--;
    pageid-=pageOffset;
    return {file:fileid,page:pageid};
}
var api={
	search:_search
	,concordance:require("./concordance")
	,regex:require("./regex")
	,highlightPage:_highlightPage
	,excerpt:require("./excerpt")
	,vpos2filepage:vpos2filepage
}
module.exports=api;
});
require.register("ksana-document/kde.js", function(exports, require, module){
/* Ksana Database Engine
   middleware for client and server.
   each ydb has one engine instance.
   all data from server will be cache at client side to save network roundtrip.
*/
if (typeof nodeRequire=='undefined')var nodeRequire=require;
var pool={},localPool={};
var apppath="";
var bsearch=require("./bsearch");
var _getSync=function(keys,recursive) {
	var out=[];
	for (var i in keys) {
		out.push(this.getSync(keys[i],recursive));	
	}
	return out;
}
var _gets=function(keys,recursive,cb) { //get many data with one call
	if (!keys) return ;
	if (typeof keys=='string') {
		keys=[keys];
	}
	var engine=this, output=[];

	var makecb=function(key){
		return function(data){
				if (!(data && typeof data =='object' && data.__empty)) output.push(data);
				engine.get(key,recursive,taskqueue.shift());
		};
	};

	var taskqueue=[];
	for (var i=0;i<keys.length;i++) {
		if (typeof keys[i]=="null") { //this is only a place holder for key data already in client cache
			output.push(null);
		} else {
			taskqueue.push(makecb(keys[i]));
		}
	};

	taskqueue.push(function(data){
		output.push(data);
		cb.apply(engine.context||engine,[output,keys]); //return to caller
	});

	taskqueue.shift()({__empty:true}); //run the task
}

var toDoc=function(pagenames,texts,parents,reverts) {
	if (typeof Require!="undefined") {
		var D=Require("ksana-document").document;
	} else {
		var D=nodeRequire("./document");	
	}
	var d=D.createDocument() ,revert=null;
	for (var i=0;i<texts.length;i++) {
		if (reverts && reverts[i].trim()) revert=JSON.parse(reverts[i]);
		else revert=null;
		var p=null;
		if (parents) p=parents[i];
		d.createPage({n:pagenames[i],t:texts[i],p:p,r:revert});
	}
	d.endCreatePages();
	return d;
}
var getFileRange=function(i) {
	var engine=this;
	var fileOffsets=engine.get(["fileOffsets"]);
	var pageOffsets=engine.get(["pageOffsets"]);
	var pageNames=engine.get(["pageNames"]);
	var fileStart=fileOffsets[i],fileEnd=fileOffsets[i+1];

	var start=bsearch(pageOffsets,fileStart+1,true);
	if (i==0) start=0; //work around for first file
	var end=bsearch(pageOffsets,fileEnd);
	//in case of items with same value
	//return the last one
	while (start && pageOffsets[start-1]==pageOffsets[start]) start--;	
	
	while (pageOffsets[end+1]==pageOffsets[end]) end++;

	return {start:start,end:end};
}
var getFilePageOffsets=function(i) {
	var pageOffsets=this.get("pageOffsets");
	var range=getFileRange.apply(this,[i]);
	return pageOffsets.slice(range.start,range.end+1);
}

var getFilePageNames=function(i) {
	var range=getFileRange.apply(this,[i]);
	var pageNames=this.get("pageNames");
	return pageNames.slice(range.start,range.end+1);
}
var getDocument=function(filename,cb){
	var engine=this;
	var filenames=engine.get("fileNames");
	
	var i=filenames.indexOf(filename);
	if (i==-1) {
		cb(null);
	} else {
		var pagenames=getFilePageNames.apply(engine,[i]);
		var files=engine.get(["files",i],true,function(file){
			var parentId=null,reverts=null;
			if (file) {
				parentId=file.parentId;
				reverts=file.reverts;
			}
			engine.get(["fileContents",i],true,function(data){
				cb(toDoc(pagenames,data,parentId,reverts));
			});			
		});
	}
}
var createLocalEngine=function(kdb,cb,context) {
	var engine={lastAccess:new Date(), kdb:kdb, queryCache:{}, postingCache:{}, cache:{}};

	if (kdb.fs.html5fs) {
		var customfunc=Require("ksana-document").customfunc;
	} else {
		var customfunc=nodeRequire("ksana-document").customfunc;	
	}	
	if (typeof context=="object") engine.context=context;
	engine.get=function(key,recursive,cb) {

		if (typeof recursive=="function") {
			cb=recursive;
			recursive=false;
		}
		if (!key) {
			if (cb) cb(null);
			return null;
		}

		if (typeof cb!="function") {
			if (kdb.fs.html5fs) {
				return engine.kdb.get(key,recursive,cb);
			} else {
				return engine.kdb.getSync(key,recursive);
			}
		}

		if (typeof key=="string") {
			return engine.kdb.get([key],recursive,cb);
		} else if (typeof key[0] =="string") {
			return engine.kdb.get(key,recursive,cb);
		} else if (typeof key[0] =="object") {
			return _gets.apply(engine,[key,recursive,cb]);
		} else {
			cb(null);	
		}
	};	
	engine.fileOffset=fileOffset;
	engine.folderOffset=folderOffset;
	engine.pageOffset=pageOffset;
	engine.getDocument=getDocument;
	engine.getFilePageNames=getFilePageNames;
	engine.getFilePageOffsets=getFilePageOffsets;
	//only local engine allow getSync
	if (!kdb.fs.html5fs)	engine.getSync=engine.kdb.getSync;
	var preload=[["meta"],["fileNames"],["fileOffsets"],
	["tokens"],["postingslen"],["pageNames"],["pageOffsets"]];

	var setPreload=function(res) {
		engine.dbname=res[0].name;
		engine.customfunc=customfunc.getAPI(res[0].config);
		engine.ready=true;
	}
	if (typeof cb=="function") {
		_gets.apply(engine,[  preload, true,function(res){
			setPreload(res);
			cb.apply(engine.context,[engine]);
		}]);
	} else {
		setPreload(_getSync.apply(engine,[preload,true]));
	}
	return engine;
}

var getRemote=function(key,recursive,cb) {
	var $kse=Require("ksanaforge-kse").$ksana; 
	var engine=this;
	if (!engine.ready) {
		console.error("remote connection not established yet");
		return;
	} 
	if (typeof recursive=="function") {
		cb=recursive;
		recursive=false;
	}
	recursive=recursive||false;
	if (typeof key=="string") key=[key];

	if (key[0] instanceof Array) { //multiple keys
		var keys=[],output=[];
		for (var i=0;i<key.length;i++) {
			var cachekey=key[i].join("\0");
			var data=engine.cache[cachekey];
			if (typeof data!="undefined") {
				keys.push(null);//  place holder for LINE 28
				output.push(data); //put cached data into output
			} else{
				engine.fetched++;
				keys.push(key[i]); //need to ask server
				output.push(null); //data is unknown yet
			}
		}
		//now ask server for unknown datum
		engine.traffic++;
		var opts={key:keys,recursive:recursive,db:engine.kdbid};
		$kse("get",opts).done(function(datum){
			//merge the server result with cached 
			for (var i=0;i<output.length;i++) {
				if (datum[i] && keys[i]) {
					var cachekey=keys[i].join("\0");
					engine.cache[cachekey]=datum[i];
					output[i]=datum[i];
				}
			}
			cb.apply(engine.context,[output]);	
		});
	} else { //single key
		var cachekey=key.join("\0");
		var data=engine.cache[cachekey];
		if (typeof data!="undefined") {
			if (cb) cb.apply(engine.context,[data]);
			return data;//in cache , return immediately
		} else {
			engine.traffic++;
			engine.fetched++;
			var opts={key:key,recursive:recursive,db:engine.kdbid};
			$kse("get",opts).done(function(data){
				engine.cache[cachekey]=data;
				if (cb) cb.apply(engine.context,[data]);	
			});
		}
	}
}
var pageOffset=function(pagename) {
	var engine=this;
	if (arguments.length>1) throw "argument : pagename ";

	var pageNames=engine.get("pageNames");
	var pageOffsets=engine.get("pageOffsets");

	var i=pageNames.indexOf(pagename);
	return (i>-1)?pageOffsets[i]:0;
}
var fileOffset=function(fn) {
	var engine=this;
	var filenames=engine.get("fileNames");
	var offsets=engine.get("fileOffsets");
	var i=filenames.indexOf(fn);
	if (i==-1) return null;
	return {start: offsets[i], end:offsets[i+1]};
}

var folderOffset=function(folder) {
	var engine=this;
	var start=0,end=0;
	var filenames=engine.get("fileNames");
	var offsets=engine.get("fileOffsets");
	for (var i=0;i<filenames.length;i++) {
		if (filenames[i].substring(0,folder.length)==folder) {
			if (!start) start=offsets[i];
			end=offsets[i];
		} else if (start) break;
	}
	return {start:start,end:end};
}

var createEngine=function(kdbid,context,cb) {
	if (typeof context=="function"){
		cb=context;
	}
	//var link=Require("./link");
	var customfunc=Require("ksana-document").customfunc;
	var $kse=Require("ksanaforge-kse").$ksana; 
	var engine={lastAccess:new Date(), kdbid:kdbid, cache:{} , 
	postingCache:{}, queryCache:{}, traffic:0,fetched:0};
	engine.setContext=function(ctx) {this.context=ctx};
	engine.get=getRemote;
	engine.fileOffset=fileOffset;
	engine.folderOffset=folderOffset;
	engine.pageOffset=pageOffset;
	engine.getDocument=getDocument;
	engine.getFilePageNames=getFilePageNames;
	engine.getFilePageOffsets=getFilePageOffsets;

	if (typeof context=="object") engine.context=context;

	//engine.findLinkBy=link.findLinkBy;
	$kse("get",{key:[["meta"],["fileNames"],["fileOffsets"],["tokens"],["postingslen"],,["pageNames"],["pageOffsets"]], 
		recursive:true,db:kdbid}).done(function(res){
		engine.dbname=res[0].name;

		engine.cache["fileNames"]=res[1];
		engine.cache["fileOffsets"]=res[2];
		engine.cache["tokens"]=res[3];
		engine.cache["postingslen"]=res[4];
		engine.cache["pageNames"]=res[5];
		engine.cache["pageOffsets"]=res[6];

//		engine.cache["tokenId"]=res[4];
//		engine.cache["files"]=res[2];

		engine.customfunc=customfunc.getAPI(res[0].config);
		engine.cache["meta"]=res[0]; //put into cache manually

		engine.ready=true;
		//console.log("remote kde connection ["+kdbid+"] established.");
		if (cb) cb.apply(context,[engine]);
	})


	return engine;
}
 //TODO delete directly from kdb instance
 //kdb.free();
var closeLocal=function(kdbid) {
	var engine=localPool[kdbid];
	if (engine) {
		engine.kdb.free();
		delete localPool[kdbid];
	}
}
var close=function(kdbid) {
	var engine=pool[kdbid];
	if (engine) {
		engine.kdb.free();
		delete pool[kdbid];
	}
}
var open=function(kdbid,cb,context) {
	if (typeof io=="undefined") { //for offline mode
		return openLocal(kdbid,cb,context);
	}

	var engine=pool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[engine]);
		return engine;
	}
	engine=createEngine(kdbid,context,cb);

	pool[kdbid]=engine;
	return engine;
}
var openLocalNode=function(kdbid,cb,context) {
	var fs=nodeRequire('fs');
	var Kdb=nodeRequire('ksana-document').kdb;
	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb(engine);
		return engine;
	}

	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";

	var tries=["./"+kdbfn  //TODO , allow any depth
	           ,apppath+"/"+kdbfn,
	           ,apppath+"/ksana_databases/"+kdbfn
	           ,apppath+"/"+kdbfn,
	           ,"./ksana_databases/"+kdbfn
	           ,"../"+kdbfn
	           ,"../ksana_databases/"+kdbfn
	           ,"../../"+kdbfn
	           ,"../../ksana_databases/"+kdbfn
	           ,"../../../"+kdbfn
	           ,"../../../ksana_databases/"+kdbfn
	           ];

	for (var i=0;i<tries.length;i++) {
		if (fs.existsSync(tries[i])) {
			//console.log("kdb path: "+nodeRequire('path').resolve(tries[i]));
			new Kdb(tries[i],function(kdb){
				createLocalEngine(kdb,function(engine){
						localPool[kdbid]=engine;
						cb.apply(context||engine.context,[engine]);
				},context);
			});
			return engine;
		}
	}
	if (cb) cb(null);
	return null;
}

var openLocalHtml5=function(kdbid,cb,context) {
	var Kdb=Require('ksana-document').kdb;
	
	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[engine]);
		return engine;
	}
	var Kdb=Require('ksana-document').kdb;
	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";
	new Kdb(kdbfn,function(handle){
		createLocalEngine(handle,function(engine){
			localPool[kdbid]=engine;
			cb.apply(context||engine.context,[engine]);
		},context);		
	});
}
//omit cb for syncronize open
var openLocal=function(kdbid,cb,context)  {
	if (kdbid.indexOf("filesystem:")>-1 || typeof process=="undefined") {
		openLocalHtml5(kdbid,cb,context);
	} else {
		openLocalNode(kdbid,cb,context);
	}
}
var setPath=function(path) {
	apppath=path;
	console.log("set path",path)
}

var enumKdb=function(cb,context){
	Require("ksana-document").html5fs.readdir(function(out){
		cb.apply(this,[out]);
	},context||this);
}

module.exports={openLocal:openLocal, open:open, close:close, 
	setPath:setPath, closeLocal:closeLocal, enumKdb:enumKdb};
});
require.register("ksana-document/boolsearch.js", function(exports, require, module){
/*
  TODO
  and not

*/

// http://jsfiddle.net/neoswf/aXzWw/
var plist=require('./plist');
function intersect(I, J) {
  var i = j = 0;
  var result = [];

  while( i < I.length && j < J.length ){
     if      (I[i] < J[j]) i++; 
     else if (I[i] > J[j]) j++; 
     else {
       result[result.length]=l[i];
       i++;j++;
     }
  }
  return result;
}

/* return all items in I but not in J */
function subtract(I, J) {
  var i = j = 0;
  var result = [];

  while( i < I.length && j < J.length ){
    if (I[i]==J[j]) {
      i++;j++;
    } else if (I[i]<J[j]) {
      while (I[i]<J[j]) result[result.length]= I[i++];
    } else {
      while(J[j]<I[i]) j++;
    }
  }

  if (j==J.length) {
    while (i<I.length) result[result.length]=I[i++];
  }

  return result;
}

var union=function(a,b) {
	if (!a || !a.length) return b;
	if (!b || !b.length) return a;
    var result = [];
    var ai = 0;
    var bi = 0;
    while (true) {
        if ( ai < a.length && bi < b.length) {
            if (a[ai] < b[bi]) {
                result[result.length]=a[ai];
                ai++;
            } else if (a[ai] > b[bi]) {
                result[result.length]=b[bi];
                bi++;
            } else {
                result[result.length]=a[ai];
                result[result.length]=b[bi];
                ai++;
                bi++;
            }
        } else if (ai < a.length) {
            result.push.apply(result, a.slice(ai, a.length));
            break;
        } else if (bi < b.length) {
            result.push.apply(result, b.slice(bi, b.length));
            break;
        } else {
            break;
        }
    }
    return result;
}
var OPERATION={'include':intersect, 'union':union, 'exclude':subtract};

var boolSearch=function(opts) {
  opts=opts||{};
  ops=opts.op||this.opts.op;
  this.docs=[];
	if (!this.phrases.length) return;
	var r=this.phrases[0].docs;
  /* ignore operator of first phrase */
	for (var i=1;i<this.phrases.length;i++) {
		var op= ops[i] || 'union';
		r=OPERATION[op](r,this.phrases[i].docs);
	}
	this.docs=plist.unique(r);
	return this;
}
module.exports={search:boolSearch}
});
require.register("ksana-document/search.js", function(exports, require, module){
var plist=require("./plist");
var boolsearch=require("./boolsearch");
var excerpt=require("./excerpt");
var parseTerm = function(engine,raw,opts) {
	if (!raw) return;
	var res={raw:raw,variants:[],term:'',op:''};
	var term=raw, op=0;
	var firstchar=term[0];
	var termregex="";
	if (firstchar=='-') {
		term=term.substring(1);
		firstchar=term[0];
		res.exclude=true; //exclude
	}
	term=term.trim();
	var lastchar=term[term.length-1];
	term=engine.customfunc.normalize(term);
	
	if (term.indexOf("%")>-1) {
		var termregex="^"+term.replace(/%+/g,".*")+"$";
		if (firstchar=="%") 	termregex=".*"+termregex.substr(1);
		if (lastchar=="%") 	termregex=termregex.substr(0,termregex.length-1)+".*";
	}

	if (termregex) {
		res.variants=expandTerm(engine,termregex);
	}

	res.key=term;
	return res;
}
var expandTerm=function(engine,regex) {
	var r=new RegExp(regex);
	var tokens=engine.get("tokens");
	var postingslen=engine.get("postingslen");
	var out=[];
	for (var i=0;i<tokens.length;i++) {
		var m=tokens[i].match(r);
		if (m) {
			out.push([m[0],postingslen[i]]);
		}
	}
	out.sort(function(a,b){return b[1]-a[1]});
	return out;
}
var isWildcard=function(raw) {
	return !!raw.match(/[\*\?]/);
}

var isOrTerm=function(term) {
	term=term.trim();
	return (term[term.length-1]===',');
}
var orterm=function(engine,term,key) {
		var t={text:key};
		if (engine.customfunc.simplifiedToken) {
			t.simplified=engine.customfunc.simplifiedToken(key);
		}
		term.variants.push(t);
}
var orTerms=function(engine,tokens,now) {
	var raw=tokens[now];
	var term=parseTerm(engine,raw);
	if (!term) return;
	orterm(engine,term,term.key);
	while (isOrTerm(raw))  {
		raw=tokens[++now];
		var term2=parseTerm(engine,raw);
		orterm(engine,term,term2.key);
		for (var i in term2.variants){
			term.variants[i]=term2.variants[i];
		}
		term.key+=','+term2.key;
	}
	return term;
}

var getOperator=function(raw) {
	var op='';
	if (raw[0]=='+') op='include';
	if (raw[0]=='-') op='exclude';
	return op;
}
var parsePhrase=function(q) {
	var match=q.match(/(".+?"|'.+?'|\S+)/g)
	match=match.map(function(str){
		var n=str.length, h=str.charAt(0), t=str.charAt(n-1)
		if (h===t&&(h==='"'|h==="'")) str=str.substr(1,n-2)
		return str;
	})
	return match;
}
var parseWildcard=function(raw) {
	var n=parseInt(raw,10) || 1;
	var qcount=raw.split('?').length-1;
	var scount=raw.split('*').length-1;
	var type='';
	if (qcount) type='?';
	else if (scount) type='*';
	return {wildcard:type, width: n , op:'wildcard'};
}

var newPhrase=function() {
	return {termid:[],posting:[],raw:''};
} 
var parseQuery=function(q) {
	var match=q.match(/(".+?"|'.+?'|\S+)/g)
	match=match.map(function(str){
		var n=str.length, h=str.charAt(0), t=str.charAt(n-1)
		if (h===t&&(h==='"'|h==="'")) str=str.substr(1,n-2)
		return str
	})
	//console.log(input,'==>',match)
	return match;
}
var loadPhrase=function(phrase) {
	/* remove leading and ending wildcard */
	var Q=this;
	var cache=Q.engine.postingCache;
	if (cache[phrase.key]) {
		phrase.posting=cache[phrase.key];
		return Q;
	}
	if (phrase.termid.length==1) {
		cache[phrase.key]=phrase.posting=Q.terms[phrase.termid[0]].posting;
		return Q;
	}

	var i=0, r=[],dis=0;
	while(i<phrase.termid.length) {
	  var T=Q.terms[phrase.termid[i]];
		if (0 === i) {
			r = T.posting;
		} else {
		    if (T.op=='wildcard') {
		    	T=Q.terms[phrase.termid[i++]];
		    	var width=T.width;
		    	var wildcard=T.wildcard;
		    	T=Q.terms[phrase.termid[i]];
		    	var mindis=dis;
		    	if (wildcard=='?') mindis=dis+width;
		    	if (T.exclude) r = plist.plnotfollow2(r, T.posting, mindis, dis+width);
		    	else r = plist.plfollow2(r, T.posting, mindis, dis+width);		    	
		    	dis+=(width-1);
		    }else {
		    	if (T.posting) {
		    		if (T.exclude) r = plist.plnotfollow(r, T.posting, dis);
		    		else r = plist.plfollow(r, T.posting, dis);
		    	}
		    }
		}
		dis++;	i++;
		if (!r) return Q;
  }
  phrase.posting=r;
  cache[phrase.key]=r;
  return Q;
}
var trimSpace=function(engine,query) {
	var i=0;
	var isSkip=engine.customfunc.isSkip;
	while (isSkip(query[i]) && i<query.length) i++;
	return query.substring(i);
}
var getPageWithHit=function(fileid,offsets) {
	var Q=this,engine=Q.engine;
	var pagewithhit=plist.groupbyposting2(Q.byFile[fileid ], offsets);
	pagewithhit.shift(); //the first item is not used (0~Q.byFile[0] )
	var out=[];
	pagewithhit.map(function(p,idx){if (p.length) out.push(idx)});
	return out;
}
var pageWithHit=function(fileid) {
	var Q=this,engine=Q.engine;
	var offsets=engine.getFilePageOffsets(fileid);
	return getPageWithHit.apply(this,[fileid,offsets]);
}

var newQuery =function(engine,query,opts) {
	if (!query) return;
	opts=opts||{};
	query=trimSpace(engine,query);

	var phrases=query;
	if (typeof query=='string') {
		phrases=parseQuery(query);
	}
	
	var phrase_terms=[], terms=[],variants=[],termcount=0,operators=[];
	var pc=0,termid=0;//phrase count
	for  (var i=0;i<phrases.length;i++) {
		var op=getOperator(phrases[pc]);
		if (op) phrases[pc]=phrases[pc].substring(1);

		/* auto add + for natural order ?*/
		//if (!opts.rank && op!='exclude' &&i) op='include';
		operators.push(op);
		
		var j=0,tokens=engine.customfunc.tokenize(phrases[pc]).tokens;
		phrase_terms.push(newPhrase());
		while (j<tokens.length) {
			var raw=tokens[j];
			if (isWildcard(raw)) {
				if (phrase_terms[pc].termid.length==0)  { //skip leading wild card
					j++
					continue;
				}
				terms.push(parseWildcard(raw));
				termid=termcount++;
			} else if (isOrTerm(raw)){
				var term=orTerms.apply(this,[tokens,j]);
				terms.push(term);
				j+=term.key.split(',').length-1;
				termid=termcount++;
			} else {
				var term=parseTerm(engine,raw);
				termid=terms.map(function(a){return a.key}).indexOf(term.key);
				if (termid==-1) {
					terms.push(term);
					termid=termcount++;
				};
			}
			phrase_terms[pc].termid.push(termid);
			j++;
		}
		phrase_terms[pc].key=phrases[pc];

		//remove ending wildcard
		var P=phrase_terms[pc] , T=null;
		do {
			T=terms[P.termid[P.termid.length-1]];
			if (!T) break;
			if (T.wildcard) P.termid.pop(); else break;
		} while(T);
		
		if (P.termid.length==0) {
			phrase_terms.pop();
		} else pc++;
	}
	opts.op=operators;

	var Q={dbname:engine.dbname,engine:engine,opts:opts,query:query,
		phrases:phrase_terms,terms:terms
	};
	Q.tokenize=function() {return engine.customfunc.tokenize.apply(engine,arguments);}
	Q.isSkip=function() {return engine.customfunc.isSkip.apply(engine,arguments);}
	Q.normalize=function() {return engine.customfunc.normalize.apply(engine,arguments);}
	Q.pageWithHit=pageWithHit;

	//Q.getRange=function() {return that.getRange.apply(that,arguments)};
	//API.queryid='Q'+(Math.floor(Math.random()*10000000)).toString(16);
	return Q;
}
var loadPostings=function(engine,terms,cb) {
	//
	var tokens=engine.get("tokens");
	   //var tokenIds=terms.map(function(t){return tokens[t.key]});

	var tokenIds=terms.map(function(t){ return 1+tokens.indexOf(t.key)});
	var postingid=[];
	for (var i=0;i<tokenIds.length;i++) {
		postingid.push( tokenIds[i]); // tokenId==0 , empty token
	}
	var postingkeys=postingid.map(function(t){return ["postings",t]});
	engine.get(postingkeys,function(postings){
		postings.map(function(p,i) { terms[i].posting=p });
		if (cb) cb();
	});
}
var groupBy=function(Q,posting) {
	phrases.forEach(function(P){
		var key=P.key;
		var docfreq=docfreqcache[key];
		if (!docfreq) docfreq=docfreqcache[key]={};
		if (!docfreq[that.groupunit]) {
			docfreq[that.groupunit]={doclist:null,freq:null};
		}		
		if (P.posting) {
			var res=matchPosting(engine,P.posting);
			P.freq=res.freq;
			P.docs=res.docs;
		} else {
			P.docs=[];
			P.freq=[];
		}
		docfreq[that.groupunit]={doclist:P.docs,freq:P.freq};
	});
	return this;
}
var groupByFolder=function(engine,filehits) {
	var files=engine.get("fileNames");
	var prevfolder="",hits=0,out=[];
	for (var i=0;i<filehits.length;i++) {
		var fn=files[i];
		var folder=fn.substring(0,fn.indexOf('/'));
		if (prevfolder && prevfolder!=folder) {
			out.push(hits);
			hits=0;
		}
		hits+=filehits[i].length;
		prevfolder=folder;
	}
	out.push(hits);
	return out;
}
var phrase_intersect=function(engine,Q) {
	var intersected=null;
	var fileOffsets=Q.engine.get("fileOffsets");
	var empty=[],emptycount=0,hashit=0;
	for (var i=0;i<Q.phrases.length;i++) {
		var byfile=plist.groupbyposting2(Q.phrases[i].posting,fileOffsets);
		byfile.shift();byfile.pop();
		if (intersected==null) {
			intersected=byfile;
		} else {
			for (var j=0;j<byfile.length;j++) {
				if (!(byfile[j].length && intersected[j].length)) {
					intersected[j]=empty; //reuse empty array
					emptycount++;
				} else hashit++;
			}
		}
	}

	Q.byFile=intersected;
	Q.byFolder=groupByFolder(engine,Q.byFile);
	var out=[];
	//calculate new rawposting
	for (var i=0;i<Q.byFile.length;i++) {
		if (Q.byFile[i].length) out=out.concat(Q.byFile[i]);
	}
	Q.rawresult=out;
	countFolderFile(Q);
	console.log(emptycount,hashit);
}
var countFolderFile=function(Q) {
	Q.fileWithHitCount=0;
	Q.byFile.map(function(f){if (f.length) Q.fileWithHitCount++});
			
	Q.folderWithHitCount=0;
	Q.byFolder.map(function(f){if (f) Q.folderWithHitCount++});
}
var main=function(engine,q,opts,cb){
	if (typeof opts=="function") cb=opts;
	opts=opts||{};
	
	var Q=engine.queryCache[q];
	if (!Q) Q=newQuery(engine,q,opts);
	if (!Q) {
		if (engine.context) cb.apply(engine.context,[{rawresult:[]}]);
		else cb({rawresult:[]});
		return;
	};

	engine.queryCache[q]=Q;
	
	loadPostings(engine,Q.terms,function(){
	
		if (!Q.phrases[0].posting) {
			cb.apply(engine.context,[{rawresult:[]}]);
			return;			
		}
		if (!Q.phrases[0].posting.length) { //
			Q.phrases.forEach(loadPhrase.bind(Q));
		}
		if (Q.phrases.length==1) {
			Q.rawresult=Q.phrases[0].posting;
		} else {
			phrase_intersect(engine,Q);
		}
		var fileOffsets=Q.engine.get("fileOffsets");
		
		if (!Q.byFile && Q.rawresult && !opts.nogroup) {
			Q.byFile=plist.groupbyposting2(Q.rawresult, fileOffsets);
			Q.byFile.shift();Q.byFile.pop();
			Q.byFolder=groupByFolder(engine,Q.byFile);

			countFolderFile(Q);
		}
		if (opts.range) {
			excerpt.resultlist(engine,Q,opts,function(data) {
				Q.excerpt=data;
				if (engine.context) cb.apply(engine.context,[Q]);
				else cb(Q);
			});
		} else {
			if (engine.context) cb.apply(engine.context,[Q]);
			else cb(Q);
		}		
	});
}

module.exports=main;
});
require.register("ksana-document/plist.js", function(exports, require, module){

var unpack = function (ar) { // unpack variable length integer list
  var r = [],
  i = 0,
  v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;
	} while (ar[++i] & 0x80);
	r[r.length]=v;
  } while (i < ar.length);
  return r;
}

/*
   arr:  [1,1,1,1,1,1,1,1,1]
   levels: [0,1,1,2,2,0,1,2]
   output: [5,1,3,1,1,3,1,1]
*/

var groupsum=function(arr,levels) {
  if (arr.length!=levels.length+1) return null;
  var stack=[];
  var output=new Array(levels.length);
  for (var i=0;i<levels.length;i++) output[i]=0;
  for (var i=1;i<arr.length;i++) { //first one out of toc scope, ignored
    if (stack.length>levels[i-1]) {
      while (stack.length>levels[i-1]) stack.pop();
    }
    stack.push(i-1);
    for (var j=0;j<stack.length;j++) {
      output[stack[j]]+=arr[i];
    }
  }
  return output;
}
/* arr= 1 , 2 , 3 ,4 ,5,6,7 //token posting
  posting= 3 , 5  //tag posting
  out = 3 , 2, 2
*/
var countbyposting = function (arr, posting) {
  if (!posting.length) return [arr.length];
  var out=[];
  for (var i=0;i<posting.length;i++) out[i]=0;
  out[posting.length]=0;
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<posting.length) {
    if (arr[i]<=posting[p]) {
      while (p<posting.length && i<arr.length && arr[i]<=posting[p]) {
        out[p]++;
        i++;
      }      
    } 
    p++;
  }
  out[posting.length] = arr.length-i; //remaining
  return out;
}

var groupbyposting=function(arr,gposting) { //relative vpos
  if (!gposting.length) return [arr.length];
  var out=[];
  for (var i=0;i<=gposting.length;i++) out[i]=[];
  
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<gposting.length) {
    if (arr[i]<gposting[p]) {
      while (p<gposting.length && i<arr.length && arr[i]<gposting[p]) {
        var start=0;
        if (p>0) start=gposting[p-1];
        out[p].push(arr[i++]-start);  // relative
      }      
    } 
    p++;
  }
  //remaining
  while(i<arr.length) out[out.length-1].push(arr[i++]-gposting[gposting.length-1]);
  return out;
}
var groupbyposting2=function(arr,gposting) { //absolute vpos
  if (!gposting.length) return [arr.length];
  var out=[];
  for (var i=0;i<=gposting.length;i++) out[i]=[];
  
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<gposting.length) {
    if (arr[i]<gposting[p]) {
      while (p<gposting.length && i<arr.length && arr[i]<gposting[p]) {
        var start=0;
        if (p>0) start=gposting[p-1]; //absolute
        out[p].push(arr[i++]);
      }      
    } 
    p++;
  }
  //remaining
  while(i<arr.length) out[out.length-1].push(arr[i++]-gposting[gposting.length-1]);
  return out;
}
var groupbyblock2 = function(ar, ntoken,slotshift,opts) {
  if (!ar.length) return [{},{}];
  
  slotshift = slotshift || 16;
  var g = Math.pow(2,slotshift);
  var i = 0;
  var r = {}, ntokens={};
  var groupcount=0;
  do {
    var group = Math.floor(ar[i] / g) ;
    if (!r[group]) {
      r[group] = [];
      ntokens[group]=[];
      groupcount++;
    }
    r[group].push(ar[i] % g);
    ntokens[group].push(ntoken[i]);
    i++;
  } while (i < ar.length);
  if (opts) opts.groupcount=groupcount;
  return [r,ntokens];
}
var groupbyslot = function (ar, slotshift, opts) {
  if (!ar.length)
	return {};
  
  slotshift = slotshift || 16;
  var g = Math.pow(2,slotshift);
  var i = 0;
  var r = {};
  var groupcount=0;
  do {
	var group = Math.floor(ar[i] / g) ;
	if (!r[group]) {
	  r[group] = [];
	  groupcount++;
	}
	r[group].push(ar[i] % g);
	i++;
  } while (i < ar.length);
  if (opts) opts.groupcount=groupcount;
  return r;
}
/*
var identity = function (value) {
  return value;
};
var sortedIndex = function (array, obj, iterator) { //taken from underscore
  iterator || (iterator = identity);
  var low = 0,
  high = array.length;
  while (low < high) {
	var mid = (low + high) >> 1;
	iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
  }
  return low;
};*/

var indexOfSorted = function (array, obj) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
  return low;
};
var plhead=function(pl, pltag, opts) {
  opts=opts||{};
  opts.max=opts.max||1;
  var out=[];
  if (pltag.length<pl.length) {
    for (var i=0;i<pltag.length;i++) {
       k = indexOfSorted(pl, pltag[i]);
       if (k>-1 && k<pl.length) {
        if (pl[k]==pltag[i]) {
          out[out.length]=pltag[i];
          if (out.length>=opts.max) break;
        }
      }
    }
  } else {
    for (var i=0;i<pl.length;i++) {
       k = indexOfSorted(pltag, pl[i]);
       if (k>-1 && k<pltag.length) {
        if (pltag[k]==pl[i]) {
          out[out.length]=pltag[k];
          if (out.length>=opts.max) break;
        }
      }
    }
  }
  return out;
}
/*
 pl2 occur after pl1, 
 pl2>=pl1+mindis
 pl2<=pl1+maxdis
*/
var plfollow2 = function (pl1, pl2, mindis, maxdis) {
  var r = [],i=0;
  var swap = 0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + mindis);
    var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
    if (t > -1) {
      r[r.length]=pl1[i];
      i++;
    } else {
      if (k>=pl2.length) break;
      var k2=indexOfSorted (pl1,pl2[k]-maxdis);
      if (k2>i) {
        var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
        if (t>-1) r[r.length]=pl1[k2];
        i=k2;
      } else break;
    }
  }
  return r;
}

var plnotfollow2 = function (pl1, pl2, mindis, maxdis) {
  var r = [],i=0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + mindis);
    var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
    if (t > -1) {
      i++;
    } else {
      if (k>=pl2.length) {
        r=r.concat(pl1.slice(i));
        break;
      } else {
        var k2=indexOfSorted (pl1,pl2[k]-maxdis);
        if (k2>i) {
          r=r.concat(pl1.slice(i,k2));
          i=k2;
        } else break;
      }
    }
  }
  return r;
}
/* this is incorrect */
var plfollow = function (pl1, pl2, distance) {
  var r = [],i=0;

  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) {
      r.push(pl1[i]);
      i++;
    } else {
      if (k>=pl2.length) break;
      var k2=indexOfSorted (pl1,pl2[k]-distance);
      if (k2>i) {
        t = (pl2[k] === (pl1[k2] + distance)) ? k : -1;
        if (t>-1) {
           r.push(pl1[k2]);
           k2++;
        }
        i=k2;
      } else break;
    }
  }
  return r;
}
var plnotfollow = function (pl1, pl2, distance) {
  var r = [];
  var r = [],i=0;
  var swap = 0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) { 
      i++;
    } else {
      if (k>=pl2.length) {
        r=r.concat(pl1.slice(i));
        break;
      } else {
        var k2=indexOfSorted (pl1,pl2[k]-distance);
        if (k2>i) {
          r=r.concat(pl1.slice(i,k2));
          i=k2;
        } else break;
      }
    }
  }
  return r;
}
var pland = function (pl1, pl2, distance) {
  var r = [];
  var swap = 0;
  
  if (pl1.length > pl2.length) { //swap for faster compare
    var t = pl2;
    pl2 = pl1;
    pl1 = t;
    swap = distance;
    distance = -distance;
  }
  for (var i = 0; i < pl1.length; i++) {
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) {
      r.push(pl1[i] - swap);
    }
  }
  return r;
}
var combine=function (postings) {
  var out=[];
  for (var i in postings) {
    out=out.concat(postings[i]);
  }
  out.sort(function(a,b){return a-b});
  return out;
}

var unique = function(ar){
   if (!ar || !ar.length) return [];
   var u = {}, a = [];
   for(var i = 0, l = ar.length; i < l; ++i){
    if(u.hasOwnProperty(ar[i])) continue;
    a.push(ar[i]);
    u[ar[i]] = 1;
   }
   return a;
}



var plphrase = function (postings,ops) {
  var r = [];
  for (var i=0;i<postings.length;i++) {
	if (!postings[i])
	  return [];
	if (0 === i) {
	  r = postings[0];
	} else {
    if (ops[i]=='andnot') {
      r = plnotfollow(r, postings[i], i);  
    }else {
      r = pland(r, postings[i], i);  
    }
	}
  }
  
  return r;
}
//return an array of group having any of pl item
var matchPosting=function(pl,gupl,start,end) {
  start=start||0;
  end=end||-1;
  if (end==-1) end=Math.pow(2, 53); // max integer value

  var count=0, i = j= 0,  result = [] ,v=0;
  var docs=[], freq=[];
  if (!pl) return {docs:[],freq:[]};
  while( i < pl.length && j < gupl.length ){
     if (pl[i] < gupl[j] ){ 
       count++;
       v=pl[i];
       i++; 
     } else {
       if (count) {
        if (v>=start && v<end) {
          docs.push(j);
          freq.push(count);          
        }
       }
       j++;
       count=0;
     }
  }
  if (count && j<gupl.length && v>=start && v<end) {
    docs.push(j);
    freq.push(count);
    count=0;
  }
  else {
    while (j==gupl.length && i<pl.length && pl[i] >= gupl[gupl.length-1]) {
      i++;
      count++;
    }
    if (v>=start && v<end) {
      docs.push(j);
      freq.push(count);      
    }
  } 
  return {docs:docs,freq:freq};
}

var trim=function(arr,start,end) {
  var s=indexOfSorted(arr,start);
  var e=indexOfSorted(arr,end);
  return arr.slice(s,e+1);
}
var plist={};
plist.unpack=unpack;
plist.plphrase=plphrase;
plist.plhead=plhead;
plist.plfollow2=plfollow2;
plist.plnotfollow2=plnotfollow2;
plist.plfollow=plfollow;
plist.plnotfollow=plnotfollow;
plist.unique=unique;
plist.indexOfSorted=indexOfSorted;
plist.matchPosting=matchPosting;
plist.trim=trim;

plist.groupbyslot=groupbyslot;
plist.groupbyblock2=groupbyblock2;
plist.countbyposting=countbyposting;
plist.groupbyposting=groupbyposting;
plist.groupbyposting2=groupbyposting2;
plist.groupsum=groupsum;
plist.combine=combine;
module.exports=plist;
return plist;
});
require.register("ksana-document/excerpt.js", function(exports, require, module){
var plist=require("./plist");

var getPhraseWidths=function (Q,phraseid,voffs) {
	var res=[];
	for (var i in voffs) {
		res.push(getPhraseWidth(Q,phraseid,voffs[i]));
	}
	return res;
}
var getPhraseWidth=function (Q,phraseid,voff) {
	var P=Q.phrases[phraseid];
	var width=0,varwidth=false;
	if (P.termid.length<2) return P.termid.length;
	var lasttermposting=Q.terms[P.termid[P.termid.length-1]].posting;

	for (var i in P.termid) {
		var T=Q.terms[P.termid[i]];
		if (T.op=='wildcard') {
			width+=T.width;
			if (T.wildcard=='*') varwidth=true;
		} else {
			width++;
		}
	}
	if (varwidth) { //width might be smaller due to * wildcard
		var at=plist.indexOfSorted(lasttermposting,voff);
		var endpos=lasttermposting[at];
		if (endpos-voff<width) width=endpos-voff+1;
	}

	return width;
}
/* return [voff, phraseid, phrasewidth, optional_tagname] by slot range*/
var hitInRange=function(Q,startvoff,endvoff) {
	var res=[];
	if (!Q || !Q.rawresult.length) return res;
	for (var i=0;i<Q.phrases.length;i++) {
		var P=Q.phrases[i];
		if (!P.posting) continue;
		var s=plist.indexOfSorted(P.posting,startvoff);
		var e=plist.indexOfSorted(P.posting,endvoff);
		var r=P.posting.slice(s,e);
		var width=getPhraseWidths(Q,i,r);

		res=res.concat(r.map(function(voff,idx){ return [voff,i,width[idx]] }));
	}
	// order by voff, if voff is the same, larger width come first.
	// so the output will be
	// <tag1><tag2>one</tag2>two</tag1>
	//TODO, might cause overlap if same voff and same width
	//need to check tag name
	res.sort(function(a,b){return a[0]==b[0]? b[2]-a[2] :a[0]-b[0]});

	return res;
}

/*
given a vpos range start, file, convert to filestart, fileend
   filestart : starting file
   start   : vpos start
   showfile: how many files to display
   showpage: how many pages to display

output:
   array of fileid with hits
*/
var getFileWithHits=function(engine,Q,range) {
	var fileOffsets=engine.get("fileOffsets");
	var out=[],filecount=100;
	if (range.start) {
		var first=range.start , start=0 , end;
		for (var i=0;i<fileOffsets.length;i++) {
			if (fileOffsets[i]>first) break;
			start=i;
		}		
	} else {
		start=range.filestart || 0;
		if (range.maxfile) {
			filecount=range.maxfile;
		} else if (range.showpage) {
			throw "not implement yet"
		}
	}

	var fileWithHits=[],totalhit=0;
	range.maxhit=range.maxhit||1000;

	for (var i=start;i<Q.byFile.length;i++) {
		if(Q.byFile[i].length>0) {
			totalhit+=Q.byFile[i].length;
			fileWithHits.push(i);
			range.nextFileStart=i;
			if (fileWithHits.length>=filecount) break;
			if (totalhit>range.maxhit) break;
		}
	}
	if (i>=Q.byFile.length) { //no more file
		Q.excerptStop=true;
	}
	return fileWithHits;
}
var resultlist=function(engine,Q,opts,cb) {
	var output=[];
	if (!Q.rawresult || !Q.rawresult.length) {
		cb(output);
		return;
	} 
	if (opts.range) {
		if (opts.range.maxhit && !opts.range.maxfile) {
			opts.range.maxfile=opts.range.maxhit;
		}
	}
	var fileWithHits=getFileWithHits(engine,Q,opts.range);
	if (!fileWithHits.length) {
		cb(output);
		return;
	}

	var output=[],files=[];//temporary holder for pagenames
	for (var i=0;i<fileWithHits.length;i++) {
		var nfile=fileWithHits[i];
		var pageOffsets=engine.getFilePageOffsets(nfile);
		var pageNames=engine.getFilePageNames(nfile);
		files[nfile]={pageOffsets:pageOffsets};
		var pagewithhit=plist.groupbyposting2(Q.byFile[ nfile ],  pageOffsets);
		pagewithhit.shift(); //the first item is not used (0~Q.byFile[0] )
		for (var j=0; j<pagewithhit.length;j++) {
			if (!pagewithhit[j].length) continue;
			//var offsets=pagewithhit[j].map(function(p){return p- fileOffsets[i]});
			output.push(  {file: nfile, page:j,  pagename:pageNames[j]});
		}
	}

	var pagekeys=output.map(function(p){
		return ["fileContents",p.file,p.page+1];
	});
	//prepare the text
	engine.get(pagekeys,function(pages){
		var seq=0;
		if (pages) for (var i=0;i<pages.length;i++) {
			var startvpos=files[output[i].file].pageOffsets[output[i].page];
			var endvpos=files[output[i].file].pageOffsets[output[i].page+1];
			var hl={};

			if (opts.range && opts.range.start && startvpos<opts.range.start ) {
				startvpos=opts.range.start;
			}
			
			if (opts.nohighlight) {
				hl.text=pages[i];
				hl.hits=hitInRange(Q,startvpos,endvpos);
			} else {
				var o={text:pages[i],startvpos:startvpos, endvpos: endvpos, Q:Q,fulltext:opts.fulltext};
				hl=highlight(Q,o);
			}
			if (hl.text) {
				output[i].text=hl.text;
				output[i].hits=hl.hits;
				output[i].seq=seq;
				seq+=hl.hits.length;

				output[i].start=startvpos;				
			} else {
				output[i]=null; //remove item vpos less than opts.range.start
			}
		} 
		output=output.filter(function(o){return o!=null});
		cb(output);
	});
}
var injectTag=function(Q,opts){
	var hits=opts.hits;
	var tag=opts.tag||'hl';
	var output='',O=[],j=0;;
	var surround=opts.surround||5;

	var tokens=Q.tokenize(opts.text).tokens;
	var voff=opts.voff;
	var i=0,previnrange=!!opts.fulltext ,inrange=!!opts.fulltext;
	while (i<tokens.length) {
		inrange=opts.fulltext || (j<hits.length && voff+surround>=hits[j][0] ||
				(j>0 && j<=hits.length &&  hits[j-1][0]+surround*2>=voff));	

		if (previnrange!=inrange) {
			output+=opts.abridge||"...";
		}
		previnrange=inrange;

		if (Q.isSkip(tokens[i])) {
			if (inrange) output+=tokens[i];
			i++;
			continue;
		}
		if (i<tokens.length && j<hits.length && voff==hits[j][0]) {
			var nphrase=hits[j][1] % 10, width=hits[j][2];
			var tag=hits[j][3] || tag;
			if (width) {
				output+= '<'+tag+' n="'+nphrase+'">';
				while (width && i<tokens.length) {
					output+=tokens[i];
					if (!Q.isSkip(tokens[i])) {voff++;width--;}
					i++;
				}
				output+='</'+tag+'>';
			} else {
				output+= '<'+tag+' n="'+nphrase+'"/>';
			}
			while (j<hits.length && voff>hits[j][0]) j++;
		} else {
			if (inrange && i<tokens.length) output+=tokens[i];
			i++;
			voff++;
		}
		
	}
	var remain=10;
	while (i<tokens.length) {
		if (inrange) output+= tokens[i];
		i++;
		remain--;
		if (remain<=0) break;
	}
	O.push(output);
	output="";

	return O.join("");
}
var highlight=function(Q,opts) {
	if (!opts.text) return {text:"",hits:[]};
	var opt={text:opts.text,
		hits:null,tag:'hl',abridge:opts.abridge,voff:opts.startvpos,
		fulltext:opts.fulltext
	};

	opt.hits=hitInRange(opts.Q,opts.startvpos,opts.endvpos);
	return {text:injectTag(Q,opt),hits:opt.hits};
}

var getPage=function(engine,fileid,pageid,cb) {
	var fileOffsets=engine.get("fileOffsets");
	var pagekeys=["fileContents",fileid,pageid];
	var pagenames=engine.getFilePageNames(fileid);

	engine.get(pagekeys,function(text){
		cb.apply(engine.context,[{text:text,file:fileid,page:pageid,pagename:pagenames[pageid]}]);
	});
}

var highlightPage=function(Q,fileid,pageid,opts,cb) {
	if (typeof opts=="function") {
		cb=opts;
	}

	if (!Q || !Q.engine) return cb(null);
	var pageOffsets=Q.engine.getFilePageOffsets(fileid);
	var startvpos=pageOffsets[pageid];
	var endvpos=pageOffsets[pageid+1];
	var pagenames=Q.engine.getFilePageNames(fileid);

	this.getPage(Q.engine, fileid,pageid+1,function(res){
		var opt={text:res.text,hits:null,tag:'hl',voff:startvpos,fulltext:true};
		opt.hits=hitInRange(Q,startvpos,endvpos);
		var pagename=pagenames[pageid];
		cb.apply(Q.engine.context,[{text:injectTag(Q,opt),page:pageid,file:fileid,hits:opt.hits,pagename:pagename}]);
	})
}
module.exports={resultlist:resultlist, 
	hitInRange:hitInRange, 
	highlightPage:highlightPage,
	getPage:getPage};
});
require.register("ksana-document/link.js", function(exports, require, module){
var findLinkBy=function(page,start,len,cb) {
	if (!page) {
		cb([]);
		return;
	}
	var markups=page.markupAt(start);
	markups=markups.filter(function(m){
		return m.payload.type=="linkby";
	})
	cb(markups);
}
module.exports={findLinkBy:findLinkBy};

});
require.register("ksana-document/tibetan/wylie.js", function(exports, require, module){
var opt = { check:false, check_strict:false, print_warnings:false, fix_spacing:false }

function setopt(arg_opt) {
	for (i in arg_opt) opt[i] = arg_opt[i]
	if (opt.check_strict && !opt.check) { 
		throw 'check_strict requires check.'
	}
}

function newHashSet() {
	var x = []
	x.add = function (K) {
		if (this.indexOf(K) < 0) this.push(K)
	}
	x.contains = function (K) {
		return this.indexOf(K) >= 0
	}
	return x
}

function newHashMap() {
	var x = {}
	x.k = [], x.v = []
	x.put = function (K, V) {
		var i = this.k.indexOf(K)
		if (i < 0) this.k.push(K), this.v.push(V); else this.v[i] = V
	}
	x.containsKey = function (K) {
		return this.k.indexOf(K) >= 0
	}
	x.get = function (K) {
		var i = this.k.indexOf(K)
		if (i >= 0) return this.v[i]
	}
	return x
}
var tmpSet;
// mappings are ported from Java code
// *** Wylie to Unicode mappings ***
// list of wylie consonant => unicode
var m_consonant = new newHashMap();
m_consonant.put("k", 	"\u0f40");
m_consonant.put("kh", 	"\u0f41");
m_consonant.put("g", 	"\u0f42");
m_consonant.put("gh", 	"\u0f42\u0fb7");
m_consonant.put("g+h", 	"\u0f42\u0fb7");
m_consonant.put("ng", 	"\u0f44");
m_consonant.put("c", 	"\u0f45");
m_consonant.put("ch", 	"\u0f46");
m_consonant.put("j", 	"\u0f47");
m_consonant.put("ny", 	"\u0f49");
m_consonant.put("T", 	"\u0f4a");
m_consonant.put("-t", 	"\u0f4a");
m_consonant.put("Th", 	"\u0f4b");
m_consonant.put("-th", 	"\u0f4b");
m_consonant.put("D", 	"\u0f4c");
m_consonant.put("-d", 	"\u0f4c");
m_consonant.put("Dh", 	"\u0f4c\u0fb7");
m_consonant.put("D+h", 	"\u0f4c\u0fb7");
m_consonant.put("-dh", 	"\u0f4c\u0fb7");
m_consonant.put("-d+h", "\u0f4c\u0fb7");
m_consonant.put("N", 	"\u0f4e");
m_consonant.put("-n", 	"\u0f4e");
m_consonant.put("t", 	"\u0f4f");
m_consonant.put("th", 	"\u0f50");
m_consonant.put("d", 	"\u0f51");
m_consonant.put("dh", 	"\u0f51\u0fb7");
m_consonant.put("d+h", 	"\u0f51\u0fb7");
m_consonant.put("n", 	"\u0f53");
m_consonant.put("p", 	"\u0f54");
m_consonant.put("ph", 	"\u0f55");
m_consonant.put("b", 	"\u0f56");
m_consonant.put("bh", 	"\u0f56\u0fb7");
m_consonant.put("b+h", 	"\u0f56\u0fb7");
m_consonant.put("m", 	"\u0f58");
m_consonant.put("ts", 	"\u0f59");
m_consonant.put("tsh", 	"\u0f5a");
m_consonant.put("dz", 	"\u0f5b");
m_consonant.put("dzh", 	"\u0f5b\u0fb7");
m_consonant.put("dz+h", "\u0f5b\u0fb7");
m_consonant.put("w", 	"\u0f5d");
m_consonant.put("zh", 	"\u0f5e");
m_consonant.put("z", 	"\u0f5f");
m_consonant.put("'", 	"\u0f60");
m_consonant.put("\u2018", 	"\u0f60");	// typographic quotes
m_consonant.put("\u2019", 	"\u0f60");
m_consonant.put("y", 	"\u0f61");
m_consonant.put("r", 	"\u0f62");
m_consonant.put("l", 	"\u0f63");
m_consonant.put("sh", 	"\u0f64");
m_consonant.put("Sh", 	"\u0f65");
m_consonant.put("-sh", 	"\u0f65");
m_consonant.put("s", 	"\u0f66");
m_consonant.put("h", 	"\u0f67");
m_consonant.put("W", 	"\u0f5d");
m_consonant.put("Y", 	"\u0f61");
m_consonant.put("R", 	"\u0f6a");
m_consonant.put("f", 	"\u0f55\u0f39");
m_consonant.put("v", 	"\u0f56\u0f39");

// subjoined letters
var m_subjoined = new newHashMap();
m_subjoined.put("k", 	"\u0f90");
m_subjoined.put("kh", 	"\u0f91");
m_subjoined.put("g", 	"\u0f92");
m_subjoined.put("gh", 	"\u0f92\u0fb7");
m_subjoined.put("g+h", 	"\u0f92\u0fb7");
m_subjoined.put("ng", 	"\u0f94");
m_subjoined.put("c", 	"\u0f95");
m_subjoined.put("ch", 	"\u0f96");
m_subjoined.put("j", 	"\u0f97");
m_subjoined.put("ny", 	"\u0f99");
m_subjoined.put("T", 	"\u0f9a");
m_subjoined.put("-t", 	"\u0f9a");
m_subjoined.put("Th", 	"\u0f9b");
m_subjoined.put("-th", 	"\u0f9b");
m_subjoined.put("D", 	"\u0f9c");
m_subjoined.put("-d", 	"\u0f9c");
m_subjoined.put("Dh", 	"\u0f9c\u0fb7");
m_subjoined.put("D+h", 	"\u0f9c\u0fb7");
m_subjoined.put("-dh", 	"\u0f9c\u0fb7");
m_subjoined.put("-d+h",	"\u0f9c\u0fb7");
m_subjoined.put("N", 	"\u0f9e");
m_subjoined.put("-n", 	"\u0f9e");
m_subjoined.put("t", 	"\u0f9f");
m_subjoined.put("th", 	"\u0fa0");
m_subjoined.put("d", 	"\u0fa1");
m_subjoined.put("dh", 	"\u0fa1\u0fb7");
m_subjoined.put("d+h", 	"\u0fa1\u0fb7");
m_subjoined.put("n", 	"\u0fa3");
m_subjoined.put("p", 	"\u0fa4");
m_subjoined.put("ph", 	"\u0fa5");
m_subjoined.put("b", 	"\u0fa6");
m_subjoined.put("bh", 	"\u0fa6\u0fb7");
m_subjoined.put("b+h", 	"\u0fa6\u0fb7");
m_subjoined.put("m", 	"\u0fa8");
m_subjoined.put("ts", 	"\u0fa9");
m_subjoined.put("tsh", 	"\u0faa");
m_subjoined.put("dz", 	"\u0fab");
m_subjoined.put("dzh", 	"\u0fab\u0fb7");
m_subjoined.put("dz+h",	"\u0fab\u0fb7");
m_subjoined.put("w", 	"\u0fad");
m_subjoined.put("zh", 	"\u0fae");
m_subjoined.put("z", 	"\u0faf");
m_subjoined.put("'", 	"\u0fb0");
m_subjoined.put("\u2018", 	"\u0fb0");	// typographic quotes
m_subjoined.put("\u2019", 	"\u0fb0");
m_subjoined.put("y", 	"\u0fb1");
m_subjoined.put("r", 	"\u0fb2");
m_subjoined.put("l", 	"\u0fb3");
m_subjoined.put("sh", 	"\u0fb4");
m_subjoined.put("Sh", 	"\u0fb5");
m_subjoined.put("-sh", 	"\u0fb5");
m_subjoined.put("s", 	"\u0fb6");
m_subjoined.put("h", 	"\u0fb7");
m_subjoined.put("a", 	"\u0fb8");
m_subjoined.put("W", 	"\u0fba");
m_subjoined.put("Y", 	"\u0fbb");
m_subjoined.put("R", 	"\u0fbc");

// vowels
var m_vowel = new newHashMap();
m_vowel.put("a", 	"\u0f68");
m_vowel.put("A", 	"\u0f71");
m_vowel.put("i", 	"\u0f72");
m_vowel.put("I", 	"\u0f71\u0f72");
m_vowel.put("u", 	"\u0f74");
m_vowel.put("U", 	"\u0f71\u0f74");
m_vowel.put("e", 	"\u0f7a");
m_vowel.put("ai", 	"\u0f7b");
m_vowel.put("o", 	"\u0f7c");
m_vowel.put("au", 	"\u0f7d");
m_vowel.put("-i", 	"\u0f80");
m_vowel.put("-I", 	"\u0f71\u0f80");

// final symbols to unicode
var m_final_uni = new newHashMap();
m_final_uni.put("M", 	"\u0f7e");
m_final_uni.put("~M`", 	"\u0f82");
m_final_uni.put("~M", 	"\u0f83");
m_final_uni.put("X", 	"\u0f37");
m_final_uni.put("~X", 	"\u0f35");
m_final_uni.put("H", 	"\u0f7f");
m_final_uni.put("?", 	"\u0f84");
m_final_uni.put("^", 	"\u0f39");

// final symbols organized by class
var m_final_class = new newHashMap();
m_final_class.put("M", 	"M");
m_final_class.put("~M`", "M");
m_final_class.put("~M",  "M");
m_final_class.put("X", 	"X");
m_final_class.put("~X", "X");
m_final_class.put("H", 	"H");
m_final_class.put("?", 	"?");
m_final_class.put("^", 	"^");

// other stand-alone symbols
var m_other = new newHashMap();
m_other.put("0", 	"\u0f20");
m_other.put("1", 	"\u0f21");
m_other.put("2", 	"\u0f22");
m_other.put("3", 	"\u0f23");
m_other.put("4", 	"\u0f24");
m_other.put("5", 	"\u0f25");
m_other.put("6", 	"\u0f26");
m_other.put("7", 	"\u0f27");
m_other.put("8", 	"\u0f28");
m_other.put("9", 	"\u0f29");
m_other.put(" ", 	"\u0f0b");
m_other.put("*", 	"\u0f0c");
m_other.put("/", 	"\u0f0d");
m_other.put("//", 	"\u0f0e");
m_other.put(";", 	"\u0f0f");
m_other.put("|", 	"\u0f11");
m_other.put("!", 	"\u0f08");
m_other.put(":", 	"\u0f14");
m_other.put("_", 	" ");
m_other.put("=", 	"\u0f34");
m_other.put("<", 	"\u0f3a");
m_other.put(">", 	"\u0f3b");
m_other.put("(", 	"\u0f3c");
m_other.put(")", 	"\u0f3d");
m_other.put("@", 	"\u0f04");
m_other.put("#", 	"\u0f05");
m_other.put("$", 	"\u0f06");
m_other.put("%", 	"\u0f07");

// special characters: flag those if they occur out of context
var m_special = new newHashSet();
m_special.add(".");
m_special.add("+");
m_special.add("-");
m_special.add("~");
m_special.add("^");
m_special.add("?");
m_special.add("`");
m_special.add("]");

// superscripts: hashmap of superscript => set of letters or stacks below
var m_superscripts = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("j");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("ts");
tmpSet.add("dz");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("m+y");
tmpSet.add("b+w");
tmpSet.add("ts+w");
tmpSet.add("g+w");
m_superscripts.put("r", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("c");
tmpSet.add("j");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("h");
m_superscripts.put("l", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("ts");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("p+y");
tmpSet.add("b+y");
tmpSet.add("m+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("p+r");
tmpSet.add("b+r");
tmpSet.add("m+r");
tmpSet.add("n+r");
m_superscripts.put("s", tmpSet);

// subscripts => set of letters above
var m_subscripts = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("p");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("r+k");
tmpSet.add("r+g");
tmpSet.add("r+m");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+p");
tmpSet.add("s+b");
tmpSet.add("s+m");
m_subscripts.put("y", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("t");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("p");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("h");
tmpSet.add("dz");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+p");
tmpSet.add("s+b");
tmpSet.add("s+m");
tmpSet.add("s+n");
m_subscripts.put("r", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("b");
tmpSet.add("r");
tmpSet.add("s");
tmpSet.add("z");
m_subscripts.put("l", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("c");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("ts");
tmpSet.add("tsh");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("r");
tmpSet.add("l");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("h");
tmpSet.add("g+r");
tmpSet.add("d+r");
tmpSet.add("ph+y");
tmpSet.add("r+g");
tmpSet.add("r+ts");
m_subscripts.put("w", tmpSet);

// prefixes => set of consonants or stacks after
var m_prefixes = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("c");
tmpSet.add("ny");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("ts");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("y");
tmpSet.add("sh");
tmpSet.add("s");
m_prefixes.put("g", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("p");
tmpSet.add("b");
tmpSet.add("m");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("p+y");
tmpSet.add("b+y");
tmpSet.add("m+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("p+r");
tmpSet.add("b+r");
m_prefixes.put("d", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("k");
tmpSet.add("g");
tmpSet.add("c");
tmpSet.add("t");
tmpSet.add("d");
tmpSet.add("ts");
tmpSet.add("zh");
tmpSet.add("z");
tmpSet.add("sh");
tmpSet.add("s");
tmpSet.add("r");
tmpSet.add("l");
tmpSet.add("k+y");
tmpSet.add("g+y");
tmpSet.add("k+r");
tmpSet.add("g+r");
tmpSet.add("r+l");
tmpSet.add("s+l");
tmpSet.add("r+k");
tmpSet.add("r+g");
tmpSet.add("r+ng");
tmpSet.add("r+j");
tmpSet.add("r+ny");
tmpSet.add("r+t");
tmpSet.add("r+d");
tmpSet.add("r+n");
tmpSet.add("r+ts");
tmpSet.add("r+dz");
tmpSet.add("s+k");
tmpSet.add("s+g");
tmpSet.add("s+ng");
tmpSet.add("s+ny");
tmpSet.add("s+t");
tmpSet.add("s+d");
tmpSet.add("s+n");
tmpSet.add("s+ts");
tmpSet.add("r+k+y");
tmpSet.add("r+g+y");
tmpSet.add("s+k+y");
tmpSet.add("s+g+y");
tmpSet.add("s+k+r");
tmpSet.add("s+g+r");
tmpSet.add("l+d");
tmpSet.add("l+t");
tmpSet.add("k+l");
tmpSet.add("s+r");
tmpSet.add("z+l");
tmpSet.add("s+w");
m_prefixes.put("b", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("ch");
tmpSet.add("j");
tmpSet.add("ny");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("n");
tmpSet.add("tsh");
tmpSet.add("dz");
tmpSet.add("kh+y");
tmpSet.add("g+y");
tmpSet.add("kh+r");
tmpSet.add("g+r");
m_prefixes.put("m", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("kh");
tmpSet.add("g");
tmpSet.add("ch");
tmpSet.add("j");
tmpSet.add("th");
tmpSet.add("d");
tmpSet.add("ph");
tmpSet.add("b");
tmpSet.add("tsh");
tmpSet.add("dz");
tmpSet.add("kh+y");
tmpSet.add("g+y");
tmpSet.add("ph+y");
tmpSet.add("b+y");
tmpSet.add("kh+r");
tmpSet.add("g+r");
tmpSet.add("d+r");
tmpSet.add("ph+r");
tmpSet.add("b+r");
m_prefixes.put("'", tmpSet);
m_prefixes.put("\u2018", tmpSet);
m_prefixes.put("\u2019", tmpSet);

// set of suffix letters
// also included are some Skt letters b/c they occur often in suffix position in Skt words
var m_suffixes = new newHashSet();
m_suffixes.add("'");
m_suffixes.add("\u2018");
m_suffixes.add("\u2019");
m_suffixes.add("g");
m_suffixes.add("ng");
m_suffixes.add("d");
m_suffixes.add("n");
m_suffixes.add("b");
m_suffixes.add("m");
m_suffixes.add("r");
m_suffixes.add("l");
m_suffixes.add("s");
m_suffixes.add("N");
m_suffixes.add("T");
m_suffixes.add("-n");
m_suffixes.add("-t");

// suffix2 => set of letters before
var m_suff2 = new newHashMap();
tmpSet = new newHashSet();
tmpSet.add("g");
tmpSet.add("ng");
tmpSet.add("b");
tmpSet.add("m");
m_suff2.put("s", tmpSet);

tmpSet = new newHashSet();
tmpSet.add("n");
tmpSet.add("r");
tmpSet.add("l");
m_suff2.put("d", tmpSet);

// root letter index for very ambiguous three-stack syllables
var m_ambiguous_key = new newHashMap();
m_ambiguous_key.put("dgs", 	1);
m_ambiguous_key.put("dms", 	1);
m_ambiguous_key.put("'gs", 	1);
m_ambiguous_key.put("mngs", 	0);
m_ambiguous_key.put("bgs", 	0);
m_ambiguous_key.put("dbs", 	1);

var m_ambiguous_wylie = new newHashMap();
m_ambiguous_wylie.put("dgs", 	"dgas");
m_ambiguous_wylie.put("dms", 	"dmas");
m_ambiguous_wylie.put("'gs", 	"'gas");
m_ambiguous_wylie.put("mngs", 	"mangs");
m_ambiguous_wylie.put("bgs", 	"bags");
m_ambiguous_wylie.put("dbs", 	"dbas");

// *** Unicode to Wylie mappings ***

// top letters
var m_tib_top = new newHashMap();
m_tib_top.put('\u0f40', 	"k");
m_tib_top.put('\u0f41', 	"kh");
m_tib_top.put('\u0f42', 	"g");
m_tib_top.put('\u0f43', 	"g+h");
m_tib_top.put('\u0f44', 	"ng");
m_tib_top.put('\u0f45', 	"c");
m_tib_top.put('\u0f46', 	"ch");
m_tib_top.put('\u0f47', 	"j");
m_tib_top.put('\u0f49', 	"ny");
m_tib_top.put('\u0f4a', 	"T");
m_tib_top.put('\u0f4b', 	"Th");
m_tib_top.put('\u0f4c', 	"D");
m_tib_top.put('\u0f4d', 	"D+h");
m_tib_top.put('\u0f4e', 	"N");
m_tib_top.put('\u0f4f', 	"t");
m_tib_top.put('\u0f50', 	"th");
m_tib_top.put('\u0f51', 	"d");
m_tib_top.put('\u0f52', 	"d+h");
m_tib_top.put('\u0f53', 	"n");
m_tib_top.put('\u0f54', 	"p");
m_tib_top.put('\u0f55', 	"ph");
m_tib_top.put('\u0f56', 	"b");
m_tib_top.put('\u0f57', 	"b+h");
m_tib_top.put('\u0f58', 	"m");
m_tib_top.put('\u0f59', 	"ts");
m_tib_top.put('\u0f5a', 	"tsh");
m_tib_top.put('\u0f5b', 	"dz");
m_tib_top.put('\u0f5c', 	"dz+h");
m_tib_top.put('\u0f5d', 	"w");
m_tib_top.put('\u0f5e', 	"zh");
m_tib_top.put('\u0f5f', 	"z");
m_tib_top.put('\u0f60', 	"'");
m_tib_top.put('\u0f61', 	"y");
m_tib_top.put('\u0f62', 	"r");
m_tib_top.put('\u0f63', 	"l");
m_tib_top.put('\u0f64', 	"sh");
m_tib_top.put('\u0f65', 	"Sh");
m_tib_top.put('\u0f66', 	"s");
m_tib_top.put('\u0f67', 	"h");
m_tib_top.put('\u0f68', 	"a");
m_tib_top.put('\u0f69', 	"k+Sh");
m_tib_top.put('\u0f6a', 	"R");

// subjoined letters
var m_tib_subjoined = new newHashMap();
m_tib_subjoined.put('\u0f90', 	"k");
m_tib_subjoined.put('\u0f91', 	"kh");
m_tib_subjoined.put('\u0f92', 	"g");
m_tib_subjoined.put('\u0f93', 	"g+h");
m_tib_subjoined.put('\u0f94', 	"ng");
m_tib_subjoined.put('\u0f95', 	"c");
m_tib_subjoined.put('\u0f96', 	"ch");
m_tib_subjoined.put('\u0f97', 	"j");
m_tib_subjoined.put('\u0f99', 	"ny");
m_tib_subjoined.put('\u0f9a', 	"T");
m_tib_subjoined.put('\u0f9b', 	"Th");
m_tib_subjoined.put('\u0f9c', 	"D");
m_tib_subjoined.put('\u0f9d', 	"D+h");
m_tib_subjoined.put('\u0f9e', 	"N");
m_tib_subjoined.put('\u0f9f', 	"t");
m_tib_subjoined.put('\u0fa0', 	"th");
m_tib_subjoined.put('\u0fa1', 	"d");
m_tib_subjoined.put('\u0fa2', 	"d+h");
m_tib_subjoined.put('\u0fa3', 	"n");
m_tib_subjoined.put('\u0fa4', 	"p");
m_tib_subjoined.put('\u0fa5', 	"ph");
m_tib_subjoined.put('\u0fa6', 	"b");
m_tib_subjoined.put('\u0fa7', 	"b+h");
m_tib_subjoined.put('\u0fa8', 	"m");
m_tib_subjoined.put('\u0fa9', 	"ts");
m_tib_subjoined.put('\u0faa', 	"tsh");
m_tib_subjoined.put('\u0fab', 	"dz");
m_tib_subjoined.put('\u0fac', 	"dz+h");
m_tib_subjoined.put('\u0fad', 	"w");
m_tib_subjoined.put('\u0fae', 	"zh");
m_tib_subjoined.put('\u0faf', 	"z");
m_tib_subjoined.put('\u0fb0', 	"'");
m_tib_subjoined.put('\u0fb1', 	"y");
m_tib_subjoined.put('\u0fb2', 	"r");
m_tib_subjoined.put('\u0fb3', 	"l");
m_tib_subjoined.put('\u0fb4', 	"sh");
m_tib_subjoined.put('\u0fb5', 	"Sh");
m_tib_subjoined.put('\u0fb6', 	"s");
m_tib_subjoined.put('\u0fb7', 	"h");
m_tib_subjoined.put('\u0fb8', 	"a");
m_tib_subjoined.put('\u0fb9', 	"k+Sh");
m_tib_subjoined.put('\u0fba', 	"W");
m_tib_subjoined.put('\u0fbb', 	"Y");
m_tib_subjoined.put('\u0fbc', 	"R");

// vowel signs:
// a-chen is not here because that's a top character, not a vowel sign.
// pre-composed "I" and "U" are dealt here; other pre-composed Skt vowels are more
// easily handled by a global replace in toWylie(), b/c they turn into subjoined "r"/"l".

var m_tib_vowel = new newHashMap();
m_tib_vowel.put('\u0f71', 	"A");
m_tib_vowel.put('\u0f72', 	"i");
m_tib_vowel.put('\u0f73', 	"I");
m_tib_vowel.put('\u0f74', 	"u");
m_tib_vowel.put('\u0f75', 	"U");
m_tib_vowel.put('\u0f7a', 	"e");
m_tib_vowel.put('\u0f7b', 	"ai");
m_tib_vowel.put('\u0f7c', 	"o");
m_tib_vowel.put('\u0f7d', 	"au");
m_tib_vowel.put('\u0f80', 	"-i");

// long (Skt) vowels
var m_tib_vowel_long = new newHashMap();
m_tib_vowel_long.put("i", 	"I");
m_tib_vowel_long.put("u", 	"U");
m_tib_vowel_long.put("-i", 	"-I");

// final symbols => wylie
var m_tib_final_wylie = new newHashMap();
m_tib_final_wylie.put('\u0f7e', 	"M");
m_tib_final_wylie.put('\u0f82', 	"~M`");
m_tib_final_wylie.put('\u0f83', 	"~M");
m_tib_final_wylie.put('\u0f37', 	"X");
m_tib_final_wylie.put('\u0f35', 	"~X");
m_tib_final_wylie.put('\u0f39', 	"^");
m_tib_final_wylie.put('\u0f7f', 	"H");
m_tib_final_wylie.put('\u0f84', 	"?");

// final symbols by class
var m_tib_final_class = new newHashMap();
m_tib_final_class.put('\u0f7e', 	"M");
m_tib_final_class.put('\u0f82', 	"M");
m_tib_final_class.put('\u0f83', 	"M");
m_tib_final_class.put('\u0f37', 	"X");
m_tib_final_class.put('\u0f35', 	"X");
m_tib_final_class.put('\u0f39', 	"^");
m_tib_final_class.put('\u0f7f', 	"H");
m_tib_final_class.put('\u0f84', 	"?");

// special characters introduced by ^
var m_tib_caret = new newHashMap();
m_tib_caret.put("ph", 	"f");
m_tib_caret.put("b", 	"v");

// other stand-alone characters
var m_tib_other = new newHashMap();
m_tib_other.put(' ', 		"_");
m_tib_other.put('\u0f04', 	"@");
m_tib_other.put('\u0f05', 	"#");
m_tib_other.put('\u0f06', 	"$");
m_tib_other.put('\u0f07', 	"%");
m_tib_other.put('\u0f08', 	"!");
m_tib_other.put('\u0f0b', 	" ");
m_tib_other.put('\u0f0c', 	"*");
m_tib_other.put('\u0f0d', 	"/");
m_tib_other.put('\u0f0e', 	"//");
m_tib_other.put('\u0f0f', 	";");
m_tib_other.put('\u0f11', 	"|");
m_tib_other.put('\u0f14', 	":");
m_tib_other.put('\u0f20', 	"0");
m_tib_other.put('\u0f21', 	"1");
m_tib_other.put('\u0f22', 	"2");
m_tib_other.put('\u0f23', 	"3");
m_tib_other.put('\u0f24', 	"4");
m_tib_other.put('\u0f25', 	"5");
m_tib_other.put('\u0f26', 	"6");
m_tib_other.put('\u0f27', 	"7");
m_tib_other.put('\u0f28', 	"8");
m_tib_other.put('\u0f29', 	"9");
m_tib_other.put('\u0f34', 	"=");
m_tib_other.put('\u0f3a', 	"<");
m_tib_other.put('\u0f3b', 	">");
m_tib_other.put('\u0f3c', 	"(");
m_tib_other.put('\u0f3d', 	")");

// all these stacked consonant combinations don't need "+"s in them
var m_tib_stacks = new newHashSet();
m_tib_stacks.add("b+l");
m_tib_stacks.add("b+r");
m_tib_stacks.add("b+y");
m_tib_stacks.add("c+w");
m_tib_stacks.add("d+r");
m_tib_stacks.add("d+r+w");
m_tib_stacks.add("d+w");
m_tib_stacks.add("dz+r");
m_tib_stacks.add("g+l");
m_tib_stacks.add("g+r");
m_tib_stacks.add("g+r+w");
m_tib_stacks.add("g+w");
m_tib_stacks.add("g+y");
m_tib_stacks.add("h+r");
m_tib_stacks.add("h+w");
m_tib_stacks.add("k+l");
m_tib_stacks.add("k+r");
m_tib_stacks.add("k+w");
m_tib_stacks.add("k+y");
m_tib_stacks.add("kh+r");
m_tib_stacks.add("kh+w");
m_tib_stacks.add("kh+y");
m_tib_stacks.add("l+b");
m_tib_stacks.add("l+c");
m_tib_stacks.add("l+d");
m_tib_stacks.add("l+g");
m_tib_stacks.add("l+h");
m_tib_stacks.add("l+j");
m_tib_stacks.add("l+k");
m_tib_stacks.add("l+ng");
m_tib_stacks.add("l+p");
m_tib_stacks.add("l+t");
m_tib_stacks.add("l+w");
m_tib_stacks.add("m+r");
m_tib_stacks.add("m+y");
m_tib_stacks.add("n+r");
m_tib_stacks.add("ny+w");
m_tib_stacks.add("p+r");
m_tib_stacks.add("p+y");
m_tib_stacks.add("ph+r");
m_tib_stacks.add("ph+y");
m_tib_stacks.add("ph+y+w");
m_tib_stacks.add("r+b");
m_tib_stacks.add("r+d");
m_tib_stacks.add("r+dz");
m_tib_stacks.add("r+g");
m_tib_stacks.add("r+g+w");
m_tib_stacks.add("r+g+y");
m_tib_stacks.add("r+j");
m_tib_stacks.add("r+k");
m_tib_stacks.add("r+k+y");
m_tib_stacks.add("r+l");
m_tib_stacks.add("r+m");
m_tib_stacks.add("r+m+y");
m_tib_stacks.add("r+n");
m_tib_stacks.add("r+ng");
m_tib_stacks.add("r+ny");
m_tib_stacks.add("r+t");
m_tib_stacks.add("r+ts");
m_tib_stacks.add("r+ts+w");
m_tib_stacks.add("r+w");
m_tib_stacks.add("s+b");
m_tib_stacks.add("s+b+r");
m_tib_stacks.add("s+b+y");
m_tib_stacks.add("s+d");
m_tib_stacks.add("s+g");
m_tib_stacks.add("s+g+r");
m_tib_stacks.add("s+g+y");
m_tib_stacks.add("s+k");
m_tib_stacks.add("s+k+r");
m_tib_stacks.add("s+k+y");
m_tib_stacks.add("s+l");
m_tib_stacks.add("s+m");
m_tib_stacks.add("s+m+r");
m_tib_stacks.add("s+m+y");
m_tib_stacks.add("s+n");
m_tib_stacks.add("s+n+r");
m_tib_stacks.add("s+ng");
m_tib_stacks.add("s+ny");
m_tib_stacks.add("s+p");
m_tib_stacks.add("s+p+r");
m_tib_stacks.add("s+p+y");
m_tib_stacks.add("s+r");
m_tib_stacks.add("s+t");
m_tib_stacks.add("s+ts");
m_tib_stacks.add("s+w");
m_tib_stacks.add("sh+r");
m_tib_stacks.add("sh+w");
m_tib_stacks.add("t+r");
m_tib_stacks.add("t+w");
m_tib_stacks.add("th+r");
m_tib_stacks.add("ts+w");
m_tib_stacks.add("tsh+w");
m_tib_stacks.add("z+l");
m_tib_stacks.add("z+w");
m_tib_stacks.add("zh+w");

// a map used to split the input string into tokens for fromWylie().
// all letters which start tokens longer than one letter are mapped to the max length of
// tokens starting with that letter.  
var m_tokens_start = new newHashMap();
m_tokens_start.put('S', 2);
m_tokens_start.put('/', 2);
m_tokens_start.put('d', 4);
m_tokens_start.put('g', 3);
m_tokens_start.put('b', 3);
m_tokens_start.put('D', 3);
m_tokens_start.put('z', 2);
m_tokens_start.put('~', 3);
m_tokens_start.put('-', 4);
m_tokens_start.put('T', 2);
m_tokens_start.put('a', 2);
m_tokens_start.put('k', 2);
m_tokens_start.put('t', 3);
m_tokens_start.put('s', 2);
m_tokens_start.put('c', 2);
m_tokens_start.put('n', 2);
m_tokens_start.put('p', 2);
m_tokens_start.put('\r', 2);

// also for tokenization - a set of tokens longer than one letter
var m_tokens = new newHashSet();
m_tokens.add("-d+h");
m_tokens.add("dz+h");
m_tokens.add("-dh");
m_tokens.add("-sh");
m_tokens.add("-th");
m_tokens.add("D+h");
m_tokens.add("b+h");
m_tokens.add("d+h");
m_tokens.add("dzh");
m_tokens.add("g+h");
m_tokens.add("tsh");
m_tokens.add("~M`");
m_tokens.add("-I");
m_tokens.add("-d");
m_tokens.add("-i");
m_tokens.add("-n");
m_tokens.add("-t");
m_tokens.add("//");
m_tokens.add("Dh");
m_tokens.add("Sh");
m_tokens.add("Th");
m_tokens.add("ai");
m_tokens.add("au");
m_tokens.add("bh");
m_tokens.add("ch");
m_tokens.add("dh");
m_tokens.add("dz");
m_tokens.add("gh");
m_tokens.add("kh");
m_tokens.add("ng");
m_tokens.add("ny");
m_tokens.add("ph");
m_tokens.add("sh");
m_tokens.add("th");
m_tokens.add("ts");
m_tokens.add("zh");
m_tokens.add("~M");
m_tokens.add("~X");
m_tokens.add("\r\n");

// A class to encapsulate the return value of fromWylieOneStack.
var WylieStack = function() {
	this.uni_string = ''
	this.tokens_used = 0
	this.single_consonant = ''
	this.single_cons_a = ''
	this.warns = []
	this.visarga = false
	return this
}

// Looking from i onwards within tokens, returns as many consonants as it finds,
// up to and not including the next vowel or punctuation.  Skips the caret "^".
// Returns: a string of consonants joined by "+" signs.
function consonantString(tokens, i) { // strings, int
	var out = [];
	var t = '';
	while (tokens[i] != null) {
		t = tokens[i++];
		if (t == '+' || t == '^') continue;
		if (consonant(t) == null) break;
		out.push(t);
	}
	return out.join("+");
}

// Looking from i backwards within tokens, at most up to orig_i, returns as 
// many consonants as it finds, up to and not including the next vowel or
// punctuation.  Skips the caret "^".
// Returns: a string of consonants (in forward order) joined by "+" signs.
function consonantStringBackwards(tokens, i, orig_i) {
	var out = [];
	var t = '';
	while (i >= orig_i && tokens[i] != null) {
		t = tokens[i--];
		if (t == '+' || t == '^') continue;
		if (consonant(t) == null) break;
		out.unshift(t);
	}
	return out.join("+");
}

// A class to encapsulate the return value of fromWylieOneTsekbar.
var WylieTsekbar = function() {
	this.uni_string = ''
	this.tokens_used = 0
	this.warns = []
	return this
}
// A class to encapsulate an analyzed tibetan stack, while converting Unicode to Wylie.
var ToWylieStack = function() {
	this.top = ''
	this.stack = []
	this.caret = false
	this.vowels = []
	this.finals = []
	this.finals_found = newHashMap()
	this.visarga = false
	this.cons_str = ''
	this.single_cons = ''
	this.prefix = false
	this.suffix = false
	this.suff2 = false
	this.dot = false
	this.tokens_used = 0
	this.warns = []
	return this
}

// A class to encapsulate the return value of toWylieOneTsekbar.
var ToWylieTsekbar = function() {
	this.wylie = ''
	this.tokens_used = 0
	this.warns = []
	return this
}

// Converts successive stacks of Wylie into unicode, starting at the given index
// within the array of tokens. 
// 
// Assumes that the first available token is valid, and is either a vowel or a consonant.
// Returns a WylieTsekbar object
// HELPER CLASSES AND STRUCTURES
var State = { PREFIX: 0, MAIN: 1, SUFF1: 2, SUFF2: 3, NONE: 4 }
	// split a string into Wylie tokens; 
	// make sure there is room for at least one null element at the end of the array
var splitIntoTokens = function(str) {
	var tokens = [] // size = str.length + 2
	var i = 0;
	var maxlen = str.length;
	TOKEN:
	while (i < maxlen) {
		var c = str.charAt(i);
		var mlo = m_tokens_start.get(c);
		// if there are multi-char tokens starting with this char, try them
		if (mlo != null) {
			for (var len = mlo; len > 1; len--) {
				if (i <= maxlen - len) {
					var tr = str.substring(i, i + len);
					if (m_tokens.contains(tr)) {
						tokens.push(tr);
						i += len;
						continue TOKEN;
					}
				}
			}
		}
		// things starting with backslash are special
		if (c == '\\' && i <= maxlen - 2) {
			if (str.charAt(i + 1) == 'u' && i <= maxlen - 6) {
				tokens.push(str.substring(i, i + 6));		// \\uxxxx
				i += 6;
			} else if (str.charAt(i + 1) == 'U' && i <= maxlen - 10) {
				tokens.push(str.substring(i, i + 10));		// \\Uxxxxxxxx
				i += 10;
			} else {
				tokens.push(str.substring(i, i + 2));		// \\x
				i += 2;
			}
			continue TOKEN;
		}
		// otherwise just take one char
		tokens.push(c.toString());
		i += 1;
	}
	return tokens;
}

// helper functions to access the various hash tables
var consonant = function(s) { return m_consonant.get(s) }
var subjoined = function(s) { return m_subjoined.get(s) }
var vowel = function(s) { return m_vowel.get(s) }
var final_uni = function(s) { return m_final_uni.get(s) }
var final_class = function(s) { return m_final_class.get(s) }
var other = function(s) { return m_other.get(s) }
var isSpecial = function(s) { return m_special.contains(s) }
var isSuperscript = function(s) { return m_superscripts.containsKey(s) }
var superscript = function(sup, below) {
	var tmpSet = m_superscripts.get(sup);
	if (tmpSet == null) return false;
	return tmpSet.contains(below);
}
var isSubscript = function(s) { return m_subscripts.containsKey(s) }
var subscript = function(sub, above) {
	var tmpSet = m_subscripts.get(sub);
	if (tmpSet == null) return false;
	return tmpSet.contains(above);
}
var isPrefix = function(s) { return m_prefixes.containsKey(s) }
var prefix = function(pref, after) {
	var tmpSet = m_prefixes.get(pref);
	if (tmpSet == null) return false;
	return tmpSet.contains(after);
}
var isSuffix = function(s) { return m_suffixes.contains(s) }
var isSuff2 = function(s) { return m_suff2.containsKey(s) }
var suff2 = function(suff, before) {
	var tmpSet = m_suff2.get(suff);
	if (tmpSet == null) return false;
	return tmpSet.contains(before);
}
var ambiguous_key = function(syll) { return m_ambiguous_key.get(syll) }
var ambiguous_wylie = function(syll) { return m_ambiguous_wylie.get(syll) }
var tib_top = function(c) { return m_tib_top.get(c) }
var tib_subjoined = function(c) { return m_tib_subjoined.get(c) }
var tib_vowel = function(c) { return m_tib_vowel.get(c) }
var tib_vowel_long = function(s) { return m_tib_vowel_long.get(s) }
var tib_final_wylie = function(c) { return m_tib_final_wylie.get(c) }
var tib_final_class = function(c) { return m_tib_final_class.get(c) }
var tib_caret = function(s) { return m_tib_caret.get(s) }
var tib_other = function(c) { return m_tib_other.get(c) }
var tib_stack = function(s) { return m_tib_stacks.contains(s) }

// does this string consist of only hexadecimal digits?
function validHex(t) {
	for (var i = 0; i < t.length; i++) {
		var c = t.charAt(i);
		if (!((c >= 'a' && c <= 'f') || (c >= '0' && c <= '9'))) return false;
	}
	return true;
}

// generate a warning if we are keeping them; prints it out if we were asked to
// handle a Wylie unicode escape, \\uxxxx or \\Uxxxxxxxx
function unicodeEscape (warns, line, t) { // [], int, str
	var hex = t.substring(2);
	if (hex == '') return null;
	if (!validHex(hex)) {
		warnl(warns, line, "\"" + t + "\": invalid hex code.");
		return "";
	}
	return String.fromCharCode(parseInt(hex, 16))
}

function warn(warns, str) {
	if (warns != null) warns.push(str);
	if (opt.print_warnings) console.log(str);
}

// warn with line number
function warnl(warns, line, str) {
	warn(warns, "line " + line + ": " + str);
}

function fromWylieOneTsekbar(tokens, i) { // (str, int)
	var orig_i = i
	var t = tokens[i]
	// variables for tracking the state within the syllable as we parse it
	var stack = null
	var prev_cons = ''
	var visarga = false
	// variables for checking the root letter, after parsing a whole tsekbar made of only single
	// consonants and one consonant with "a" vowel
	var check_root = true
	var consonants = [] // strings
	var root_idx = -1
	var out = ''
	var warns = []
	// the type of token that we are expecting next in the input stream
	//   - PREFIX : expect a prefix consonant, or a main stack
	//   - MAIN   : expect only a main stack
	//   - SUFF1  : expect a 1st suffix 
	//   - SUFF2  : expect a 2nd suffix
	//   - NONE   : expect nothing (after a 2nd suffix)
	//
	// the state machine is actually more lenient than this, in that a "main stack" is allowed
	// to come at any moment, even after suffixes.  this is because such syllables are sometimes
	// found in abbreviations or other places.  basically what we check is that prefixes and 
	// suffixes go with what they are attached to.
	//
	// valid tsek-bars end in one of these states: SUFF1, SUFF2, NONE
	var state = State.PREFIX;

	// iterate over the stacks of a tsek-bar
	STACK:
	while (t != null && (vowel(t) != null || consonant(t) != null) && !visarga) {
		// translate a stack
		if (stack != null) prev_cons = stack.single_consonant;
		stack = fromWylieOneStack(tokens, i);
		i += stack.tokens_used;
		t = tokens[i];
		out += stack.uni_string;
		warns = warns.concat(stack.warns);
		visarga = stack.visarga;
		if (!opt.check) continue;
		// check for syllable structure consistency by iterating a simple state machine
		// - prefix consonant
		if (state == State.PREFIX && stack.single_consonant != null) {
			consonants.push(stack.single_consonant);
			if (isPrefix(stack.single_consonant)) {
			var next = t;
			if (opt.check_strict) next = consonantString(tokens, i);
			if (next != null && !prefix(stack.single_consonant, next)) {
				next = next.replace(/\+/g, "");
				warns.push("Prefix \"" + stack.single_consonant + "\" does not occur before \"" + next + "\".");
			}
		} else {
			warns.push("Invalid prefix consonant: \"" + stack.single_consonant + "\".");
		}
		state = State.MAIN;
		// - main stack with vowel or multiple consonants
		} else if (stack.single_consonant == null) {
		state = State.SUFF1;
		// keep track of the root consonant if it was a single cons with an "a" vowel
		if (root_idx >= 0) {
			check_root = false;
		} else if (stack.single_cons_a != null) {
			consonants.push(stack.single_cons_a);
			root_idx = consonants.length - 1;
		}
		// - unexpected single consonant after prefix
		} else if (state == State.MAIN) {
			warns.push("Expected vowel after \"" + stack.single_consonant + "\".");
			// - 1st suffix
		} else if (state == State.SUFF1) {
			consonants.push(stack.single_consonant);
			// check this one only in strict mode b/c it trips on lots of Skt stuff
			if (opt.check_strict) {
				if (!isSuffix(stack.single_consonant)) {
					warns.push("Invalid suffix consonant: \"" + stack.single_consonant + "\".");
				}
			}
			state = State.SUFF2;
			// - 2nd suffix
		} else if (state == State.SUFF2) {
			consonants.push(stack.single_consonant);
			if (isSuff2(stack.single_consonant)) {
				if (!suff2(stack.single_consonant, prev_cons)) {
					warns.push("Second suffix \"" + stack.single_consonant 
					+ "\" does not occur after \"" + prev_cons + "\".");
				}
			} else {
				warns.push("Invalid 2nd suffix consonant: \"" + stack.single_consonant  + "\".");
			}
			state = State.NONE;
			// - more crap after a 2nd suffix
		} else if (state == State.NONE) {
			warns.push("Cannot have another consonant \"" + stack.single_consonant + "\" after 2nd suffix.");
		}
	}

	if (state == State.MAIN && stack.single_consonant != null && isPrefix(stack.single_consonant)) {
	warns.push("Vowel expected after \"" + stack.single_consonant + "\".");
	}

	// check root consonant placement only if there were no warnings so far, and the syllable 
	// looks ambiguous.  not many checks are needed here because the previous state machine 
	// already takes care of most illegal combinations.
	if (opt.check && warns.length == 0 && check_root && root_idx >= 0) {
		// 2 letters where each could be prefix/suffix: root is 1st
		if (consonants.length == 2 && root_idx != 0 
		&& prefix(consonants[0], consonants[1]) && isSuffix(consonants[1]))
		{
			warns.push("Syllable should probably be \"" + consonants[0] + "a" + consonants[1] + "\".");

			// 3 letters where 1st can be prefix, 2nd can be postfix before "s" and last is "s":
			// use a lookup table as this is completely ambiguous.
		} else if (consonants.length == 3 && isPrefix(consonants[0]) &&
			suff2("s", consonants[1]) && consonants[2] == "s")
		{
			var cc = consonants.join("");
			cc = cc.replace(/\u2018/g, '\'');
			cc = cc.replace(/\u2019/g, '\'');	// typographical quotes
			var expect_key = ambiguous_key(cc);
	//		console.log('typeof expect_key', typeof expect_key)
			if (expect_key != null && expect_key != root_idx) {
				warns.push("Syllable should probably be \"" + ambiguous_wylie(cc) + "\".");
			}
		}
	}
	// return the stuff as a WylieTsekbar struct
	var ret = new WylieTsekbar();
	ret.uni_string = out;
	ret.tokens_used = i - orig_i;
	ret.warns = warns;
	return ret;
}

    // Converts one stack's worth of Wylie into unicode, starting at the given index
    // within the array of tokens.
    // Assumes that the first available token is valid, and is either a vowel or a consonant.
    // Returns a WylieStack object.
function fromWylieOneStack(tokens, i) {
	var orig_i = i
	var t = '', t2 = '', o = ''
	var out = ''
	var warns = []
	var consonants = 0		// how many consonants found
	var vowel_found = null; // any vowels (including a-chen)
	var vowel_sign = null; // any vowel signs (that go under or above the main stack)
	var single_consonant = null; // did we find just a single consonant?
	var plus = false;		// any explicit subjoining via '+'?
	var caret = 0;			// find any '^'?
	var final_found = new newHashMap(); // keep track of finals (H, M, etc) by class

	// do we have a superscript?
	t = tokens[i]
	t2 = tokens[i + 1]
	if (t2 != null && isSuperscript(t) && superscript(t, t2)) {
		if (opt.check_strict) {
			var next = consonantString(tokens, i + 1);
			if (!superscript(t, next)) {
				next = next.replace(/\+/g, '')
				warns.push("Superscript \"" + t + "\" does not occur above combination \"" + next + "\".");
			}
		}
		out += consonant(t);
		consonants++;
		i++;
		while (tokens[i] != null && tokens[i] == ("^")) { caret++; i++; }
	}
	// main consonant + stuff underneath.
	// this is usually executed just once, but the "+" subjoining operator makes it come back here
	MAIN: 
	while (true) {
		// main consonant (or a "a" after a "+")
		t = tokens[i];
		if (consonant(t) != null || (out.length > 0 && subjoined(t) != null)) {
			if (out.length > 0) {
				out += (subjoined(t));
			} else {
				out += (consonant(t));
			}
			i++;

			if (t == "a") {
				vowel_found = "a";
			} else {
				consonants++;
				single_consonant = t;
			}

			while (tokens[i] != null && tokens[i] == "^") {
				caret++;
				i++;
			}
			// subjoined: rata, yata, lata, wazur.  there can be up two subjoined letters in a stack.
			for (var z = 0; z < 2; z++) {
				t2 = tokens[i];
				if (t2 != null && isSubscript(t2)) {
					// lata does not occur below multiple consonants 
					// (otherwise we mess up "brla" = "b.r+la")
					if (t2 == "l" && consonants > 1) break;
					// full stack checking (disabled by "+")
					if (opt.check_strict && !plus) {
						var prev = consonantStringBackwards(tokens, i-1, orig_i);
						if (!subscript(t2, prev)) {
							prev = prev.replace(/\+/g, "");
							warns.push("Subjoined \"" + t2 + "\" not expected after \"" + prev + "\".");
						}
						// simple check only
					} else if (opt.check) {
						if (!subscript(t2, t) && !(z == 1 && t2 == ("w") && t == ("y"))) {
							warns.push("Subjoined \"" + t2 + "\"not expected after \"" + t + "\".");
						}
					}
					out += subjoined(t2);
					i++;
					consonants++;
					while (tokens[i] != null && tokens[i] == ("^")) { caret++; i++; }
					t = t2;
				} else {
					break;
				}
			}
		}

		// caret (^) can come anywhere in Wylie but in Unicode we generate it at the end of 
		// the stack but before vowels if it came there (seems to be what OpenOffice expects),
		// or at the very end of the stack if that's how it was in the Wylie.
		if (caret > 0) {
			if (caret > 1) {
				warns.push("Cannot have more than one \"^\" applied to the same stack.");
			}
			final_found.put(final_class("^"), "^");
			out += (final_uni("^"));
			caret = 0;
		}
		// vowel(s)
		t = tokens[i];
		if (t != null && vowel(t) != null) {
			if (out.length == 0) out += (vowel("a"));
			if (t != "a") out += (vowel(t));
			i++;
			vowel_found = t;
			if (t != "a") vowel_sign = t;
		}
		// plus sign: forces more subjoining
		t = tokens[i];
		if (t != null && t == ("+")) {
			i++;
			plus = true;
			// sanity check: next token must be vowel or subjoinable consonant.  
			t = tokens[i];
			if (t == null || (vowel(t) == null && subjoined(t) == null)) {
				if (opt.check) warns.push("Expected vowel or consonant after \"+\".");
				break MAIN;
			}
			// consonants after vowels doesn't make much sense but process it anyway
			if (opt.check) {
				if (vowel(t) == null && vowel_sign != null) {
					warns.push("Cannot subjoin consonant (" + t + ") after vowel (" + vowel_sign + ") in same stack.");
				} else if (t == ("a") && vowel_sign != null) {
					warns.push("Cannot subjoin a-chen (a) after vowel (" + vowel_sign + ") in same stack.");
				}
			}
			continue MAIN;
		}
		break MAIN;
	}
	// final tokens
	t = tokens[i];
	while (t != null && final_class(t) != null) {
		var uni = final_uni(t);
		var klass = final_class(t);
		// check for duplicates
		if (final_found.containsKey(klass)) {
			if (final_found.get(klass) == t) {
				warns.push("Cannot have two \"" + t + "\" applied to the same stack.");
			} else {
				warns.push("Cannot have \"" + t + "\" and \"" + final_found.get(klass)
					+ "\" applied to the same stack.");
			}
		} else {
			final_found.put(klass, t);
			out += (uni);
		}
		i++;
		single_consonant = null;
		t = tokens[i];
	}
	// if next is a dot "." (stack separator), skip it.
	if (tokens[i] != null && tokens[i] == (".")) i++;
	// if we had more than a consonant and no vowel, and no explicit "+" joining, backtrack and 
	// return the 1st consonant alone
	if (consonants > 1 && vowel_found == null) {
		if (plus) {
			if (opt.check) warns.push("Stack with multiple consonants should end with vowel.");
		} else {
			i = orig_i + 1;
			consonants = 1;
			single_consonant = tokens[orig_i];
			out = '';
			out += (consonant(single_consonant));
		}
	}
	// calculate "single consonant"
	if (consonants != 1 || plus) {
		single_consonant = null;
	}
	// return the stuff as a WylieStack struct
	var ret = new WylieStack();
	ret.uni_string = out;
	ret.tokens_used = i - orig_i;
	if (vowel_found != null) {
		ret.single_consonant = null;
	} else {
		ret.single_consonant = single_consonant;
	}

	if (vowel_found != null && vowel_found == ("a")) {
		ret.single_cons_a = single_consonant;
	} else {
		ret.single_cons_a = null;
	}
	ret.warns = warns;
	ret.visarga = final_found.containsKey("H");
	return ret;
}

	// Converts a Wylie (EWTS) string to unicode.  If 'warns' is not 'null', puts warnings into it.
function fromWylie(str, warns) {
		var out = '', line = 1, units = 0, i = 0
		if (opt.fix_spacing) { str = str.replace(/^\s+/, '') }
		var tokens = splitIntoTokens(str);
		ITER:while (tokens[i] != null) {
			var t = tokens[i], o = null
			// [non-tibetan text] : pass through, nesting brackets
			if (t == "[") {
				var nesting = 1;
				i++;
					ESC:while (tokens[i] != null) {
					t = tokens[i++];
					if (t == "[") nesting++;
					if (t == "]") nesting--;
					if (nesting == 0) continue ITER;
					// handle unicode escapes and \1-char escapes within [comments]...
					if (t.charAt(0) == '\\' && (t.charAt(1) == 'u' || t.charAt(1) == 'U')) {
						o = unicodeEscape(warns, line, t);
						if (o != null) {
							out += o;
							continue ESC;
						}
					}
					if (t.charAt(0) == '\\') {
						o = t.substring(1);
					} else {
						o = t;
					}
					out += o;
				}
				warnl(warns, line, "Unfinished [non-Wylie stuff].");
				break ITER;
			}
			// punctuation, numbers, etc
			o = other(t);
			if (o != null) {
				out += o;
				i++;
				units++;
				// collapse multiple spaces?
				if (t == " " && opt.fix_spacing) {
					while (tokens[i] != null && tokens[i] == " ") i++;
				}
				continue ITER;
			}
			// vowels & consonants: process tibetan script up to a tsek, punctuation or line noise
			if (vowel(t) != null || consonant(t) != null) {
				var tb = fromWylieOneTsekbar(tokens, i);
				var word = '';
				for (var j = 0; j < tb.tokens_used; j++) {
					word += (tokens[i+j]);
				}
				out += tb.uni_string;
				i += tb.tokens_used;
				units++;
				for (var w = 0; w < tb.warns.length; w++) {
					warnl(warns, line, "\"" + word + "\": " + tb.warns[w]);
				}
				continue ITER;
			}
			// *** misc unicode and line handling stuff ***
			// ignore BOM and zero-width space
			if (t == "\ufeff" || t == "\u200b") {
				i++;
				continue ITER;
			}
			// \\u, \\U unicode characters
			if (t.charAt(0) == '\\' && (t.charAt(1) == 'u' || t.charAt(1) == 'U')) {
				o = unicodeEscape(warns, line, t);
				if (o != null) {
					i++;
					out += o;
					continue ITER;
				}
			}
			// backslashed characters
			if (t.charAt(0) == '\\') {
				out += t.substring(1);
				i++;
				continue ITER;
			}
			// count lines
			if (t == "\r\n" || t == "\n" || t == "\r") {
				line++;
				out += t;
				i++;
				// also eat spaces after newlines (optional)
				if (opt.fix_spacing) {
					while (tokens[i] != null && tokens[i] == " ") i++;
				}
				continue ITER;
			}
			// stuff that shouldn't occur out of context: special chars and remaining [a-zA-Z]
			var c = t.charAt(0);
			if (isSpecial(t) || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
				warnl(warns, line, "Unexpected character \"" + t + "\".");
			}
			// anything else: pass through
			out += t;
			i++;
		}
		if (units == 0) warn(warns, "No Tibetan characters found!");
		return out
	}
	
	// given a character, return a string like "\\uxxxx", with its code in hex
function formatHex(t) { //char
		// not compatible with GWT...
		// return String.format("\\u%04x", (int)t);
		var sb = '';
		sb += '\\u';
		var s = t.charCodeAt(0).toString(16);
		for (var i = s.length; i < 4; i++) sb += '0';
		sb += s;
		return sb;
	}

	// handles spaces (if any) in the input stream, turning them into '_'.
	// this is abstracted out because in non-escaping mode, we only want to turn spaces into _
	// when they come in the middle of Tibetan script.
function handleSpaces(str, i, out) { //return int
	var found = 0;
	var orig_i = i;
	while (i < str.length && str.charAt(i) == ' ') {
		i++;
		found++;
	}
	if (found == 0 || i == str.length) return 0;
	var t = str.charAt(i);
	if (tib_top(t) == null && tib_other(t) == null) return 0;
	// found 'found' spaces between two tibetan bits; generate the same number of '_'s
	for (i = 0; i < found; i++) out += '_';
	return found;
}

// for space-handling in escaping mode: is the next thing coming (after a number of spaces)
// some non-tibetan bit, within the same line?
function followedByNonTibetan(str, i) {
	var len = str.length;
	while (i < len && str.charAt(i) == ' ') i++;
	if (i == len) return false;
	var t = str.charAt(i);
	return tib_top(t) == null && tib_other(t) == null && t != '\r' && t != '\n';
}

// Convert Unicode to Wylie: one tsekbar
function toWylieOneTsekbar(str, len, i) {
	var orig_i = i;
	var warns = [];
	var stacks = [];// ArrayList<ToWylieStack>;
	ITER: 
	while (true) {
		var st = toWylieOneStack(str, len, i);
		stacks.push(st);
		warns = warns.concat(st.warns);
		i += st.tokens_used;
		if (st.visarga) break ITER;
		if (i >= len || tib_top(str.charAt(i)) == null) break ITER;
	}
	// figure out if some of these stacks can be prefixes or suffixes (in which case
	// they don't need their "a" vowels)
	var last = stacks.length - 1;
	if (stacks.length > 1 && stacks[0].single_cons != null) {
		// we don't count the wazur in the root stack, for prefix checking
		var cs = stacks[1].cons_str.replace(/\+w/g, "")
		if (prefix(stacks[0].single_cons, cs)) stacks[0].prefix = true;
	}
	if (stacks.length > 1 && stacks[last].single_cons != null 
	&& isSuffix(stacks[last].single_cons)) {
		stacks[last].suffix = true;
	}
	if (stacks.length > 2 && stacks[last].single_cons != null 
	&& stacks[last - 1].single_cons != null
	&& isSuffix(stacks[last - 1].single_cons)
	&& suff2(stacks[last].single_cons, stacks[last - 1].single_cons)) {
		stacks[last].suff2 = true;
		stacks[last - 1].suffix = true;
	}
	// if there are two stacks and both can be prefix-suffix, then 1st is root
	if (stacks.length == 2 && stacks[0].prefix && stacks[1].suffix) {
	    stacks[0].prefix = false;
	}
	// if there are three stacks and they can be prefix, suffix and suff2, then check w/ a table
	if (stacks.length == 3 && stacks[0].prefix && stacks[1].suffix && stacks[2].suff2) {
		var strb = []
		for (var si = 0; si < stacks.length; si++) strb.push(stacks[si].single_cons)
		var ztr = strb.join('')
		var root = ambiguous_key(ztr)
		if (root == null) {
			warns.push("Ambiguous syllable found: root consonant not known for \"" + ztr + "\".")
			// make it up...  (ex. "mgas" for ma, ga, sa)
			root = 1
		}
		stacks[root].prefix = stacks[root].suffix = false
		stacks[root + 1].suff2 = false
	}
	// if the prefix together with the main stack could be mistaken for a single stack, add a "."
	if (stacks[0].prefix && tib_stack(stacks[0].single_cons + "+" + stacks[1].cons_str)) 
		stacks[0].dot = true;
	// put it all together
	var out = ''
	for (var si = 0; si < stacks.length; si++) out += putStackTogether(stacks[si])
	var ret = new ToWylieTsekbar();
	ret.wylie = out;
	ret.tokens_used = i - orig_i;
	ret.warns = warns;
	return ret;
}
	 
// Unicode to Wylie: one stack at a time
function toWylieOneStack(str, len, i) {
	var orig_i = i;
	var ffinal = null, vowel = null, klass = null;
	// split the stack into a ToWylieStack object:
	//   - top symbol
	//   - stacked signs (first is the top symbol again, then subscribed main characters...)
	//   - caret (did we find a stray tsa-phru or not?)
	//   - vowel signs (including small subscribed a-chung, "-i" Skt signs, etc)
	//   - final stuff (including anusvara, visarga, halanta...)
	//   - and some more variables to keep track of what has been found
	var st = new ToWylieStack();
	// assume: tib_top(t) exists
	var t = str.charAt(i++);
	st.top = tib_top(t);
	st.stack.push(tib_top(t));
	// grab everything else below the top sign and classify in various categories
	while (i < len) {
		t = str.charAt(i);
		var o;
		if ((o = tib_subjoined(t)) != null) {
			i++;
			st.stack.push(o);
			// check for bad ordering
			if (st.finals.length > 0) {
				st.warns.push("Subjoined sign \"" + o + "\" found after final sign \"" + ffinal + "\".");
			} else if (st.vowels.length > 0) {
				st.warns.push("Subjoined sign \"" + o + "\" found after vowel sign \"" + vowel + "\".");
			}
		} else if ((o = tib_vowel(t)) != null) {
			i++;
			st.vowels.push(o);
			if (vowel == null) vowel = o;
			// check for bad ordering
			if (st.finals.length > 0) {
				st.warns.push("Vowel sign \"" + o + "\" found after final sign \"" + ffinal + "\".");
			}
		} else if ((o = tib_final_wylie(t)) != null) {
			i++;
			klass = tib_final_class(t);
			if (o == "^") {
				st.caret = true;
			} else {
				if (o == "H") st.visarga = true;
				st.finals.push(o);
				if (ffinal == null) ffinal = o;
				// check for invalid combinations
				if (st.finals_found.containsKey(klass)) {
					st.warns.push("Final sign \"" + o 
					+ "\" should not combine with found after final sign \"" + ffinal + "\".");
				} else {
					st.finals_found.put(klass, o);
				}
			}
		} else break;
	}
	// now analyze the stack according to various rules
	// a-chen with vowel signs: remove the "a" and keep the vowel signs
	if (st.top == "a" && st.stack.length == 1 && st.vowels.length > 0) st.stack.shift();
	// handle long vowels: A+i becomes I, etc.
	if (st.vowels.length > 1 && st.vowels[0] == "A" && tib_vowel_long(st.vowels[1]) != null) {
		var l = tib_vowel_long(st.vowels[1]);
		st.vowels.shift();
		st.vowels.shift();
		st.vowels.unshift(l);
	}
	// special cases: "ph^" becomes "f", "b^" becomes "v"
	if (st.caret && st.stack.length == 1 && tib_caret(st.top) != null) {
		var l = tib_caret(st.top);
		st.top = l;
		st.stack.shift();
		st.stack.unshift(l);
		st.caret = false;
	}
	st.cons_str = st.stack.join("+");
	// if this is a single consonant, keep track of it (useful for prefix/suffix analysis)
	if (st.stack.length == 1 && st.stack[0] != ("a") && !st.caret 
	&& st.vowels.length == 0 && st.finals.length == 0) {
		st.single_cons = st.cons_str;
	}
	// return the analyzed stack
	st.tokens_used = i - orig_i;
	return st;
}

// Puts an analyzed stack together into Wylie output, adding an implicit "a" if needed.
function putStackTogether(st) {
	var out = '';
	// put the main elements together... stacked with "+" unless it's a regular stack
	if (tib_stack(st.cons_str)) {
	    out += st.stack.join("");
	} else out += (st.cons_str);
	// caret (tsa-phru) goes here as per some (halfway broken) Unicode specs...
	if (st.caret) out += ("^");
	// vowels...
	if (st.vowels.length > 0) {
		out += st.vowels.join("+");
	} else if (!st.prefix && !st.suffix && !st.suff2
	&& (st.cons_str.length == 0 || st.cons_str.charAt(st.cons_str.length - 1) != 'a')) {
		out += "a"
	}
	// final stuff
	out += st.finals.join("");
	if (st.dot) out += ".";
	return out;
}

	// Converts from Unicode strings to Wylie (EWTS) transliteration.
	//
	// Arguments are:
	//    str   : the unicode string to be converted
	//    escape: whether to escape non-tibetan characters according to Wylie encoding.
	//            if escape == false, anything that is not tibetan will be just passed through.
	//
	// Returns: the transliterated string.
	//
	// To get the warnings, call getWarnings() afterwards.

function toWylie(str, warns, escape) {
	if (escape == undefined) escape = true
	var out = ''
	var line = 1
	var units = 0
	// globally search and replace some deprecated pre-composed Sanskrit vowels
	str = str.replace(/\u0f76/g, "\u0fb2\u0f80")
	str = str.replace(/\u0f77/g, "\u0fb2\u0f71\u0f80")
	str = str.replace(/\u0f78/g, "\u0fb3\u0f80")
	str = str.replace(/\u0f79/g, "\u0fb3\u0f71\u0f80")
	str = str.replace(/\u0f81/g, "\u0f71\u0f80")
	var i = 0
	var len = str.length
	// iterate over the string, codepoint by codepoint
	ITER:
	while (i < len) {
		var t = str.charAt(i);
		// found tibetan script - handle one tsekbar
		if (tib_top(t) != null) {
			var tb = toWylieOneTsekbar(str, len, i);
			out += tb.wylie;
			i += tb.tokens_used;
			units++;
			for (var w = 0; w < tb.warns.length; w++) warnl(warns, line, tb.warns[w]);
			if (!escape) i += handleSpaces(str, i, out);
			continue ITER;
		}
		// punctuation and special stuff. spaces are tricky:
		// - in non-escaping mode: spaces are not turned to '_' here (handled by handleSpaces)
		// - in escaping mode: don't do spaces if there is non-tibetan coming, so they become part
		//   of the [escaped block].
		var o = tib_other(t);
		if (o != null && (t != ' ' || (escape && !followedByNonTibetan(str, i)))) {
			out += o;
			i++;
			units++;
			if (!escape) i += handleSpaces(str, i, out);
			continue ITER;
		}
		// newlines, count lines.  "\r\n" together count as one newline.
		if (t == '\r' || t == '\n') {
			line++;
			i++;
			out += t;
			if (t == '\r' && i < len && str.charAt(i) == '\n') {
				i++;
				out += ('\n');
			}
			continue ITER;
		}
		// ignore BOM and zero-width space
		if (t == '\ufeff' || t == '\u200b') {
			i++;
			continue ITER;
		}
		// anything else - pass along?
		if (!escape) {
			out += (t);
			i++;
			continue ITER;
		}
		// other characters in the tibetan plane, escape with \\u0fxx
		if (t >= '\u0f00' && t <= '\u0fff') {
			var c = formatHex(t);
			out += c;
			i++;
			// warn for tibetan codepoints that should appear only after a tib_top
			if (tib_subjoined(t) != null || tib_vowel(t) != null || tib_final_wylie(t) != null) {
				warnl(warns, line, "Tibetan sign " + c + " needs a top symbol to attach to.");
			}
			continue ITER;
		}
		// ... or escape according to Wylie:
		// put it in [comments], escaping [] sequences and closing at line ends
		out += "[";
		while (tib_top(t) == null && (tib_other(t) == null || t == ' ') && t != '\r' && t != '\n') {
			// \escape [opening and closing] brackets
			if (t == '[' || t == ']') {
				out += "\\";
				out += t;
			// unicode-escape anything in the tibetan plane (i.e characters not handled by Wylie)
			} else if (t >= '\u0f00' && t <= '\u0fff') {
				out += formatHex(t);
				// and just pass through anything else!
			} else {
				out += t;
			}
			if (++i >= len) break;
			t = str.charAt(i);
		}
		 out += "]";
	}
	return out;
}
module.exports= {
		fromWylie: fromWylie,
		toWylie: toWylie,
		setopt: setopt,
		getopt: function() { return opt },
		five: function() {
			return 555;
		}
}



});
require.register("ksana-document/languages.js", function(exports, require, module){
var tibetan={
	romanize:require("./tibetan/wylie")
}
var chinese={};
var languages={
	tibetan:tibetan
	,chinese:chinese
}

module.exports=languages;
});
require.register("ksana-document/diff.js", function(exports, require, module){
/**
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Computes the difference between two texts to create a patch.
 * Applies the patch onto another text, allowing for errors.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Class containing the diff, match and patch methods.
 * @constructor
 */
function diff_match_patch() {

  // Defaults.
  // Redefine these in your program to override the defaults.

  // Number of seconds to map a diff before giving up (0 for infinity).
  this.Diff_Timeout = 1.0;
  // Cost of an empty edit operation in terms of edit characters.
  this.Diff_EditCost = 4;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
  this.Match_Threshold = 0.5;
  // How far to search for a match (0 = exact location, 1000+ = broad match).
  // A match this many characters away from the expected location will add
  // 1.0 to the score (0.0 is a perfect match).
  this.Match_Distance = 1000;
  // When deleting a large block of text (over ~64 characters), how close do
  // the contents have to be to match the expected contents. (0.0 = perfection,
  // 1.0 = very loose).  Note that Match_Threshold controls how closely the
  // end points of a delete need to match.
  this.Patch_DeleteThreshold = 0.5;
  // Chunk size for context length.
  this.Patch_Margin = 4;

  // The number of bits in an int.
  this.Match_MaxBits = 32;
}


//  DIFF FUNCTIONS


/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

/** @typedef {{0: number, 1: string}} */
diff_match_patch.Diff;


/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
 *     then don't run a line-level diff first to identify the changed areas.
 *     Defaults to true, which does a faster, slightly less optimal diff.
 * @param {number} opt_deadline Optional time when the diff should be complete
 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
 *     instead.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 */
diff_match_patch.prototype.diff_main = function(text1, text2, opt_checklines,
    opt_deadline) {
  // Set a deadline by which time the diff must be complete.
  if (typeof opt_deadline == 'undefined') {
    if (this.Diff_Timeout <= 0) {
      opt_deadline = Number.MAX_VALUE;
    } else {
      opt_deadline = (new Date).getTime() + this.Diff_Timeout * 1000;
    }
  }
  var deadline = opt_deadline;

  // Check for null inputs.
  if (text1 == null || text2 == null) {
    throw new Error('Null input. (diff_main)');
  }

  // Check for equality (speedup).
  if (text1 == text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }

  if (typeof opt_checklines == 'undefined') {
    opt_checklines = true;
  }
  var checklines = opt_checklines;

  // Trim off common prefix (speedup).
  var commonlength = this.diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = this.diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = this.diff_compute_(text1, text2, checklines, deadline);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  this.diff_cleanupMerge(diffs);
  return diffs;
};


/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean} checklines Speedup flag.  If false, then don't run a
 *     line-level diff first to identify the changed areas.
 *     If true, then run a faster, slightly less optimal diff.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_compute_ = function(text1, text2, checklines,
    deadline) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]];
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i != -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
             [DIFF_EQUAL, shorttext],
             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }

  if (shorttext.length == 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
  }

  // Check to see if the problem can be split in two.
  var hm = this.diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }

  if (checklines && text1.length > 100 && text2.length > 100) {
    return this.diff_lineMode_(text1, text2, deadline);
  }

  return this.diff_bisect_(text1, text2, deadline);
};


/**
 * Do a quick line-level diff on both strings, then rediff the parts for
 * greater accuracy.
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_lineMode_ = function(text1, text2, deadline) {
  // Scan the text on a line-by-line basis first.
  var a = this.diff_linesToChars_(text1, text2);
  text1 = a.chars1;
  text2 = a.chars2;
  var linearray = a.lineArray;

  var diffs = this.diff_main(text1, text2, false, deadline);

  // Convert the diff back to original text.
  this.diff_charsToLines_(diffs, linearray);
  // Eliminate freak matches (e.g. blank lines)
  this.diff_cleanupSemantic(diffs);

  // Rediff any replacement blocks, this time character-by-character.
  // Add a dummy entry at the end.
  diffs.push([DIFF_EQUAL, '']);
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete >= 1 && count_insert >= 1) {
          // Delete the offending records and add the merged ones.
          diffs.splice(pointer - count_delete - count_insert,
                       count_delete + count_insert);
          pointer = pointer - count_delete - count_insert;
          var a = this.diff_main(text_delete, text_insert, false, deadline);
          for (var j = a.length - 1; j >= 0; j--) {
            diffs.splice(pointer, 0, a[j]);
          }
          pointer = pointer + a.length;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
    pointer++;
  }
  diffs.pop();  // Remove the dummy entry at the end.

  return diffs;
};


/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisect_ = function(text1, text2, deadline) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = (delta % 2 != 0);
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Bail out if deadline is reached.
    if ((new Date()).getTime() > deadline) {
      break;
    }

    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (x1 < text1_length && y1 < text2_length &&
             text1.charAt(x1) == text2.charAt(y1)) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (x2 < text1_length && y2 < text2_length &&
             text1.charAt(text1_length - x2 - 1) ==
             text2.charAt(text2_length - y2 - 1)) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
};


/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisectSplit_ = function(text1, text2, x, y,
    deadline) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = this.diff_main(text1a, text2a, false, deadline);
  var diffsb = this.diff_main(text1b, text2b, false, deadline);

  return diffs.concat(diffsb);
};


/**
 * Split two texts into an array of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
 *     An object containing the encoded text1, the encoded text2 and
 *     the array of unique strings.
 *     The zeroth element of the array of unique strings is intentionally blank.
 * @private
 */
diff_match_patch.prototype.diff_linesToChars_ = function(text1, text2) {
  var lineArray = [];  // e.g. lineArray[4] == 'Hello\n'
  var lineHash = {};   // e.g. lineHash['Hello\n'] == 4

  // '\x00' is a valid character, but various debuggers don't like it.
  // So we'll insert a junk entry to avoid generating a null character.
  lineArray[0] = '';

  /**
   * Split a text into an array of strings.  Reduce the texts to a string of
   * hashes where each Unicode character represents one line.
   * Modifies linearray and linehash through being a closure.
   * @param {string} text String to encode.
   * @return {string} Encoded string.
   * @private
   */
  function diff_linesToCharsMunge_(text) {
    var chars = '';
    // Walk the text, pulling out a substring for each line.
    // text.split('\n') would would temporarily double our memory footprint.
    // Modifying text would create many large strings to garbage collect.
    var lineStart = 0;
    var lineEnd = -1;
    // Keeping our own length variable is faster than looking it up.
    var lineArrayLength = lineArray.length;
    while (lineEnd < text.length - 1) {
      lineEnd = text.indexOf('\n', lineStart);
      if (lineEnd == -1) {
        lineEnd = text.length - 1;
      }
      var line = text.substring(lineStart, lineEnd + 1);
      lineStart = lineEnd + 1;

      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) :
          (lineHash[line] !== undefined)) {
        chars += String.fromCharCode(lineHash[line]);
      } else {
        chars += String.fromCharCode(lineArrayLength);
        lineHash[line] = lineArrayLength;
        lineArray[lineArrayLength++] = line;
      }
    }
    return chars;
  }

  var chars1 = diff_linesToCharsMunge_(text1);
  var chars2 = diff_linesToCharsMunge_(text2);
  return {chars1: chars1, chars2: chars2, lineArray: lineArray};
};


/**
 * Rehydrate the text in a diff from a string of line hashes to real lines of
 * text.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {!Array.<string>} lineArray Array of unique strings.
 * @private
 */
diff_match_patch.prototype.diff_charsToLines_ = function(diffs, lineArray) {
  for (var x = 0; x < diffs.length; x++) {
    var chars = diffs[x][1];
    var text = [];
    for (var y = 0; y < chars.length; y++) {
      text[y] = lineArray[chars.charCodeAt(y)];
    }
    diffs[x][1] = text.join('');
  }
};


/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
diff_match_patch.prototype.diff_commonPrefix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) ==
        text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
diff_match_patch.prototype.diff_commonSuffix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 ||
      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
diff_match_patch.prototype.diff_commonOverlap_ = function(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length;
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (found == 0 || text1.substring(text_length - length) ==
        text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
};


/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 * @private
 */
diff_match_patch.prototype.diff_halfMatch_ = function(text1, text2) {
  if (this.Diff_Timeout <= 0) {
    // Don't risk returning a non-optimal diff if we have unlimited time.
    return null;
  }
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null;  // Pointless.
  }
  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i),
                                               shorttext.substring(j));
      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i),
                                               shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) +
            shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [best_longtext_a, best_longtext_b,
              best_shorttext_a, best_shorttext_b, best_common];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
};


/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemantic = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  // Number of characters that changed after the equality.
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastequality = diffs[pointer][1];
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      } else {
        length_deletions2 += diffs[pointer][1].length;
      }
      // Eliminate an equality that is smaller or equal to the edits on both
      // sides of it.
      if (lastequality && (lastequality.length <=
          Math.max(length_insertions1, length_deletions1)) &&
          (lastequality.length <= Math.max(length_insertions2,
                                           length_deletions2))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalitiesLength--;
        // Throw away the previous equality (it needs to be reevaluated).
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0;  // Reset the counters.
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }

  // Normalize the diff.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
  this.diff_cleanupSemanticLossless(diffs);

  // Find any overlaps between deletions and insertions.
  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
  //   -> <del>abc</del>xxx<ins>def</ins>
  // e.g: <del>xxxabc</del><ins>defxxx</ins>
  //   -> <ins>def</ins>xxx<del>abc</del>
  // Only extract an overlap if it is as big as the edit ahead or behind it.
  pointer = 1;
  while (pointer < diffs.length) {
    if (diffs[pointer - 1][0] == DIFF_DELETE &&
        diffs[pointer][0] == DIFF_INSERT) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (overlap_length1 >= deletion.length / 2 ||
            overlap_length1 >= insertion.length / 2) {
          // Overlap found.  Insert an equality and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
          diffs[pointer - 1][1] =
              deletion.substring(0, deletion.length - overlap_length1);
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (overlap_length2 >= deletion.length / 2 ||
            overlap_length2 >= insertion.length / 2) {
          // Reverse overlap found.
          // Insert an equality and swap and trim the surrounding edits.
          diffs.splice(pointer, 0,
              [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] =
              insertion.substring(0, insertion.length - overlap_length2);
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] =
              deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
};


/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemanticLossless = function(diffs) {
  /**
   * Given two strings, compute a score representing whether the internal
   * boundary falls on logical boundaries.
   * Scores range from 6 (best) to 0 (worst).
   * Closure, but does not reference any external variables.
   * @param {string} one First string.
   * @param {string} two Second string.
   * @return {number} The score.
   * @private
   */
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      // Edges are the best.
      return 6;
    }

    // Each port of this function behaves slightly differently due to
    // subtle differences in each language's definition of things like
    // 'whitespace'.  Since this function's purpose is largely cosmetic,
    // the choice has been made to use each language's native features
    // rather than force total conformity.
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
    var whitespace1 = nonAlphaNumeric1 &&
        char1.match(diff_match_patch.whitespaceRegex_);
    var whitespace2 = nonAlphaNumeric2 &&
        char2.match(diff_match_patch.whitespaceRegex_);
    var lineBreak1 = whitespace1 &&
        char1.match(diff_match_patch.linebreakRegex_);
    var lineBreak2 = whitespace2 &&
        char2.match(diff_match_patch.linebreakRegex_);
    var blankLine1 = lineBreak1 &&
        one.match(diff_match_patch.blanklineEndRegex_);
    var blankLine2 = lineBreak2 &&
        two.match(diff_match_patch.blanklineStartRegex_);

    if (blankLine1 || blankLine2) {
      // Five points for blank lines.
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      // Four points for line breaks.
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      // Three points for end of sentences.
      return 3;
    } else if (whitespace1 || whitespace2) {
      // Two points for whitespace.
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      // One point for non-alphanumeric.
      return 1;
    }
    return 0;
  }

  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = this.diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore = diff_cleanupSemanticScore_(equality1, edit) +
          diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score = diff_cleanupSemanticScore_(equality1, edit) +
            diff_cleanupSemanticScore_(edit, equality2);
        // The >= encourages trailing rather than leading whitespace on edits.
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }

      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
};

// Define some regex patterns for matching boundaries.
diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
diff_match_patch.whitespaceRegex_ = /\s/;
diff_match_patch.linebreakRegex_ = /[\r\n]/;
diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;

/**
 * Reduce the number of edits by eliminating operationally trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupEfficiency = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Is there an insertion operation before the last equality.
  var pre_ins = false;
  // Is there a deletion operation before the last equality.
  var pre_del = false;
  // Is there an insertion operation after the last equality.
  var post_ins = false;
  // Is there a deletion operation after the last equality.
  var post_del = false;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      if (diffs[pointer][1].length < this.Diff_EditCost &&
          (post_ins || post_del)) {
        // Candidate found.
        equalities[equalitiesLength++] = pointer;
        pre_ins = post_ins;
        pre_del = post_del;
        lastequality = diffs[pointer][1];
      } else {
        // Not a candidate, and can never become one.
        equalitiesLength = 0;
        lastequality = null;
      }
      post_ins = post_del = false;
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_DELETE) {
        post_del = true;
      } else {
        post_ins = true;
      }
      /*
       * Five types to be split:
       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
       * <ins>A</ins>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<ins>C</ins>
       * <ins>A</del>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<del>C</del>
       */
      if (lastequality && ((pre_ins && pre_del && post_ins && post_del) ||
                           ((lastequality.length < this.Diff_EditCost / 2) &&
                            (pre_ins + pre_del + post_ins + post_del) == 3))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     [DIFF_DELETE, lastequality]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        equalitiesLength--;  // Throw away the equality we just deleted;
        lastequality = null;
        if (pre_ins && pre_del) {
          // No changes made which could affect previous entry, keep going.
          post_ins = post_del = true;
          equalitiesLength = 0;
        } else {
          equalitiesLength--;  // Throw away the previous equality.
          pointer = equalitiesLength > 0 ?
              equalities[equalitiesLength - 1] : -1;
          post_ins = post_del = false;
        }
        changes = true;
      }
    }
    pointer++;
  }

  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupMerge = function(diffs) {
  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete + count_insert > 1) {
          if (count_delete !== 0 && count_insert !== 0) {
            // Factor out any common prefixies.
            commonlength = this.diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if ((pointer - count_delete - count_insert) > 0 &&
                  diffs[pointer - count_delete - count_insert - 1][0] ==
                  DIFF_EQUAL) {
                diffs[pointer - count_delete - count_insert - 1][1] +=
                    text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, [DIFF_EQUAL,
                                    text_insert.substring(0, commonlength)]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixies.
            commonlength = this.diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length -
                  commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length -
                  commonlength);
              text_delete = text_delete.substring(0, text_delete.length -
                  commonlength);
            }
          }
          // Delete the offending records and add the merged ones.
          if (count_delete === 0) {
            diffs.splice(pointer - count_insert,
                count_delete + count_insert, [DIFF_INSERT, text_insert]);
          } else if (count_insert === 0) {
            diffs.splice(pointer - count_delete,
                count_delete + count_insert, [DIFF_DELETE, text_delete]);
          } else {
            diffs.splice(pointer - count_delete - count_insert,
                count_delete + count_insert, [DIFF_DELETE, text_delete],
                [DIFF_INSERT, text_insert]);
          }
          pointer = pointer - count_delete - count_insert +
                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop();  // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length -
          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] +
            diffs[pointer][1].substring(0, diffs[pointer][1].length -
                                        diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
          diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
            diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * loc is a location in text1, compute and return the equivalent location in
 * text2.
 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {number} loc Location within text1.
 * @return {number} Location within text2.
 */
diff_match_patch.prototype.diff_xIndex = function(diffs, loc) {
  var chars1 = 0;
  var chars2 = 0;
  var last_chars1 = 0;
  var last_chars2 = 0;
  var x;
  for (x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {  // Equality or deletion.
      chars1 += diffs[x][1].length;
    }
    if (diffs[x][0] !== DIFF_DELETE) {  // Equality or insertion.
      chars2 += diffs[x][1].length;
    }
    if (chars1 > loc) {  // Overshot the location.
      break;
    }
    last_chars1 = chars1;
    last_chars2 = chars2;
  }
  // Was the location was deleted?
  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
    return last_chars2;
  }
  // Add the remaining character length.
  return last_chars2 + (loc - last_chars1);
};


/**
 * Convert a diff array into a pretty HTML report.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} HTML representation.
 */
diff_match_patch.prototype.diff_prettyHtml = function(diffs) {
  var html = [];
  var pattern_amp = /&/g;
  var pattern_lt = /</g;
  var pattern_gt = />/g;
  var pattern_para = /\n/g;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];    // Operation (insert, delete, equal)
    var data = diffs[x][1];  // Text of change.
    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
        .replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
    switch (op) {
      case DIFF_INSERT:
        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
        break;
      case DIFF_DELETE:
        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
        break;
      case DIFF_EQUAL:
        html[x] = '<span>' + text + '</span>';
        break;
    }
  }
  return html.join('');
};


/**
 * Compute and return the source text (all equalities and deletions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Source text.
 */
diff_match_patch.prototype.diff_text1 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute and return the destination text (all equalities and insertions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Destination text.
 */
diff_match_patch.prototype.diff_text2 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_DELETE) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute the Levenshtein distance; the number of inserted, deleted or
 * substituted characters.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {number} Number of changes.
 */
diff_match_patch.prototype.diff_levenshtein = function(diffs) {
  var levenshtein = 0;
  var insertions = 0;
  var deletions = 0;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];
    var data = diffs[x][1];
    switch (op) {
      case DIFF_INSERT:
        insertions += data.length;
        break;
      case DIFF_DELETE:
        deletions += data.length;
        break;
      case DIFF_EQUAL:
        // A deletion and an insertion is one substitution.
        levenshtein += Math.max(insertions, deletions);
        insertions = 0;
        deletions = 0;
        break;
    }
  }
  levenshtein += Math.max(insertions, deletions);
  return levenshtein;
};


/**
 * Crush the diff into an encoded string which describes the operations
 * required to transform text1 into text2.
 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Delta text.
 */
diff_match_patch.prototype.diff_toDelta = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    switch (diffs[x][0]) {
      case DIFF_INSERT:
        text[x] = '+' + encodeURI(diffs[x][1]);
        break;
      case DIFF_DELETE:
        text[x] = '-' + diffs[x][1].length;
        break;
      case DIFF_EQUAL:
        text[x] = '=' + diffs[x][1].length;
        break;
    }
  }
  return text.join('\t').replace(/%20/g, ' ');
};


/**
 * Given the original text1, and an encoded string which describes the
 * operations required to transform text1 into text2, compute the full diff.
 * @param {string} text1 Source string for the diff.
 * @param {string} delta Delta text.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.diff_fromDelta = function(text1, delta) {
  var diffs = [];
  var diffsLength = 0;  // Keeping our own length var is faster in JS.
  var pointer = 0;  // Cursor in text1
  var tokens = delta.split(/\t/g);
  for (var x = 0; x < tokens.length; x++) {
    // Each token begins with a one character parameter which specifies the
    // operation of this token (delete, insert, equality).
    var param = tokens[x].substring(1);
    switch (tokens[x].charAt(0)) {
      case '+':
        try {
          diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
        } catch (ex) {
          // Malformed URI sequence.
          throw new Error('Illegal escape in diff_fromDelta: ' + param);
        }
        break;
      case '-':
        // Fall through.
      case '=':
        var n = parseInt(param, 10);
        if (isNaN(n) || n < 0) {
          throw new Error('Invalid number in diff_fromDelta: ' + param);
        }
        var text = text1.substring(pointer, pointer += n);
        if (tokens[x].charAt(0) == '=') {
          diffs[diffsLength++] = [DIFF_EQUAL, text];
        } else {
          diffs[diffsLength++] = [DIFF_DELETE, text];
        }
        break;
      default:
        // Blank tokens are ok (from a trailing \t).
        // Anything else is an error.
        if (tokens[x]) {
          throw new Error('Invalid diff operation in diff_fromDelta: ' +
                          tokens[x]);
        }
    }
  }
  if (pointer != text1.length) {
    throw new Error('Delta length (' + pointer +
        ') does not equal source text length (' + text1.length + ').');
  }
  return diffs;
};


//  MATCH FUNCTIONS


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc'.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 */
diff_match_patch.prototype.match_main = function(text, pattern, loc) {
  // Check for null inputs.
  if (text == null || pattern == null || loc == null) {
    throw new Error('Null input. (match_main)');
  }

  loc = Math.max(0, Math.min(loc, text.length));
  if (text == pattern) {
    // Shortcut (potentially not guaranteed by the algorithm)
    return 0;
  } else if (!text.length) {
    // Nothing to match.
    return -1;
  } else if (text.substring(loc, loc + pattern.length) == pattern) {
    // Perfect match at the perfect spot!  (Includes case of null pattern)
    return loc;
  } else {
    // Do a fuzzy compare.
    return this.match_bitap_(text, pattern, loc);
  }
};


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
 * Bitap algorithm.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 * @private
 */
diff_match_patch.prototype.match_bitap_ = function(text, pattern, loc) {
  if (pattern.length > this.Match_MaxBits) {
    throw new Error('Pattern too long for this browser.');
  }

  // Initialise the alphabet.
  var s = this.match_alphabet_(pattern);

  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Compute and return the score for a match with e errors and x location.
   * Accesses loc and pattern through being a closure.
   * @param {number} e Number of errors in match.
   * @param {number} x Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length;
    var proximity = Math.abs(loc - x);
    if (!dmp.Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }
    return accuracy + (proximity / dmp.Match_Distance);
  }

  // Highest score beyond which we give up.
  var score_threshold = this.Match_Threshold;
  // Is there a nearby exact match? (speedup)
  var best_loc = text.indexOf(pattern, loc);
  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
    if (best_loc != -1) {
      score_threshold =
          Math.min(match_bitapScore_(0, best_loc), score_threshold);
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << (pattern.length - 1);
  best_loc = -1;

  var bin_min, bin_mid;
  var bin_max = pattern.length + text.length;
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid;
      } else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(1, loc - bin_mid + 1);
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;

    var rd = Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)];
      if (d === 0) {  // First pass: exact match.
        rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
      } else {  // Subsequent passes: fuzzy match.
        rd[j] = (((rd[j + 1] << 1) | 1) & charMatch) |
                (((last_rd[j + 1] | last_rd[j]) << 1) | 1) |
                last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j - 1;
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc);
          } else {
            // Already passed loc, downhill from here on in.
            break;
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break;
    }
    last_rd = rd;
  }
  return best_loc;
};


/**
 * Initialise the alphabet for the Bitap algorithm.
 * @param {string} pattern The text to encode.
 * @return {!Object} Hash of character locations.
 * @private
 */
diff_match_patch.prototype.match_alphabet_ = function(pattern) {
  var s = {};
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] = 0;
  }
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
  }
  return s;
};


//  PATCH FUNCTIONS


/**
 * Increase the context until it is unique,
 * but don't let the pattern expand beyond Match_MaxBits.
 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
 * @param {string} text Source text.
 * @private
 */
diff_match_patch.prototype.patch_addContext_ = function(patch, text) {
  if (text.length == 0) {
    return;
  }
  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
  var padding = 0;

  // Look for the first and last matches of pattern in text.  If two different
  // matches are found, increase the pattern length.
  while (text.indexOf(pattern) != text.lastIndexOf(pattern) &&
         pattern.length < this.Match_MaxBits - this.Patch_Margin -
         this.Patch_Margin) {
    padding += this.Patch_Margin;
    pattern = text.substring(patch.start2 - padding,
                             patch.start2 + patch.length1 + padding);
  }
  // Add one chunk for good luck.
  padding += this.Patch_Margin;

  // Add the prefix.
  var prefix = text.substring(patch.start2 - padding, patch.start2);
  if (prefix) {
    patch.diffs.unshift([DIFF_EQUAL, prefix]);
  }
  // Add the suffix.
  var suffix = text.substring(patch.start2 + patch.length1,
                              patch.start2 + patch.length1 + padding);
  if (suffix) {
    patch.diffs.push([DIFF_EQUAL, suffix]);
  }

  // Roll back the start points.
  patch.start1 -= prefix.length;
  patch.start2 -= prefix.length;
  // Extend the lengths.
  patch.length1 += prefix.length + suffix.length;
  patch.length2 += prefix.length + suffix.length;
};


/**
 * Compute a list of patches to turn text1 into text2.
 * Use diffs if provided, otherwise compute it ourselves.
 * There are four ways to call this function, depending on what data is
 * available to the caller:
 * Method 1:
 * a = text1, b = text2
 * Method 2:
 * a = diffs
 * Method 3 (optimal):
 * a = text1, b = diffs
 * Method 4 (deprecated, use method 3):
 * a = text1, b = text2, c = diffs
 *
 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
 * Array of diff tuples for text1 to text2 (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_b text2 (methods 1,4) or
 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>} opt_c Array of diff tuples
 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_make = function(a, opt_b, opt_c) {
  var text1, diffs;
  if (typeof a == 'string' && typeof opt_b == 'string' &&
      typeof opt_c == 'undefined') {
    // Method 1: text1, text2
    // Compute diffs from text1 and text2.
    text1 = /** @type {string} */(a);
    diffs = this.diff_main(text1, /** @type {string} */(opt_b), true);
    if (diffs.length > 2) {
      this.diff_cleanupSemantic(diffs);
      this.diff_cleanupEfficiency(diffs);
    }
  } else if (a && typeof a == 'object' && typeof opt_b == 'undefined' &&
      typeof opt_c == 'undefined') {
    // Method 2: diffs
    // Compute text1 from diffs.
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(a);
    text1 = this.diff_text1(diffs);
  } else if (typeof a == 'string' && opt_b && typeof opt_b == 'object' &&
      typeof opt_c == 'undefined') {
    // Method 3: text1, diffs
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_b);
  } else if (typeof a == 'string' && typeof opt_b == 'string' &&
      opt_c && typeof opt_c == 'object') {
    // Method 4: text1, text2, diffs
    // text2 is not used.
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_c);
  } else {
    throw new Error('Unknown call format to patch_make.');
  }

  if (diffs.length === 0) {
    return [];  // Get rid of the null case.
  }
  var patches = [];
  var patch = new diff_match_patch.patch_obj();
  var patchDiffLength = 0;  // Keeping our own length var is faster in JS.
  var char_count1 = 0;  // Number of characters into the text1 string.
  var char_count2 = 0;  // Number of characters into the text2 string.
  // Start with text1 (prepatch_text) and apply the diffs until we arrive at
  // text2 (postpatch_text).  We recreate the patches one by one to determine
  // context info.
  var prepatch_text = text1;
  var postpatch_text = text1;
  for (var x = 0; x < diffs.length; x++) {
    var diff_type = diffs[x][0];
    var diff_text = diffs[x][1];

    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
      // A new patch starts here.
      patch.start1 = char_count1;
      patch.start2 = char_count2;
    }

    switch (diff_type) {
      case DIFF_INSERT:
        patch.diffs[patchDiffLength++] = diffs[x];
        patch.length2 += diff_text.length;
        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text +
                         postpatch_text.substring(char_count2);
        break;
      case DIFF_DELETE:
        patch.length1 += diff_text.length;
        patch.diffs[patchDiffLength++] = diffs[x];
        postpatch_text = postpatch_text.substring(0, char_count2) +
                         postpatch_text.substring(char_count2 +
                             diff_text.length);
        break;
      case DIFF_EQUAL:
        if (diff_text.length <= 2 * this.Patch_Margin &&
            patchDiffLength && diffs.length != x + 1) {
          // Small equality inside a patch.
          patch.diffs[patchDiffLength++] = diffs[x];
          patch.length1 += diff_text.length;
          patch.length2 += diff_text.length;
        } else if (diff_text.length >= 2 * this.Patch_Margin) {
          // Time for a new patch.
          if (patchDiffLength) {
            this.patch_addContext_(patch, prepatch_text);
            patches.push(patch);
            patch = new diff_match_patch.patch_obj();
            patchDiffLength = 0;
            // Unlike Unidiff, our patch lists have a rolling context.
            // http://code.google.com/p/google-diff-match-patch/wiki/Unidiff
            // Update prepatch text & pos to reflect the application of the
            // just completed patch.
            prepatch_text = postpatch_text;
            char_count1 = char_count2;
          }
        }
        break;
    }

    // Update the current character count.
    if (diff_type !== DIFF_INSERT) {
      char_count1 += diff_text.length;
    }
    if (diff_type !== DIFF_DELETE) {
      char_count2 += diff_text.length;
    }
  }
  // Pick up the leftover patch if not empty.
  if (patchDiffLength) {
    this.patch_addContext_(patch, prepatch_text);
    patches.push(patch);
  }

  return patches;
};


/**
 * Given an array of patches, return another array that is identical.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_deepCopy = function(patches) {
  // Making deep copies is hard in JavaScript.
  var patchesCopy = [];
  for (var x = 0; x < patches.length; x++) {
    var patch = patches[x];
    var patchCopy = new diff_match_patch.patch_obj();
    patchCopy.diffs = [];
    for (var y = 0; y < patch.diffs.length; y++) {
      patchCopy.diffs[y] = patch.diffs[y].slice();
    }
    patchCopy.start1 = patch.start1;
    patchCopy.start2 = patch.start2;
    patchCopy.length1 = patch.length1;
    patchCopy.length2 = patch.length2;
    patchesCopy[x] = patchCopy;
  }
  return patchesCopy;
};


/**
 * Merge a set of patches onto the text.  Return a patched text, as well
 * as a list of true/false values indicating which patches were applied.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @param {string} text Old text.
 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
 *      new text and an array of boolean values.
 */
diff_match_patch.prototype.patch_apply = function(patches, text) {
  if (patches.length == 0) {
    return [text, []];
  }

  // Deep copy the patches so that no changes are made to originals.
  patches = this.patch_deepCopy(patches);

  var nullPadding = this.patch_addPadding(patches);
  text = nullPadding + text + nullPadding;

  this.patch_splitMax(patches);
  // delta keeps track of the offset between the expected and actual location
  // of the previous patch.  If there are patches expected at positions 10 and
  // 20, but the first patch was found at 12, delta is 2 and the second patch
  // has an effective expected position of 22.
  var delta = 0;
  var results = [];
  for (var x = 0; x < patches.length; x++) {
    var expected_loc = patches[x].start2 + delta;
    var text1 = this.diff_text1(patches[x].diffs);
    var start_loc;
    var end_loc = -1;
    if (text1.length > this.Match_MaxBits) {
      // patch_splitMax will only provide an oversized pattern in the case of
      // a monster delete.
      start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits),
                                  expected_loc);
      if (start_loc != -1) {
        end_loc = this.match_main(text,
            text1.substring(text1.length - this.Match_MaxBits),
            expected_loc + text1.length - this.Match_MaxBits);
        if (end_loc == -1 || start_loc >= end_loc) {
          // Can't find valid trailing context.  Drop this patch.
          start_loc = -1;
        }
      }
    } else {
      start_loc = this.match_main(text, text1, expected_loc);
    }
    if (start_loc == -1) {
      // No match found.  :(
      results[x] = false;
      // Subtract the delta for this failed patch from subsequent patches.
      delta -= patches[x].length2 - patches[x].length1;
    } else {
      // Found a match.  :)
      results[x] = true;
      delta = start_loc - expected_loc;
      var text2;
      if (end_loc == -1) {
        text2 = text.substring(start_loc, start_loc + text1.length);
      } else {
        text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
      }
      if (text1 == text2) {
        // Perfect match, just shove the replacement text in.
        text = text.substring(0, start_loc) +
               this.diff_text2(patches[x].diffs) +
               text.substring(start_loc + text1.length);
      } else {
        // Imperfect match.  Run a diff to get a framework of equivalent
        // indices.
        var diffs = this.diff_main(text1, text2, false);
        if (text1.length > this.Match_MaxBits &&
            this.diff_levenshtein(diffs) / text1.length >
            this.Patch_DeleteThreshold) {
          // The end points match, but the content is unacceptably bad.
          results[x] = false;
        } else {
          this.diff_cleanupSemanticLossless(diffs);
          var index1 = 0;
          var index2;
          for (var y = 0; y < patches[x].diffs.length; y++) {
            var mod = patches[x].diffs[y];
            if (mod[0] !== DIFF_EQUAL) {
              index2 = this.diff_xIndex(diffs, index1);
            }
            if (mod[0] === DIFF_INSERT) {  // Insertion
              text = text.substring(0, start_loc + index2) + mod[1] +
                     text.substring(start_loc + index2);
            } else if (mod[0] === DIFF_DELETE) {  // Deletion
              text = text.substring(0, start_loc + index2) +
                     text.substring(start_loc + this.diff_xIndex(diffs,
                         index1 + mod[1].length));
            }
            if (mod[0] !== DIFF_DELETE) {
              index1 += mod[1].length;
            }
          }
        }
      }
    }
  }
  // Strip the padding off.
  text = text.substring(nullPadding.length, text.length - nullPadding.length);
  return [text, results];
};


/**
 * Add some padding on text start and end so that edges can match something.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} The padding string added to each side.
 */
diff_match_patch.prototype.patch_addPadding = function(patches) {
  var paddingLength = this.Patch_Margin;
  var nullPadding = '';
  for (var x = 1; x <= paddingLength; x++) {
    nullPadding += String.fromCharCode(x);
  }

  // Bump all the patches forward.
  for (var x = 0; x < patches.length; x++) {
    patches[x].start1 += paddingLength;
    patches[x].start2 += paddingLength;
  }

  // Add some padding on start of first diff.
  var patch = patches[0];
  var diffs = patch.diffs;
  if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.unshift([DIFF_EQUAL, nullPadding]);
    patch.start1 -= paddingLength;  // Should be 0.
    patch.start2 -= paddingLength;  // Should be 0.
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[0][1].length) {
    // Grow first equality.
    var extraLength = paddingLength - diffs[0][1].length;
    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
    patch.start1 -= extraLength;
    patch.start2 -= extraLength;
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  // Add some padding on end of last diff.
  patch = patches[patches.length - 1];
  diffs = patch.diffs;
  if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.push([DIFF_EQUAL, nullPadding]);
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[diffs.length - 1][1].length) {
    // Grow last equality.
    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  return nullPadding;
};


/**
 * Look through the patches and break up any which are longer than the maximum
 * limit of the match algorithm.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 */
diff_match_patch.prototype.patch_splitMax = function(patches) {
  var patch_size = this.Match_MaxBits;
  for (var x = 0; x < patches.length; x++) {
    if (patches[x].length1 <= patch_size) {
      continue;
    }
    var bigpatch = patches[x];
    // Remove the big old patch.
    patches.splice(x--, 1);
    var start1 = bigpatch.start1;
    var start2 = bigpatch.start2;
    var precontext = '';
    while (bigpatch.diffs.length !== 0) {
      // Create one of several smaller patches.
      var patch = new diff_match_patch.patch_obj();
      var empty = true;
      patch.start1 = start1 - precontext.length;
      patch.start2 = start2 - precontext.length;
      if (precontext !== '') {
        patch.length1 = patch.length2 = precontext.length;
        patch.diffs.push([DIFF_EQUAL, precontext]);
      }
      while (bigpatch.diffs.length !== 0 &&
             patch.length1 < patch_size - this.Patch_Margin) {
        var diff_type = bigpatch.diffs[0][0];
        var diff_text = bigpatch.diffs[0][1];
        if (diff_type === DIFF_INSERT) {
          // Insertions are harmless.
          patch.length2 += diff_text.length;
          start2 += diff_text.length;
          patch.diffs.push(bigpatch.diffs.shift());
          empty = false;
        } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 &&
                   patch.diffs[0][0] == DIFF_EQUAL &&
                   diff_text.length > 2 * patch_size) {
          // This is a large deletion.  Let it pass in one chunk.
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          empty = false;
          patch.diffs.push([diff_type, diff_text]);
          bigpatch.diffs.shift();
        } else {
          // Deletion or equality.  Only take as much as we can stomach.
          diff_text = diff_text.substring(0,
              patch_size - patch.length1 - this.Patch_Margin);
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          if (diff_type === DIFF_EQUAL) {
            patch.length2 += diff_text.length;
            start2 += diff_text.length;
          } else {
            empty = false;
          }
          patch.diffs.push([diff_type, diff_text]);
          if (diff_text == bigpatch.diffs[0][1]) {
            bigpatch.diffs.shift();
          } else {
            bigpatch.diffs[0][1] =
                bigpatch.diffs[0][1].substring(diff_text.length);
          }
        }
      }
      // Compute the head context for the next patch.
      precontext = this.diff_text2(patch.diffs);
      precontext =
          precontext.substring(precontext.length - this.Patch_Margin);
      // Append the end context for this patch.
      var postcontext = this.diff_text1(bigpatch.diffs)
                            .substring(0, this.Patch_Margin);
      if (postcontext !== '') {
        patch.length1 += postcontext.length;
        patch.length2 += postcontext.length;
        if (patch.diffs.length !== 0 &&
            patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
          patch.diffs[patch.diffs.length - 1][1] += postcontext;
        } else {
          patch.diffs.push([DIFF_EQUAL, postcontext]);
        }
      }
      if (!empty) {
        patches.splice(++x, 0, patch);
      }
    }
  }
};


/**
 * Take a list of patches and return a textual representation.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} Text representation of patches.
 */
diff_match_patch.prototype.patch_toText = function(patches) {
  var text = [];
  for (var x = 0; x < patches.length; x++) {
    text[x] = patches[x];
  }
  return text.join('');
};


/**
 * Parse a textual representation of patches and return a list of Patch objects.
 * @param {string} textline Text representation of patches.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.patch_fromText = function(textline) {
  var patches = [];
  if (!textline) {
    return patches;
  }
  var text = textline.split('\n');
  var textPointer = 0;
  var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
  while (textPointer < text.length) {
    var m = text[textPointer].match(patchHeader);
    if (!m) {
      throw new Error('Invalid patch string: ' + text[textPointer]);
    }
    var patch = new diff_match_patch.patch_obj();
    patches.push(patch);
    patch.start1 = parseInt(m[1], 10);
    if (m[2] === '') {
      patch.start1--;
      patch.length1 = 1;
    } else if (m[2] == '0') {
      patch.length1 = 0;
    } else {
      patch.start1--;
      patch.length1 = parseInt(m[2], 10);
    }

    patch.start2 = parseInt(m[3], 10);
    if (m[4] === '') {
      patch.start2--;
      patch.length2 = 1;
    } else if (m[4] == '0') {
      patch.length2 = 0;
    } else {
      patch.start2--;
      patch.length2 = parseInt(m[4], 10);
    }
    textPointer++;

    while (textPointer < text.length) {
      var sign = text[textPointer].charAt(0);
      try {
        var line = decodeURI(text[textPointer].substring(1));
      } catch (ex) {
        // Malformed URI sequence.
        throw new Error('Illegal escape in patch_fromText: ' + line);
      }
      if (sign == '-') {
        // Deletion.
        patch.diffs.push([DIFF_DELETE, line]);
      } else if (sign == '+') {
        // Insertion.
        patch.diffs.push([DIFF_INSERT, line]);
      } else if (sign == ' ') {
        // Minor equality.
        patch.diffs.push([DIFF_EQUAL, line]);
      } else if (sign == '@') {
        // Start of next patch.
        break;
      } else if (sign === '') {
        // Blank line?  Whatever.
      } else {
        // WTF?
        throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
      }
      textPointer++;
    }
  }
  return patches;
};


/**
 * Class representing one patch operation.
 * @constructor
 */
diff_match_patch.patch_obj = function() {
  /** @type {!Array.<!diff_match_patch.Diff>} */
  this.diffs = [];
  /** @type {?number} */
  this.start1 = null;
  /** @type {?number} */
  this.start2 = null;
  /** @type {number} */
  this.length1 = 0;
  /** @type {number} */
  this.length2 = 0;
};


/**
 * Emmulate GNU diff's format.
 * Header: @@ -382,8 +481,9 @@
 * Indicies are printed as 1-based, not 0-based.
 * @return {string} The GNU diff string.
 */
diff_match_patch.patch_obj.prototype.toString = function() {
  var coords1, coords2;
  if (this.length1 === 0) {
    coords1 = this.start1 + ',0';
  } else if (this.length1 == 1) {
    coords1 = this.start1 + 1;
  } else {
    coords1 = (this.start1 + 1) + ',' + this.length1;
  }
  if (this.length2 === 0) {
    coords2 = this.start2 + ',0';
  } else if (this.length2 == 1) {
    coords2 = this.start2 + 1;
  } else {
    coords2 = (this.start2 + 1) + ',' + this.length2;
  }
  var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
  var op;
  // Escape the body of the patch with %xx notation.
  for (var x = 0; x < this.diffs.length; x++) {
    switch (this.diffs[x][0]) {
      case DIFF_INSERT:
        op = '+';
        break;
      case DIFF_DELETE:
        op = '-';
        break;
      case DIFF_EQUAL:
        op = ' ';
        break;
    }
    text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
  }
  return text.join('').replace(/%20/g, ' ');
};


// Export these global variables so that they survive Google's JS compiler.
// In a browser, 'this' will be 'window'.
// Users of node.js should 'require' the uncompressed version since Google's
// JS compiler may break the following exports for non-browser environments.
/*
this['diff_match_patch'] = diff_match_patch;
this['DIFF_DELETE'] = DIFF_DELETE;
this['DIFF_INSERT'] = DIFF_INSERT;
this['DIFF_EQUAL'] = DIFF_EQUAL;
*/

module.exports=diff_match_patch;

});
require.register("ksana-document/xml4kdb.js", function(exports, require, module){
if (typeof nodeRequire=='undefined')nodeRequire=require;

var tags=[];
var tagstack=[];
var parseXMLTag=function(s) {
	var name="",i=0;
	if (s[0]=='/') {
		return {name:s.substring(1),type:'end'};
	}
	while (s[i] && (s.charCodeAt(i)>0x30)) {name+=s[i];i++;}
	var type="start";
	if (s[s.length-1]=='/') { type="emtpy"; }
	var attr={},count=0;
	s=s.substring(name.length+1);
	s.replace(/(.*?)="([^"]*?)"/g,function(m,m1,m2) {
		attr[m1]=m2;
		count++;
	});
	if (!count) attr=undefined;
	return {name:name,type:type,attr:attr};
};
var parseUnit=function(unittext) {
	// name,sunit, soff, eunit, eoff , attributes
	var totaltaglength=0,tags=[],tagoffset=0;
	var parsed=unittext.replace(/<(.*?)>/g,function(m,m1,off){
		var i=m1.indexOf(" "),tag=m1,attributes="";
		if (i>-1) {
			tag=m1.substr(0,i);
			attributes=m1.substr(i+1);
		}
		tagoffset=off-totaltaglength;
		tags.push([tagoffset , tag,attributes, 0 ]); //vpos to be resolved
		totaltaglength+=m.length;
		return ""; //remove the tag from inscription
	});
	return {inscription:parsed, tags:tags};
};
var splitUnit=function(buf,sep) {
	var units=[], unit="", last=0 ,name="";
	buf.replace(sep,function(m,m1,offset){
		units.push([name,buf.substring(last,offset),last]);
		name=m1;
		last=offset;//+m.length;   //keep the separator
	});
	units.push([name,buf.substring(last),last]);
	return units;
};
var defaultsep="_.id";
var emptypagename="_";
var parseXML=function(buf, opts){
	opts=opts||{};
	var sep=opts.sep||defaultsep;
	var unitsep=new RegExp('<'+sep.replace(".",".*? ")+'="([^"]*?)"' , 'g')  ;
	var units=splitUnit(buf, unitsep);
	var texts=[], tags=[];
	units.map(function(U,i){
		var out=parseUnit(U[1]);
		if (opts.trim) out.inscription=out.inscription.trim();
		texts.push({n:U[0]||emptypagename,t:out.inscription});
		tags.push(out.tags);
	});
	return {texts:texts,tags:tags,sep:sep};
};
var D=nodeRequire("ksana-document").document;

var importJson=function(json) {
	d=D.createDocument();
	for (var i=0;i<json.texts.length;i++) {
		var markups=json.tags[i];
		d.createPage(json.texts[i]);
	}
	//d.setRawXMLTags(json.tags);
	d.setSep(json.sep);
	return d;
}
/*
    doc.tags hold raw xml tags, offset will be adjusted by evolvePage.
    should not add or delete page, otherwise the export XML is not valid.
*/
/*
		var o=pg.getOrigin();
		if (o.id && this.tags[o.id-1] && this.tags[o.id-1].length) {
			this.tags[o.id-1]=pg.upgradeXMLTags(this.tags[o.id-1], pg.__revisions__());	
		}
*/
var upgradeXMLTags=function(tags,revs) {
	var migratedtags=[],i=0, delta=0;
	for (var j=0;j<tags.length;j++) {
		var t=tags[j];
		var s=t[0], l=t[1].length, deleted=false;
		while (i<revs.length && revs[i].start<=s) {
			var rev=revs[i];
			if (rev.start<=s && rev.start+rev.len>=s+l) {
				deleted=true;
			}
			delta+= (rev.payload.text.length-rev.len);
			i++;
		}
		var m2=[t[0]+delta,t[1]];
		migratedtags.push(m2);
	};
	return migratedtags;
}

var migrateRawTags=function(doc,tags) {
	var out=[];
	for (var i=0;i<tags.length;i++) {
		var T=tags[i];

		var pg=doc.getPage(i+1);
		var offsprings=pg.offsprings();
		for (var j=0;j<offsprings.length;j++) {
			var o=offsprings[j];
			var rev=pg.revertRevision(o.revert,pg.inscription);
			T=upgradeXMLTags(T,rev);
			pg=o;
		}		
		out.push(T);
	}
	return out;
}
var exportXML=function(doc,originalrawtags){
	var out=[],tags=null;
	rawtags=migrateRawTags(doc,originalrawtags);
	doc.map(function(pg,i){
		var tags=rawtags[i];  //get the xml tags
		var tagnow=0,text="";
		var t=pg.inscription;
		for (var j=0;j<t.length;j++) {
			if (tagnow<tags.length) {
				if (tags[tagnow][0]==j) {
					text+="<"+tags[tagnow][1]+">";
					tagnow++;
				}
			}
			text+=t[j];
		}
		if (tagnow<tags.length && j==tags[tagnow][0]) text+="<"+tags[tagnow][1]+">";
		out.push(text);
	})

	return out.join("");
};
module.exports={parseXML:parseXML, importJson:importJson, exportXML:exportXML}
});
require.register("ksana-document/buildfromxml.js", function(exports, require, module){
var outback = function (s) {
    while (s.length < 70) s += ' ';
    var l = s.length; 
    for (var i = 0; i < l; i++) s += String.fromCharCode(8);
    process.stdout.write(s);
}
var movefile=function(sourcefn,targetfolder) {
	var fs = require("fs");
	var source = fs.createReadStream(sourcefn);
	var path=require("path");
	var targetfn=path.resolve(process.cwd(),"..")+path.sep+path.basename(sourcefn);
	var destination = fs.createWriteStream(targetfn);
	console.log(targetfn);
	source.pipe(destination, { end: false });
	source.on("end", function(){
	    fs.unlinkSync(sourcefn);
	});
	return targetfn;
}
var mkdbjs="mkdb.js";
var build=function(path){
  var fs=require("fs");

  if (!fs.existsSync(mkdbjs)) {
      throw "no "+mkdbjs  ;
  }
  var starttime=new Date();
  console.log("START",starttime);
  if (!path) path=".";
  var fn=require("path").resolve(path,mkdbjs);
  var mkdbconfig=require(fn);
  var glob = require("glob");
  var indexer=require("ksana-document").indexer;
  var timer=null;

  glob(mkdbconfig.glob, function (err, files) {
    if (err) {
      throw err;
    }
    mkdbconfig.files=files.sort();
    var session=indexer.start(mkdbconfig);
    if (!session) {
      console.log("No file to index");
      return;
    }
    timer=setInterval( getstatus, 1000);
  });
  var getstatus=function() {
    var status=indexer.status();
    outback((Math.floor(status.progress*1000)/10)+'%'+status.message);
    if (status.done) {
    	var endtime=new Date();
    	console.log("END",endtime, "elapse",(endtime-starttime) /1000,"seconds") ;
      //status.outputfn=movefile(status.outputfn,"..");
      clearInterval(timer);
    }
  }
}

module.exports=build;
});
require.register("ksana-document/tei.js", function(exports, require, module){

var anchors=[];
var parser=null,filename="";
var context=null, config={};
var tagmodules=[];

var warning=function(err) {
	if (config.warning) {
		config.warning(err,filename);
	} else {
		console.log(err,filename);	
	}	
}
var ontext=function(e) {
	//if (context.handler) 
	context.text+=e;
}
var onopentag=function(e) {
	context.paths.push(e.name);
	context.parents.push(e);
	context.now=e;	
	context.path=context.paths.join("/");
	if (!context.handler) {
		var handler=context.handlers[context.path];
		if (handler) 	context.handler=handler;
		var close_handler=context.close_handlers[context.path];
		if (close_handler) 	context.close_handler=close_handler;
	}

	if (context.handler)  context.handler(true);
}

var onclosetag=function(e) {
	context.now=context.parents[context.parents.length-1];

	var handler=context.close_handlers[context.path];
	if (handler) {
		var res=null;
		if (context.close_handler) res=context.close_handler(true);
		context.handler=null;//stop handling
		context.close_handler=null;//stop handling
		context.text="";
		if (res && context.status.storeFields) {
			context.status.storeFields(res, context.status.json);
		}
	} else if (context.close_handler) {
		context.close_handler();
	}
	
	context.paths.pop();
	context.parents.pop();
	context.path=context.paths.join("/");		
}
var addHandler=function(path,_tagmodule) {
	var tagmodule=_tagmodule;
	if (typeof tagmodule=="function") {
		tagmodule={close_handler:_tagmodule};
	}
	if (tagmodule.handler) context.handlers[path]=tagmodule.handler;
	if (tagmodule.close_handler) context.close_handlers[path]=tagmodule.close_handler;
	if (tagmodule.reset) tagmodule.reset();
	tagmodule.warning=warning;
	tagmodules.push(tagmodule);
}
var closeAnchor=function(pg,T,anchors,id,texts) {
	var beg="beg"+id.substr(3);
	for (var j=anchors.length-1;j>=0;j--) {
		if (anchors[j][3]!=beg) continue;
		var anchor=anchors[j];
		
		if (pg==anchor[0]) { //same page
			anchor[2]=T[0]-anchor[1]; // length
		} else { //assume end anchor in just next page// ref. pT01p0003b2901
			var pagelen=texts[anchor[0]].t.length;
			anchors[j][2]= (pagelen-anchor[1])  + T[0];
		}
		return;
	}
	warning("cannot find beg pointer for anchor:"+id);
}
// [pg, start, len, id]
var createAnchors=function(parsed) {
	var anchors=[];
	var tags=parsed.tags;
	for (var pg=0;pg<tags.length;pg++){
		var pgtags=tags[pg];
		for (var i=0;i<pgtags.length;i++) {
				var T=pgtags[i];
				if (T[1].indexOf("anchor xml:id=")!=0) continue;
				var id=T[1].substr(15);
				id=id.substr(0,id.indexOf('"'));
				if (id.substr(0,3)=="end") {
					closeAnchor(pg,T,anchors,id,parsed.texts);
				} else {
					anchors.push([pg,T[0],0,id]);	
				}
			}
	}
	return anchors;	
}
var resolveAnchors=function(anchors,texts) {
	tagmodules.map(function(m){
		if (m.resolve) m.resolve(anchors,texts);
	})
}
var  createMarkups=function(parsed) {
	anchors=createAnchors(parsed);
	resolveAnchors(anchors,parsed.text);

	for (var i=0;i<anchors.length;i++) {
		if (anchors[i][4] && !anchors[i][4].length) {
			config.warning("unresolve anchor"+anchors[i][3]);
		}
	}
	return anchors;
}
var handlersResult=function() {
	var out={};
	tagmodules.map(function(m){
		if (m.result) out[m.name]=m.result();
	})
}

var parseP5=function(xml,parsed,fn,_config,_status) {
	parser=require("sax").parser(true);
	filename=fn;
	context={ paths:[] , parents:[], handlers:{}, close_handlers:{}, text:"" ,now:null,status:_status};
	parser.onopentag=onopentag;
	parser.onclosetag=onclosetag;
	parser.ontext=ontext;
	config=_config;
	tagmodules=[];
	context.addHandler=addHandler;
	if (_config.setupHandlers) config.setupHandlers.apply(context);
	parser.write(xml);
	context=null;
	parser=null;
	if (parsed) return createMarkups(parsed);
	else return handlersResult();
}
module.exports=parseP5;
});
require.register("ksana-document/concordance.js", function(exports, require, module){
/*
  concordance without suffix array.

  法 takes 25 seconds.

  improvement:
	less page scan.        
*/
var search=require("./search");
var Kde=require("./kde");
var excerpt=excerpt=require("./excerpt");
var status={progress:0}, forcestop=false;
var texts=[],starts=[],ends=[];
var config=null,engine=null;
var nest=0;
var verbose=false;

var scanpage=function(obj,npage,pat,backward) {
	var page=texts[npage];
	page.replace(pat,function(m,m1){
			if (!obj[m1]) obj[m1]=[];
			var o=obj[m1];
			if (o[o.length-1]!=npage) o.push(npage);
	});
}
var trimunfrequent=function(out,total,config) {
	for (var i=0;i<out.length;i++) {
		var hit=out[i][1].length;
		if ( (hit / total) < config.threshold || hit < config.threshold_count) {
			out.length=i;
			break;
		}
	}
}
var findNeighbors=function(filter,q,backward) {
	var cjkbmp="([\\u4E00-\\u9FFF])";
	if (verbose) console.log("findn",q,filter.length,backward)
	var p=q+cjkbmp;
	nest++;
	if (backward) terms=starts;
	else terms=ends;

	if (backward) p=cjkbmp+q ;  //starts

	var pat=new RegExp(p,"g");
	var obj={},out=[];
	for (var i=0;i<filter.length;i++) {
		var npage=i;
		if (typeof filter[i]=="number") npage=filter[i];
		scanpage(obj,npage,pat,backward);
	}
	for (var i in obj) out.push([i,obj[i]]);
	out.sort(function(a,b){return b[1].length-a[1].length});

	var total=0;
	for (var i=0;i<out.length;i++) total+=out[i][1].length;

	trimunfrequent(out,total,config);
	var newterms=[];
	if (nest<5) for (var i=0;i<out.length;i++) {
		var term=q+out[i][0];
		var termhit=out[i][1].length;
		if (backward) term=out[i][0]+q;
		var childterms=findNeighbors(out[i][1],term,backward);

		terms.push([term,termhit,q]);

		if (childterms.length==1 && childterms[0][1]/config.mid_threshold > termhit) {
			terms[terms.length-1][3]=childterms[0][0];
		}
		newterms.push([term,termhit,q]);
	}
	nest--;
	return newterms;
}

var finalize=function() {
	if (verbose) console.timeEnd("fetchtext");
	if (verbose) console.time("neighbor");
	findNeighbors(texts,config.q,false); //forward
	findNeighbors(texts,config.q,true); //backward	
	starts.sort(function(a,b){return b[1]-a[1]});
	ends.sort(function(a,b){return b[1]-a[1]});
	status.output={
		totalpagecount:engine.get("meta").pagecount,
		pagecount:texts.length,starts:starts,ends:ends};
	if (verbose) console.timeEnd("neighbor");
	status.done=true;
}
var opts={nohighlight:true};

var worker=function() {
	var Q=this;
	var pages=Q.pageWithHit(this.now);
	status.progress=this.now/Q.byFile.length;
	for (var j=0;j<pages.length;j++) {
		texts.push( engine.getSync(["fileContents",this.now,pages[j]]));	
	}
	this.now++
	if (this.now<Q.byFile.length) {
		setImmediate( worker.bind(this)) ;
		if (forcestop || Q.excerptStop) 	finalize();
	} else finalize();
}

var start=function(_config) {
	if (verbose) console.time("search");
	config=_config;
	config.threshold=config.threshold||0.005;
	config.threshold_count=config.threshold_count||20;
	config.mid_threshold=config.mid_threshold || 0.9 ; //if child has 80% hit, remove parent
	config.termlimit=config.termlimit||500;
	config.nestlevel=config.nestlevel||5;
	var open=Kde.open;
	if (typeof Require=="undefined") open=Kde.openLocal;

	open(config.db,function(_engine){
		engine=_engine;
		search(engine,config.q,opts,function(Q){
			Q.now=0;
			if (verbose) console.timeEnd("search");
			if (verbose) console.time("fetchtext");
			worker.call(Q);
		});
	});
}
var stop=function() {
	forcestop=true;
}

var getstatus=function() {
	return status;
}

module.exports={start:start,stop:stop,status:getstatus};

//module.exports=concordance;
});
require.register("ksana-document/regex.js", function(exports, require, module){
/*
   regex search.
   scan only possible pages

   remove regular expression operator  ^ $  [  ]  {  }  (  )  . \d \t \n

   $,^  begin and end not supported 
   support [^] exclusion later

   report match term with hit
*/
var search=require("./search");
var Kde=require("./kde");
var status={progress:0}, forcestop=false;
var texts=[],terms=[];
var config=null,engine=null;

var opts={nohighlight:true, range:{filestart:0, maxfile:100}};

var worker=function() {
	search(engine,config.q_unregex,opts,function(Q){
		var excerpts=Q.excerpt.map(function(q){return q.text.replace(/\n/g,"")});
		texts=texts.concat(excerpts);
		opts.range.filestart=opts.range.nextFileStart;
		status.progress=opts.range.nextFileStart/Q.byFile.length;
		if (forcestop || Q.excerptStop) {
			finalize();
		} else setTimeout(worker,0);
	});
}

var filter=function() {
	var pat=new RegExp(config.q,"g");
	var matches={};
	
	for (var i=0;i<texts.length;i++) {
		var m=texts[i].match(pat);
		if (m) {
			for (var j=0;j<m.length;j++) {
				if (!matches[m[j]]) matches[m[j]]=0;
				matches[m[j]]++;
			}
		}
	}

	terms=[];
	for (var i in matches) {
		if (matches[i]>=config.threshold) terms.push( [i,matches[i]]);	
	} 
	terms.sort(function(a,b){return b[1]-a[1]});
	return terms;
}
var finalize=function() {
	filter();
	status.output={
		totalpagecount:engine.get("meta").pagecount,
		pagecount:texts.length,
		terms:terms
	};
	status.done=true;
}
var unregex=function(q) {
	var out=q.replace(/\.+/g," ");
	out=out.replace(/\\./g," "); //remove \d \n \t
	return out;
}
var start=function(_config){
	config=_config;
	var open=Kde.open;
	config.threshold=config.threshold||5;
	if (typeof Require=="undefined") open=Kde.openLocal;
	config.q_unregex=unregex(config.q);
	open(config.db,function(_engine){
		engine=_engine;
		setTimeout(worker,0);
	});
}
var stop=function() {
	forcestop=true;
}

var getstatus=function() {
	return status;
}
module.exports={start:start,stop:stop,status:getstatus};
});
require.register("ksana-document/bsearch.js", function(exports, require, module){
var indexOfSorted = function (array, obj, near) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]==obj) return mid;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
  if (near) return low;
  else if (array[low]==obj) return low;else return -1;
};
var indexOfSorted_str = function (array, obj, near) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]==obj) return mid;
    (array[mid].localeCompare(obj)<0) ? low = mid + 1 : high = mid;
  }
  if (near) return low;
  else if (array[low]==obj) return low;else return -1;
};


var bsearch=function(array,value,near) {
	var func=indexOfSorted;
	if (typeof array[0]=="string") func=indexOfSorted_str;
	return func(array,value,near);
}
var bsearchNear=function(array,value) {
	return bsearch(array,value,true);
}

module.exports=bsearch;//{bsearchNear:bsearchNear,bsearch:bsearch};
});
require.register("ksanaforge-fileinstaller/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* todo , optional kdb */

var htmlfs=Require("htmlfs");    
var checkbrowser=Require("checkbrowser");  
  
var html5fs=Require("ksana-document").html5fs;
var filelist = React.createClass({displayName: 'filelist',
	getInitialState:function() {
		return {downloading:false,progress:0};
	},
	updatable:function(f) {
        	var classes="btn btn-warning";
        	if (this.state.downloading) classes+=" disabled";
		if (f.hasUpdate) return React.DOM.button( {className:classes, 
			'data-filename':f.filename,  'data-url':f.url,
	            onClick:this.download}
	       , "Update")
		else return null;
	},
	showLocal:function(f) {
        var classes="btn btn-danger";
        if (this.state.downloading) classes+=" disabled";
	  return React.DOM.tr(null, React.DOM.td(null, f.filename),
	      React.DOM.td(null),
	      React.DOM.td( {className:"pull-right"}, 
	      this.updatable(f),React.DOM.button( {className:classes, 
	               onClick:this.deleteFile, 'data-filename':f.filename}, "Delete")
	        
	      )
	  )
	},  
	showRemote:function(f) { 
	  var classes="btn btn-warning";
	  if (this.state.downloading) classes+=" disabled";
	  return (React.DOM.tr( {'data-id':f.filename}, React.DOM.td(null, 
	      f.filename),
	      React.DOM.td(null, f.desc),
	      React.DOM.td(null, 
	      React.DOM.span( {'data-filename':f.filename,  'data-url':f.url,
	            className:classes,
	            onClick:this.download}, "Download")
	      )
	  ));
	},
	showFile:function(f) {
	//	return <span data-id={f.filename}>{f.url}</span>
		return (f.ready)?this.showLocal(f):this.showRemote(f);
	},
	reloadDir:function() {
		this.props.action("reload");
	},
	download:function(e) {
		var url=e.target.dataset["url"];
		var filename=e.target.dataset["filename"];
		this.setState({downloading:true,progress:0,url:url});
		this.userbreak=false;
		html5fs.download(url,filename,function(){
			this.reloadDir();
			this.setState({downloading:false,progress:1});
			},function(progress,total){
				if (progress==0) {
					this.setState({message:"total "+total})
			 	}
			 	this.setState({progress:progress});
			 	//if user press abort return true
			 	return this.userbreak;
			}
		,this);
	},
	deleteFile:function( e) {
		var filename=e.target.attributes["data-filename"].value;
		this.props.action("delete",filename);
	},
	allFilesReady:function(e) {
		return this.props.files.every(function(f){ return f.ready});
	},
	dismiss:function() {
		$(this.refs.dialog1.getDOMNode()).modal('hide');
		this.props.action("dismiss");
	},
	abortdownload:function() {
		this.userbreak=true;
	},
	showProgress:function() {
	     if (this.state.downloading) {
	      var progress=Math.round(this.state.progress*100);
	      return (
	      	React.DOM.div(null, 
	      	"Downloading from ", this.state.url,
	      React.DOM.div(  {key:"progress", className:"progress col-md-8"}, 
	          React.DOM.div( {className:"progress-bar", role:"progressbar", 
	              'aria-valuenow':progress, 'aria-valuemin':"0", 
	              'aria-valuemax':"100", style:{width: progress+"%"}}, 
	            progress,"%"
	          )
	        ),
	        React.DOM.button( {onClick:this.abortdownload, 
	        	className:"btn btn-danger col-md-4"}, "Abort")
	        )
	        );
	      } else {
	      		if ( this.allFilesReady() ) {
	      			return React.DOM.button( {onClick:this.dismiss, className:"btn btn-success"}, "Ok")
	      		} else return null;
	      		
	      }
	},
	showUsage:function() {
		var percent=this.props.remainPercent;
           return (React.DOM.div(null, React.DOM.span( {className:"pull-left"}, "Usage:"),React.DOM.div( {className:"progress"}, 
		  React.DOM.div( {className:"progress-bar progress-bar-success progress-bar-striped", role:"progressbar",  style:{width: percent+"%"}}, 
		    	percent+"%"
		  )
		)));
	},
	render:function() {
	  	return (
		React.DOM.div( {ref:"dialog1", className:"modal fade", 'data-backdrop':"static"}, 
		    React.DOM.div( {className:"modal-dialog"}, 
		      React.DOM.div( {className:"modal-content"}, 
		        React.DOM.div( {className:"modal-header"}, 
		          React.DOM.h4( {className:"modal-title"}, "File Installer")
		        ),
		        React.DOM.div( {className:"modal-body"}, 
		        	React.DOM.table( {className:"table"}, 
		        	React.DOM.tbody(null, 
		          	this.props.files.map(this.showFile)
		          	)
		          )
		        ),
		        React.DOM.div( {className:"modal-footer"}, 
		        	this.showUsage(),
		           this.showProgress()
		        )
		      )
		    )
		  )
		);
	},	
	componentDidMount:function() {
		$(this.refs.dialog1.getDOMNode()).modal('show');
	}
});
/*TODO kdb check version*/
var filemanager = React.createClass({displayName: 'filemanager',
	getInitialState:function() {
		var quota=this.getQuota();
		return {browserReady:false,noupdate:true,
			requestQuota:quota,remain:0};
	},
	getQuota:function() {
		var q=this.props.quota||"128M";
		var unit=q[q.length-1];
		var times=1;
		if (unit=="M") times=1024*1024;
		else if (unit="K") times=1024;
		return parseInt(q) * times;
	},
	missingKdb:function() {
		var missing=this.props.needed.filter(function(kdb){
			for (var i in html5fs.files) {
				if (html5fs.files[i][0]==kdb.filename) return false;
			}
			return true;
		},this);
		return missing;
	},
	getRemoteUrl:function(fn) {
		var f=this.props.needed.filter(function(f){return f.filename==fn});
		if (f.length ) return f[0].url;
	},
	genFileList:function(existing,missing){
		var out=[];
		for (var i in existing) {
			var url=this.getRemoteUrl(existing[i][0]);
			out.push({filename:existing[i][0], url :url, ready:true });
		}
		for (var i in missing) {
			out.push(missing[i]);
		}
		return out;
	},
	reload:function() {
		html5fs.readdir(function(files){
  			this.setState({files:this.genFileList(files,this.missingKdb())});
  		},this);
	 },
	deleteFile:function(fn) {
	  html5fs.rm(fn,function(){
	  	this.reload();
	  },this);
	},
	onQuoteOk:function(quota,usage) {
		var files=this.genFileList(html5fs.files,this.missingKdb());
		var that=this;
		that.checkIfUpdate(files,function(hasupdate) {
			var missing=this.missingKdb();
			var autoclose=this.props.autoclose;
			if (missing.length) autoclose=false;
			that.setState({autoclose:autoclose,
				quota:quota,usage:usage,files:files,
				missing:missing,
				noupdate:!hasupdate,
				remain:quota-usage});
		});
	},  
	onBrowserOk:function() {
	  this.totalDownloadSize();
	}, 
	dismiss:function() {
		this.props.onReady(this.state.usage,this.state.quota);
		setTimeout(function(){
			$(".modal.in").modal('hide');
		},500);
	}, 
	totalDownloadSize:function() {
		var files=this.missingKdb();
		var taskqueue=[],totalsize=0;
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) totalsize+=data;
						html5fs.getDownloadSize(files[idx].url,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			totalsize+=data;
			setTimeout(function(){that.setState({requireSpace:totalsize,browserReady:true})},0);
		});
		taskqueue.shift()({__empty:true});
	},
	checkIfUpdate:function(files,cb) {
		var taskqueue=[];
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) files[idx-1].hasUpdate=data;
						html5fs.checkUpdate(files[idx].url,files[idx].filename,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			files[files.length-1].hasUpdate=data;
			var hasupdate=files.some(function(f){return f.hasUpdate});
			if (cb) cb.apply(that,[hasupdate]);
		});
		taskqueue.shift()({__empty:true});
	},
	render:function(){
    		if (!this.state.browserReady) {   
      			return checkbrowser( {feature:"fs", onReady:this.onBrowserOk})
    		} if (!this.state.quota || this.state.remain<this.state.requireSpace) {  
    			var quota=this.state.requestQuota;
    			if (this.state.usage+this.state.requireSpace>quota) {
    				quota=(this.state.usage+this.state.requireSpace)*1.5;
    			}
      			return htmlfs( {quota:quota, autoclose:"true", onReady:this.onQuoteOk})
      		} else {
			if (!this.state.noupdate || this.missingKdb().length || !this.state.autoclose) {
				var remain=Math.round((this.state.usage/this.state.quota)*100);				
				return filelist( {action:this.action, files:this.state.files, remainPercent:remain})
			} else {
				setTimeout( this.dismiss ,0);
				return React.DOM.span(null, "Success");
			}
      		}
	},
	action:function() {
	  var args = Array.prototype.slice.call(arguments);
	  var type=args.shift();
	  var res=null, that=this;
	  if (type=="delete") {
	    this.deleteFile(args[0]);
	  }  else if (type=="reload") {
	  	this.reload();
	  } else if (type=="dismiss") {
	  	this.dismiss();
	  }
	}
});

module.exports=filemanager;
});
require.register("ksanaforge-checkbrowser/index.js", function(exports, require, module){
/** @jsx React.DOM */

var checkfs=function() {
	return (navigator && navigator.webkitPersistentStorage);
}
var featurechecks={
	"fs":checkfs
}
var checkbrowser = React.createClass({displayName: 'checkbrowser',
	getInitialState:function() {
		var missingFeatures=this.getMissingFeatures();
		return {ready:false, missing:missingFeatures};
	},
	getMissingFeatures:function() {
		var feature=this.props.feature.split(",");
		var status=[];
		feature.map(function(f){
			var checker=featurechecks[f];
			if (checker) checker=checker();
			status.push([f,checker]);
		});
		return status.filter(function(f){return !f[1]});
	},
	downloadbrowser:function() {
		window.location="https://www.google.com/chrome/"
	},
	renderMissing:function() {
		var showMissing=function(m) {
			return React.DOM.div(null, m);
		}
		return (
		 React.DOM.div( {ref:"dialog1", className:"modal fade", 'data-backdrop':"static"}, 
		    React.DOM.div( {className:"modal-dialog"}, 
		      React.DOM.div( {className:"modal-content"}, 
		        React.DOM.div( {className:"modal-header"}, 
		          React.DOM.button( {type:"button", className:"close", 'data-dismiss':"modal", 'aria-hidden':"true"}, "×"),
		          React.DOM.h4( {className:"modal-title"}, "Browser Check")
		        ),
		        React.DOM.div( {className:"modal-body"}, 
		          React.DOM.p(null, "Sorry but the following feature is missing"),
		          this.state.missing.map(showMissing)
		        ),
		        React.DOM.div( {className:"modal-footer"}, 
		          React.DOM.button( {onClick:this.downloadbrowser, type:"button", className:"btn btn-primary"}, "Download Google Chrome")
		        )
		      )
		    )
		  )
		 );
	},
	renderReady:function() {
		return React.DOM.span(null, "browser ok")
	},
	render:function(){
		return  (this.state.missing.length)?this.renderMissing():this.renderReady();
	},
	componentDidMount:function() {
		if (!this.state.missing.length) {
			this.props.onReady();
		} else {
			$(this.refs.dialog1.getDOMNode()).modal('show');
		}
	}
});

module.exports=checkbrowser;
});
require.register("ksanaforge-htmlfs/index.js", function(exports, require, module){
/** @jsx React.DOM */
var html5fs=Require("ksana-document").html5fs;
var htmlfs = React.createClass({displayName: 'htmlfs',
	getInitialState:function() { 
		return {ready:false, quota:0,usage:0,Initialized:false,autoclose:this.props.autoclose};
	},
	initFilesystem:function() {
		var quota=this.props.quota||1024*1024*128; // default 128MB
		quota=parseInt(quota);
		html5fs.init(quota,function(q){
			this.dialog=false;
			$(this.refs.dialog1.getDOMNode()).modal('hide');
			this.setState({quota:q,autoclose:true});
		},this);
	},
	welcome:function() {
		return (
		React.DOM.div( {ref:"dialog1", className:"modal fade", id:"myModal", 'data-backdrop':"static"}, 
		    React.DOM.div( {className:"modal-dialog"}, 
		      React.DOM.div( {className:"modal-content"}, 
		        React.DOM.div( {className:"modal-header"}, 
		          React.DOM.h4( {className:"modal-title"}, "Welcome")
		        ),
		        React.DOM.div( {className:"modal-body"}, 
		          "Browser will ask for your confirmation."
		        ),
		        React.DOM.div( {className:"modal-footer"}, 
		          React.DOM.button( {onClick:this.initFilesystem, type:"button", 
		            className:"btn btn-primary"}, "Initialize File System")
		        )
		      )
		    )
		  )
		 );
	},
	renderDefault:function(){
		var used=Math.floor(this.state.usage/this.state.quota *100);
		var more=function() {
			if (used>50) return React.DOM.button( {type:"button", className:"btn btn-primary"}, "Allocate More");
			else null;
		}
		return (
		React.DOM.div( {ref:"dialog1", className:"modal fade", id:"myModal", 'data-backdrop':"static"}, 
		    React.DOM.div( {className:"modal-dialog"}, 
		      React.DOM.div( {className:"modal-content"}, 
		        React.DOM.div( {className:"modal-header"}, 
		          React.DOM.h4( {className:"modal-title"}, "Sandbox File System")
		        ),
		        React.DOM.div( {className:"modal-body"}, 
		          React.DOM.div( {className:"progress"}, 
		            React.DOM.div( {className:"progress-bar", role:"progressbar", style:{width: used+"%" }}, 
		               used,"%"
		            )
		          ),
		          React.DOM.span(null, this.state.quota, " total , ", this.state.usage, " in used")
		        ),
		        React.DOM.div( {className:"modal-footer"}, 
		          React.DOM.button( {onClick:this.dismiss, type:"button", className:"btn btn-default", 'data-dismiss':"modal"}, "Close"),         
		          more()
		        )
		      )
		    )
		  )
		  );
	},
	dismiss:function() {
		var that=this;
		setTimeout(function(){
			that.props.onReady(that.state.quota,that.state.usage);	
		},0);
	},
	queryQuota:function() {
		html5fs.queryQuota(function(usage,quota){
			this.setState({usage:usage,quota:quota,initialized:true});
		},this);
	},
	render:function() {
		var that=this;
		if (!this.state.quota || this.state.quota<this.props.quota) {
			if (this.state.initialized) {
				this.dialog=true;
				return this.welcome();	
			} else {
				return React.DOM.span(null, "checking quota")
			}			
		} else {
			if (!this.state.autoclose) {
				this.dialog=true;
				return this.renderDefault(); 
			}
			this.dismiss();
			this.dialog=false;
			return React.DOM.span(null)
		}
	},
	componentDidMount:function() {
		if (!this.state.quota) {
			this.queryQuota();

		};
	},
	componentDidUpdate:function() {
		if (this.dialog) $(this.refs.dialog1.getDOMNode()).modal('show');
	}
});

module.exports=htmlfs;
});
require.register("ccs_classifier-main/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var main = React.createClass({displayName: 'main',
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      React.DOM.div(null, 
        "Hello,",this.state.bar
      )
    );
  }
});
module.exports=main;
});
require.register("ccs_classifier-comp1/index.js", function(exports, require, module){
/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var comp1 = React.createClass({displayName: 'comp1',
  getInitialState: function() {
    return {bar: "world"};
  },
  render: function() {
    return (
      React.DOM.div(null, 
        "Hello,",this.state.bar
      )
    );
  }
});
module.exports=comp1;
});
require.register("ccs_classifier-dataset/index.js", function(exports, require, module){
//var othercomponent=Require("other"); 
//new module filename must be added to scripts section of ./component.js and export here
var dataset = {
 module1: require("./module")
}

module.exports=dataset;
});
require.register("ccs_classifier-dataset/titlenames.js", function(exports, require, module){
module.exports=[
 "石林燕語辨",
 "演繁露",
 "嬾真子錄",
 "攷古編",
 "捫蝨新話上集",
 "下集",
 "螢雪叢說",
 "前定錄",
 "續",
 "中華古今注",
 "庚溪詩話",
 "善誘文",
 "釋常談",
 "高宗皇帝御製翰墨志",
 "九經補韻",
 "官箴",
 "雞肋",
 "梅譜",
 "厚德錄",
 "河東先生龍城錄",
 "竹坡老人詩話",
 "文正王公遺事",
 "晝簾緒論",
 "法帖譜系",
 "翰林志",
 "茶經",
 "酒譜",
 "竹譜",
 "東坡先生志林集",
 "晁氏客語",
 "許彥周詩話",
 "耕祿藳",
 "聖門事業圖",
 "書譜",
 "鼠璞",
 "歐陽文忠公試筆",
 "開天傳信記",
 "菊譜",
 "宋朝燕翼詒謀錄",
 "後山居士詩話",
 "孫公談圃",
 "可談",
 "續書譜",
 "四六談麈",
 "洛陽牡丹記",
 "香譜",
 "濟南先生師友談記",
 "因論",
 "司馬溫公詩話",
 "東谷所見",
 "春明退朝錄",
 "法帖刊誤",
 "袪疑說",
 "李涪刊誤",
 "東溪試茶錄",
 "淳熙玉堂雜紀",
 "獨斷",
 "珊瑚鉤詩話",
 "王文正公筆錄",
 "國老談苑",
 "米元章書史",
 "煎茶水記",
 "菌譜",
 "笋譜",
 "本心齋疏食譜",
 "蘇黃門龍川略志",
 "王公四六話",
 "劉攽貢父詩話",
 "獻醜集",
 "隋遺錄",
 "書斷",
 "名山洞天福地記",
 "硯史",
 "古今刀劍錄",
 "海棠譜",
 "子略",
 "目",
 "宋景文公筆記",
 "東萊呂紫微詩話",
 "漁樵對問",
 "選詩句圖",
 "寶章待訪錄",
 "南方草木狀",
 "蟹譜",
 "歙州硯譜",
 "歙硯說",
 "辨歙石說",
 "茶錄",
 "騷略",
 "韓忠獻公遺事",
 "石林詩話",
 "揮麈錄",
 "文房四友除授集",
 "法帖釋文",
 "師曠禽經",
 "橘錄",
 "端溪硯譜",
 "牡丹榮辱志",
 "學齋佔畢",
 "欒城先生遺言",
 "六一居士詩話",
 "西疇老人常言",
 "道山清話",
 "海岳名言",
 "丁晉公談錄",
 "荔枝譜",
 "揚州芍藥譜",
 "硯譜",
 "古今刀劒錄",
 "大學石經",
 "論語筆解",
 "李氏刊誤",
 "宜齋野乘",
 "芥隱筆記",
 "因話錄",
 "玉匣記",
 "抒情錄",
 "王文正筆錄",
 "傳信記",
 "尚書故實",
 "次柳氏舊聞",
 "錢氏私誌",
 "家世舊聞",
 "默記",
 "卓異記",
 "艮嶽記",
 "王氏談錄",
 "畫墁錄",
 "碧雲騢",
 "霏雪錄",
 "談藪",
 "話腴",
 "拊掌錄",
 "山房隨筆",
 "文錄",
 "滄浪詩話",
 "書史",
 "書評",
 "翰墨志",
 "譜系雜說",
 "歐公試筆",
 "古畫品錄",
 "後畫品錄",
 "畫品",
 "畫論",
 "紀藝",
 "林泉高致",
 "試茶錄",
 "金漳蘭譜",
 "蔬食譜",
 "梅品",
 "天彭牡丹譜",
 "禽經",
 "相鶴經",
 "相牛經",
 "耒耜經",
 "洛陽名園記",
 "岳陽風土記",
 "真臘風土記",
 "桂海虞衡志",
 "洞天福地記",
 "令旨解二諦義",
 "毛詩草木鳥獸蟲魚疏",
 "古今考",
 "小爾雅",
 "五色線",
 "兩同書",
 "希通錄",
 "資暇錄",
 "蠡海錄",
 "晉陽秋",
 "蜀檮杌",
 "趙后遺事",
 "焚椒錄",
 "元氏掖庭記",
 "鄴中記",
 "北轅錄",
 "西使記",
 "三楚新錄",
 "江南野錄",
 "明道雜志",
 "東觀奏記",
 "幽閑鼓吹",
 "隋唐嘉話",
 "南唐近事",
 "開元天寶遺事",
 "朝野僉載",
 "桂苑叢談",
 "樂郊私語",
 "劉賓客嘉話錄",
 "隣幾雜誌",
 "避暑漫抄",
 "深雪偶談",
 "桐陰舊話",
 "養痾漫筆",
 "宣政雜錄",
 "遂昌雜錄",
 "文昌雜錄",
 "聞見雜錄",
 "行營雜錄",
 "江行雜錄",
 "碧湖雜記",
 "鐵圍山叢談",
 "南海古蹟記",
 "青溪寇軌",
 "溪蠻叢笑",
 "北戶錄",
 "北里志",
 "吳船錄",
 "驂鸞錄",
 "攬轡錄",
 "入蜀記",
 "入越記",
 "吳地記",
 "吳郡諸山錄",
 "廬山錄",
 "後錄",
 "九華山錄",
 "金華游錄",
 "臥游錄",
 "啟顏錄",
 "省心錄",
 "樂善錄",
 "還寃記",
 "博異志",
 "集異記",
 "歲華紀麗譜",
 "家世舊事",
 "教坊記",
 "青樓集",
 "小名錄",
 "侍兒小名錄",
 "麟書",
 "尤射",
 "詩式",
 "詩品",
 "書品",
 "書法",
 "筆陣圖",
 "衍極",
 "續畫品錄",
 "貞觀公私畫史",
 "名畫記",
 "畫梅譜",
 "畫竹譜",
 "墨竹譜",
 "樂府雜錄",
 "羯鼓錄",
 "嘯旨",
 "風后握奇經",
 "附握奇經續圖",
 "八陣總述",
 "女孝經",
 "墨經",
 "丸經",
 "棋經",
 "五木經",
 "鼎錄",
 "蜀錦譜",
 "蜀牋譜",
 "聖學範圍圖說",
 "戊申立春考證",
 "正朔考",
 "龍興慈記",
 "在田錄",
 "一統肇基錄",
 "聖君初政記",
 "逐鹿記",
 "東朝紀",
 "壟起雜事",
 "椒宮舊事",
 "造邦賢勳錄略",
 "掾曹名臣錄",
 "明良錄略",
 "從政錄",
 "致身錄",
 "殉身錄",
 "備遺錄",
 "平夏錄",
 "復辟錄",
 "女直考",
 "夷俗記",
 "北征錄",
 "北征後錄",
 "北征記",
 "使高麗錄",
 "玉堂漫筆",
 "願豐堂漫書",
 "金臺紀聞",
 "制府雜錄",
 "北虜紀略",
 "翦勝野聞",
 "觚不觚錄",
 "谿山餘話",
 "清暑筆談",
 "吳中故語",
 "甲乙剩言",
 "三朝野史",
 "熙朝樂事",
 "委巷叢談",
 "蜩笑偶言",
 "玉笑零音",
 "春雨雜述",
 "病榻寤言",
 "褚氏遺書",
 "瀟湘錄",
 "清尊錄",
 "昨夢錄",
 "就日錄",
 "驚聽錄",
 "劇談錄",
 "解酲語",
 "已瘧編",
 "耳目記",
 "括異志",
 "枕譚",
 "猥談",
 "語怪",
 "異林",
 "羣碎錄",
 "物異考",
 "真靈位業圖",
 "空同子",
 "冥寥子游",
 "廣莊",
 "貧士傳",
 "長者言",
 "香案牘",
 "清言",
 "續清言",
 "歸有園麈談",
 "偶譚",
 "木几冗談",
 "金石契",
 "考槃餘事",
 "書箋",
 "帖箋",
 "辨帖箋",
 "畫箋",
 "紙箋",
 "筆箋",
 "墨箋",
 "研箋",
 "琴箋",
 "香箋",
 "文房器具箋",
 "起居器服箋",
 "游具箋",
 "山齋志",
 "茶箋",
 "盆玩品",
 "金魚品",
 "岩棲幽事",
 "友論",
 "農說",
 "山棲志",
 "林水錄",
 "吳社編",
 "客越志",
 "雨航記",
 "荊溪疏",
 "大嶽志",
 "蜀都雜抄",
 "金山雜志",
 "泉南雜志",
 "武夷雜記",
 "海槎餘錄",
 "瀛涯勝覽",
 "滇載記",
 "閩部疏",
 "吳中勝記",
 "田家五行",
 "明月篇",
 "丹青志",
 "書畫史",
 "畫說",
 "畫麈",
 "畫禪",
 "竹派",
 "詞旨",
 "詞評",
 "曲藻",
 "曲豔品",
 "後",
 "樂府指迷",
 "陽關三疊圖譜",
 "秇圃擷餘",
 "學古編",
 "古今印史",
 "古奇器錄",
 "弈律",
 "葉子譜",
 "茶疏",
 "岕茶牋",
 "觴政",
 "瓶史",
 "缾花譜",
 "藝花譜",
 "藝菊",
 "蘭譜",
 "種蘭訣",
 "種樹書",
 "學圃雜疏",
 "花疏",
 "果疏",
 "瓜蔬疏",
 "野蔌品",
 "稻品",
 "蠶經",
 "養魚經",
 "獸經",
 "虎苑",
 "大學古本",
 "中庸古本",
 "詩小序",
 "詩傳",
 "詩說",
 "乾鑿度",
 "元包",
 "潛虛",
 "京氏易略",
 "關氏易傳",
 "周易略例",
 "周易古占",
 "周易舉正",
 "讀易私言",
 "元包數義",
 "櫝蓍記",
 "論語拾遺",
 "疑孟",
 "詰墨",
 "翼莊",
 "三禮鈙錄",
 "夏小正",
 "月令問答",
 "三墳書",
 "易飛候",
 "易洞林",
 "易稽覽圖",
 "易巛靈圖",
 "易通卦驗",
 "尚書旋璣鈐",
 "尚書帝命期",
 "尚書考靈耀",
 "尚書中候",
 "詩含神霧",
 "詩紀曆樞",
 "春秋元命苞",
 "春秋運斗樞",
 "春秋文曜鉤",
 "春秋合誠圖",
 "春秋孔演圖",
 "春秋說題辭",
 "春秋感精符",
 "春秋潛潭巴",
 "春秋佐助期",
 "春秋緯",
 "春秋後語",
 "春秋繁露",
 "禮稽命徵",
 "禮含文嘉",
 "禮斗威儀",
 "大戴禮逸",
 "樂稽耀嘉",
 "孝經援神契",
 "孝經鉤命決",
 "孝經左契",
 "孝經右契",
 "孝經內事",
 "五經折疑",
 "五經通義",
 "龍魚河圖",
 "河圖括地象",
 "河圖稽命徵",
 "河圖稽燿鉤",
 "河圖始開圖",
 "洛書甄耀度",
 "遁甲開山圖",
 "淮南萬畢術",
 "兼明書",
 "實賓錄",
 "譚子化書",
 "素書",
 "枕中書",
 "參同契",
 "陰符經",
 "三教論衡",
 "藝圃折中",
 "發明義理",
 "鹿門隱書",
 "山書",
 "◎書",
 "武侯新書",
 "權書",
 "史剡",
 "綱目疑誤",
 "揚子新注",
 "新唐書糾謬",
 "遂初堂書目",
 "輶軒絕代語",
 "臆乘",
 "刑書釋名",
 "續釋常談",
 "事原",
 "袖中記",
 "學齋呫嗶",
 "孔氏雜說",
 "賓退錄",
 "紀談錄",
 "過庭錄",
 "楮記室",
 "墨客揮犀",
 "師友談記",
 "楊文公談苑",
 "愛日齋藂抄",
 "能改齋漫錄",
 "識遺",
 "退齋雅聞錄",
 "南墅閒居錄",
 "雪浪齋日記",
 "廬陵官下記",
 "玉溪編事",
 "渚宮故事",
 "麟臺故事",
 "五國故事",
 "郡閣雅言",
 "候鯖錄",
 "摭青雜說",
 "隱窟雜志",
 "梁溪漫志",
 "墨娥漫錄",
 "三水小牘",
 "寓簡",
 "碧雞漫志",
 "涪翁雜說",
 "雲麓漫抄",
 "黃氏筆記",
 "兩鈔摘腴",
 "西林日記",
 "搜神祕覽",
 "牧竪閒談",
 "紫薇雜記",
 "巖下放言",
 "玉澗襍書",
 "石林燕語",
 "避暑錄話",
 "葦航紀談",
 "豹隱紀談",
 "悅生隨抄",
 "齊東埜語",
 "邇言志見",
 "晰獄龜鑑",
 "青箱雜記",
 "冷齋夜話",
 "癸辛雜識",
 "墨莊漫錄",
 "龍川別志",
 "羅湖野錄",
 "鶴林玉露",
 "雲谿友議",
 "後山談叢",
 "林下偶譚",
 "緗素雜記",
 "捫虱新話",
 "研北雜志",
 "清波雜志",
 "壼中贅錄",
 "物類相感志",
 "同話錄",
 "五總志",
 "金樓子",
 "乾𦠆子",
 "投荒雜錄",
 "炙轂子錄",
 "絕倒錄",
 "唾玉集",
 "辨疑志",
 "開城錄",
 "原化記",
 "澄懷錄",
 "先公談錄",
 "槁簡贅筆",
 "傳講雜記",
 "繼古藂編",
 "南窗記談",
 "後耳目志",
 "羣居解頤",
 "雁門野說",
 "三柳軒雜識",
 "負暄雜錄",
 "中吳紀聞",
 "緯略",
 "鉤玄",
 "遯齋閒覽",
 "稗史",
 "志林",
 "晉問",
 "窮愁志",
 "席上腐談",
 "讀書隅見",
 "田間書",
 "判決錄",
 "東園友聞",
 "劉馮事始",
 "西墅記譚",
 "遺史紀聞",
 "姑蘇筆記",
 "南部新書",
 "龍城錄",
 "義山雜記",
 "文藪雜著",
 "法苑珠林",
 "蒼梧雜志",
 "青瑣高議",
 "祕閣閑話",
 "耕餘博覽",
 "雞肋編",
 "泊宅編",
 "吹劍錄",
 "投轄錄",
 "鑑戒錄",
 "暇日記",
 "佩楚軒客談",
 "志雅堂雜抄",
 "浩然齋視聽抄",
 "瑞桂堂暇錄",
 "陵陽室中語",
 "猗覺寮雜記",
 "昭德新編",
 "山陵雜記",
 "桯史",
 "雲谷雜記",
 "船窗夜話",
 "野人閒話",
 "植杖閒談",
 "東齋記事",
 "澹山雜識",
 "坦齋通編",
 "桃源手聽",
 "韋居聽輿",
 "仇池筆記",
 "暘谷謾錄",
 "友會談叢",
 "野老記聞",
 "灌畦暇語",
 "澗泉日記",
 "步里客談",
 "雲齋廣錄",
 "續骫骳說",
 "西齋話記",
 "雪舟𧨀語",
 "西軒客談",
 "蒙齋筆談（節錄巖下放言）",
 "廬陵雜說",
 "昌黎雜說",
 "漁樵閒話",
 "游宦紀聞",
 "行都紀事",
 "楓窗小牘",
 "湖湘故事",
 "誠齋雜記",
 "溫公瑣語",
 "蔣氏日錄",
 "剡溪野語",
 "釣磯立談",
 "盛事美談",
 "衣冠盛事",
 "硯崗筆志",
 "窗閒記聞",
 "翰墨叢記",
 "備忘小抄",
 "艅艎日疏",
 "輶軒雜錄",
 "獨醒雜志",
 "姚氏殘語",
 "有宋佳話",
 "採蘭雜志",
 "嘉蓮燕語",
 "戊辰雜抄",
 "真率筆記",
 "芸窗私志",
 "致虛雜俎",
 "內觀日疏",
 "漂粟手牘",
 "奚囊橘柚",
 "玄池說林",
 "賈氏說林",
 "然藜餘筆",
 "荻樓雜抄",
 "客退紀談",
 "下帷短牒",
 "下黃私記",
 "嫏嬛記",
 "宣室志",
 "傳載",
 "傳載略",
 "野雪鍜排雜說",
 "樹萱錄",
 "善謔集",
 "紹陶錄",
 "視聽抄",
 "卻掃編",
 "開顏集",
 "雞跖集",
 "葆化錄",
 "聞見錄",
 "洽聞記",
 "閒談錄",
 "延漏錄",
 "三餘帖",
 "北山錄",
 "潛居錄",
 "西溪藂語",
 "倦游雜錄",
 "虛谷閒抄",
 "玉照新志",
 "醉翁寱語",
 "錦里新聞",
 "漫笑錄",
 "軒渠錄",
 "諧噱錄",
 "咸定錄",
 "天定錄",
 "調謔編",
 "謔名錄",
 "艾子雜說",
 "摭言",
 "諧史",
 "談淵",
 "談撰",
 "賓朋宴語",
 "法藏碎金錄",
 "春渚紀聞",
 "曲洧舊聞",
 "茅亭客話",
 "避戎嘉話",
 "閒燕常談",
 "儒林公議",
 "賈氏談錄",
 "燈下閒談",
 "蘜堂野史",
 "退齋筆錄",
 "皇朝類苑",
 "珩璜新論",
 "白獺髓",
 "清夜錄",
 "貴耳錄",
 "異聞記",
 "芝田錄",
 "避亂錄",
 "啽囈集",
 "◎關錄",
 "揮麈餘話",
 "洞微志",
 "該聞錄",
 "從駕記",
 "東巡記",
 "江表志",
 "歸田錄",
 "陶朱新錄",
 "東臯雜錄",
 "東軒筆錄",
 "十友瑣說",
 "澠水燕談錄",
 "幙府燕閒錄",
 "老學菴筆記",
 "蓼花洲閒錄",
 "秀水閒居錄",
 "大唐創業起居注",
 "乾淳起居注",
 "御塞行程",
 "熙豐日曆",
 "唐年補錄",
 "燕翼貽謀錄",
 "玉堂逢辰錄",
 "宜春傳信錄",
 "洛陽搢紳舊聞記",
 "小說舊聞記",
 "廣陵妖亂志",
 "玉堂雜記",
 "玉壺清話",
 "家王故事",
 "北夢瑣言",
 "杜陽雜編",
 "金華子雜編",
 "玉泉子真錄",
 "松窗雜記",
 "南楚新聞",
 "中朝故事",
 "戎幕閒談",
 "商芸小說",
 "封氏聞見記",
 "景龍文館記",
 "古杭雜記",
 "錢塘遺事",
 "唐國史補",
 "唐闕史",
 "唐語林",
 "大唐新語",
 "大唐奇事",
 "三聖記",
 "先友記",
 "皮子世錄",
 "盧氏雜說",
 "零陵總記",
 "玉堂閑話",
 "四朝聞見錄",
 "三朝聖政錄",
 "會昌解頤錄",
 "洛中紀異錄",
 "相學齋雜鈔",
 "金鑾密記",
 "常侍言旨",
 "朝野遺記",
 "朝野僉言",
 "大中遺事",
 "西朝寶訓",
 "涑水紀聞",
 "蜀道征討比事",
 "大事記",
 "甲申雜記",
 "隨手雜錄",
 "聞見近錄",
 "南遊記舊",
 "燕北雜記",
 "山居新語",
 "續翰林志",
 "翰林壁記",
 "御史臺記",
 "上庠錄",
 "唐科名記",
 "五代登科記",
 "趨朝事類",
 "紹熙行禮記",
 "上壽拜舞記",
 "封禪儀記",
 "明禋儀注",
 "梁雜儀注",
 "婚雜儀注",
 "朝會儀記",
 "稽古定制",
 "明皇十七事",
 "摭異記",
 "愧郯錄",
 "新城錄",
 "南渡宮禁典儀",
 "乾淳御教記",
 "燕射記",
 "唱名記",
 "天基聖節排當樂次",
 "乾淳教坊樂部",
 "雜劇段數",
 "高宗幸張府節次略",
 "藝流供奉志",
 "晉史乘",
 "楚史檮杌",
 "幸蜀記",
 "五代新說",
 "金志",
 "遼志",
 "松漠記聞",
 "雞林類事",
 "虜廷事實",
 "夷俗考",
 "北風揚沙錄",
 "蒙韃備錄",
 "北邊備對",
 "燕北錄",
 "天南行記",
 "高昌行紀",
 "陷虜記",
 "群輔錄",
 "英雄記鈔",
 "東林蓮社十八高賢傳",
 "高士傳",
 "汝南先賢傳",
 "陳留耆舊傳",
 "會稽先賢傳",
 "益都耆舊傳",
 "楚國先賢傳",
 "襄陽耆舊傳",
 "長沙耆舊傳",
 "零陵先賢傳",
 "廣州先賢傳",
 "閩川名士傳",
 "西州後賢志",
 "文士傳",
 "列女傳",
 "梓潼士女志",
 "漢中士女志",
 "孝子傳",
 "幼童傳",
 "高道傳",
 "方外志",
 "列仙傳",
 "神仙傳",
 "續神仙傳",
 "集仙傳",
 "江淮異人錄",
 "漢官儀",
 "獻帝春秋",
 "玄晏春秋",
 "九州春秋",
 "帝王世記",
 "魏晉世語",
 "東宮舊事",
 "元嘉起居注",
 "大業拾遺錄",
 "建康宮殿簿",
 "山公啟事",
 "八王故事",
 "陸機要覽",
 "新論",
 "譙周法訓",
 "裴啟語林",
 "虞喜志林",
 "魏臺訪議",
 "魏春秋",
 "齊春秋",
 "續晉陽秋",
 "晉中興書",
 "宋拾遺錄",
 "會稽典錄",
 "三國典略",
 "建康實錄",
 "三輔決錄",
 "吳錄",
 "靈憲注",
 "玉曆通政經",
 "徐整長曆",
 "孫氏瑞應圖",
 "玉符瑞圖",
 "地鏡圖",
 "五行記",
 "玄中記",
 "發蒙記",
 "決疑要注",
 "在窮記",
 "河東記",
 "雞林志",
 "湘山錄",
 "九國志",
 "九域志",
 "十道志",
 "十三州記",
 "寰宇記",
 "風土記",
 "神境記",
 "西征記",
 "三輔黃圖",
 "三輔舊事",
 "西都雜記",
 "太康地記",
 "燉煌新錄",
 "扶南土俗",
 "南宋巿肆紀",
 "三秦記",
 "長安志",
 "關中記",
 "洛陽記",
 "梁州記",
 "梁京寺紀",
 "宜都記",
 "益州記",
 "荊州記",
 "湘中記",
 "武陵記",
 "漢南記",
 "南雍州記",
 "安城記",
 "南康記",
 "潯陽記",
 "鄱陽記",
 "九江志",
 "丹陽記",
 "會稽記",
 "永嘉郡記",
 "三齊略記",
 "南越志",
 "廣州記",
 "廣志",
 "番禺雜記",
 "始興記",
 "林邑記",
 "涼州記",
 "交州記",
 "沙州記",
 "雲南志略",
 "遼東志略",
 "陳留風俗傳",
 "成都古今記",
 "臨海水土記",
 "臨海異物志",
 "遊城南注",
 "湖山勝槩",
 "盧山錄",
 "金華遊錄",
 "大獄志",
 "來南錄",
 "汎舟錄",
 "乾道庚寅奏事錄",
 "河源志",
 "于役志",
 "峽程記",
 "述異記",
 "佛國記",
 "神異經",
 "拾遺名山記",
 "海內十洲記",
 "別國洞冥記",
 "西京雜記",
 "南部烟花記",
 "豫章古今記",
 "睦州古蹟記",
 "遊甬東山水古蹟記",
 "洛陽伽藍記",
 "寺塔記",
 "益部方物略記",
 "嶺表錄異記",
 "函潼關要志",
 "南宋故都宮殿",
 "東京夢華錄",
 "古杭夢遊錄",
 "錢塘瑣記",
 "六朝事迹",
 "汴故宮記",
 "汴都平康記",
 "吳興園林記",
 "盧山草堂記",
 "草堂三謠",
 "終南十志",
 "平泉山居雜記",
 "平泉山居草木記",
 "荊楚歲時記",
 "乾淳歲時記",
 "輦下歲時記",
 "秦中歲時記",
 "玉燭寶典",
 "四民月令",
 "千金月令",
 "四時寶鏡",
 "歲時雜記",
 "歲華紀麗",
 "影燈記",
 "政經",
 "忠經",
 "女論語",
 "女誡",
 "涑水家儀",
 "顏氏家訓",
 "石林家訓",
 "緒訓",
 "蘇氏族譜",
 "訓學齋規",
 "呂氏鄉約",
 "義莊規矩",
 "世範",
 "鄭氏家範",
 "報應記",
 "辨惑論",
 "山家清供",
 "山家清事",
 "忘懷錄",
 "登涉符籙",
 "對雨編",
 "農家諺",
 "經鉏堂襍誌",
 "吳下田家志",
 "天隱子養生書",
 "保生要錄",
 "保生月錄",
 "養生月錄",
 "攝生要錄",
 "齊民要術",
 "林下清錄",
 "蘭亭集",
 "輞川集",
 "洛中耆英會",
 "洛中九老會",
 "錦帶書",
 "耕祿藁",
 "水族加恩簿",
 "禪本草",
 "義山雜纂",
 "雜纂續",
 "雜纂二續",
 "釵小志",
 "粧樓記",
 "粧臺記",
 "靚粧錄",
 "髻鬟品",
 "織錦璇璣圖",
 "麗情集",
 "文則",
 "詩譜",
 "二十四詩品",
 "詩談",
 "詩論",
 "詩病五事",
 "杜詩箋",
 "風騷旨格",
 "韻語陽秋",
 "藝苑雌黃",
 "譚苑醍醐",
 "竹林詩評",
 "謝氏詩源",
 "潛溪詩眼",
 "本事詩",
 "續本事詩",
 "䂬溪詩話",
 "環溪詩話",
 "東坡詩話",
 "西清詩話",
 "艇齋詩話",
 "梅澗詩話",
 "後村詩話",
 "漫叟詩話",
 "桐江詩話",
 "蘭莊詩話",
 "迃齋詩話",
 "金玉詩話",
 "漢臯詩話",
 "陳輔之詩話",
 "敖器之詩話",
 "潘子真詩話",
 "青瑣詩話",
 "玄散詩話",
 "烏臺詩案",
 "紫微詩話",
 "臨漢隱居詩話",
 "苕溪漁隱叢話",
 "歲寒堂詩話",
 "娛書堂詩話",
 "二老堂詩話",
 "比紅兒詩",
 "林下詩談",
 "詩話雋永",
 "詩詞餘話",
 "詞品",
 "四六餘話",
 "月泉吟社",
 "佩觿",
 "干祿字書",
 "金壺字考",
 "俗書證誤",
 "字書誤讀",
 "字格",
 "字林",
 "六義圖解",
 "筆勢論略",
 "筆髓論",
 "五十六種書法",
 "九品書",
 "書品優劣",
 "續書品",
 "論篆",
 "陽冰（誤題冰陽）筆訣",
 "張長史十二意筆法",
 "顏公筆法",
 "四體書勢",
 "法書苑",
 "後書品",
 "能書錄",
 "思陵書畫記",
 "集古錄",
 "益州名畫錄",
 "名畫獵精",
 "采畫錄",
 "廣畫錄",
 "畫學祕訣",
 "畫史",
 "畫鑒",
 "大觀茶論",
 "宣和北苑貢茶錄",
 "北苑別錄",
 "品茶要錄",
 "本朝茶法",
 "十六湯品",
 "述煮茶小品",
 "採茶錄",
 "鬬茶記",
 "續北山酒經",
 "酒經",
 "安雅堂觥律",
 "觴政述",
 "醉鄉日月",
 "罰爵典故",
 "熙寧酒課",
 "新豐酒法",
 "酒乘",
 "觥記注",
 "麴本草",
 "酒爾雅",
 "酒小史",
 "酒名記",
 "食譜",
 "食經",
 "食珍錄",
 "膳夫錄",
 "玉食批",
 "士大夫食時五觀",
 "糖霜譜",
 "中饋錄",
 "刀劍錄",
 "洞天清錄",
 "雲林石譜",
 "漁陽石譜",
 "宣和石譜",
 "太湖石志",
 "吳氏印譜",
 "漢晉印章圖譜",
 "傳國璽譜",
 "玉璽譜",
 "相貝經",
 "相手版經",
 "帶格",
 "三器圖義",
 "寶記",
 "三代鼎器錄",
 "錢譜",
 "泉志",
 "名香譜",
 "墨記",
 "筆經",
 "衞公故物記",
 "古玉圖攷",
 "文房圖贊",
 "文房圖贊續",
 "燕几圖",
 "琴曲譜錄",
 "雅琴名錄",
 "琴聲經緯",
 "琴箋圖式",
 "雜書琴事",
 "古琴疏",
 "樂府解題",
 "驃國樂頌",
 "唐樂曲譜",
 "籟紀",
 "玄真子漁歌記",
 "觱篥格",
 "柘枝譜",
 "管絃記",
 "鼓吹格",
 "射經",
 "九射格",
 "投壺儀節",
 "投壺新格",
 "打馬圖",
 "蹴踘圖譜",
 "譜雙",
 "除紅譜",
 "醉綠圖",
 "骰子選格",
 "樗蒲經略",
 "藝經",
 "彈碁經",
 "儒棋格",
 "棊訣",
 "棋手勢",
 "棋品",
 "圍棋義例",
 "古局象棋圖",
 "琵琶錄",
 "王氏蘭譜",
 "海棠譜詩",
 "陳州牡丹記",
 "花經",
 "花九錫",
 "洛陽花木記",
 "魏王花木志",
 "楚辭芳草譜",
 "園林草木疏",
 "桐譜",
 "續竹譜",
 "筍譜",
 "打棗譜",
 "野菜譜",
 "茹草紀事",
 "藥譜",
 "藥錄",
 "何首烏錄",
 "彰明附子記",
 "肉攫部",
 "蠶書",
 "漁具詠",
 "相馬書",
 "蟫史",
 "禽獸決錄",
 "解鳥語經",
 "筭經",
 "望氣經",
 "星經",
 "相雨書",
 "水衡記",
 "峽船誌",
 "水經",
 "太乙經",
 "起世經",
 "宅經",
 "木經",
 "脈經",
 "子午經",
 "玄女房中經",
 "相地骨經",
 "相兒經",
 "龜經",
 "卜記",
 "箕龜論",
 "百怪斷經",
 "土牛經",
 "漏刻經",
 "感應經",
 "感應類從志",
 "夢書",
 "數術記遺",
 "漢雜事祕辛",
 "大業雜記",
 "大業拾遺記",
 "開河記",
 "迷樓記",
 "海山記",
 "東方朔傳",
 "漢武帝內傳",
 "趙飛燕外傳",
 "飛燕遺事",
 "楊太真外傳",
 "梅妃傳",
 "長恨歌傳",
 "高力士傳",
 "綠珠傳",
 "非煙傳",
 "謝小娥傳",
 "霍小玉傳",
 "劉無雙傳",
 "虬髯客傳",
 "韓仙傳",
 "神僧傳",
 "劍俠傳",
 "穆天子傳",
 "鄴侯外傳",
 "同昌公主傳",
 "梁四公記",
 "林靈素傳",
 "希夷先生傳",
 "梁清傳",
 "西王母傳",
 "魏夫人傳",
 "杜蘭香傳",
 "麻姑傳",
 "白猿傳",
 "柳毅傳",
 "李林甫外傳",
 "汧國夫人傳",
 "靈鬼志",
 "才鬼記",
 "太清樓侍宴記",
 "延福宮曲宴記",
 "保和殿曲宴記",
 "周秦行紀",
 "東城老父傳",
 "登西臺慟哭記",
 "東陽夜怪錄",
 "冥通記",
 "冥音錄",
 "三夢記",
 "古鏡記",
 "記錦裾",
 "甘澤謠",
 "夢遊錄",
 "續齊諧記",
 "春夢錄",
 "會真記",
 "諾臯記",
 "金剛經鳩異",
 "集異志",
 "異聞實錄",
 "靈異小錄",
 "異苑",
 "幽明錄",
 "續幽明錄",
 "搜神記",
 "搜神後記",
 "稽神錄",
 "幽怪錄",
 "續幽怪錄",
 "窮怪錄",
 "玄怪記",
 "續玄怪錄",
 "志怪錄",
 "吉凶影響錄",
 "靈應錄",
 "聞奇錄",
 "錄異記",
 "纂異記",
 "采異記",
 "乘異記",
 "廣異記",
 "獨異志",
 "甄異記",
 "徂異記",
 "祥異記",
 "近異錄",
 "旌異記",
 "冥祥記",
 "集靈記",
 "太清記",
 "妖化錄",
 "宣驗記",
 "睽車志",
 "鬼國記",
 "壠上記",
 "雲仙雜記",
 "清異錄",
 "正學編",
 "元圖大衍",
 "周易稽疑",
 "周易會占",
 "讀史訂疑",
 "書傳正誤",
 "莊子闕誤",
 "草木子",
 "豢龍子",
 "觀微子",
 "海樵子",
 "沆瀣子",
 "郁離子微",
 "潛溪邃言",
 "蘿山雜言",
 "何子雜言",
 "華川巵辭",
 "青巖叢錄",
 "廣成子解",
 "續志林",
 "冥影契",
 "宵練匣",
 "玄機通",
 "求志編",
 "遒徇編",
 "海涵萬象錄",
 "補衍",
 "機警",
 "筆疇",
 "古言",
 "燕書",
 "庸書",
 "松窗寤言",
 "後渠漫記",
 "仰子遺語",
 "蒙泉雜言",
 "槎菴燕語",
 "容臺隨筆",
 "未齋雜言",
 "南山素言",
 "類博雜言",
 "思玄庸言",
 "東田辠言",
 "侯城雜誡",
 "西原約言",
 "凝齋筆語",
 "方山紀述",
 "經世要談",
 "儼山纂錄",
 "奇子雜言",
 "拘虛晤言",
 "文昌旅語",
 "鷄鳴偶記",
 "讀書筆記",
 "汲古叢語",
 "遵聞錄",
 "賢識錄",
 "保孤記",
 "祕錄",
 "明良記",
 "明臣十節",
 "明輔起家考",
 "翊運錄",
 "遜國記",
 "革除遺事",
 "擁絮迂談",
 "天順日錄",
 "九朝野記",
 "玉池談屑",
 "嵩陽雜識",
 "溶溪雜記",
 "郊外農談",
 "冶城客論",
 "西臯雜記",
 "滄江野史",
 "澤山雜記",
 "沂陽日記",
 "海上紀聞",
 "孤樹褎談",
 "西墅雜記",
 "藩獻記",
 "琬琰錄",
 "瑣綴錄",
 "代醉編",
 "明興雜記",
 "水東記略",
 "玉壼遐覽",
 "良常仙系記",
 "賜遊西苑記",
 "延休堂漫錄",
 "濯纓亭筆記",
 "錦衣志",
 "馬政志",
 "冀越通",
 "邊紀略",
 "醫閭漫記",
 "征藩功次",
 "兵符節制",
 "十家牌法",
 "保民訓要",
 "備倭事略",
 "雲中事記",
 "南巡日錄",
 "北還錄",
 "北使錄",
 "北征事蹟",
 "平夷錄",
 "平定交南錄",
 "撫安東夷記",
 "哈密國王記",
 "滇南慟哭記",
 "渤泥入貢記",
 "琉球使略",
 "日本寄語",
 "朝鮮紀事",
 "建州女直考",
 "否泰錄",
 "遇恩錄",
 "彭公筆記",
 "庭聞述略",
 "今言",
 "皇明盛事",
 "雙槐歲抄",
 "後渠雜識",
 "古穰雜錄",
 "震澤紀聞",
 "菽園雜記",
 "莘野纂聞",
 "駒陰冗記",
 "客座新聞",
 "枝山前聞",
 "尊俎餘功",
 "漱石閒談",
 "平江記事",
 "南翁夢錄",
 "公餘日錄",
 "中洲野錄",
 "三餘贅筆",
 "懸笥瑣探",
 "蘇談",
 "庚巳編",
 "續巳編",
 "長安客話",
 "快雪堂漫錄",
 "雲夢藥溪談",
 "聞雁齋筆談",
 "鬱岡齋筆麈",
 "胡氏雜說",
 "劉氏雜志",
 "丹鉛雜錄",
 "書肆說鈴",
 "田居乙記",
 "碧里雜存",
 "聽雨紀談",
 "宦遊紀聞",
 "意見",
 "識小編",
 "語言談",
 "子元案垢",
 "西樵野記",
 "寒檠膚見",
 "語窺今古",
 "詢蒭錄",
 "新知錄",
 "涉異志",
 "前定錄補",
 "維園鉛擿",
 "攬茝微言",
 "墨池浪語",
 "雪濤談叢",
 "世說舊注",
 "簷曝偶談",
 "病逸漫記",
 "東谷贅言",
 "篷軒別記",
 "蓬窗續錄",
 "瑯琊漫抄",
 "高坡異纂",
 "水南翰記",
 "藜牀瀋餘",
 "夢餘錄",
 "祐山雜說",
 "江漢叢談",
 "投甕隨筆",
 "洗硯新錄",
 "丑庄日記",
 "輟築記",
 "雙溪雜記",
 "二酉委譚",
 "窺天外乘",
 "百可漫志",
 "近峯聞略",
 "近峯記略",
 "寓圃雜記",
 "青溪暇筆",
 "方洲雜錄",
 "遼邸記聞",
 "宛委餘編",
 "無用閒談",
 "逌旃璅言",
 "井觀瑣言",
 "林泉隨筆",
 "推蓬寤語",
 "讕言長語",
 "震澤長語",
 "桑榆漫志",
 "延州筆記",
 "戒菴漫筆",
 "暖姝由筆",
 "農田餘話",
 "雨航雜錄",
 "菊坡叢語",
 "玄亭涉筆",
 "野航史話",
 "西峯淡話",
 "大賓辱語",
 "抱璞簡記",
 "寶櫝記",
 "脚氣集",
 "望崖錄",
 "燕閒錄",
 "閒中今古錄",
 "綠雪亭雜言",
 "春風堂隨筆",
 "雲蕉館紀談",
 "蒹葭堂雜抄",
 "鳳凰臺記事",
 "天爵堂筆餘",
 "壁疏",
 "譚輅",
 "戲瑕",
 "麈餘",
 "談剩",
 "雲林遺事",
 "比事摘錄",
 "墐戶錄",
 "䖷籛𤭏筆",
 "病榻手欥",
 "記事珠",
 "俗呼小錄",
 "名公像記",
 "傷逝記",
 "景仰撮書",
 "仰山脞錄",
 "見聞紀訓",
 "先進遺風",
 "畜德錄",
 "新倩籍",
 "國寶新編",
 "西州合譜",
 "兒世說",
 "女俠傳",
 "雨航紀",
 "入蜀紀見",
 "黃山行六頌",
 "南陸志",
 "貴陽山泉志",
 "雲南山川志",
 "金陵冬遊記略",
 "廬陽客記",
 "居山雜志",
 "武夷游記",
 "太湖泉志",
 "半塘小志",
 "諸寺奇物記",
 "西干十寺記",
 "西浮籍",
 "楚小志",
 "朔雪北征記",
 "烏蠻瀧夜談記",
 "邊堠紀行",
 "滇行紀略",
 "銀山鐵壁謾談",
 "游台宕路程",
 "榕城隨筆",
 "西吳枝乘",
 "禮白嶽紀",
 "居家制用",
 "清齋位置",
 "鼂采清課",
 "巖棲幽事",
 "玉壺冰",
 "帝城景物略",
 "賞心樂事",
 "武陵競渡略",
 "清閑供",
 "林下盟",
 "田家曆",
 "古今諺",
 "畫舫約",
 "南陔六舟記",
 "宛陵二水評",
 "明經會約",
 "讀書社約",
 "林間社約",
 "勝蓮社約",
 "生日會約",
 "月會約",
 "紅雲社約",
 "紅雲續約",
 "浣俗約",
 "運泉約",
 "霞外雜俎",
 "韋弦佩",
 "禪門本草補",
 "蘇氏家語",
 "韻史",
 "陰符經解",
 "胎息經疏",
 "析骨分經",
 "醫先",
 "葬度",
 "居家宜忌",
 "放生辯惑",
 "寓林清言",
 "狂言紀略",
 "切韻射標",
 "發音錄",
 "讀書十六觀",
 "文章九命",
 "歌學譜",
 "三百篇聲譜",
 "談藝錄",
 "詩文浪談",
 "歸田詩話",
 "南濠詩話",
 "蓉塘詩話",
 "敬君詩話",
 "蜀中詩話",
 "麓堂詩話",
 "夷白齋詩話",
 "存餘堂詩話",
 "升菴辭品",
 "千里面譚",
 "詩家直說",
 "香宇詩談",
 "西園詩麈",
 "雪濤詩評",
 "閨秀詩評",
 "閒書杜律",
 "墨池璅錄",
 "書畫金湯",
 "論畫瑣言",
 "繪妙",
 "鄉射直節",
 "名劒記",
 "玉名詁",
 "紙箋譜",
 "箋譜銘",
 "十友圖贊",
 "水品",
 "煮泉小品",
 "茶譜",
 "茶解",
 "羅岕茶記",
 "岕茶箋",
 "茶寮記",
 "煎茶七類",
 "焚香七要",
 "文字飲",
 "醉鄉律令",
 "小酒令",
 "弈問",
 "弈旦評",
 "詩牌譜",
 "宣和牌譜",
 "壺矢銘",
 "朝京打馬格",
 "彩選百官鐸",
 "穎譜",
 "六博譜",
 "兼三圖",
 "數錢葉譜",
 "楚騷品",
 "嘉賓心令",
 "運掌經",
 "牌經",
 "馬吊脚例",
 "胟陣譜",
 "瓶史月表",
 "花曆",
 "花小名",
 "葯圃同春",
 "募種兩堤桃柳議",
 "草花譜",
 "亳州牡丹表",
 "牡丹八書",
 "記荔枝",
 "廣菌譜",
 "種芋法",
 "野菜箋",
 "雚經",
 "名馬記",
 "促織志",
 "海味索隱",
 "魚品",
 "廣寒殿記",
 "洞簫記",
 "周顛仙人傳",
 "一瓢道士傳",
 "醉叟傳",
 "拙效傳",
 "李公子傳",
 "楊幽妍別傳",
 "阿寄傳",
 "義虎傳",
 "倉庚傳",
 "煮茶夢記",
 "西玄青鳥記",
 "女紅餘志",
 "燕都妓品",
 "蓮臺仙會品",
 "廣陵女士殿最",
 "秦淮士女表",
 "曲中志",
 "金陵妓品",
 "秦淮劇品",
 "劇評",
 "艾子後語",
 "雪濤小說",
 "應諧錄",
 "笑禪錄",
 "談言",
 "權子",
 "雜纂三續",
 "經子法語",
 "古典錄略",
 "伏生尚書",
 "尚書大傳",
 "尚書璇機鈐",
 "孝經緯",
 "京房易傳",
 "五經要義",
 "春秋漢含",
 "春秋考異",
 "春秋說題",
 "春秋潛澤巴",
 "春秋符",
 "吳越春秋",
 "晉春秋",
 "晏子春秋",
 "雜志",
 "博物志",
 "續博物志",
 "東皋雜錄",
 "談壘",
 "明皇雜錄",
 "紀異錄",
 "洛中記異",
 "使遼錄",
 "談賓錄",
 "談錄",
 "見聞錄",
 "異聞錄",
 "松窗雜錄",
 "江南錄",
 "江南別錄",
 "靈怪錄",
 "集古目錄",
 "韓忠獻別錄",
 "隨隱漫錄",
 "古杭夢游錄",
 "南嶽記",
 "齊地記",
 "豫章記",
 "秦州記",
 "襄陽記",
 "盧山記",
 "青城山記",
 "嵩高山記",
 "華山記",
 "羅浮山記",
 "乘異錄",
 "玉箱雜記",
 "洞冥記",
 "續搜神記",
 "舊聞記",
 "東方朔記",
 "法顯記",
 "老學庵筆記",
 "筆記",
 "建炎以來朝野雜記",
 "老學庵續筆記",
 "藏一話腴",
 "雜纂",
 "雲溪友議",
 "談選",
 "讀子隨識",
 "尹文子",
 "管子",
 "庚桑子",
 "文子",
 "尸子",
 "墨子",
 "申子",
 "慎子",
 "劉子",
 "傅子",
 "淮南子",
 "廣知",
 "祖異志",
 "異物志",
 "華陽國志",
 "西域志",
 "陳留志",
 "名山志",
 "諸傳摘玄",
 "續仙傳",
 "仙傳拾遺",
 "王氏神仙傳",
 "高僧傳",
 "名臣傳",
 "烈士傳",
 "扶南傳",
 "杜蘭香別傳",
 "漢武內傳",
 "楊妃外傳",
 "鄴侯家傳",
 "韓詩外傳",
 "戎幙閒談",
 "牧豎閒談",
 "夢溪筆談",
 "錢唐遺事",
 "玉澗雜書",
 "野客叢書",
 "貴耳集",
 "捫蝨新話",
 "乙卯避暑錄",
 "抱朴子",
 "西溪叢語",
 "事始",
 "續事始",
 "意林",
 "鞏氏後耳目志",
 "洞天清祿集",
 "質龜論",
 "漢武帝別國洞冥記",
 "漁陽公石譜",
 "野人閑話",
 "愛日齋叢鈔",
 "坦齋筆衡",
 "打馬圖經",
 "逐昌山樵雜錄",
 "浩然齋意抄",
 "浩然齋視聽鈔",
 "視聽鈔",
 "洛中記異錄",
 "讀書愚見",
 "幽閒鼓吹",
 "植跋簡談",
 "葆光錄",
 "天隱子",
 "雲莊四六餘語",
 "清波別志",
 "麈史",
 "湘山野錄",
 "吹劍續錄",
 "續墨客揮犀",
 "逸史",
 "碧雲騢錄",
 "肯綮錄",
 "小說",
 "雲仙散錄",
 "高齋漫錄",
 "逐初堂書目",
 "東坡手澤",
 "岩下放言",
 "雋永錄",
 "拾遺記",
 "紫微雜記",
 "侯鯖錄",
 "趙飛燕別傳",
 "豪異祕纂",
 "傳記雜編",
 "青塘錄",
 "省心詮要",
 "酉陽雜俎",
 "酉陽雜俎續集",
 "繙古叢編",
 "蟹略",
 "倦游錄",
 "野史",
 "琴書類集",
 "重編燕北錄",
 "異聞",
 "南窗紀談",
 "野說",
 "山水純全集",
 "化書",
 "宣靖妖化錄",
 "炙轂子雜錄",
 "陵陽先生室中語",
 "酬酢事變",
 "感知錄",
 "禮範",
 "靖康朝野僉言",
 "稿簡贅筆",
 "煬帝開河記",
 "讀北山酒經一篇",
 "平陳記",
 "田閒書",
 "子華子",
 "曾子",
 "孔叢子",
 "公孫龍子",
 "鬻子",
 "鄧析子",
 "韓非子",
 "聱隅子歔欷瑣微論",
 "程氏則古",
 "侍講日記",
 "安南行記",
 "漢孝武故事",
 "困學齋雜錄",
 "文子通玄真經",
 "聖武親征錄",
 "安雅堂酒令",
 "黥背吟集",
 "雪舟脞語",
 "甕天脞語",
 "資暇集",
 "史記法語",
 "蘭亭博議",
 "蘭譜奧法",
 "積善錄",
 "續積善錄",
 "景行錄",
 "漫堂隨筆",
 "真率記事",
 "瑣語",
 "韓魏公遺事",
 "韓魏公事",
 "范文正公遺事",
 "九河公語錄",
 "開顏錄",
 "觀時集",
 "神異記",
 "平泉山居記",
 "國史異纂",
 "續雞肋",
 "石湖菊譜",
 "史老圃菊譜",
 "范村梅譜",
 "芍藥譜",
 "亢倉子",
 "關尹子",
 "文中子",
 "揚子",
 "鬼谷子",
 "顏子",
 "老子",
 "暘谷漫錄",
 "無名公傳",
 "書訣墨藪",
 "記文譚",
 "雜說",
 "真誥",
 "蘇氏演義",
 "談助",
 "國史補",
 "青瑣後集",
 "士林紀實",
 "初學記",
 "六一筆記",
 "金坡遺事",
 "欒城遺言",
 "西疇常言",
 "諸集拾遺",
 "樵談",
 "學齋佔嗶",
 "試筆",
 "後山詩話",
 "師友雅言",
 "護法論",
 "金國志",
 "格古論",
 "竹坡詩話",
 "貢父詩話",
 "紫薇詩話",
 "世說",
 "武侯心書",
 "夢華錄",
 "漁樵問對",
 "白虎通德論",
 "燕翼詒謀錄",
 "金山志",
 "勸善錄",
 "夷堅志陰德",
 "效顰集",
 "中華古今註",
 "折獄龜鑑",
 "橫浦語錄",
 "續前定錄",
 "論衡",
 "隨筆",
 "名物蒙求",
 "性理字訓",
 "歷代蒙求",
 "史學提要",
 "帝王紀年纂要",
 "周顛仙傳",
 "平漢錄",
 "天潢玉牒",
 "雲南機務抄黃",
 "皇明平吳錄",
 "前北征錄",
 "後北征錄",
 "平蜀記",
 "北平錄",
 "海寇議前",
 "海寇後編",
 "成化間蘇材小纂",
 "蒙泉類博稿",
 "奉天刑賞錄",
 "國初事蹟",
 "洪武聖政記",
 "國初禮賢錄",
 "水東日記",
 "平胡錄",
 "海運編",
 "海道經",
 "附錄",
 "問水集",
 "呂梁洪志",
 "三吳水利論",
 "馬端肅公三記",
 "西征石城記",
 "興復哈密記",
 "廣右戰功",
 "西番事蹟",
 "北虜事蹟",
 "六詔紀聞",
 "平番始末",
 "茂邊紀事",
 "薛公讀書錄",
 "大復論",
 "浮物",
 "易大象說",
 "太藪外史",
 "居敬堂集",
 "乾坤鑿度",
 "附周易乾坤鑿度",
 "元包經傳",
 "元包數總義",
 "周易古占法",
 "京氏易傳",
 "麻衣道者正易心法",
 "孔子集語",
 "郭子翼莊",
 "三墳",
 "商子",
 "素履子",
 "竹書紀年",
 "潛虛發微論",
 "虎鈐經",
 "左國腴詞",
 "楚騷綺語",
 "太史華句",
 "兩漢雋言前集",
 "文選錦字錄",
 "明斷編",
 "演連珠編",
 "擬連珠編",
 "璅語編",
 "讕言編",
 "竹下寤言",
 "春雨堂隨筆",
 "損齋備忘錄",
 "守溪長語",
 "平吳錄",
 "東征紀行錄",
 "江海殲渠記",
 "大學古本傍釋",
 "大學石經古本旁釋",
 "申釋",
 "中庸古本旁釋",
 "附古本前引",
 "古本後申",
 "詩傳孔氏傳",
 "白沙語要",
 "空同子纂",
 "傳習則言",
 "后渠庸書",
 "陰陽管見",
 "客問",
 "擬詩外傳",
 "吳風錄",
 "理生玉鏡稻品",
 "藝菊書",
 "薛子道論",
 "彙堂摘奇",
 "海沂子",
 "廉矩",
 "文脈",
 "與物傳",
 "禮元剩語",
 "廣成子疏略",
 "陰符經疏略",
 "胎息經疏略",
 "邇言",
 "黎子雜釋",
 "辠言",
 "約言",
 "密箴",
 "閒說",
 "前定錄補遺",
 "紀述",
 "策樞",
 "泰熙錄",
 "仕意篇",
 "墅談",
 "書牘",
 "詩的",
 "法帖通解",
 "錢子語測法語篇",
 "錢子語測巽語篇",
 "禱雨雜記",
 "海石子",
 "廓然子五述",
 "易圖",
 "春雨逸響",
 "東溟蠡測",
 "丘隅意見",
 "參同契正文",
 "周易參同契",
 "隨筆兆",
 "天仙真訣",
 "四箴雜言",
 "闕里問答",
 "談輅",
 "輶軒使者絕代語釋別國方言",
 "釋名",
 "廣雅",
 "風俗通義",
 "刊誤",
 "古今注",
 "山海經",
 "後集",
 "雍錄",
 "汲冢周書",
 "漢武故事",
 "趙后外傳",
 "迷棲記",
 "六朝事迹編類",
 "越絕書",
 "劒俠傳",
 "博異記",
 "松漠紀聞",
 "新語",
 "賈子",
 "鹽鐵論",
 "潛夫論",
 "仲長統論",
 "徐幹中論",
 "人物志",
 "申鑒",
 "文心雕龍",
 "文章緣起",
 "騷壇祕語",
 "詩源撮要",
 "廣易千文",
 "異域志",
 "格古要論",
 "羣物奇制",
 "胎息經",
 "赤鳳髓",
 "煉形內旨",
 "玉函祕典",
 "金笥玄玄",
 "逍遙子導引訣",
 "脩真演義",
 "旣濟真經",
 "唐宋衛生歌",
 "益齡單",
 "怪疴單",
 "法書通釋",
 "畫評會海",
 "附唐名公山水訣",
 "天形道貌",
 "淇園肖影",
 "羅浮幻質",
 "九畹遺容",
 "春谷嚶翔",
 "繪林題識",
 "茹草編",
 "水品全秩",
 "茶品要錄",
 "附",
 "湯品",
 "易牙遺意",
 "綠綺新聲",
 "玉局鉤玄",
 "投壼儀節",
 "馬戲圖譜",
 "胟陣篇",
 "黃帝授三子玄女經",
 "黃帝宅經",
 "葬經",
 "探春歷記",
 "握奇經",
 "祿嗣奇談",
 "靈笈寶章",
 "相法十六篇",
 "四字經",
 "天文占驗",
 "占驗錄",
 "黃石公望空四字數",
 "魚經",
 "促織經",
 "農桑撮要",
 "芋經",
 "逸民傳",
 "梅墟先生別錄",
 "梅塢貽瓊",
 "五柳賡歌",
 "中峯禪師梅花百詠",
 "羣仙降乩語",
 "閒雲稿",
 "野人清嘯",
 "燎松吟",
 "尋芳咏",
 "千片雪",
 "鴛湖唱和稿",
 "山家語",
 "泛泖吟",
 "毛公壇倡和詩",
 "香奩詩草",
 "鶴月瑤笙",
 "青蓮觴咏",
 "香山酒頌",
 "唐宋元明酒詞",
 "狂夫酒語",
 "忍書",
 "忍書續編",
 "食色紳言",
 "家範",
 "許氏貽謀四則",
 "教家要略",
 "宗儀",
 "附家人箴",
 "增損呂氏鄉約",
 "增修藍田鄉約",
 "御製皇陵碑",
 "御製西征記",
 "御製平西蜀文",
 "御製孝慈錄",
 "御製紀夢",
 "御製周顛仙人傳",
 "御製廣寒殿記",
 "宣宗皇帝御製詩",
 "勅議或問",
 "諭對錄",
 "皇朝本記",
 "正統臨戎錄",
 "正統北狩事蹟",
 "古穰雜錄摘鈔",
 "聖駕南巡日錄",
 "大駕北還錄",
 "興復哈密國王記",
 "平夷賦",
 "平蠻錄",
 "西征日錄",
 "張司馬定浙二亂志",
 "雲南機務鈔黃",
 "安南傳",
 "勘處播州事情疏",
 "防邊紀事",
 "伏戎紀事",
 "撻虜紀事",
 "靖夷紀事",
 "綏廣紀事",
 "炎徼紀聞",
 "星槎勝覽",
 "瀛涯勝覽集",
 "奉使安南水程日記",
 "使琉球錄",
 "鴻猷錄",
 "治世餘聞錄",
 "繼世紀聞",
 "名卿績記",
 "靖難功臣錄",
 "國琛集",
 "續吳先賢讚",
 "明詩評",
 "吳郡二科志",
 "守溪筆記",
 "震澤長語摘抄",
 "彭文憲公筆記",
 "閒中今古錄摘抄",
 "玉堂漫筆摘鈔",
 "金臺紀聞摘鈔",
 "停驂錄摘鈔",
 "續停驂錄摘鈔",
 "豫章漫抄摘錄",
 "科場條貫",
 "水東日記摘鈔",
 "餘冬緒錄摘鈔",
 "鳳洲雜編",
 "譯語",
 "君子堂日詢手鏡",
 "四友齋叢說摘鈔",
 "菽園雜記摘鈔",
 "留青日札摘鈔",
 "松窗寤言摘錄",
 "漫記",
 "近峯記略摘鈔",
 "星變志",
 "瑯琊漫鈔摘錄",
 "病榻遺言",
 "縣笥瑣探摘鈔",
 "前聞記",
 "蒹葭堂雜著摘抄",
 "二酉委譚摘錄",
 "江西輿地圖說",
 "饒南九三府圖說",
 "奇聞類紀摘鈔",
 "新知錄摘鈔",
 "古三墳",
 "大戴禮記",
 "元經薛氏傳",
 "逸周書",
 "新序",
 "說苑",
 "新書",
 "法言",
 "中論",
 "劉子新論",
 "王子年拾遺記",
 "通占大象曆星經",
 "易傳",
 "焦氏易林",
 "孝傳",
 "方言",
 "博雅",
 "十六國春秋",
 "飛燕外傳",
 "雜事祕辛",
 "羣輔錄",
 "神僊傳",
 "心書",
 "孫子",
 "淮南鴻烈解",
 "孔叢",
 "附詰墨",
 "抱朴子內篇",
 "外篇",
 "中說",
 "天祿閣外史",
 "盬鐵論",
 "伽藍記",
 "三國志辨誤",
 "蓮社高賢傳",
 "准南鴻烈解",
 "列子",
 "傳子",
 "道德經評注",
 "世本",
 "道德指歸論",
 "周髀算經",
 "附音義",
 "山海經圖讚",
 "補遺",
 "於陵子",
 "銅劒讚",
 "靈寶真靈位業圖",
 "周氏冥通記",
 "周易鄭康成注",
 "易解附錄",
 "南唐書",
 "附音釋",
 "批點考工記",
 "檀孟批點",
 "六韜",
 "陳眉公訂正祕笈",
 "雲烟過眼錄",
 "雲烟過眼續錄",
 "娑羅館清言",
 "娑羅館逸稿",
 "續娑羅館清言",
 "續集",
 "陳眉公家藏祕笈續函",
 "朱文公政訓",
 "真西山政訓",
 "談苑",
 "荊溪林下偶談",
 "元始上真眾仙記",
 "无上祕要",
 "鶴山渠陽讀書雜抄",
 "脈望",
 "賢弈編",
 "皇明吳郡丹青志",
 "耄餘雜識",
 "西堂日記",
 "知命錄",
 "疑仙傳",
 "四夷考",
 "慎言集訓",
 "長松茹退",
 "虎薈",
 "長水日鈔",
 "三事遡真",
 "銷夏部",
 "辟寒部",
 "廣集",
 "陳眉公家藏廣祕笈",
 "丙丁龜鑑",
 "續錄",
 "滄浪嚴先生詩談",
 "遊城南記",
 "經外雜鈔",
 "還寃志",
 "風月堂詩話",
 "武林舊事",
 "老子解",
 "牋紙譜",
 "庚申外史",
 "傳疑錄",
 "薛文清公從政錄",
 "丹鉛續錄",
 "飲食紳言",
 "男女紳言",
 "蔬疏附水草",
 "瓜疏",
 "荳疏",
 "竹疏",
 "蠙衣生馬記",
 "蠙衣生劍記",
 "邵康節先生外紀",
 "鼂采館清課",
 "金丹四百字解",
 "普集",
 "陳眉公普祕笈一集",
 "草木鳥獸蟲魚疏",
 "臥遊錄",
 "問答錄",
 "漁樵閒話錄",
 "遊名山記",
 "召對錄",
 "許然明先生茶疏",
 "真珠船",
 "同異錄",
 "駢語雕龍",
 "會仙女誌",
 "孝經",
 "說孝三書",
 "虞子集靈節略",
 "孝經引證",
 "孝經宗旨",
 "祈嗣真詮",
 "備倭圖記",
 "薛方山紀述",
 "山行雜記",
 "冬官紀事",
 "聽心齋客問",
 "渾然子",
 "方洲雜言",
 "酒史",
 "遼陽圖記",
 "勦奴議撮",
 "彙集",
 "陳眉公家藏彙祕笈",
 "蟾仙解老　",
 "道德寶章",
 "靖康緗素雜記",
 "鍾呂二仙傳",
 "金丹詩訣",
 "南獄遇師本末",
 "葛稚川內篇",
 "周易尚占",
 "明誠意伯連珠",
 "海語",
 "異魚圖贊",
 "江隣幾雜誌",
 "支談",
 "問奇集",
 "祝子小言　",
 "環碧齋小言",
 "夢溪補筆談",
 "方洲先生奉使錄",
 "黃帝祠額解",
 "天目遊記",
 "游喚",
 "黃白鏡",
 "一庵雜問錄",
 "新鋟煙波釣徒奇門定局",
 "燕市雜詩",
 "建州女真考",
 "文湖州竹派",
 "祕集",
 "眉公雜著",
 "珍珠船",
 "妮古錄",
 "偃曝談餘",
 "太平清話",
 "書蕉",
 "安得長者言",
 "狂夫之言",
 "讀書鏡",
 "張宛邱詩說",
 "詩攷",
 "詩地理攷",
 "爾雅",
 "絕代語釋別國方言",
 "急就篇",
 "埤雅",
 "韻學事類",
 "文會堂詞韻",
 "綵線貫明珠秋檠錄",
 "官級由陞",
 "官禮制攷",
 "招擬假如行移體式",
 "大明律圖",
 "律例類鈔",
 "讀律歌",
 "瑣言摘附",
 "問刑條例",
 "名例律",
 "刑統賦",
 "華夷風土志",
 "天地萬物造化論",
 "黃石公素書",
 "諸子續要",
 "呂氏官箴",
 "士範",
 "慎言集",
 "厚生訓纂",
 "赤松子中誡經",
 "長春劉真人語錄",
 "類修要訣",
 "續附",
 "養生類纂",
 "養生月覽",
 "保生心鑒",
 "攝生集覽",
 "攝生要義",
 "錦身機要指源篇",
 "附大道修真捷要選仙指源篇",
 "禪學",
 "禪宗指要",
 "證佛名譚",
 "風俗通",
 "寰宇雜記",
 "三家雜纂",
 "袖中錦",
 "歲時廣記",
 "圖說",
 "寶貨辨疑",
 "古今事物考",
 "名物法言",
 "古今原始",
 "博古圖",
 "續文房圖贊",
 "文房清事",
 "茶具圖贊",
 "農桑輯要",
 "臞仙神隱",
 "山居四要",
 "農圃四書",
 "壽親養老書",
 "食物本草",
 "食鑒本草",
 "金符經",
 "大明厤",
 "連珠厤",
 "附厤合覽",
 "趨避檢",
 "草木幽微經",
 "魏文帝詩格",
 "評詩格",
 "二南密旨",
 "文苑詩格",
 "詩議",
 "中序",
 "金鍼詩格",
 "續金鍼詩格",
 "梅氏詩評",
 "王少伯詩格",
 "詩人玉屑",
 "詩學規範",
 "詩法正宗",
 "詩宗正法眼藏",
 "詩法家數",
 "炙轂子詩格",
 "緣情手鑒詩格",
 "詩中旨格",
 "文彧詩格",
 "詩要格律",
 "詩家一指",
 "沙中金集",
 "詩文正法",
 "詩法正論",
 "黃氏詩法",
 "詩家集法",
 "木天禁語",
 "詩學禁臠",
 "雅道機要",
 "風騷要式",
 "處囊訣",
 "詩文要式",
 "詩中密旨",
 "流類手鑑",
 "六言詩集",
 "詩評",
 "詩學事類",
 "寸札粹編",
 "漢隸分韻",
 "書法三昧",
 "字學源流",
 "翰林要訣",
 "古字便覽",
 "字學備考",
 "篆法辨訣",
 "傳真祕要",
 "山房十友圖贊",
 "古今碑帖攷",
 "祝壽編年",
 "湯廷尉公餘日錄",
 "宦游紀聞",
 "首",
 "汴遊錄",
 "戒庵老人漫筆",
 "洹詞記事鈔",
 "續鈔",
 "保孤錄",
 "莊子南華真經",
 "楚辭",
 "三國志注鈔",
 "世說新語注鈔",
 "水經注鈔",
 "荀子",
 "醉鄉記",
 "品茶要錄補",
 "茶說",
 "書紳要語",
 "睡方書",
 "花寮",
 "雨窗隨喜",
 "清史",
 "迷仙志",
 "田園詩",
 "清涼帖",
 "花間碎事",
 "千古一朋",
 "揚州夢",
 "補",
 "樂府餘編",
 "酒考",
 "品茶八要",
 "香韻",
 "頌酒雜約",
 "療言",
 "貯書小譜",
 "書齋清事",
 "禪榻夢餘",
 "吳郡丹青志",
 "亳州牡丹志",
 "橘譜",
 "百菊集譜",
 "菊史補遺",
 "諸菊品目",
 "附茶具圖賛",
 "水辨",
 "茶經外集",
 "茶譜外集",
 "疏食譜",
 "禽蟲述",
 "檀弓記",
 "考工記註",
 "詩經",
 "孟子",
 "黃帝陰符經",
 "老子道德真經",
 "列子沖虛至德真經註",
 "廣成子註",
 "秋濤",
 "會心編",
 "光明藏",
 "醒言",
 "晉塵",
 "螢燈",
 "贅言",
 "月鏡",
 "滄漚集",
 "白雲梯",
 "驚筵辨",
 "鑑古瑣譚",
 "黃辭",
 "竹窗合筆",
 "雅述",
 "枕餘",
 "存論",
 "玉振",
 "郎川答問",
 "頂門針",
 "德山暑譚",
 "閒情十二憮",
 "鴛鴦譜",
 "悅容編",
 "姝聯",
 "姬侍類偶",
 "惑溺供",
 "雙門調",
 "睡鄉記",
 "含少論略",
 "擬易",
 "石桃丙舍草",
 "史遺",
 "書憲",
 "讀書通",
 "諸子斟淑",
 "觀老莊影響論",
 "測莊",
 "交友觀",
 "七輻菴",
 "九發",
 "錢詈",
 "客齋使令",
 "雅俗辨",
 "書史紀原",
 "花案",
 "十處士傳",
 "五獄臥遊",
 "文苑四史",
 "法楹",
 "碣石宮鬘語",
 "一聲鶯",
 "何之子",
 "秋籹樓眉判",
 "儒禪",
 "瀾堂夕話",
 "附偶書",
 "史輪",
 "無盡燈",
 "客邸麈談",
 "卽山論",
 "千一錄客談",
 "尋常事",
 "世書",
 "燕貽法錄",
 "家訓",
 "月唳",
 "秋水鏡",
 "臆見",
 "桂枝女子傳",
 "審是帙",
 "雜言",
 "花錫新命",
 "廣陵女士花殿最",
 "丹甑",
 "弋說",
 "璅言",
 "夢語",
 "雜記",
 "病中抽史",
 "反絕交論",
 "松霞館贅言",
 "獨鑒錄",
 "善易者言",
 "讀五胡載記",
 "蒲團上語",
 "青鏤管夢",
 "正法眼",
 "偶記",
 "倉庚集",
 "有情癡",
 "山遊十六觀",
 "蟲天志",
 "曲讌",
 "珠采",
 "照心犀",
 "士令",
 "學政",
 "長嘯餘",
 "嘔絲",
 "別論初本",
 "斷肉編",
 "瞻禮舍利記",
 "十影君傳",
 "解",
 "古握機經",
 "緯",
 "大學石經古本",
 "逸詩",
 "附論語會心詩",
 "天官書",
 "南華逸篇",
 "楚衡嶽神禹碑文",
 "漢滕公石𥕖銘",
 "吳季公碑",
 "史訇",
 "左逸",
 "小易",
 "𥨉凡",
 "䜈訷",
 "奇門賦專征",
 "附奇門數略",
 "勝義諦",
 "畫舫記",
 "瓶花譜",
 "投壼格",
 "絃子記",
 "偏安藝流",
 "明月編",
 "江花品藻",
 "泰淮士女表",
 "八段錦",
 "陳希夷坐功圖",
 "人極圖",
 "四大恩論",
 "無黨論",
 "孝經集註",
 "抄朱子劄言",
 "朱文公政訓摘要",
 "朱子學訓",
 "呂先生語錄",
 "講學大義",
 "研幾集略",
 "證人社約",
 "真西山政訓摘要",
 "偶言",
 "葉先生偶言",
 "呻吟語",
 "困知記",
 "魯鄒游記",
 "遠道隨筆",
 "疏稿",
 "奏疏",
 "儆學詩",
 "和儆學詩",
 "和儆學詩續集",
 "和朱文公感興詩",
 "秋興詩",
 "就正錄",
 "素園詩",
 "續詩譚",
 "詩譚續集",
 "名宦錄",
 "鄉賢錄",
 "春秋陰陽",
 "洪範五行傳",
 "太玄經",
 "易略例",
 "魏氏春秋",
 "元經傳",
 "白虎通",
 "通俗論",
 "楚辭章句",
 "昌言",
 "文章流別",
 "文中子中說",
 "賈長沙集",
 "董膠西集",
 "劉子政集",
 "揚侍郎集",
 "劉子駿集",
 "班蘭臺集",
 "崔亭伯集",
 "張河澗集",
 "荀侍中集",
 "蔡中郎集",
 "孔少府集",
 "諸葛武侯集",
 "魏武帝集",
 "魏文帝集",
 "陳思王集",
 "陳記室集",
 "王侍中集",
 "阮元瑜集",
 "應休璉集",
 "阮步兵集",
 "嵇中散集",
 "杜征南集",
 "潘黃門集",
 "陸平原集",
 "劉越石集",
 "郭弘農集",
 "陶彭澤集",
 "何衡陽集",
 "謝康樂集",
 "顏光祿集",
 "鮑參軍集",
 "王寧朔集",
 "孔詹事集",
 "梁武帝集",
 "梁簡文帝集",
 "梁元帝集",
 "昭明太子集",
 "江文通集",
 "沈隱候集",
 "陶通明集",
 "任中丞集",
 "王戶丞集",
 "庾度支集",
 "徐僕射集",
 "江令尹集",
 "庾開府集",
 "王司空集",
 "盧武陽集",
 "薛司隸集",
 "詩序辨說",
 "詩外傳",
 "毛詩草木鳥獸蟲魚疏廣要",
 "蘇氏易傳",
 "周易集解",
 "易釋文",
 "周易集解略例",
 "通鑑地理通釋",
 "通鑑問疑",
 "小學紺珠",
 "漢制攷",
 "佛說四十二章經",
 "青烏先生葬經",
 "古本葬經內篇",
 "附葬經翼",
 "難解二十四篇",
 "圖",
 "古文參同契集解",
 "箋註集解",
 "三相類集解",
 "全唐詩話",
 "六一詩話",
 "彥周詩話",
 "中山詩話",
 "續詩話",
 "法書要錄",
 "東觀餘論",
 "廣川書跋",
 "宣和書譜",
 "圖畫見聞誌",
 "歷代名畫記",
 "宣和畫譜",
 "圖繪寶鑑",
 "後畫錄",
 "續畫品",
 "畫繼",
 "詩品二十四則",
 "玉蘂辨證",
 "誠齋襍記",
 "却掃編",
 "瑯嬛記",
 "輟耕錄",
 "淳熙玉堂雜記",
 "拾遺",
 "東坡題跋",
 "山谷題跋",
 "无咎題跋",
 "宛丘題跋",
 "淮海題跋",
 "鶴山題跋",
 "放翁題跋",
 "姑溪題跋",
 "石門題跋",
 "西山題跋",
 "六一題跋",
 "元豐題跋",
 "水心題跋",
 "益公題跋",
 "後邨題跋",
 "止齋題跋",
 "魏公題跋",
 "晦菴題跋",
 "容齋題跋",
 "海岳題跋",
 "樂府古題要解",
 "癸辛雜識前集",
 "別集",
 "紹興內府古器評",
 "揮麈前錄",
 "三錄",
 "餘話",
 "齊東野語",
 "河南邵氏聞見前錄",
 "河南邵氏聞見後錄",
 "潛虗",
 "算經",
 "附握奇續經圖",
 "八陳總述",
 "桂海巖洞志",
 "桂海金石志",
 "桂海香志",
 "桂海酒志",
 "桂海器志",
 "桂海禽志",
 "桂海獸志",
 "桂海蟲魚志",
 "桂海花志",
 "桂海果志",
 "桂海草木志",
 "桂海雜志",
 "桂海蠻志",
 "桂海花木志",
 "王照新志",
 "唐書糾繆",
 "易說",
 "二老堂雜誌",
 "東南防守利便",
 "楊公筆錄",
 "華陽宮記事",
 "續千文",
 "語助",
 "風水問答",
 "地理正言",
 "保產育嬰錄",
 "丹溪治痘要法",
 "備急海上仙方",
 "聯句詩紀",
 "往哲錄",
 "避戎夜話",
 "二科志",
 "稗傳",
 "瑯琊漫鈔",
 "日本國考略",
 "女範",
 "刺繡圖",
 "李夫人傳",
 "趙夫人傳",
 "薛靈芸傳",
 "馮淑妃傳",
 "麗姬傳",
 "上官昭容傳",
 "鬱輪袍傳",
 "女冠耿先生傳",
 "菊部頭傳",
 "陳盻兒傳",
 "耿聽聲傳",
 "王昭君傳",
 "杜秋傳",
 "潘妃傳",
 "太真外傳",
 "黑心符",
 "樂昌公主傳",
 "西閣寄梅記",
 "香車和雪記",
 "聯芳樓記",
 "桃帕傳",
 "滁婦傳",
 "鶯鶯傳",
 "賈午傳",
 "陳子高傳",
 "王魁傳",
 "丹青扇記",
 "金縷裙記",
 "離䰟記",
 "賈雲華還魂記",
 "櫻桃青衣傳",
 "渭塘奇遇傳",
 "司馬才仲傳",
 "見夢記",
 "崔護傳",
 "玉簫傳",
 "鞦韆會記",
 "夜冡決賭記",
 "吳女紫玉傳",
 "遠烟記",
 "金鳳釵記",
 "牡丹燈記",
 "綠衣人傳",
 "任氏傳",
 "小蓮記",
 "獵狐記",
 "袁氏傳",
 "秦女賣枕記",
 "聚景園記",
 "崔玄微記",
 "趙喜奴傳",
 "韋十娘傳",
 "崔書生傳",
 "柳參軍傳",
 "王玄之傳",
 "桃花仕女傳",
 "江亭龍女傳",
 "蓮塘二姬傳",
 "南樓美人傳",
 "紅裳女子傳",
 "龐娥親傳",
 "蘇娥訴寃記",
 "姚江曹娥碑",
 "六烈女傳",
 "七烈傳",
 "烈女傳",
 "紅線傳",
 "崑崙奴傳",
 "聶隱娘傳",
 "織女星傳",
 "三女星傳",
 "天上玉女記",
 "裴諶傳",
 "薛昭傳",
 "華嶽神女記",
 "嵩嶽嫁女記",
 "紫姑神傳",
 "張女郎傳",
 "翔風傳",
 "章臺柳傳",
 "燕子樓傳",
 "錦字書",
 "却要傳",
 "狄氏傳",
 "河間傳",
 "湯賽師傳",
 "董漢州女傳",
 "續侍兒小名錄",
 "三續侍兒小名錄",
 "四續侍兒小名錄",
 "蘇小小傳",
 "薛濤傳",
 "歐陽詹傳",
 "馬湘蘭傳",
 "小青傳",
 "啞倡志",
 "楊娼傳",
 "蘇小娟傳",
 "嚴蘂傳",
 "王幼玉記",
 "教鄧子弟詔",
 "不封外戚詔",
 "又報章帝詔",
 "下田益宗令",
 "賜崔亮璽書",
 "訪祖越王墳狀",
 "上元皇后誄表",
 "讓長秋宮表",
 "為夫請戍邊自贖表",
 "乞歸巰",
 "奏牋成帝",
 "報漢元帝",
 "上宣帝書",
 "為父上書",
 "為兄上書",
 "問上元夫人書",
 "答西王母書",
 "與楊夫人袁氏書",
 "答卞夫人書",
 "與相如書",
 "答夫秦嘉書",
 "再答夫秦嘉書",
 "答夫許邁書",
 "與子宇文護書",
 "答趙象書",
 "授楊羲書",
 "題留新嘉驛壁詩序",
 "望湖亭題壁詩自序",
 "金石錄後序",
 "觀音大士傳",
 "牛應貞傳",
 "論語贊",
 "鬱金頌",
 "司馬相如誄",
 "張愈誄",
 "祭夫徐敬業文",
 "花瑣事",
 "辭咏",
 "胡笳十八拍",
 "十索",
 "白頭吟",
 "子夜歌",
 "居家儀禮",
 "遵生寶訓",
 "座右箴言",
 "經鋤雜志",
 "視履約",
 "食觀酒鑒",
 "模世語",
 "大藏治病藥",
 "論相",
 "陽宅論",
 "種果疏",
 "種藥疏",
 "養蠶經",
 "納貓經",
 "田牧志",
 "紀曆撮要",
 "探春曆記",
 "俗事方",
 "四時攝生消息論",
 "按摩導引訣",
 "治萬病坐功訣",
 "守庚申法",
 "絕三尸符咒",
 "服食方",
 "解百毒方",
 "相宅要說",
 "選擇曆說",
 "三才避忌",
 "四時宜忌",
 "神咒錄",
 "續神咒錄",
 "醞造品",
 "法製品",
 "脯鮓品",
 "甜食品",
 "粉麪品",
 "粥麋品",
 "製蔬品",
 "饌客約",
 "陽冰筆法",
 "俗考",
 "庚己編",
 "續己編",
 "可齋雜記",
 "新刻水陸路程便覽",
 "擇日便覽",
 "占驗書",
 "周易",
 "廬山草堂記",
 "藝菊訣",
 "二六課",
 "月令演",
 "仙靈衞生歌",
 "醉吟先生傳",
 "桃花源記",
 "野簌品",
 "治病藥",
 "四時歡",
 "種蔬疏",
 "五柳傳",
 "研譜",
 "畫譜梅",
 "放生辨惑",
 "探春歷紀",
 "孟浩然傳",
 "服氣法",
 "拈屏語",
 "周易議卦",
 "讀書叢說",
 "尚書蔡註考誤",
 "禹貢圖註",
 "古文尚書考",
 "尚書古文辨",
 "詩經協韻考異",
 "毛詩或問",
 "詩問略",
 "春秋集傳微旨",
 "春秋金鎖匙",
 "春秋胡傳考誤",
 "讀左漫筆",
 "春秋日食質疑",
 "禮經奧旨",
 "三禮考",
 "月令七十二候集解",
 "周禮五官考",
 "三禮指要",
 "檀弓訂誤",
 "讀禮志疑",
 "大學發微",
 "大學本旨",
 "中庸指歸",
 "中庸分章",
 "孔子論語年譜",
 "孟子年譜",
 "孝經集靈",
 "訂正史記真本",
 "讀史漫筆",
 "兩漢解疑",
 "三國雜事",
 "兩晉解疑",
 "五胡十六國考鏡",
 "南北朝襍記",
 "隋史斷",
 "新舊唐書雜論",
 "唐史論斷",
 "安祿山事蹟",
 "平巢事蹟考",
 "鑑誡錄",
 "南唐拾遺記",
 "涑水記聞",
 "西夏事略",
 "五代春秋",
 "靖康紀聞",
 "張邦昌事略",
 "劉豫事迹",
 "北狩見聞錄",
 "北狩行錄",
 "南燼紀聞錄",
 "竊憤錄",
 "阿計替傳",
 "南遷錄",
 "陳張事略",
 "元史備忘錄",
 "明氏實錄",
 "天啟宮詞",
 "宋景文雜說",
 "晁氏儒言",
 "讀書錄存遺",
 "勤有堂隨錄",
 "郁離子",
 "錢子測語",
 "甘泉新論",
 "心齋約言",
 "桑子庸言",
 "學古瑣言",
 "儼山外纂",
 "海涵萬象",
 "二谷讀書記",
 "澹齋內言",
 "外言",
 "日錄裏言",
 "常語筆存",
 "學術辨",
 "業儒臆說",
 "孝詩",
 "白鹿書院教規",
 "程董二先生學則",
 "萬柳溪邊舊話",
 "諭僚屬文",
 "諭俗文",
 "東谷隨筆",
 "集慶路江東書院講義",
 "鄭氏規範",
 "建文忠節錄",
 "楊忠愍公遺筆",
 "元祐黨籍碑考",
 "慶元偽學黨籍",
 "人譜正篇",
 "續篇",
 "三篇",
 "庭幃雜錄",
 "家誡要言",
 "初學備忘",
 "東林始末",
 "溫氏母訓",
 "教習堂條約",
 "翰苑遺事",
 "歷代銓政要略",
 "官爵志",
 "歷代銓選志",
 "捕蝗考",
 "旗軍志",
 "楊公政績紀",
 "邦計彙編",
 "拯荒事略",
 "救荒事宜",
 "煮粥條議",
 "元海運志",
 "鹽法考略",
 "錢法纂要",
 "國賦紀略",
 "明漕運志",
 "御試備官日記",
 "東宮備覽",
 "歷代關巿征稅記",
 "貢舉敍略",
 "歷代貢舉志",
 "樂律舉要",
 "學科考略",
 "文廟從祀先賢先儒考",
 "臚傳紀事",
 "歷代郊祀志",
 "紀琉球入太學始末",
 "陽明先生鄉約法",
 "陽明先生保甲法",
 "莅戎要略",
 "歷代車戰敍略",
 "歷代武舉考",
 "保越錄",
 "平濠記",
 "歷代馬政志",
 "備倭記",
 "明倭寇始末",
 "江防總論",
 "海防總論",
 "江防集要",
 "海防集要",
 "江防述略",
 "海防述略",
 "棠陰比事原編",
 "續編",
 "補編",
 "刑法敍略",
 "續刑法敍略",
 "折獄巵言",
 "河源記",
 "河防記",
 "常熟水論",
 "兩宮鼎建記",
 "西北水利議",
 "明江南治水記",
 "浮梁陶政志",
 "景鎮舊事",
 "文章緣起註",
 "續文章緣起",
 "夔溪詩話",
 "玉壼詩話",
 "容齋詩話",
 "容齋四六叢談",
 "詩讞",
 "姜氏詩說",
 "吳氏詩話",
 "對牀夜話",
 "東坡文談錄",
 "東坡詩話錄",
 "製曲十六觀",
 "文原",
 "夢蕉詩話",
 "餘冬詩話",
 "全唐詩說",
 "文評",
 "藝圃擷餘",
 "顧曲雜言",
 "佘山詩話",
 "玉笥詩談",
 "棗林藝簣",
 "聲韻叢說",
 "唐詩談叢",
 "恬致堂詩話",
 "師友詩傳錄",
 "詞統源流",
 "詞藻",
 "漫堂說詩",
 "詞壇紀事",
 "詞家辨證",
 "論學三說",
 "四六金針",
 "南州草堂詞話",
 "集唐要法",
 "北窗炙輠錄",
 "宋景文筆記",
 "西畬瑣錄",
 "退軒筆錄",
 "蘆浦筆記",
 "王氏三錄",
 "甲申雜錄",
 "木筆雜鈔",
 "梁谿漫志",
 "醴泉筆錄",
 "養疴漫筆",
 "鶴山筆錄",
 "志雅堂雜鈔",
 "誠齋揮麈錄",
 "後山叢談",
 "二老堂雜志",
 "羅氏識遺",
 "歸潛志",
 "佩韋齋輯聞",
 "北軒筆記",
 "學易居筆錄",
 "漱石軒筆記",
 "遂昌山樵雜錄",
 "蔗山筆麈",
 "琅琊漫鈔",
 "敝帚軒剩語",
 "瓶花齋雜錄",
 "秋涇筆乘",
 "苹野纂聞",
 "餘菴雜錄",
 "石田雜記",
 "簣齋雜著",
 "寒夜錄",
 "格物麤談",
 "月下偶談",
 "辨誤錄",
 "文苑英華辨證",
 "野服攷",
 "文待詔題跋",
 "辨物小志",
 "男子雙名記",
 "婦女雙名記",
 "方言據",
 "秦璽始末",
 "與古人書",
 "歷代甲子考",
 "改元考同",
 "握蘭軒隨筆",
 "諡法考",
 "孔子弟子考",
 "孔子門人考",
 "孟子弟子考",
 "姓氏考略",
 "課業餘談",
 "廣事同纂",
 "文房四譜",
 "星象考",
 "學醫隨筆",
 "古今畫鑑",
 "寓意編",
 "印章集說",
 "蕉窗九錄",
 "紙錄",
 "墨錄",
 "筆錄",
 "硯錄",
 "帖錄",
 "書錄",
 "畫錄",
 "畫訣十則",
 "琴錄．一卷",
 "琴聲十六法",
 "香錄一撰",
 "文具雅編",
 "青烏緒言",
 "弈史",
 "琴言十則",
 "附指法譜",
 "篆學指南",
 "上池雜說",
 "飛鳧語略",
 "筠軒清閟錄",
 "沈氏農書",
 "老圃良言",
 "裝潢志",
 "書法粹言",
 "說硯",
 "北墅抱瓮錄",
 "延壽第一紳言",
 "林泉結契",
 "爐火監戒錄",
 "攝生消息論",
 "飲食須知",
 "饌史",
 "修齡要指",
 "二六功課",
 "攝生要語",
 "養生膚語",
 "攝生三要",
 "花裏活",
 "養小錄",
 "怡情小錄",
 "馬氏日抄",
 "居易錄談",
 "續談",
 "燕臺筆錄",
 "京東考古錄",
 "封長白山記",
 "先聖廟林記",
 "山左筆談",
 "山東考古錄",
 "遊勞山記",
 "嘉禾百咏",
 "夢粱錄",
 "華陽宮紀事",
 "豫志",
 "秦錄",
 "晉錄",
 "楚書",
 "益部談資",
 "臺灣隨筆",
 "廣州遊覽小志",
 "遊羅浮記",
 "桂林風土記",
 "成都遊宴記",
 "滇記",
 "滇遊記",
 "黔志",
 "黔遊記",
 "使西域記",
 "西南夷風土記",
 "朝鮮國紀",
 "西方要紀",
 "西陲聞見錄",
 "安南雜記",
 "遊具雅編",
 "三百篇鳥獸草木記",
 "二十一史徵",
 "黜朱梁紀年論",
 "釋奠考",
 "喪禮雜說常禮雜說",
 "喪服或問",
 "錦帶連珠",
 "操觚十六觀",
 "十七帖述",
 "龜臺琬琰",
 "稚黃子",
 "東江子",
 "續證人社約誡",
 "高氏塾鐸",
 "餘慶堂十二戒",
 "猶見篇",
 "七勸口號",
 "元寶公案",
 "聯莊",
 "聯騷",
 "鶴齡錄",
 "新婦譜",
 "新婦譜補",
 "美人譜",
 "婦人鞋襪考",
 "七療",
 "鬱單越頌",
 "地理驪珠",
 "雁山雜記",
 "越問",
 "真率會約",
 "酒律",
 "酒箴",
 "觴政五十則",
 "廣抑戒錄",
 "農具記",
 "怪石贊",
 "惕菴石譜",
 "端溪硯石考",
 "羽族通譜",
 "江南魚鮮品",
 "虎丘茶經注補",
 "荔枝話",
 "逸亭易論",
 "孟子考",
 "人譜補圖",
 "教孝編",
 "仕的",
 "古觀人法",
 "古人居家居鄉法",
 "幼訓",
 "少學",
 "俗砭",
 "燕翼篇",
 "艾言",
 "訓蒙條例",
 "拙翁庸語",
 "醉筆堂三十六善",
 "七怪",
 "崋山經",
 "長白山錄",
 "水月令",
 "三江考",
 "黔中雜記",
 "苗俗紀聞",
 "念佛三昧",
 "佛解",
 "漁洋詩話",
 "文房約",
 "蕈溪自課",
 "讀書燈",
 "學畫淺說",
 "廣惜字說",
 "古歡社約",
 "彷圍清語",
 "鴛鴦牒",
 "裓菴黛史",
 "小星志",
 "豔體聯珠",
 "戒殺文",
 "九喜榻記",
 "行醫八事圖",
 "雪堂墨品",
 "漫堂墨品",
 "水坑石記",
 "琴學八則",
 "觀石錄",
 "紅朮軒紫泥法定本",
 "陽羨茗壺系",
 "洞山岕茶系",
 "桐堦副墨",
 "南村觴政",
 "鴿經",
 "山林經濟策",
 "讀書法",
 "根心堂學規",
 "家塾座右銘",
 "洗塵法",
 "香雪齋樂事",
 "客齋使令反",
 "一歲芳華",
 "芸窗雅事",
 "菊社約",
 "豆腐戒",
 "清戒",
 "友約",
 "灌園十二師",
 "詩本事",
 "劍氣",
 "石交",
 "燈謎",
 "宦海慈航",
 "病約三章",
 "艮堂十戒",
 "婦德四箴",
 "半菴笑政",
 "書齋快事",
 "負卦",
 "古今外國名考",
 "廣東月令",
 "黔西古跡考",
 "明制女官考",
 "五獄約",
 "攬勝圖",
 "南極諸星考",
 "引勝小約",
 "酒警",
 "酒政六則",
 "酒約",
 "彷園酒評",
 "簋貳約",
 "小半斤謠",
 "四十張紙牌說",
 "選石記",
 "美人揉碎梅花迴文圖",
 "西湖六橋桃評",
 "竹連珠",
 "征南射法",
 "黃熟香者",
 "紀草堂十六宜",
 "課婢約",
 "報謁例言",
 "謟卦",
 "書本草",
 "貧卦",
 "花鳥春秋",
 "補花底拾遺",
 "玩月約",
 "飲中八仙令",
 "更定文章九命",
 "天官考異",
 "五行問",
 "學歷說",
 "進賢說",
 "塾講規約",
 "夙興語",
 "家人子語",
 "語小",
 "心病說",
 "日錄雜說",
 "觀宅四十吉祥相",
 "增訂心相百二十善",
 "竹溪雜述",
 "閒餘筆話",
 "暢春苑御試恭紀",
 "松溪子",
 "讀莊子法",
 "蒙養詩教",
 "謝皐羽（翱）年譜",
 "西華仙籙",
 "將就園記",
 "歙問",
 "黃山松石譜",
 "外國竹枝詞",
 "花底拾遺",
 "十眉謠",
 "秋星閣詩話",
 "而菴詩話",
 "製曲枝語",
 "書法約言",
 "戒賭文",
 "快說續紀",
 "廋詞",
 "酒社芻言",
 "嬾園觴政",
 "岕茶彙鈔",
 "硯林",
 "宣爐歌註",
 "牌譜",
 "三友棋譜",
 "兵仗記",
 "蘭言",
 "龍經",
 "毛朱詩說",
 "春秋三傳異同考",
 "讀禮問",
 "十六國年表",
 "北獄恆山歷祀上曲陽考",
 "江南星野辨",
 "三年服制考",
 "師友行輩議",
 "國朝諡法考",
 "人瑞錄",
 "迎駕紀恩錄",
 "恩賜御書記",
 "恭迎大駕記",
 "格言僅錄",
 "出山異數紀",
 "奏對機緣",
 "塞程別紀",
 "隴蜀餘聞",
 "東西二漢水辯",
 "偶書",
 "然脂集例",
 "身易",
 "伯子論文",
 "日錄論文",
 "韻問",
 "南曲入聲客問",
 "連文釋義",
 "畫訣",
 "焦山古鼎考",
 "瘞鶴銘辯",
 "昭陵六駿贊辯",
 "漢甘泉宮瓦記",
 "飯有十二合說",
 "學厤說",
 "宣爐歌注",
 "甲集補",
 "周易古義",
 "周易大衍辨",
 "尚書古義",
 "毛詩古義",
 "周禮古義",
 "儀禮古義",
 "禮經釋例目錄",
 "禮記古義",
 "公羊古義",
 "榖梁古義",
 "論語古義",
 "讀東坡志林",
 "淇泉摹古錄",
 "西征賦",
 "七釋",
 "十國詞箋略",
 "廣祀典議",
 "琉球入太學始末",
 "出山異數記",
 "醫津一筏",
 "江邨草堂紀",
 "後觀石錄",
 "石友贊",
 "箋卉",
 "乙集補",
 "禘祫問答",
 "侯國職官表",
 "漢水發源改",
 "汴水說",
 "山樵書外記",
 "圖畫精意識",
 "漢魏石經考",
 "唐宋石經考",
 "五經今文古文考",
 "聖諭樂本解說",
 "讀史管見",
 "乾清門奏對記",
 "松亭行紀",
 "扈從西巡日錄",
 "塞北小鈔",
 "聖節會約",
 "荊園小語",
 "荊園進語",
 "宗規",
 "戒淫錄",
 "學語雜篇",
 "觀物篇",
 "古國都今郡縣合考",
 "周末列國有今郡縣考",
 "黃山史槩",
 "寧古塔志",
 "峒谿纖志志餘",
 "滇黔土司婚禮記",
 "切字釋疑",
 "西河詩話",
 "賓告",
 "諺說",
 "醉鄉約法",
 "練閱火器陣記",
 "貫虱心傳",
 "文苑異稱",
 "思舊錄",
 "知我錄",
 "瓊花志",
 "徐園秋花譜",
 "吳蕈譜",
 "續蟹譜",
 "春秋四傳糾正",
 "夏小正詁",
 "增訂歐陽文忠公（修）年譜",
 "古金待問錄",
 "齊山巖洞志",
 "五經讀法",
 "經咫",
 "書經地理今釋",
 "建文帝後紀",
 "汰存錄",
 "客牕偶談",
 "九諦解疏",
 "環書",
 "漁樵問答",
 "五九枝譚",
 "吳鰥放言",
 "衷江南賦註",
 "西河襍箋",
 "諾皐廣志",
 "石里雜識",
 "香天談藪",
 "茶餘客話",
 "吳語",
 "粵西瑣記",
 "苗俗記",
 "譯史紀餘",
 "進藏紀程",
 "重集列女傳例",
 "古豔樂府",
 "說詩菅蒯",
 "璇璣碎錦",
 "西河詞話",
 "琴況",
 "滋蕙堂法帖題跋",
 "小山畫譜",
 "繪事發微",
 "烟譜",
 "野菜贊",
 "洋菊譜",
 "識物",
 "昭代樂章恭紀",
 "讀史記劄記",
 "讀明史劄記",
 "再生紀略",
 "籌餉巵言",
 "兵謀",
 "兵法",
 "志壑堂雜記",
 "東行述",
 "南行述",
 "征西紀略",
 "使蜀日記",
 "自滇入都程記",
 "周官辨非",
 "春秋列國地形口號",
 "元祕史略",
 "閩難記",
 "海寇記",
 "制科雜錄",
 "南巡扈從紀略",
 "西征紀略",
 "河圖洛書同異考",
 "孔廟從祀末議",
 "霜紅龕家訓",
 "恆產瑣言",
 "漁談",
 "讀戰國策隨筆",
 "復社紀事",
 "社事始末",
 "書事七則",
 "山陽錄",
 "矩齋雜記",
 "嗒史",
 "積山雜記",
 "梅谷偶筆",
 "秋燈叢話",
 "東城襍記",
 "洱海叢談",
 "衡嶽遊記",
 "海國聞見錄",
 "裨海紀遊",
 "袖海編",
 "文章薪火",
 "江西詩社宗派圖錄",
 "崇禎宮詞",
 "衍琵琶行",
 "續詩品",
 "論文四則",
 "天文說",
 "畫筌",
 "畫語錄",
 "畫羅漢頌",
 "玉臺書史",
 "賞延素心錄",
 "秋園雜佩",
 "談虎",
 "原善",
 "原象",
 "儒行述",
 "良吏述",
 "觀感錄",
 "己畦瑣語",
 "蠖齋詩話",
 "治齋讀詩蒙說",
 "禮記篇目",
 "約喪禮經傳",
 "諸史然疑",
 "南宋六陵遺事",
 "庚申君遺事",
 "乙丙紀事",
 "蜀難敍略",
 "代北姓譜",
 "遼金元姓譜",
 "文廟從祀弟子贊",
 "破邪論",
 "山公九原",
 "蠟談",
 "詹言",
 "說叩",
 "談書錄",
 "學海蠡測",
 "淥水亭雜識",
 "仁恕堂筆記",
 "匡廬游錄",
 "清波小志",
 "清波小志補",
 "九華日錄",
 "乾州小志",
 "龍沙紀略",
 "異域錄",
 "黎岐紀聞",
 "說蠻",
 "江源記",
 "婦人集",
 "附補",
 "金石要例",
 "論文管見",
 "文頌",
 "偶然欲書",
 "比紅兒詩註",
 "詩學纂聞",
 "遼詩話",
 "花草蒙拾",
 "墨井畫跋",
 "續三十五舉",
 "再續",
 "陽羨名陶錄",
 "原詩",
 "論學制備忘記",
 "釋骨",
 "古文尚書辨",
 "喪服翼注",
 "注疏瑣語",
 "補三史藝文志",
 "虎口餘生記",
 "庸言",
 "志學會約",
 "宗譜纂要",
 "婦學",
 "山中問答",
 "蒿菴閒話",
 "寒燈絮語",
 "牘外餘言",
 "廣連珠",
 "說文凝錦錄",
 "七十二候考",
 "西臺慟哭記註",
 "聞見偶錄",
 "東齋脞語",
 "定香亭筆談",
 "宸垣識餘",
 "南漳子",
 "寧古塔紀略",
 "番社采風圖考",
 "維西見聞紀",
 "七招",
 "七娛",
 "選材錄",
 "集世說詩",
 "宮詞",
 "皺水軒詞筌",
 "書筏",
 "印文考略",
 "新曆曉或",
 "七頌堂識小錄",
 "葯房心語",
 "端溪硯譜記",
 "荔譜",
 "木棉譜",
 "宗法論",
 "明史十二論",
 "車制圖解",
 "今韻古分十七部表",
 "讀易緒言",
 "饗禮補亡",
 "春秋五禮源流口號",
 "經書巵言",
 "史略",
 "擬更季漢書昭烈皇帝本紀",
 "平臺紀略",
 "征緬紀略",
 "蜀徼紀聞",
 "臨清寇略",
 "强聒錄",
 "旅書",
 "釋冰書",
 "蕉窗日記",
 "鍾山書院規約",
 "天問校正",
 "說文義例",
 "小學字解",
 "說鈴",
 "張氏巵言",
 "峽川志略",
 "出塞紀略",
 "從西紀略",
 "藏行紀程",
 "徵刻唐宋祕本書目",
 "藏書紀要",
 "金石史",
 "淳化閣帖跋",
 "漢詩總說",
 "秋窗隨筆",
 "詠物十詞",
 "鈍吟書要",
 "秋水園印說",
 "紀聽松庵竹鑪始末",
 "窰器說",
 "怪石錄",
 "茶史補",
 "人葠譜",
 "亳州牡丹述",
 "牡丹譜",
 "菊說",
 "唐述山房日錄",
 "忠文靖節編",
 "憩遊偶考",
 "燕都識餘",
 "山齋客譚",
 "外國紀",
 "周易稗疏",
 "易漢學",
 "毛鄭詩考正",
 "春秋稗疏",
 "考工記圖",
 "孟子遊歷考",
 "續方言",
 "聲韻攷",
 "音韻問答",
 "史記天官書補目",
 "補續漢書藝文志",
 "明季遺聞",
 "守汴日志",
 "隆平紀事",
 "東槎紀略",
 "鄭康成（玄）年譜",
 "水地記",
 "人海記",
 "柳邊紀略",
 "疏河心鏡",
 "三吳水利條議",
 "鶴徵前錄",
 "鶴徵後錄",
 "鐵函齋書跋",
 "義門題跋",
 "湛園題跋",
 "史論五答",
 "淑艾錄",
 "思問錄",
 "算術問答",
 "新法表異",
 "麓臺題畫稾",
 "讀畫錄",
 "指頭畫說",
 "墨志",
 "甘藷錄",
 "適來子",
 "經史管窺",
 "畏壘筆記",
 "日貫齋塗說",
 "莊子解",
 "愚菴雜著",
 "春秋詠史樂府",
 "十國宮詞",
 "野鴻詩的",
 "寒廳詩話",
 "貞一齋詩說",
 "周易尋門餘論",
 "易學辨惑",
 "尚書稗疏",
 "正訛初稾",
 "毛詩日箋",
 "春秋客難",
 "讀左瑣言",
 "周禮客難",
 "二李經說",
 "禮經學述",
 "罋天錄",
 "駢字分箋",
 "後漢三公年表",
 "三國志攷證",
 "五代春秋志疑",
 "明季實錄",
 "秋鐙錄",
 "綱目志疑",
 "平海紀略",
 "閩中紀略",
 "西神叢語",
 "澳門記略",
 "盧山紀遊",
 "黝山紀遊",
 "桂鬱巖洞記",
 "淳化祕閣法帖源流考",
 "金石小箋",
 "農書",
 "漢氾勝之遺書",
 "恆星說",
 "月滿樓甄藻錄",
 "三萬六千頃湖中畫船錄",
 "金粟箋說",
 "淄硯錄",
 "邇語",
 "訂譌雜錄",
 "直語補證",
 "夢闌瑣筆",
 "松陰快談",
 "六如居士外集",
 "老子別錄",
 "非老",
 "𢘿題上方二山紀游集",
 "啟禎宮詞",
 "回疆雜詠",
 "黔苗竹枝詞",
 "一瓢詩話",
 "蓮坡詩話",
 "消寒詩話",
 "摶沙錄",
 "悟語",
 "板橋雜記",
 "混同天牌譜",
 "第十一段錦詞話",
 "花甲數譜",
 "荔社紀事",
 "畫眉筆談",
 "蛇譜",
 "廣田水月錢譜",
 "內家拳法",
 "放生會約",
 "百花彈詞",
 "鵪鶉譜",
 "陰隲文頌",
 "幽夢影",
 "晉人麈",
 "西湖小史",
 "十美詞紀",
 "影梅庵憶語",
 "三婦評牡丹亭雜紀",
 "西城風俗紀",
 "攬勝圖譜",
 "牡丹亭骰譜",
 "胭脂紀事",
 "非烟香法",
 "哺記",
 "秦雲擷英小譜",
 "妒律",
 "牧豬閒話",
 "湖船錄",
 "說蛇",
 "馬弔說",
 "冷雲齋冰燈詩",
 "春秋左傳類聯",
 "清閒供",
 "琉璃誌",
 "海鷗小譜",
 "五石瓠",
 "潮嘉風月記",
 "火戲略",
 "羽扇譜",
 "鳳仙譜",
 "貓乘",
 "弧矢算術細草圖解",
 "周濂溪先生全集",
 "二程文集",
 "張橫渠先生文集",
 "朱子文集",
 "楊龜山先生集",
 "尹和靖先生集",
 "羅豫章先生文集",
 "李延平先生文集",
 "張南軒先生文集",
 "黃勉齋先生文集",
 "陳克齋先生集",
 "許魯齋先生集",
 "薛敬軒先生文集",
 "胡敬齋先生文集",
 "諸葛武侯文集",
 "唐陸宣公文集",
 "韓魏公集",
 "司馬溫公文集",
 "文山先生文集",
 "謝疊山先生文集",
 "方正學先生文集",
 "楊椒山先生文集",
 "二程粹言",
 "伊洛淵源錄",
 "上蔡先生語錄",
 "程氏家塾讀書分年日程",
 "朱子學的",
 "陳清瀾先生學蔀通辯",
 "薛文清公讀書錄",
 "胡敬齋先生居業錄",
 "道南源委",
 "羅整庵先生困知記",
 "陸桴亭思辨錄輯要",
 "王學質疑",
 "讀朱隨筆",
 "陸稼書先生問學錄",
 "陸稼書先生松陽鈔存",
 "石守道先生集",
 "高東溪先生遺集",
 "真西山先生集",
 "熊勿軒先生文集",
 "吳朝宗先生聞過齋集",
 "魏莊渠先生集",
 "羅整庵先生存稾",
 "陳剩夫先生集",
 "張陽和文選",
 "湯潛庵先生集",
 "陸稼書先生文集",
 "道統錄",
 "二程語錄",
 "朱子語類輯略",
 "濂洛關閩書",
 "近思錄",
 "廣近思錄",
 "困學錄集粹",
 "小學集解",
 "濂洛風雅",
 "學規類編",
 "養正類編",
 "居濟一得",
 "正誼堂文集",
 "正誼堂續集",
 "唐宋八大家文鈔",
 "范文正公文集",
 "楊大洪先生文集",
 "海剛峯先生集",
 "續近思錄",
 "法書考",
 "琴史",
 "新編錄鬼簿",
 "梅苑",
 "禁扁",
 "硯箋",
 "都城紀勝",
 "頤堂先生糖霜譜",
 "聲畫集",
 "分門纂類唐宋時賢千家詩選",
 "後村千家詩",
 "魏鄭公諫錄",
 "闕史",
 "南海山水人物古蹟記",
 "雁山十記",
 "膳夫經",
 "牛羊日曆",
 "錢幣譜",
 "文章緣始",
 "資治通鑑綱目三編",
 "淵鑑類函",
 "御選古文淵鑑",
 "五經",
 "尚書",
 "毛詩",
 "禮記",
 "春秋",
 "四書",
 "史記",
 "御纂朱子全書",
 "施註蘇詩",
 "王註正譌",
 "續補遺",
 "東坡先生（蘇軾）年譜",
 "春明夢餘錄",
 "冬夜箋記",
 "分甘餘話",
 "奉使倭羅斯日記",
 "筠廊偶筆",
 "金鰲退食筆記",
 "天祿識餘",
 "使琉球紀",
 "閩小紀",
 "滇行紀程",
 "續抄",
 "東還紀程",
 "絕域紀略",
 "揚州鼓吹詞序",
 "粵述",
 "粵西偶記",
 "滇黔紀遊",
 "救文格論",
 "雜錄",
 "坤輿外紀",
 "臺灣紀略",
 "臺灣雜記",
 "安南紀遊",
 "峒谿纖志",
 "泰山紀勝",
 "匡廬紀游",
 "登華記",
 "游雁蕩山記",
 "甌江逸志",
 "嶺南雜記",
 "讀史吟評",
 "湖壖雜記",
 "談往",
 "簪雲樓雜說",
 "天香樓偶得",
 "蚓菴瑣語",
 "冥報錄",
 "現果隨錄",
 "果報聞見錄",
 "信徵錄",
 "曠園雜志",
 "言鯖",
 "蓴鄉贅筆",
 "觚賸",
 "畫壁詩",
 "筠廊二筆",
 "池北偶談",
 "讀書質疑",
 "子夏易傳",
 "周易鄭康成註",
 "新本鄭氏周易",
 "陸氏易解",
 "周易註",
 "周易正義",
 "周易口訣義",
 "易數鉤隱圖",
 "遺論九事",
 "周易口義",
 "溫公易說",
 "橫渠易說",
 "東坡易傳",
 "了齋易說",
 "吳園易解",
 "周易新講義",
 "紫巖易傳",
 "讀易詳說",
 "易小傳",
 "漢上易集傳",
 "卦圖",
 "叢說",
 "周易窺餘",
 "易璇璣",
 "易變體義",
 "周易經傳集解",
 "易原",
 "古周易章句外編",
 "周易本義",
 "重刻周易本義",
 "郭氏傳家易說",
 "周易義海撮要",
 "南軒易說",
 "復齋易說",
 "楊氏易傳",
 "周易玩辭",
 "誠齋易傳",
 "大易粹言",
 "易圖說",
 "古周易",
 "易傳燈",
 "易裨傳",
 "厚齋易學",
 "童溪易傳",
 "周易總義",
 "西谿易說",
 "丙子學易編",
 "易通",
 "周易卦爻經傳訓解",
 "易象意言",
 "周易要義",
 "東谷易翼傳",
 "朱文公易說",
 "易學啟蒙小傳",
 "古經傳",
 "周易輯聞",
 "附易雅",
 "筮宗",
 "周易詳解",
 "淙山讀周易記",
 "周易傳義附錄",
 "易學啟蒙通釋",
 "三易備遺",
 "周易集說",
 "讀易舉要",
 "周易象義",
 "易圖通變",
 "易筮通變",
 "易本義附錄纂疏",
 "易學啟蒙翼傳",
 "易纂言",
 "易纂言外翼",
 "易原奧義",
 "周易原旨",
 "周易程朱傳義折衷",
 "周易衍義",
 "易學濫觴",
 "大易輯說",
 "周易本義通釋",
 "周易本義集成",
 "大易象數鉤深圖",
 "學易記",
 "周易集傳",
 "讀易考原",
 "易精蘊大義",
 "易學變通",
 "周易會通",
 "周易圖說",
 "周易爻變義蘊",
 "周易參義",
 "周易文詮",
 "周易大全",
 "易經蒙引",
 "讀易餘言",
 "易學啟蒙意見",
 "易經存疑",
 "周易辨錄",
 "易象鈔",
 "周易象旨決錄",
 "易象鉤解",
 "周易集注",
 "讀易紀聞",
 "八白易傳",
 "洗心齋讀易述",
 "像象管見",
 "周易劄記",
 "周易易簡說",
 "易義古象通",
 "周易像象述",
 "易用",
 "易象正",
 "兒易內儀以",
 "兒易外儀",
 "卦變考略",
 "古周易訂詁",
 "周易玩辭困學記",
 "易經通注",
 "日講易經解義",
 "御纂周易折中",
 "御纂周易述義",
 "讀易大旨",
 "考異",
 "易酌",
 "田間易學",
 "易學象數論",
 "周易象辭",
 "附尋門餘論",
 "圖書辨惑",
 "周易筮述",
 "仲氏易",
 "推易始末",
 "春秋占筮書",
 "易小帖",
 "喬氏易俟",
 "讀易日鈔",
 "周易通論",
 "周易觀彖",
 "周易淺述",
 "易原就正",
 "大易通解",
 "易經衷論",
 "易圖明辨",
 "合訂刪補大易集義粹言",
 "周易傳註",
 "附周易筮考",
 "周易傳義合訂",
 "周易玩辭集解",
 "周易函書約存",
 "約注",
 "易箋",
 "楚蒙山房易經解",
 "周易孔義集說",
 "易翼述信",
 "周易淺釋",
 "周易洗心",
 "豐川易說",
 "周易述",
 "易例",
 "易象大意存解",
 "大易擇言",
 "周易辨畫",
 "周易圖書質疑",
 "周易章句證異",
 "周易乾鑿度",
 "易緯稽覽圖",
 "易緯辨終備",
 "易緯通卦驗",
 "易緯乾元序制記",
 "易緯是類謀",
 "易緯坤靈圖",
 "尚書正義",
 "洪範口義",
 "東坡書傳",
 "尚書全解",
 "鄭敷文書說",
 "禹貢指南",
 "禹貢論",
 "後論",
 "山川地理圖",
 "尚書講義",
 "尚書詳解",
 "禹貢說斷",
 "書說",
 "尚書說",
 "五誥解",
 "絜齋家塾書鈔",
 "書集傳",
 "尚書精義",
 "融堂書解",
 "洪範統一",
 "尚書要義",
 "序說",
 "尚書集傳或問",
 "尚書表注",
 "書纂言",
 "尚書集傳纂疏",
 "尚書輯錄纂注",
 "尚書通考",
 "書蔡傳旁通",
 "讀書管見",
 "書義斷法",
 "附作義要訣",
 "尚書纂傳．",
 "尚書句解",
 "書傳會選",
 "書傳大全",
 "尚書考異",
 "尚書疑義",
 "尚書日記",
 "尚書砭蔡編",
 "尚書註考",
 "尚書疏衍",
 "洪範明義",
 "日講書經解義",
 "欽定書經傳說彙纂",
 "書經稗疏",
 "古文尚書疏證",
 "古文尚書寃詞",
 "尚書廣聽錄",
 "尚書埤傳",
 "禹貢長箋",
 "禹貢錐指",
 "例略圖",
 "洪範正論",
 "尚書解義",
 "書經衷論",
 "尚書地理今釋",
 "禹貢會箋",
 "書義矜式",
 "詩序",
 "毛詩正義",
 "毛詩陸疏廣要",
 "毛詩指說",
 "毛詩本義",
 "詩集傳",
 "毛詩名物解",
 "毛詩集解",
 "詩補傳",
 "詩總聞",
 "慈湖詩傳",
 "呂氏家塾讀詩記",
 "續呂氏家塾讀詩記",
 "絜齋毛詩經筵講義",
 "毛詩講義",
 "詩童子問",
 "詩緝",
 "詩傳遺說",
 "詩考",
 "詩集傳名物鈔",
 "詩傳通釋",
 "詩傳旁通",
 "詩經疏義",
 "詩疑問",
 "附詩辨說",
 "詩纘緒",
 "詩演義",
 "詩解頤",
 "詩經大全",
 "詩說解頤",
 "讀詩私記",
 "詩故",
 "六家詩名物疏",
 "詩經疑問",
 "詩經世本古義",
 "待軒詩記",
 "讀詩略記",
 "欽定詩經傳說彙纂",
 "序",
 "欽定詩義折中",
 "田間詩學",
 "詩經稗疏",
 "詩經通義",
 "毛詩稽古編",
 "詩所",
 "毛詩寫官記",
 "詩札",
 "詩傳詩說駁義",
 "續詩傳鳥名",
 "詩識名解",
 "詩傳名物集覽",
 "詩經劄記",
 "讀詩質疑",
 "毛詩類釋",
 "詩疑辨證",
 "三家詩拾遺",
 "詩瀋",
 "詩序補義",
 "虞東學詩",
 "周禮注疏",
 "周官新義",
 "附考工記解",
 "周禮詳解",
 "周禮復古編",
 "禮經會元",
 "太平經國之書",
 "周官總義",
 "周禮訂義",
 "鬳齋考工記解",
 "周禮句解",
 "周禮集說",
 "周官集傳",
 "周禮傳",
 "翼傳",
 "周禮全經釋原",
 "周禮註疏刪翼",
 "欽定周官義疏",
 "周禮述注",
 "周禮訓纂",
 "周官集注",
 "禮說",
 "周官祿田考",
 "周禮疑義舉要",
 "儀禮注疏",
 "儀禮識誤",
 "儀禮集釋",
 "儀禮釋宮",
 "儀禮圖",
 "儀禮旁通圖",
 "儀禮要義",
 "儀禮逸經傳",
 "儀禮集說",
 "經禮補逸",
 "欽定儀禮義疏",
 "儀禮鄭注句讀",
 "附監本正誤",
 "石經正誤",
 "儀禮商",
 "儀禮述注",
 "儀禮析疑",
 "儀禮章句",
 "補饗禮",
 "禮經本義",
 "宮室考",
 "肆獻祼饋食禮",
 "儀禮釋宮增註",
 "儀禮小疏",
 "儀禮集編",
 "內外服制通釋",
 "讀禮通考",
 "禮記正義",
 "月令解",
 "禮記集說",
 "禮記纂言",
 "雲莊禮記集說",
 "禮記大全",
 "月令明義",
 "表記集傳",
 "坊記集傳",
 "春秋問業",
 "緇衣集傳",
 "儒行集傳",
 "日講禮記解義",
 "欽定禮記義疏",
 "深衣考",
 "陳氏禮記集說補正",
 "禮記述注",
 "禮記析疑",
 "檀弓疑問",
 "禮記訓義擇言",
 "深衣考誤",
 "夏小正戴氏傳",
 "三禮圖集注",
 "三禮圖",
 "學禮質疑",
 "郊社禘祫問",
 "參讀禮志疑",
 "禮書",
 "儀禮經傳通解",
 "禮書綱目",
 "五禮通考",
 "書儀",
 "家禮",
 "泰泉鄉禮",
 "朱子禮纂",
 "辨定祭禮通俗譜",
 "春秋左傳正義",
 "春秋公羊傳注疏",
 "春秋穀梁傳注疏",
 "箴膏盲",
 "起廢疾",
 "發墨守",
 "春秋釋例",
 "春秋集傳纂例",
 "春秋微旨",
 "春秋集傳辨疑",
 "春秋名號歸一圖",
 "春秋年表",
 "春秋尊王發微",
 "春秋皇綱論",
 "春秋通義",
 "春秋權衡",
 "春秋傳",
 "春秋意林",
 "春秋傳說例",
 "春秋經解",
 "春秋集解",
 "春秋辨疑",
 "春秋本例",
 "春秋例要",
 "春秋五禮例宗",
 "春秋通訓",
 "春秋考",
 "春秋讞左傳讞",
 "公羊傳讞",
 "穀梁傳",
 "春秋集注",
 "春秋後傳",
 "春秋左氏傳說",
 "春秋左氏傳續說",
 "詳注東萊左氏博議",
 "春秋比事",
 "春秋左傳要義卅",
 "春秋分紀",
 "春秋講義",
 "春秋集義",
 "綱領",
 "春秋王霸列國世紀編",
 "春秋通說",
 "春秋說",
 "春秋經筌",
 "春秋或問",
 "附春秋五論",
 "春秋詳說",
 "讀春秋編",
 "春秋提綱",
 "春秋集傳釋義大成",
 "春秋纂言",
 "總例",
 "春秋諸國統紀",
 "目錄",
 "春秋本義",
 "春秋三傳辨疑",
 "春秋讞義",
 "春秋諸傳會通",
 "春秋經傳闕疑",
 "春秋集傳",
 "春秋師說",
 "春秋屬辭",
 "春秋左氏傳補注",
 "春秋胡傳附錄纂疏",
 "春王正月考",
 "春秋鉤玄",
 "春秋大全",
 "春秋經傳辨疑",
 "春秋正傳",
 "左傳附註",
 "春秋胡氏傳辨疑",
 "春秋明志錄",
 "春秋正旨",
 "春秋輯傳",
 "宗旨",
 "凡例",
 "春秋億",
 "春秋事義全考",
 "左傳屬事",
 "左氏釋",
 "春秋質疑",
 "春秋孔義",
 "春秋辨義",
 "讀春秋略記",
 "春秋四傳質",
 "左傳杜林合注",
 "日講春秋解義",
 "欽定春秋傳說彙纂",
 "御纂春秋直解",
 "左傳杜解補正",
 "春秋平義",
 "讀左日鈔",
 "左傳事緯",
 "春秋毛氏傳",
 "春秋簡書刊誤",
 "春秋屬辭比事記",
 "春秋地名考略",
 "春秋管窺",
 "三傳折諸",
 "春秋闕如編",
 "春秋宗朱辨義",
 "春秋通論",
 "春秋長歷",
 "春秋世族譜",
 "半農春秋說",
 "春秋大事表",
 "輿圖",
 "春秋識小錄",
 "左傳補注",
 "春秋左氏傳小疏",
 "春秋地理考實",
 "三正考",
 "春秋究遺",
 "春秋隨筆",
 "古文孝經孔氏傳",
 "附宋本古文孝經",
 "孝經正義",
 "古文孝經指解",
 "孝經刊誤",
 "孝經大義",
 "孝經定本",
 "孝經述註",
 "孝經集傳",
 "御註孝經",
 "御纂孝經集註",
 "孝經問",
 "駁五經異義",
 "鄭志",
 "經典釋文",
 "七經小傳",
 "程氏經說",
 "六經圖",
 "六經正誤",
 "刊正九經三傳沿革例",
 "融堂四書管見",
 "四如講稾",
 "六經奧論",
 "明本排字九經直音",
 "五經說",
 "十一經問對",
 "五經蠡測",
 "簡端錄",
 "五經稽疑",
 "經典稽疑",
 "欽定繙譯五經",
 "七經孟子考文補遺",
 "九經誤字",
 "經問",
 "經問補",
 "十三經義疑",
 "九經古義",
 "經稗",
 "十三經註疏正字",
 "朱子五經語類",
 "羣經補義",
 "九經辨字瀆蒙",
 "古經解鉤沈",
 "古微書",
 "孟子正義",
 "論語義疏",
 "論語正義",
 "孟子音義",
 "孟子解",
 "論語全解",
 "孟子傳",
 "尊孟辨",
 "續辨",
 "別錄",
 "大學章句",
 "論語集註",
 "孟子集註",
 "中庸章句",
 "四書或問",
 "論孟精義",
 "中庸輯略",
 "論語意原",
 "癸巳論語解",
 "癸巳孟子說",
 "石鼓論語問答",
 "蒙齋中庸講義",
 "四書集編",
 "孟子集疏",
 "論語集說",
 "四書纂疏",
 "大學疏義",
 "論語集註考證",
 "孟子集註考證",
 "四書集義精要",
 "四書辨疑",
 "讀四書叢說",
 "四書通",
 "四書通證",
 "四書疑節",
 "四書經疑貫通",
 "四書纂箋",
 "四書通旨",
 "四書管窺",
 "大學中庸集說啟蒙",
 "四書大全",
 "四書蒙引",
 "別附",
 "四書因問",
 "問辨錄",
 "論語類考",
 "孟子雜記",
 "學庸正說",
 "論語商",
 "論語學案",
 "四書留書",
 "日講四書解義",
 "四書近指",
 "孟子師說",
 "大學翼真",
 "四書講義困勉錄",
 "松陽講義",
 "大學古本說",
 "中庸章段",
 "中庸餘論",
 "讀論語劄記",
 "讀孟子劄記",
 "論語稽求篇",
 "四書賸言",
 "大學證文",
 "四書釋地",
 "又續",
 "三續",
 "四書劄記",
 "此木軒四書說",
 "鄉黨圖考",
 "四書逸箋",
 "皇祐新樂圖記",
 "樂書",
 "律呂新書",
 "瑟譜",
 "韶舞九成樂補",
 "律呂成書",
 "苑洛志樂",
 "鍾律通考",
 "樂律全書",
 "御定律呂正義",
 "御製律呂正義後編",
 "欽定詩經樂譜",
 "樂律正俗",
 "古樂經傳",
 "古樂書",
 "皇言定聲錄",
 "竟山樂錄",
 "李氏學樂錄",
 "樂律表微",
 "律呂新論",
 "律呂闡微",
 "琴旨",
 "爾雅註疏",
 "爾雅註",
 "匡謬正俗",
 "羣經音辨",
 "爾雅翼",
 "駢雅",
 "字詁",
 "別雅",
 "急就章",
 "說文解字",
 "說文繫傳",
 "說文繫傳考異",
 "說文解字篆韻譜",
 "重修玉篇",
 "五經文字",
 "九經字樣",
 "汗簡",
 "目錄敍略",
 "古文四聲韻",
 "類篇",
 "歷代鐘鼎彝器款識法帖",
 "復古編",
 "漢隸字源",
 "班馬字類",
 "字通",
 "六書故",
 "龍龕手鑑",
 "六書統",
 "周秦刻石釋音",
 "字鑑",
 "說文字原",
 "六書正譌",
 "六書本義",
 "奇字韻",
 "古音駢字",
 "俗書刊誤",
 "字孿",
 "康熙字典",
 "御定清文鑑",
 "總綱",
 "補總綱",
 "御定滿洲蒙古漢字三合切音清文鑑",
 "欽定西域同文志",
 "篆隸攷異",
 "隸辨",
 "廣韻",
 "重修廣韻",
 "集韻",
 "切韻指掌圖",
 "附檢圖之例",
 "韻補",
 "附釋文互註禮部韻略",
 "附貢舉條式",
 "增修互註禮部韻略",
 "增修校正押韻釋疑",
 "五音集韻",
 "古今韻會舉要",
 "四聲等子",
 "經史正音切韻指南",
 "洪武正韻",
 "古音叢目",
 "古音獵要",
 "古音餘",
 "古音略例",
 "轉注古音略",
 "毛詩古音考",
 "屈宋古音義",
 "欽定音韻闡微",
 "欽定同文韻統",
 "欽定叶韻彙輯",
 "欽定音韻述微",
 "音論",
 "詩本音",
 "易音",
 "唐韻正",
 "古音表",
 "韻補正",
 "古今通韻",
 "易韻",
 "唐韻考",
 "古韻標準",
 "詩韻舉例",
 "六藝綱目",
 "史記集解",
 "史記索隱",
 "史記正義",
 "讀史記十表",
 "史記疑問",
 "漢書",
 "班馬異同",
 "後漢書",
 "補後漢書年表",
 "兩漢刊誤補遺",
 "三國志",
 "三國志補注",
 "晉書",
 "宋書",
 "南齊書",
 "梁書",
 "陳書",
 "魏書",
 "北齊書",
 "周書",
 "隋書",
 "南史",
 "北史",
 "舊唐書",
 "新唐書",
 "舊五代史",
 "新五代史記",
 "五代史記纂誤",
 "宋史",
 "遼史",
 "遼史拾遺",
 "金史",
 "元史",
 "欽定遼金元三史國語解",
 "明史",
 "竹書統箋",
 "漢紀",
 "後漢紀",
 "元經",
 "資治通鑑",
 "資治通鑑釋文辨誤",
 "通鑑胡注舉正",
 "資治通鑑考異",
 "資治通鑑目錄",
 "通鑑釋例",
 "稽古錄",
 "通鑑外紀",
 "皇王大紀",
 "中興小紀",
 "續資治通鑑長編",
 "綱目續麟",
 "校正凡例",
 "彙覽",
 "綱目分註補遺",
 "綱目訂誤",
 "通釋",
 "解題",
 "建炎以來繫年要錄",
 "宋九朝編年備要",
 "續宋編年資治通鑑",
 "西漢年紀",
 "靖康要錄",
 "兩朝綱目備要",
 "宋季三朝政要",
 "宋史全文",
 "通鑑前編",
 "舉要",
 "通鑑續編",
 "大事記續編",
 "元史續編",
 "皇清開國方略",
 "御批通鑑輯覽",
 "明唐桂二王本　末",
 "御定通鑑綱目三編",
 "資治通鑑後編",
 "通鑑紀事本末",
 "春秋左氏傳事類始末",
 "三朝北盟會編",
 "蜀鑑",
 "宋史紀事本末",
 "元史紀事本末",
 "平定三逆方略",
 "親征朔漠方略",
 "欽定平定金川方略",
 "御定平定準噶爾方略前編",
 "正編",
 "欽定平定兩金川方略",
 "欽定臨清紀略",
 "欽定蘭州紀略",
 "欽定石峯堡紀略",
 "欽定臺灣紀略",
 "綏寇紀略",
 "明史紀事本末",
 "滇考",
 "繹史",
 "左傳紀事本末",
 "平臺紀",
 "東征集",
 "東觀漢記",
 "隆平集",
 "古史",
 "通志",
 "東都事略",
 "路史",
 "契丹國志",
 "大金國志",
 "古今紀要",
 "續後漢書",
 "春秋別典",
 "欽定歷代紀事年表",
 "欽定續通志",
 "歷代史表",
 "後漢書補逸",
 "春秋戰國異辭",
 "通表",
 "尚史",
 "國語",
 "國語補音",
 "戰國策注",
 "鮑氏戰國策注",
 "戰國策校注",
 "貞觀政要",
 "渚宮舊事",
 "五代史闕文",
 "五代史補",
 "太平治迹統類前集",
 "咸淳遺事",
 "大金弔伐錄",
 "汝南遺事",
 "平宋錄",
 "弇山堂別集",
 "革除逸史",
 "欽定蒙古源流",
 "太祖高皇帝聖訓",
 "太宗文皇帝聖訓",
 "世祖章皇帝聖訓",
 "聖祖仁皇帝聖訓",
 "世宗憲皇帝聖訓卅",
 "世宗憲皇帝上諭內閣",
 "世宗憲皇帝硃批諭旨",
 "世宗憲皇帝上諭八旗",
 "上諭旗務議覆",
 "諭行旗務奏議",
 "唐大詔令集",
 "兩漢詔令",
 "政府奏議",
 "包孝肅奏議",
 "盡言集",
 "讜論集",
 "左史諫草",
 "商文毅疏稾略",
 "王端毅公奏議",
 "馬端肅奏議",
 "關中奏議",
 "楊文忠公三錄",
 "胡端敏奏議",
 "何文簡疏議",
 "垂光集",
 "孫毅菴奏議",
 "玉坡奏議",
 "南宮奏稾",
 "訥谿奏疏",
 "譚襄敏奏議",
 "潘司空奏疏",
 "兩河經略",
 "兩垣奏議",
 "周忠愍奏疏",
 "張襄壯奏疏",
 "靳文襄奏疏",
 "華野疏稾",
 "諸臣奏議",
 "歷代名臣奏議",
 "名臣經濟錄",
 "明臣奏議",
 "孔子編年",
 "東家雜記",
 "李相國論事集",
 "杜工部（甫）年譜",
 "杜工部詩年譜",
 "金陀稡編",
 "象臺首末",
 "魏鄭公諫續錄",
 "忠貞錄",
 "諸葛忠武書",
 "寧海將軍固山貝子功績錄",
 "朱子（熹）年譜",
 "古列女傳",
 "續列女傳",
 "春秋列國諸臣傳",
 "廉吏傳",
 "紹興十八年同年小錄",
 "伊雒淵源錄",
 "名臣言行錄前集",
 "外集",
 "名臣碑傳琬琰集",
 "錢塘先賢傳贊",
 "慶元黨禁",
 "寶祐四年登科錄",
 "京口耆舊傳",
 "昭忠錄",
 "敬鄉錄",
 "唐才子傳",
 "元朝名臣事略",
 "浦陽人物記",
 "古今列女傳",
 "殿閣詞林記",
 "嘉靖以來首輔傳",
 "明名臣琬琰錄",
 "今獻備遺",
 "百越先賢志",
 "元儒考略",
 "欽定八旗滿洲氏族通譜",
 "欽定宗室王公功績表傳",
 "欽定蒙古王公功績表傳",
 "欽定勝朝殉節諸臣錄",
 "明儒學案",
 "中州人物考",
 "東林列傳",
 "儒林宗派",
 "明儒言行錄",
 "史傳三編",
 "閩中理學淵源考",
 "孫威敏征南錄",
 "閩粵巡視紀略",
 "兩漢博聞",
 "通鑑總類",
 "南史識小錄",
 "北史識小錄",
 "別本十六國春秋",
 "蠻書",
 "江南野史",
 "江南餘載",
 "錦里耆舊傳",
 "成都理亂記",
 "音釋",
 "吳越備史",
 "安南志略",
 "十國春秋",
 "越史略",
 "朝鮮史略",
 "御定月令輯要",
 "元和郡縣志",
 "太平寰宇記",
 "元豐九域志",
 "輿地廣記",
 "方輿勝覽",
 "明一統志",
 "大清一統志",
 "吳郡圖經續記",
 "乾道臨安志",
 "淳熙三山志",
 "吳郡志",
 "新安志",
 "剡錄",
 "嘉泰會稽志",
 "寶慶續志",
 "嘉定赤城志",
 "寶慶四明志廿",
 "開慶續志",
 "澉水志",
 "景定建康志",
 "景定嚴州續志",
 "咸淳臨安志",
 "至元嘉禾志",
 "大德昌國州圖志",
 "延祐四明志",
 "齊乘",
 "至大金陵新志",
 "無錫縣志",
 "姑蘇志",
 "武功縣志",
 "朝邑縣志",
 "嶺海輿圖",
 "滇略",
 "吳興備志",
 "欽定日下舊聞考",
 "欽定熱河志",
 "欽定滿洲源流考",
 "欽定皇輿西域圖志",
 "欽定盛京通志",
 "畿輔通志",
 "江南通志",
 "江西通志",
 "浙江通志",
 "福建通志",
 "湖廣通志",
 "河南通志",
 "山東通志",
 "山西通志",
 "陝西通志",
 "甘肅通志",
 "四川通志",
 "廣東通志",
 "廣西通志",
 "雲南通志",
 "貴州通志",
 "歷代帝王宅京記",
 "水經注",
 "水經注集釋訂訛",
 "水經注釋",
 "吳中水利書",
 "四明它山水利備覽",
 "河防通議",
 "治河圖略",
 "浙西水利書",
 "河防一覽",
 "三吳水利錄",
 "北河紀",
 "紀餘",
 "敬止集",
 "三吳水考",
 "欽定河源紀略",
 "崑崙河源考",
 "兩河清彙",
 "治河奏績書",
 "河防述言",
 "直隸河渠志",
 "行水金鑑",
 "水道提綱",
 "海塘錄",
 "籌海圖編",
 "鄭開陽雜著",
 "南嶽小錄",
 "廬山記",
 "廬山紀略",
 "赤松山志",
 "西湖遊覽志",
 "志餘",
 "桂勝",
 "附桂故",
 "欽定盤山志",
 "西湖志纂",
 "附後集",
 "洞霄圖志",
 "長安志圖",
 "汴京遺蹟志",
 "武林梵志",
 "江城名蹟",
 "營平二州地名記",
 "金鼇退食筆記",
 "石柱記箋釋",
 "關中勝蹟圖誌",
 "嶺表錄異",
 "會稽三賦",
 "嶺外代答",
 "歲華記麗譜",
 "吳中舊事",
 "平江紀事",
 "閩中海錯疏",
 "蜀中廣記",
 "顏山雜記",
 "嶺南風物紀",
 "臺海使槎錄",
 "東城雜記",
 "河朔訪古記",
 "徐霞客遊記",
 "大唐西域記",
 "宣和奉使高麗圖經",
 "諸蕃志",
 "島夷志略",
 "朝鮮賦",
 "東西洋考",
 "職方外紀",
 "赤雅",
 "朝鮮志",
 "皇清職貢圖",
 "坤輿圖說",
 "唐六典",
 "翰苑羣書",
 "南宋館閣錄",
 "宋宰輔編年錄",
 "祕書監志",
 "翰林記",
 "禮部志稿",
 "太常續考",
 "土官底簿",
 "詞林典故",
 "欽定國子監志",
 "欽定歷代職官表",
 "州縣提綱",
 "百官箴",
 "三事忠告",
 "御製人臣儆心錄",
 "通典",
 "唐會要",
 "五代會要",
 "宋朝事實",
 "西漢會要",
 "東漢會要",
 "漢制考",
 "文獻通考",
 "明會典",
 "七國考",
 "欽定大清會典",
 "欽定大清會典則例",
 "欽定續文獻通考",
 "欽定皇朝文獻通考",
 "欽定續通典",
 "欽定皇朝通典",
 "欽定皇朝通志",
 "元朝典故編年考",
 "漢官舊儀",
 "大唐開元禮",
 "諡法",
 "政和五禮新儀",
 "御製冠禮",
 "紹熙州縣釋奠儀圖",
 "大金集禮",
 "大金德運圖說",
 "廟學典禮",
 "明集禮",
 "明臣諡彙考",
 "頖宮禮樂疏",
 "明諡記彙編",
 "明宮史",
 "幸魯盛典",
 "萬壽盛典",
 "欽定大清通禮",
 "南巡盛典",
 "欽定皇朝禮器圖式廿",
 "國朝宮史",
 "欽定滿洲祭神祭天典禮",
 "八旬萬壽盛典",
 "歷代建元考",
 "北郊配位議",
 "廟制圖考",
 "救荒活民書",
 "熬波圖",
 "錢通",
 "欽定康濟錄",
 "荒政叢書",
 "歷代兵制",
 "補漢兵志",
 "馬政紀",
 "八旗通志初集",
 "唐律疏義",
 "大清律例",
 "營造法式",
 "欽定武英殿聚珍版程式",
 "崇文總目",
 "郡齋讀書志",
 "後志",
 "附志",
 "直齋書錄解題",
 "漢藝文志考證",
 "文淵閣書目",
 "授經圖",
 "欽定天祿琳琅書目",
 "千頃堂書目",
 "經義考",
 "金石錄",
 "籀史",
 "隸釋",
 "隸續",
 "絳帖平",
 "石刻鋪敍",
 "蘭亭考",
 "蘭亭續考",
 "寶刻叢編",
 "輿地碑記目",
 "寶刻類編",
 "古刻叢鈔",
 "名蹟錄",
 "吳中金石新編",
 "金薤琳琅",
 "法帖釋文考異",
 "金石林時地考",
 "石墨鐫華",
 "欽定校正淳化閣帖釋文",
 "求古錄",
 "金石文字記",
 "石經考",
 "來齋金石考",
 "嵩陽石刻集記",
 "觀妙齋金石文考略",
 "分隸偶存",
 "淳化祕閣法帖考正",
 "竹雲題跋",
 "金石經眼錄",
 "石經考異",
 "史通",
 "史通通釋",
 "唐鑑",
 "唐書直筆",
 "經幄管見",
 "涉史隨筆",
 "六朝通鑑博議",
 "大事記講義",
 "兩漢筆記",
 "舊聞證誤",
 "通鑑答問",
 "歷代名賢確論",
 "歷朝通略",
 "十七史纂古今通要",
 "學史",
 "史糾",
 "御批通鑑綱目",
 "通鑑綱目前編",
 "外紀",
 "通鑑綱目續編",
 "御製評鑑闡要",
 "欽定古今儲貳金鑑",
 "孔子家語",
 "法言集註",
 "帝範",
 "續孟子",
 "伸蒙子",
 "帝學",
 "儒志編",
 "太極圖說述解",
 "通書述解",
 "西銘述解",
 "張子全書",
 "註解正蒙",
 "正蒙初義",
 "二程遺書",
 "二程外書",
 "公是先生弟子記",
 "節孝語錄",
 "儒言",
 "童蒙訓",
 "省心雜言",
 "上蔡語錄",
 "袁氏世範",
 "延平答問",
 "近思錄集註",
 "附說",
 "雜學辨",
 "附記疑",
 "小學集註",
 "朱子語類",
 "戒子通錄",
 "知言",
 "明本釋",
 "少儀外傳",
 "麗澤論說集錄",
 "子思子",
 "木鐘集",
 "經濟文衡前集",
 "大學衍義",
 "讀書記",
 "心經",
 "項氏家說",
 "先聖大訓",
 "黃氏日鈔",
 "北溪字義",
 "準齊雜記",
 "性理羣書句解",
 "朱子讀書法",
 "家山圖書",
 "讀書分年日程",
 "辨惑編",
 "治世龜鑑",
 "管窺外編",
 "內訓",
 "理學類編",
 "性理大全書",
 "讀書錄",
 "大學衍義補",
 "居業錄",
 "楓山語錄",
 "東溪日談錄",
 "續記",
 "讀書劄記",
 "士翼",
 "涇野子內篇",
 "周子抄釋",
 "張子抄釋",
 "二程子抄釋",
 "朱子抄釋",
 "中庸衍義",
 "格物通",
 "世緯",
 "呻吟語摘",
 "聖學宗要",
 "學言",
 "人譜",
 "人譜類記",
 "榕壇問業",
 "資政要覽",
 "後序",
 "聖諭廣訓",
 "庭訓格言",
 "日知薈說",
 "內則衍義",
 "御定孝經衍義",
 "性理精義",
 "朱子全書",
 "執中成憲",
 "御覽經史講義",
 "正學偶見述",
 "思辨錄輯要",
 "雙橋隨筆",
 "三魚堂賸言",
 "松陽抄存",
 "榕村語錄",
 "讀書偶記",
 "吳子",
 "司馬法",
 "尉繚子",
 "黃石公三略",
 "三略直解",
 "李衞公問對",
 "太白陰經",
 "武經總要",
 "何博士備論",
 "守城錄",
 "武編",
 "陣紀",
 "江南經略",
 "練兵實紀",
 "雜集",
 "紀效新書",
 "管子補註",
 "韓子",
 "疑獄集",
 "補疑獄集",
 "棠陰比事",
 "農桑衣食撮要",
 "救荒本草",
 "農政全書",
 "泰西水法",
 "野菜博錄",
 "授時通考",
 "黃帝素問",
 "靈樞經",
 "難經本義",
 "甲乙經",
 "金匱要略論註",
 "傷寒論註",
 "附傷寒明理論",
 "論方",
 "肘後備急方",
 "巢氏諸病源候論",
 "千金要方",
 "銀海精微",
 "外臺祕要",
 "顱顖經",
 "銅人鍼灸經",
 "明堂灸經",
 "博濟方",
 "蘇沈良方",
 "壽親養老新書",
 "腳氣治法總要",
 "旅舍備要方",
 "素問入式運氣論奧",
 "附黃帝內經素問遺篇",
 "傷寒微旨",
 "傷寒總病論",
 "附音訓",
 "修治藥法",
 "聖濟總錄纂要",
 "證類本草",
 "全生指迷方",
 "小兒衞生總微論方",
 "類證普濟本事方",
 "太平惠民和劑局方",
 "指南總論",
 "衞生十全方",
 "奇疾方",
 "傳信適用方",
 "衞濟寶書",
 "醫說",
 "鍼灸資生經",
 "婦人大全良方",
 "太醫局程文",
 "三因極一病證方論",
 "產育寶慶方",
 "集驗背疽方",
 "濟生方",
 "產寶諸方",
 "仁齋直指",
 "附傷寒類書活人總括",
 "急救仙方",
 "素問元機原病式",
 "宣明論方",
 "傷寒直格方",
 "傷寒標本心法類萃",
 "病機氣宜保命集",
 "儒門事親",
 "內外傷辨惑論",
 "脾胃論",
 "蘭室秘藏",
 "醫壘元戎",
 "此事難知",
 "湯液本草",
 "瑞竹堂經驗方",
 "世醫得效方",
 "格致餘論",
 "局方發揮",
 "金匱鉤玄",
 "扁鵲神應鍼灸玉龍經",
 "外科精義",
 "脈訣刊誤",
 "醫經溯洄集",
 "普濟方",
 "推求師意",
 "玉機微義",
 "仁端錄",
 "薛氏醫案",
 "鍼灸問對",
 "外科理例",
 "附方",
 "石山醫案",
 "附案",
 "名醫類案",
 "赤水玄珠",
 "醫旨緒餘",
 "證治準繩",
 "本草綱目",
 "奇經八脈考",
 "瀕湖脈學",
 "傷寒論條辨",
 "附本草鈔",
 "或問",
 "痙書",
 "先醒齋廣筆記",
 "神農本草經疏",
 "類經",
 "景岳全書",
 "溫疫論",
 "痎瘧論疏",
 "本草乘雅半偈",
 "醫宗金鑑",
 "尚論篇",
 "醫門法律",
 "附寓意草",
 "傷寒舌鑑",
 "傷寒兼證析義",
 "絳雪園古方選註",
 "附得宜本草",
 "續名醫類案",
 "神農本草經百種錄",
 "蘭臺軌範",
 "傷寒類方",
 "醫學源流論",
 "音義",
 "新儀象法要",
 "六經天文編",
 "革象新書",
 "重修革象新書",
 "七政推步",
 "聖壽萬年曆",
 "附律曆融通",
 "古今律曆考",
 "乾坤體義",
 "表度說",
 "簡平儀說",
 "天問略",
 "新法算書",
 "測量法義",
 "測量異同",
 "句股義",
 "渾蓋通憲圖說",
 "圜容較義",
 "歷體略",
 "歷象考成",
 "儀象考成",
 "歷象考成後編",
 "曉菴新法",
 "中星譜",
 "天經或問前集",
 "天步真原",
 "天學會通",
 "歷算全書",
 "大統歷志",
 "勿菴歷算書記",
 "中西經星同異考",
 "全史日至源流",
 "算學",
 "九章算術",
 "孫子算經",
 "術數記遺",
 "海島算經",
 "五曹算經",
 "夏侯陽算經",
 "五經算術",
 "張丘建算經",
 "緝古算經",
 "數學九章",
 "測圓海鏡",
 "測圓海鏡分類釋術",
 "益古演段",
 "弧矢算術",
 "同文算指前編",
 "通編",
 "幾何原本",
 "數理精蘊",
 "幾何論約",
 "數學鑰",
 "數度衍",
 "句股引蒙",
 "句股矩測解原",
 "少廣補遺",
 "莊氏算學",
 "九章錄要",
 "太玄本旨",
 "皇極經世書",
 "皇極經世索隱",
 "皇極經世觀物外篇衍義",
 "易通變",
 "觀物篇解",
 "附皇極經世解起數訣",
 "皇極經世書解",
 "易學",
 "洪範皇極內篇",
 "天原發微",
 "大衍索隱",
 "易象圖說內篇",
 "三易洞璣",
 "靈臺秘苑",
 "唐開元占經",
 "葬書",
 "撼龍經",
 "疑龍經",
 "葬法倒杖",
 "青囊奧語",
 "青囊序",
 "天玉經內傳",
 "外編",
 "靈城精義",
 "催官篇",
 "發微論",
 "靈棋經",
 "易林",
 "六壬大全",
 "卜法詳考",
 "李虛中命書",
 "玉照定真經",
 "星命溯源",
 "徐氏珞琭子賦註",
 "珞琭子三命消息賦註",
 "三命指迷賦",
 "星命總括",
 "演禽通纂",
 "星學大成",
 "三命通會",
 "月波洞中記",
 "玉管照神局",
 "太清神鑑",
 "人倫大統賦",
 "太乙金鏡式經",
 "遁甲演義",
 "禽星易見",
 "星歷考原",
 "協紀辨方書",
 "述書賦",
 "唐朝名畫錄",
 "墨藪",
 "法帖釋文刊誤",
 "畫山水賦",
 "附筆法記",
 "五代名畫補遺",
 "宋朝名畫評",
 "圖畫見聞志",
 "林泉高致集",
 "墨池編",
 "德隅齋畫品",
 "廣川畫跋",
 "寶真齋法書贊",
 "書小史",
 "書苑菁華",
 "書史會要",
 "珊瑚木難",
 "趙氏鐵網珊瑚",
 "墨池瑣錄",
 "書訣",
 "書畫跋跋",
 "繪事微言",
 "書法雅言",
 "寒山帚談",
 "書法離鉤",
 "畫史會要",
 "郁氏書畫題跋記",
 "續題跋記",
 "清河書畫舫",
 "真蹟日錄",
 "二集",
 "三集",
 "法書名畫見聞表",
 "南陽法書表",
 "南陽名畫表",
 "清河書畫表",
 "珊瑚網",
 "佩文齋書畫譜",
 "石渠寶笈",
 "祕殿珠林",
 "庚子消夏記",
 "繪事備考",
 "書法正傳",
 "江村銷夏錄",
 "式古堂書畫彙考",
 "南宋院畫錄",
 "六藝之一錄",
 "傳神祕要",
 "松絃館琴譜",
 "松風閣琴譜",
 "抒懷操",
 "琴譜合璧",
 "印典",
 "元元棋經",
 "棋訣",
 "考古圖",
 "續考古圖",
 "釋文",
 "嘯堂集古錄",
 "宣和博古圖",
 "宣德鼎彝譜",
 "西清古鑑",
 "奇器圖說",
 "諸器圖說",
 "欽定西清硯譜",
 "墨譜",
 "墨史",
 "墨法集要",
 "錢錄",
 "香乘",
 "續茶經",
 "北山酒經",
 "劉氏菊譜",
 "史氏菊譜",
 "范村菊譜",
 "御定廣羣芳譜",
 "異魚圖贊箋",
 "異魚圖贊補",
 "閏集",
 "鶡冠子",
 "呂氏春秋",
 "長短經",
 "芻言",
 "樂菴語錄",
 "習學記言",
 "本語",
 "白虎通義",
 "近事會元",
 "能改齊漫錄",
 "學林",
 "容齋隨筆",
 "續筆",
 "三筆",
 "四筆",
 "五筆",
 "續演繁露",
 "甕牖閒評",
 "考古質疑",
 "續古今考",
 "潁川語小",
 "朝野類要",
 "困學紀聞",
 "日損齋筆記",
 "丹鉛餘錄",
 "摘錄",
 "總錄",
 "正楊",
 "疑耀",
 "藝彀",
 "彀補",
 "名義考",
 "筆精",
 "通雅",
 "巵林",
 "拾遺錄",
 "日知錄",
 "義府",
 "藝林彙攷",
 "潛邱劄記",
 "湛園札記",
 "白田雜著",
 "義門讀書記",
 "樵香小記",
 "管城碩記",
 "東原錄",
 "補筆談",
 "續筆談",
 "東坡志林",
 "呂氏雜記",
 "元城語錄",
 "元城行錄",
 "嬾真子",
 "郤掃編",
 "紫微雜說",
 "辨言",
 "東園叢說",
 "常談",
 "雲麓漫鈔",
 "示兒編",
 "密齋筆記",
 "續筆記",
 "琴堂諭俗編",
 "吹劍錄外集",
 "書齋夜話",
 "隱居通議",
 "湛淵靜語",
 "敬齋古今黈",
 "日聞錄",
 "玉堂嘉話",
 "庶齋老學叢談",
 "閒居錄",
 "雪履齋筆記",
 "蠡海集",
 "胡文穆雜著",
 "蟫精雋",
 "南園漫錄",
 "採芹錄",
 "畫禪室隨筆",
 "六研齋筆記",
 "二筆",
 "物理小識",
 "居易錄",
 "香祖筆記",
 "古夫于亭雜錄",
 "負暄野錄",
 "竹嶼山房雜部",
 "遵生八牋",
 "清秘藏",
 "長物志",
 "韻石齋筆談",
 "研山齋雜記",
 "紺珠集",
 "類說",
 "事實類苑",
 "仕學規範",
 "自警編",
 "言行龜鑑",
 "說郛",
 "古今說海",
 "玉芝堂談薈",
 "元明事類鈔",
 "儼山外集",
 "少室山房筆叢正集",
 "鈍吟雜錄",
 "古今同姓名錄",
 "編珠",
 "續編珠",
 "藝文類聚",
 "北堂書鈔",
 "龍筋鳳髓判",
 "元和姓纂",
 "白孔六帖",
 "蒙求集註",
 "事類賦",
 "太平御覽",
 "冊府元龜",
 "事物紀原",
 "書敍指南",
 "海錄碎事",
 "古今姓氏書辨證",
 "帝王經世圖譜",
 "職官分紀",
 "歷代制度詳說",
 "永嘉八面鋒",
 "錦繡萬花谷前集",
 "事文類聚前集",
 "新集",
 "遺集",
 "記纂淵海",
 "名賢氏族言行類稿",
 "羣書會元截江網",
 "小字錄",
 "全芳備祖前集",
 "山堂考索前集",
 "古今合璧事類備要前集",
 "源流至論前集",
 "玉海",
 "附詞學指南",
 "姓氏急就篇",
 "六帖補",
 "韻府羣玉",
 "翰苑新書前集",
 "純正蒙求",
 "排韻增廣事類氏族大全",
 "名疑",
 "荊川稗編",
 "萬姓統譜",
 "附氏族博攷",
 "喻林",
 "經濟類編",
 "同姓名錄",
 "錄補",
 "說略",
 "天中記",
 "圖書編",
 "駢志",
 "山堂肆考",
 "古儷府",
 "廣博物志",
 "御定淵鑑類函",
 "御定駢字類編",
 "御定分類字錦",
 "御定子史精華",
 "御定佩文韻府",
 "御定韻府拾遺",
 "格致鏡原",
 "讀書紀數略",
 "花木鳥獸集類",
 "別號錄",
 "宋稗類鈔",
 "世說新語",
 "大唐傳載",
 "幽閒皷吹",
 "松窻雜錄",
 "玉泉子",
 "唐摭言",
 "金華子",
 "洛陽縉紳舊聞記",
 "嘉祐雜志",
 "錢氏私志",
 "龍川略志",
 "別志",
 "孔氏談苑",
 "玉壺野史",
 "珍席放談",
 "萍洲可談",
 "第三錄",
 "張氏可書",
 "聞見前錄",
 "聞見後錄",
 "耆舊續聞",
 "東南紀聞",
 "何氏語林",
 "山海經廣註",
 "漢武洞冥記",
 "太平廣記",
 "茆亭客話",
 "分門古今類事",
 "夷堅支志",
 "弘明集",
 "廣弘明集",
 "開元釋教錄",
 "宋高僧傳",
 "道院集要",
 "僧寶傳",
 "林間錄",
 "五燈會元",
 "釋氏稽古略",
 "佛祖通載",
 "陰符經考異",
 "陰符經講義",
 "老子註",
 "道德經解",
 "道德真經註",
 "老子翼",
 "老子考異",
 "御註道德經",
 "老子說略",
 "道德經註",
 "陰符經註",
 "沖虛至德真經解",
 "莊子註",
 "南華真經新傳",
 "莊子口義",
 "南華真經義海纂微",
 "莊子翼",
 "文子纘義",
 "周易參同契通真義",
 "周易參同契考異",
 "周易參同契解",
 "周易參同契發揮",
 "釋疑",
 "周易參同契分章註",
 "抱朴子內外篇",
 "亢倉子註",
 "玄真子",
 "無能子",
 "雲笈七籤",
 "悟真篇註疏",
 "附直指詳說",
 "古文龍虎經註疏",
 "易外別傳",
 "道藏目錄詳註",
 "楚詞章句",
 "楚詞補註",
 "楚詞集註",
 "辨證",
 "後語",
 "離騷草木疏",
 "欽定補繪離騷全圖",
 "山帶閣註楚詞",
 "餘論",
 "說韻",
 "揚子雲集",
 "孔北海集",
 "曹子建集",
 "陸士龍集",
 "陶淵明集",
 "璿璣圖詩讀法",
 "謝宣城集",
 "何水部集",
 "庾開府集箋註",
 "庾子山集註",
 "徐孝穆集箋註",
 "東皐子集",
 "寒山子詩集",
 "豐干拾得詩",
 "王子安集",
 "盈川集",
 "盧昇之集",
 "駱丞集",
 "陳拾遺集",
 "張燕公集",
 "曲江集",
 "李北海集",
 "李太白集",
 "分類補註李太白集",
 "李太白詩集註",
 "九家集註杜詩",
 "黃氏補註杜詩",
 "集千家註杜詩",
 "杜詩攟",
 "杜詩詳註",
 "附編",
 "王右丞集箋註",
 "末",
 "高常侍集",
 "孟浩然集",
 "常建詩",
 "儲光羲詩",
 "次山集",
 "顏魯公集",
 "年譜",
 "宗玄集",
 "附錄元綱論",
 "內丹九章經",
 "杼山集",
 "劉隨州集",
 "韋蘇州集",
 "毘陵集",
 "蕭茂挺文集",
 "李遐叔文集",
 "錢仲文集",
 "華陽集",
 "顧非熊詩",
 "翰苑集",
 "權文公集",
 "韓集舉正",
 "外集舉正",
 "敍錄",
 "原本韓文考異",
 "別本韓文考異",
 "遺文",
 "五百家註音辨昌黎先生文集",
 "東雅堂韓昌黎集註",
 "韓集點勘",
 "詁訓柳先生文集",
 "新編外集",
 "增廣註釋音辯柳集",
 "五百家註柳先生集",
 "劉賓客文集",
 "呂衡州集",
 "張司業集",
 "皇甫持正集",
 "李文公集",
 "歐陽行周集",
 "李元賓文編",
 "孟東野集",
 "長江集",
 "昌谷集",
 "箋註評點李長吉歌詩",
 "絳守居園池記註",
 "王司馬集",
 "沈下賢集",
 "追昔遊集",
 "會昌一品集",
 "元氏長慶集",
 "白氏長慶集",
 "白香山詩集",
 "附錄年譜",
 "鮑溶詩集",
 "樊川文集",
 "姚少監詩集",
 "李義山詩集",
 "李義山詩註",
 "李義山文集箋註",
 "溫飛卿集箋註",
 "丁卯集",
 "續補",
 "集外遺詩",
 "文泉子集",
 "梨岳集",
 "李羣玉集",
 "孫可之集",
 "曹祠部集",
 "曹唐詩",
 "麟角集",
 "皮子文藪",
 "笠澤叢書",
 "甫里集",
 "詠史詩",
 "雲臺編",
 "司空表聖文集",
 "韓內翰別集",
 "唐英歌詩",
 "玄英集",
 "唐風集",
 "徐正字詩賦",
 "黃御史集",
 "羅昭諫集",
 "白蓮集",
 "禪月集",
 "浣花集",
 "廣成集",
 "騎省集",
 "河東集",
 "咸平集",
 "逍遙集",
 "寇忠愍公詩集",
 "乖崖集",
 "小畜集",
 "小畜外集",
 "南陽集",
 "武夷新集",
 "和靖詩集",
 "穆參軍集",
 "附錄遺事",
 "晏元獻遺文",
 "文莊集",
 "春卿遺稾",
 "東觀集",
 "宋元憲集",
 "宋景文集",
 "文恭集",
 "武溪集",
 "安陽集",
 "文正集",
 "河南集",
 "孫明復小集",
 "徂徠集",
 "蔡忠惠集",
 "祠部集",
 "鐔津集",
 "祖英集",
 "蘇學士集",
 "蘇魏公集",
 "古靈集",
 "代檀集",
 "傳家集",
 "清獻集",
 "盱江集",
 "金氏文集",
 "公是集",
 "彭城集",
 "邕州小集",
 "都官集",
 "丹淵集",
 "西溪集",
 "鄖溪集",
 "錢塘集",
 "淨德集",
 "馮安岳集",
 "元豐類稾",
 "龍學文集",
 "宛陵集",
 "忠肅集",
 "無為集",
 "王魏公集",
 "范太史集",
 "潞公集",
 "擊壤集",
 "鄱陽集",
 "曲阜集",
 "周元公集",
 "節孝集",
 "文忠集",
 "歐陽文粹",
 "樂全集",
 "忠宣文集",
 "奏議",
 "嘉祐集",
 "臨川集",
 "王荊公詩註",
 "廣陵集",
 "東坡全集",
 "東坡詩集註",
 "東坡年譜",
 "蘇詩續補遺",
 "補註東坡編年詩",
 "欒城集",
 "欒城後集",
 "欒城三集",
 "應詔集",
 "山谷內集",
 "詞",
 "簡尺",
 "山谷內集註",
 "外集註",
 "別集註",
 "後山集",
 "後山詩註",
 "宛邱集",
 "淮海集",
 "長短句",
 "濟南集",
 "參寥子集",
 "寶晉英光集",
 "石門文字禪",
 "青山集",
 "畫墁集",
 "陶山集",
 "倚松老人集",
 "長興集",
 "西塘集",
 "雲巢編",
 "景迂生集",
 "雞肋集",
 "樂圃餘稾",
 "龍雲集",
 "雲溪居士集",
 "演山集",
 "姑溪居士前集",
 "潏水集",
 "學易集",
 "道鄉集",
 "游廌山集",
 "西臺集",
 "樂靜集",
 "北湖集",
 "溪堂集",
 "竹友集",
 "日涉園集",
 "灌園集",
 "慶湖遺老集",
 "摛文堂集",
 "襄陵集",
 "東堂集",
 "浮沚集",
 "劉給事集",
 "劉左史集",
 "竹隱畸士集",
 "唐子西集",
 "洪龜父集",
 "跨鼇集",
 "忠愍集",
 "宗忠簡集",
 "龜山集",
 "梁溪集",
 "初寮集",
 "橫塘集",
 "西渡集",
 "老圃集",
 "丹陽集",
 "浮溪集",
 "浮溪文粹",
 "莊簡集",
 "忠正德文集",
 "東牕集",
 "忠惠集",
 "松隱文集",
 "石林居士建康集",
 "簡齋集",
 "北山小集",
 "檆溪居士集",
 "筠溪集",
 "樂府",
 "忠穆集",
 "紫微集",
 "苕溪集",
 "東牟集",
 "相山集",
 "三餘集",
 "大隱集",
 "龜溪集",
 "栟櫚集",
 "默成文集",
 "澹齋集",
 "韋齋集",
 "玉瀾集",
 "陵陽集",
 "灊山集",
 "雲溪集",
 "盧溪集",
 "屏山集",
 "北海集",
 "鴻慶居士集",
 "內簡尺牘編註",
 "崧菴集",
 "藏海居士集",
 "豫章文集",
 "和靖集",
 "王著作集",
 "郴江百詠",
 "雙溪集",
 "少陽集",
 "歐陽修撰集",
 "東溪集",
 "岳武穆遺文",
 "茶山集",
 "雪溪集",
 "蘆川歸來集",
 "東萊詩集",
 "澹菴文集",
 "五峯集",
 "斐然集",
 "鄧紳伯集",
 "北山集",
 "浮山集",
 "橫浦集",
 "湖山集",
 "文定集",
 "縉雲文集",
 "嵩山居士集",
 "默堂集",
 "知稼翁集",
 "唯室集",
 "漢濱集",
 "香溪集",
 "鄭忠肅奏議遺集",
 "雲莊集",
 "竹軒雜著",
 "拙齋文集",
 "于湖集",
 "太倉稊米集",
 "夾漈遺稿",
 "鄮峯真隱漫錄",
 "燕堂詩稿",
 "海陵集",
 "竹洲集",
 "附棣華雜著",
 "高峯文集",
 "鄂州小集",
 "艾軒集",
 "晦菴集",
 "梁谿遺稾",
 "雪山集",
 "方舟集",
 "網山集",
 "東萊集",
 "止齋文集",
 "格齋",
 "梅溪集",
 "香山集",
 "宮教集",
 "蒙隱集",
 "倪石陵書",
 "樂軒集",
 "定菴類稿",
 "澹軒集",
 "攻媿集",
 "尊白堂集",
 "東塘集",
 "義豐集",
 "涉齋集",
 "蠹齋鉛刀編",
 "乾道稾",
 "淳熙稾",
 "章泉稾",
 "止堂集",
 "緣督集",
 "象山集",
 "附語錄",
 "慈湖遺書",
 "絜齋集",
 "舒文靖集",
 "定齋集",
 "九華集",
 "野處類稿",
 "盤洲集",
 "應齋雜著",
 "芸菴類稾",
 "浪語集",
 "石湖詩集",
 "誠齋集",
 "劍南詩稿",
 "渭南文集",
 "逸稾",
 "放翁詩選前集",
 "附別集",
 "金陵百詠",
 "頤庵居士集",
 "水心集",
 "南湖集",
 "南澗甲乙稾",
 "自鳴集",
 "客亭類稿",
 "石屏集",
 "蓮峯集",
 "江湖長翁文集",
 "燭湖集",
 "省齋集",
 "南軒集",
 "勉齋集",
 "北溪大全集",
 "山房集",
 "橘山",
 "後樂集",
 "竹齋詩集",
 "華亭百詠",
 "梅山續稿",
 "信天巢遺稿",
 "林湖遺稿",
 "江邨遺稿",
 "疎寮小集",
 "性善堂稿",
 "漫塘文集",
 "克齋集",
 "芳蘭軒集",
 "二薇亭集",
 "西巖集",
 "清苑齋集",
 "瓜廬詩",
 "洺水集",
 "龍川文集",
 "龍洲集",
 "鶴山全集",
 "西山文集",
 "方泉集",
 "東山詩選",
 "白石詩集",
 "野谷詩稿",
 "平齋文集",
 "蒙齋集",
 "康範詩集",
 "鶴林集",
 "東澗集",
 "方是閒居士小稾",
 "翠微南征錄",
 "浣川集",
 "漁墅類稿",
 "滄洲塵缶編",
 "安晚堂詩集",
 "四六標準",
 "篔窗集",
 "友林乙稿",
 "方壺存稿",
 "鐵菴集",
 "壺山",
 "默齋遺稿",
 "履齋遺集",
 "臞軒集",
 "東野農歌集",
 "敝帚稿略",
 "清正存稿",
 "寒松閣集",
 "滄浪集",
 "泠然齋集",
 "可齋雜稾",
 "續稿前",
 "續稿後",
 "後村集",
 "澗泉集",
 "矩山存稿",
 "雪牕集",
 "庸齋集",
 "文溪存稿",
 "彝齋文編",
 "張氏拙軒集",
 "靈巖集",
 "玉楮集",
 "楳埜集",
 "恥堂存稿",
 "秋崖集",
 "芸隱橫舟稿",
 "芸隱倦遊稿",
 "蒙川遺稿",
 "雪磯叢稿",
 "北磵集",
 "西塍集",
 "梅屋集",
 "潛山集",
 "字溪集",
 "勿齋集",
 "巽齋文集",
 "雪坡文集",
 "文山集",
 "文信公集杜詩",
 "文山詩史",
 "疊山集",
 "本堂集",
 "汶陽端平詩雋",
 "鬳齋續集",
 "魯齋集",
 "須溪集",
 "須溪四景詩集",
 "葦航漫遊稿",
 "蘭臯集",
 "雲泉詩",
 "嘉禾百詠",
 "柳塘外集",
 "碧梧玩芳集",
 "四明文獻集",
 "覆瓿集",
 "閬風集",
 "北遊集",
 "秋堂集",
 "蛟峯文集",
 "秋聲集",
 "牟氏陵陽集",
 "湖山類稿",
 "水雲集",
 "晞髮集",
 "晞髮遺集",
 "遺集補",
 "附天地閒集",
 "冬青引註",
 "潛齋文集",
 "鐵牛翁遺稿",
 "梅巖文集",
 "四如集",
 "林霽山集",
 "勿軒集",
 "古梅吟稿",
 "佩韋齋文集",
 "廬山集",
 "英溪集",
 "西湖百詠",
 "則堂集",
 "富山遺稿",
 "真山民集",
 "百正集",
 "月洞吟",
 "伯牙琴",
 "存雅堂遺稿",
 "吾汶稿",
 "在軒集",
 "紫巖詩選",
 "九華詩集",
 "寧極齋稿",
 "慎獨叟遺稿",
 "仁山集",
 "自堂存稿",
 "心泉學詩稿",
 "拙軒集",
 "滏水集",
 "滹南遺老集",
 "莊靖集",
 "遺山集",
 "湛然居士集",
 "藏春集",
 "淮陽集",
 "附錄詩餘",
 "陵川集",
 "歸田類稾",
 "白雲集",
 "稼村類稾",
 "桐江續集",
 "野趣有聲畫",
 "月屋漫稾",
 "剡源集",
 "剩語",
 "養蒙集",
 "牆東類稾",
 "桂隱文集",
 "詩集",
 "水雲村稾",
 "巴西文集",
 "屏巖小稾",
 "玉斗山人集",
 "谷響集",
 "竹素山房詩集",
 "紫山大全集",
 "松鄉文集",
 "松雪齋集",
 "吳文正集",
 "金淵集",
 "山村遺集",
 "湛淵集",
 "牧潛集",
 "小亨集",
 "還山遺稿",
 "魯齋遺書",
 "靜修集",
 "青崖集",
 "養吾齋集",
 "存悔齋稿",
 "雙溪醉隱集",
 "東菴集",
 "畏齋集",
 "默菴集",
 "雲峯集",
 "秋澗集",
 "牧菴文集",
 "雪樓集",
 "曹文貞詩集",
 "芳谷集",
 "觀光稾",
 "交州稾",
 "玉堂稾",
 "陳秋巖詩集",
 "蘭軒集",
 "玉井樵唱",
 "清容居士集",
 "此山集",
 "申齋集",
 "霞外詩集",
 "蒲室集",
 "弁山小隱吟錄",
 "續軒渠集",
 "定宇集",
 "艮齋詩集",
 "知非堂稿",
 "雲林集",
 "梅花字字香前集",
 "中菴集",
 "靜春堂集",
 "惟實集",
 "勤齋集",
 "石田集",
 "榘菴集",
 "道園學古錄",
 "道園遺稿",
 "楊仲弘集",
 "范德機詩",
 "文安集",
 "翠寒集",
 "檜亭集",
 "伊濱集",
 "淵穎集",
 "黃文獻集",
 "圭齋集",
 "待制集",
 "閒居叢稿",
 "所安遺集",
 "至正集",
 "圭塘小稿",
 "禮部集",
 "積齋集",
 "燕石集",
 "雁門集",
 "集外詩",
 "杏亭摘稾",
 "安雅堂集",
 "傅與礪詩文集",
 "瓢泉吟稿",
 "筠軒集",
 "俟菴集",
 "滋溪文稾",
 "青陽集",
 "鯨背吟集",
 "近光集",
 "扈從詩",
 "經濟文集",
 "純白齋類稿",
 "圭峯集",
 "蛻菴集",
 "野處集",
 "夢觀集",
 "金臺集",
 "子淵詩集",
 "午溪集",
 "葯房樵唱",
 "栲栳山人集",
 "梅花道人遺墨",
 "玩齋集",
 "羽庭集",
 "不繫舟漁集",
 "居竹軒集",
 "句曲外史集",
 "僑吳集",
 "詠物詩",
 "鹿皮子集",
 "林外野言",
 "傲軒吟稿",
 "師山文集",
 "友石山人遺稿",
 "聞過齋集",
 "學言詩稿",
 "北郭集",
 "玉笥集",
 "青村遺稿",
 "丁鶴年集",
 "貞素齋集",
 "北莊遺稿",
 "一山文集",
 "江月松風集",
 "龜巢集",
 "石初集",
 "山窗餘稾",
 "梧溪集",
 "吾吾類稾",
 "樵雲獨唱",
 "桐山老農集",
 "靜思集",
 "九靈山房集",
 "灤京雜詠",
 "雲陽集",
 "佩玉齋類稾",
 "清閟閣集",
 "玉山璞稾",
 "麟原文集",
 "來鶴亭詩",
 "雲松巢集",
 "環谷集",
 "性情集",
 "花溪集",
 "樗隱集",
 "東山存稿",
 "東維子集",
 "鐵崖古樂府",
 "樂府補",
 "復古詩集",
 "麗則遺音",
 "夷白齋稿",
 "庸菴集",
 "可閒老人集",
 "石門集",
 "明太祖文集",
 "宋學士全集",
 "宋景濂未刻集",
 "誠意伯文集",
 "鳳池吟稾",
 "陶學士集",
 "西隱集",
 "王忠文公集",
 "翠屏集",
 "說學齋稿",
 "登州集",
 "槎翁詩集",
 "東皐錄",
 "柘軒集",
 "白雲稾",
 "密菴集",
 "清江詩集",
 "文集",
 "蘇平仲集",
 "胡仲子集",
 "始豐稿",
 "王常宗集",
 "白石山房逸稾",
 "滄螺集",
 "臨安集",
 "尚絅齋集",
 "考古文集",
 "劉彥昺集",
 "藍山集",
 "藍澗集",
 "大全集",
 "鳧藻集",
 "眉菴集",
 "靜居集",
 "鳴盛集",
 "白雲樵唱集",
 "草澤狂歌",
 "半軒集",
 "西菴集",
 "南村詩集",
 "望雲集",
 "蚓竅集",
 "西郊笑端集",
 "草閣集",
 "筠谷詩",
 "樗菴類稾",
 "春草齋集",
 "耕學齋詩集",
 "可傳集",
 "强齋集",
 "海桑集",
 "畦樂詩集",
 "竹齋集",
 "獨醉亭集",
 "海叟集",
 "隻外詩",
 "榮進錄",
 "梁園寓稿",
 "自怡集",
 "斗南老人集",
 "希澹園詩集",
 "鵞湖集",
 "滎陽外史集",
 "全室外集",
 "峴泉集",
 "唐愚士詩",
 "附會稽懷古詩",
 "繼志齋集",
 "練中丞集",
 "遜志齋集",
 "貞白遺稿",
 "顯忠錄",
 "靜學文集",
 "芻蕘集",
 "巽隱集",
 "易齋集",
 "野古集",
 "文毅集",
 "虛舟集",
 "王舍人詩集",
 "泊菴集",
 "毅齋集",
 "頤菴文選",
 "青城山人集",
 "東里全集",
 "楊文敏集",
 "省愆集",
 "金文靖集",
 "夏忠靖集",
 "抑菴集",
 "運甓漫稿",
 "古廉集",
 "梧岡集",
 "曹月川集",
 "薛文清集",
 "兩溪文集",
 "于忠肅集",
 "蘭庭集",
 "古穰集",
 "武功集",
 "倪文僖集",
 "襄毅文集",
 "白沙集",
 "類博稾",
 "平橋稾",
 "竹巖詩集",
 "彭惠安集",
 "清風亭稾",
 "方洲集",
 "讀史錄",
 "重編瓊臺會稾",
 "謙齋文錄",
 "椒邱文集",
 "石田詩選",
 "東園文集",
 "懷麓堂集",
 "清谿漫稾",
 "康齋文集",
 "樓居雜著",
 "野航詩稾",
 "野航文稾",
 "一峯集",
 "篁墩集",
 "楓山集",
 "莊定山集",
 "未軒文集",
 "醫閭集",
 "翠渠摘稾",
 "家藏集",
 "歸田稾",
 "震澤集",
 "鬱洲遺稾",
 "見素文集",
 "古城集",
 "虛齋集",
 "容春堂前集",
 "羅圭峯文集",
 "吳文肅公摘稾",
 "熊峯集",
 "立齋遺文",
 "西村集",
 "胡文敬公集",
 "小鳴稾",
 "方簡肅文集",
 "懷星堂集",
 "整菴存稿",
 "東江家藏集",
 "空同集",
 "山齋集",
 "浮湘集",
 "山中集",
 "憑几集",
 "息園存稿詩",
 "文",
 "緩慟集",
 "華泉集",
 "劉清惠集",
 "東田遺稾",
 "沙溪集",
 "王文成全書",
 "對山集",
 "柏齋集",
 "竹澗集",
 "竹澗奏議",
 "大復集",
 "洹詞",
 "莊渠遺書",
 "儼山集",
 "迪功集",
 "鄭少谷集",
 "太白山人漫稾",
 "苑洛集",
 "東洲初稾",
 "升菴集",
 "東巖集",
 "瀼溪草堂稿",
 "方齋詩文集",
 "考功集",
 "雲村文集",
 "小山類稿",
 "夢澤集",
 "泰泉集",
 "甫田集",
 "西村詩集",
 "天馬山房遺稿",
 "蘇門集",
 "愚谷集",
 "遵巖集",
 "陸子餘集",
 "念菴集",
 "皇甫司勳集",
 "楊忠介集",
 "荊川集",
 "皇甫少玄集",
 "瑤石山人稾",
 "南行集",
 "東遊集",
 "北觀集",
 "洞麓堂集",
 "張莊僖文集",
 "具茨集",
 "遺稿",
 "青霞集",
 "滄溟集",
 "山海漫談",
 "楊忠愍集",
 "弇州山人四部稿",
 "續稿",
 "讀書後",
 "方麓集",
 "存家詩藁",
 "海壑吟藁",
 "伐檀齋集",
 "備忘集",
 "石洞集",
 "宗子相集",
 "衡廬精舍藏稿",
 "薜荔園集",
 "郭鯤溟集",
 "亦玉堂稿",
 "溫恭毅公集",
 "震川文集",
 "四溟集",
 "蠛蠓集",
 "少室山房類稿",
 "榖城山館詩集",
 "宗伯集",
 "臨臯文集",
 "淡然軒集",
 "涇臯藏稿",
 "小辨齋偶存",
 "事定錄",
 "高子遺書",
 "馮少墟集",
 "石隱園藏藁",
 "仰節堂集",
 "願學集",
 "劉蕺山集",
 "學古緒言",
 "檀園集",
 "忠介燼餘集",
 "范文忠集",
 "幔亭詩集",
 "孫白谷集",
 "集玉山房藁",
 "宋布衣集",
 "倪文貞集",
 "講編",
 "凌忠介集",
 "茅簷集",
 "申忠愍詩集",
 "陶菴全集",
 "聖祖仁皇帝御製文集",
 "世宗憲皇帝御製文集",
 "御製樂善堂文集定本",
 "御製文初集",
 "御製詩初集",
 "四集",
 "梅村集",
 "湯子遺書",
 "兼濟堂文集",
 "學餘堂文集",
 "忠貞集",
 "林蕙堂集",
 "精華錄",
 "堯峯文鈔",
 "午亭文編",
 "讀書齋偶存稿",
 "松桂堂全集",
 "延露詞",
 "南𣶂集",
 "曝書亭集",
 "政書",
 "愚菴小集",
 "抱犢山房集",
 "文端集",
 "西河文集",
 "陳檢討",
 "蓮洋詩鈔",
 "張文貞集",
 "西陂類稾",
 "鐵廬集",
 "湛園集",
 "古懽堂集",
 "黔書",
 "長河志籍考",
 "榕村集",
 "三魚堂文集",
 "因園集",
 "懷清堂集",
 "二希堂文集",
 "敬業堂集",
 "望溪集",
 "存硯樓文集",
 "香屑集",
 "鹿洲初集",
 "樊榭山房集",
 "果堂集",
 "松泉文集",
 "文選註",
 "六臣註文選",
 "文選顏鮑謝詩評",
 "玉臺新詠",
 "玉臺新詠考異",
 "高氏三宴詩集",
 "香山九老詩",
 "篋中集",
 "河岳英靈集",
 "國秀集",
 "唐御覽詩",
 "唐歌詩一名選進集一名元和御覽",
 "中興閒氣集",
 "極玄集",
 "松陵集",
 "二皇甫集",
 "唐四僧詩",
 "薛濤李冶詩集",
 "竇氏聯珠集",
 "才調集",
 "搜玉小集",
 "古文苑",
 "文苑英華",
 "唐文粹",
 "西崑酬唱集",
 "同文館唱和詩",
 "唐百家詩選",
 "會稽掇英總集",
 "清江三孔集",
 "三劉家集",
 "宋文選",
 "坡門酬唱集",
 "樂府詩集",
 "古今歲時雜詠",
 "嚴陵集",
 "南嶽倡酬集",
 "萬首唐人絕句詩",
 "宋文鑑",
 "古文關鍵",
 "回文類聚",
 "五百家播芳大全文粹",
 "崇古文訣",
 "成都文類",
 "文章正宗",
 "天台前集",
 "前集別編",
 "續集拾遺",
 "續集別編",
 "赤城集",
 "妙絕古今",
 "唐僧宏秀集",
 "眾妙集",
 "江湖小集",
 "江湖後集",
 "三體唐詩",
 "論學繩尺",
 "吳都文粹",
 "古文集成前集",
 "文章軌範",
 "月泉吟社詩",
 "文選補遺",
 "蘇門六君子文粹",
 "三國文類",
 "增註唐策",
 "十先生奧論註前集",
 "詩家鼎臠",
 "兩宋名賢小集",
 "柴氏四隱集",
 "中州集",
 "中州樂府",
 "唐詩鼓吹",
 "二妙集",
 "瀛奎律髓",
 "谷音",
 "梅花百咏",
 "河汾諸老詩集",
 "天下同文集",
 "古賦辨體",
 "圭塘欸乃集",
 "忠義集",
 "宛陵羣英集",
 "元文類",
 "元風雅前集",
 "唐音",
 "古樂府",
 "玉山名勝集",
 "草堂雅集",
 "玉山紀游",
 "大雅集",
 "元音遺響",
 "風雅翼",
 "荊南倡和集",
 "乾坤清氣集",
 "元音",
 "雅頌正音",
 "唐詩品彙",
 "廣州四先生詩",
 "三華集",
 "閩中十子詩",
 "元詩體要",
 "滄海遺珠",
 "中州名賢文表",
 "明文衡",
 "新安文獻志",
 "海岱會集",
 "經義模範",
 "文編",
 "古詩紀",
 "詩紀匡謬",
 "全蜀藝文志",
 "古今詩刪",
 "唐宋元名表",
 "文氏五家集",
 "宋藝圃集",
 "元藝圃集",
 "吳都文粹續集",
 "石倉歷代詩選",
 "四六法海",
 "古樂苑",
 "皇霸文紀",
 "西漢文紀",
 "東漢文紀",
 "西晉文紀",
 "宋文紀",
 "南齊文紀",
 "梁文紀",
 "陳文紀",
 "北齊文紀",
 "後周文紀",
 "隋文紀",
 "釋文紀",
 "文章辨體彙選",
 "古詩鏡",
 "唐詩鏡",
 "漢魏六朝一百三家集",
 "古今禪藻集",
 "三家宮詞",
 "二家宮詞",
 "御選古文淵鑒",
 "御定全唐詩",
 "御定全金詩",
 "御選四朝詩",
 "御定佩文齋詠物詩選",
 "御定題畫詩類",
 "御定歷代賦彙",
 "逸句",
 "御選唐詩",
 "御定千叟宴詩",
 "御選唐宋文醇",
 "御選唐宋詩醇",
 "皇清文穎一百廿",
 "欽定四書文",
 "欽定千叟宴詩",
 "明文海",
 "二家詩選",
 "唐賢三昧集",
 "唐人萬首絕句選",
 "明詩綜",
 "宋詩鈔",
 "宋元詩會",
 "粵西詩載",
 "粵西文載",
 "粵西叢載",
 "元詩選首",
 "初集",
 "全唐詩錄",
 "甬上耆舊詩",
 "檇李詩繫",
 "古文雅正",
 "鄱陽五家集",
 "南宋雜事詩",
 "宋百家詩存",
 "文心雕龍輯註",
 "優古堂詩話",
 "詩話總龜前集",
 "四六話",
 "藏海詩話",
 "唐詩紀事",
 "觀林詩話",
 "苕溪漁隱叢話前集",
 "誠齋詩話",
 "餘師錄",
 "後村詩話前集",
 "草堂詩話",
 "文章精義",
 "竹莊詩話",
 "浩然齋雅談",
 "詩林廣記前集",
 "文說",
 "修辭鑑衡",
 "金石例",
 "作義要訣",
 "墓銘舉例",
 "懷麓堂詩話",
 "頤山詩話",
 "詩話補遺",
 "唐音癸籤",
 "歷代詩話",
 "聲調譜",
 "談龍錄",
 "宋詩紀事",
 "全閩詩話",
 "五代詩話",
 "珠玉詞",
 "樂章集",
 "安陸集",
 "六一詞",
 "東坡詞",
 "山谷詞",
 "淮海詞",
 "書舟詞",
 "小山詞",
 "晁无咎詞",
 "姑溪詞",
 "東堂詞",
 "溪堂詞",
 "片玉詞",
 "初寮詞",
 "友古詞",
 "和清真詞",
 "聖求詞",
 "石林詞",
 "筠溪樂府",
 "丹陽詞",
 "坦菴詞",
 "酒邊詞",
 "無住詞",
 "竹坡詞",
 "漱玉詞",
 "蘆川詞",
 "東浦詞",
 "孏窟詞",
 "逃禪詞",
 "于湖詞",
 "海野詞",
 "審齋詞",
 "介菴詞",
 "歸愚詞",
 "克齋詞",
 "稼軒詞",
 "龍川詞",
 "西樵語業",
 "放翁詞",
 "樵隱詞",
 "知稼翁詞",
 "蒲江詞",
 "平齋詞",
 "白石道人歌曲",
 "夢窗稿",
 "惜香樂府",
 "龍洲詞",
 "竹屋癡語",
 "竹齋詩餘",
 "梅溪詞",
 "石屏詞",
 "散花菴詞",
 "斷腸詞",
 "山中白雲詞",
 "竹山詞",
 "天籟集",
 "蛻巖詞",
 "珂雪詞",
 "花間集",
 "尊前集",
 "樂府雅詞",
 "花菴詞選",
 "類編草堂詩餘",
 "絕妙好詞箋",
 "樂府補題",
 "花草粹編",
 "御定歷代詩餘",
 "詞綜",
 "十五家詞",
 "沈氏樂府指迷",
 "渚山堂詞話",
 "詞話",
 "詞苑叢談",
 "欽定詞譜",
 "詞律",
 "欽定曲譜",
 "中原音韻",
 "周易注疏",
 "附略例",
 "漢上易傳",
 "易義海撮要",
 "交公易說",
 "周易裨傳",
 "周易鄭注",
 "束谷易翼傳",
 "易傳義附錄",
 "俞氏集說",
 "易本義通釋",
 "易本義附錄纂注",
 "周易啟蒙翼傳",
 "易象數鉤深圖",
 "易緯",
 "尚書注疏",
 "增修東萊書說",
 "書經集傳",
 "書集傳纂疏",
 "書傳纂注",
 "尚書纂傳",
 "禹貢地理圖",
 "毛詩注疏",
 "詩經集傳",
 "毛詩解頤",
 "御纂詩義折中",
 "詩地理考",
 "毛詩名物鈔",
 "詩疏廣要",
 "左傳注疏",
 "左傳事類始末",
 "公羊注疏",
 "榖梁注疏",
 "尊王發微",
 "春秋劉氏傳",
 "蘇氏春秋集解",
 "葉氏春秋傳",
 "春秋列國臣傳",
 "春秋胡氏傳",
 "春秋集註",
 "春秋釋義大成",
 "春秋會通",
 "春秋闕疑",
 "春秋世紀編",
 "禮記注疏",
 "陳氏禮記集說",
 "孝經注疏",
 "論語注疏",
 "論語解",
 "孟子注疏",
 "孟子說",
 "四書章句集註",
 "經說",
 "爾雅注疏",
 "玉篇",
 "清文鑑",
 "古今韻會",
 "御定音韻闡微",
 "唐書",
 "附釋音",
 "五代史",
 "金史一百卅",
 "前漢紀",
 "通鑑綱目正編",
 "太祖聖訓",
 "太宗聖訓",
 "世祖聖訓",
 "聖祖聖訓",
 "聖祖庭訓格言",
 "世宗聖訓",
 "硃批諭旨",
 "皇朝禮器圖式廿",
 "欽定西清古鑑",
 "經世圖譜",
 "家語",
 "御製資政要覽",
 "御纂性理精義",
 "欽定執中成憲",
 "御製日知薈說",
 "戰國策",
 "素問",
 "玉龍經",
 "御定醫宗金鑑",
 "欽定授時通考",
 "參同契通真義",
 "御製曆象考成",
 "御製律呂正義",
 "御製數理精蘊",
 "御製曆象考成後編",
 "欽定儀象考成",
 "道德經",
 "莊子",
 "新唐書糾繆",
 "御定佩文齋書畫譜",
 "欽定淳化閣帖釋文",
 "聖祖御製文集",
 "世宗御製文集",
 "樂善堂全集定本",
 "高宗御製文初集",
 "高宗御製詩初集",
 "徐孝穆集",
 "庾子山集注",
 "王右丞集",
 "外編附錄",
 "集千家注杜工部集",
 "柳河東集",
 "五百家注昌黎文集",
 "李義山文集箋注",
 "李義山詩集注",
 "范文正集",
 "尺牘",
 "端明集",
 "臨川文集",
 "施注蘇詩",
 "伐檀集",
 "后山集",
 "放翁逸稿",
 "止齋集",
 "龍川集",
 "滹南集",
 "石田文集",
 "仲弘集",
 "文獻集",
 "圭齋文集",
 "文憲集",
 "御選宋詩",
 "御選金詩",
 "御選元詩",
 "御選明詩",
 "御定歷代題畫詩類",
 "皇清文穎",
 "楚辭補注",
 "文選",
 "漢魏六朝百三家集",
 "元詩選初集",
 "御定詞譜",
 "御選歷代詩餘",
 "用易詳解",
 "淙山讀周易",
 "易源奧義",
 "易像鈔",
 "春秋左傳讞",
 "榖梁傳讞",
 "春秋左傳要義",
 "春秋分記",
 "十三經注疏正字",
 "武經總要前集",
 "脚氣治法總要",
 "扁鵲神應鍼炙玉龍經",
 "硯山齋雜記",
 "襄陵文集",
 "東窗集",
 "筠谿集",
 "定庵類稿",
 "芸庵類藳",
 "滄州塵缶編",
 "泠然齋詩集",
 "可齋雜藳",
 "續藳前",
 "葦航漫游稿",
 "稼村類藳",
 "東庵集",
 "秋巖詩集",
 "佩玉齋類藳",
 "樗菴類藳",
 "玉山紀遊",
 "綠苔軒集",
 "種菊庵集",
 "錦樹集",
 "淶水詩集",
 "太史詩集",
 "博士詩集",
 "和州詩集",
 "錄事詩集",
 "吳園周易解",
 "總論",
 "易緯乾坤鑿度",
 "易緯乾鑿度",
 "附校勘記",
 "春秋攷",
 "校勘記",
 "欽定詩經樂譜全書",
 "五代史纂誤",
 "御選明臣奏議",
 "琉球國志略",
 "附御製文",
 "畿輔安瀾志",
 "附考異",
 "建炎以來朝野雜記甲集",
 "乙集",
 "欽定四庫全書總目",
 "淳化閣帖釋文",
 "公是弟子記",
 "小兒藥證真訣",
 "雲谷雜紀",
 "攷古質疑",
 "欽定四庫全書考證",
 "遺",
 "老子道德經",
 "元憲集",
 "景文集",
 "公是集五十四卷拾遺一卷續拾遺一卷",
 "山谷內集詩注二十卷外集詩注十七卷別集詩注二卷外集補四卷別集補一卷",
 "后山詩",
 "柯山集五十卷拾遺十二卷續拾遺一卷",
 "附拾遺",
 "乾道稿二卷",
 "淳熙稿二十卷",
 "章泉稿五卷",
 "章泉稿拾遺一卷",
 "南澗甲乙稿",
 "牧庵集",
 "牧庵年譜",
 "御製詩文十全集",
 "悅心集",
 "萬壽衢歌樂章",
 "詩倫",
 "武英殿聚珍版程式",
 "沈氏四聲考",
 "唐人試律說",
 "刪正二馮評閱才調集",
 "刪正方虛谷瀛奎律髓",
 "後山集鈔",
 "張為主客圖",
 "風雅遺音",
 "庚辰集",
 "館課存藳",
 "李氏易傳",
 "附周易音義",
 "鄭氏周易",
 "周易爻辰圖",
 "鄭司農集",
 "附補遺",
 "松牕雜錄",
 "采石瓜洲斃亮記",
 "北牕炙輠錄",
 "文山題跋",
 "遺山題跋",
 "大理行記",
 "雲煙過眼續錄",
 "筆麈",
 "雲閒雜誌",
 "周公諡法",
 "武王踐阼記",
 "弟子職",
 "書序",
 "荀卿子",
 "樂記",
 "賈子新書",
 "揚子法言",
 "說文",
 "續述記",
 "呂覽",
 "戴氏遺書",
 "東原文集",
 "杲溪詩經補注",
 "孟子字義疏證",
 "聲類表",
 "續天文略",
 "方言疏證",
 "算經十書",
 "策算",
 "九章重差",
 "附考證",
 "句股割圜記",
 "春秋地名",
 "孟子．",
 "五經文字疑",
 "新加九經字樣",
 "九經字樣疑",
 "水經釋地",
 "雜體文藳",
 "同度記",
 "長行經",
 "紅櫚書屋詩集",
 "㓸冰詞",
 "古文辭彙纂序目",
 "四六叢話緣起",
 "魏伯子雜說",
 "魏叔子文集外篇",
 "微波榭遺書",
 "習園藏稿",
 "鶚亭詩話",
 "切時政要",
 "蜀遊記",
 "楚辭達",
 "滇海虞衡記",
 "課餘隨錄",
 "御覽闕史",
 "客杭日記",
 "經筵玉音問答",
 "榕城詩話",
 "對牀夜語",
 "閒者軒帖考",
 "清虛雜著",
 "補闕",
 "滹南詩話",
 "黃孝子紀程",
 "尋親紀程",
 "滇還日記",
 "澹生堂藏書約",
 "流通古書約",
 "苦瓜和尚畫語錄",
 "論語集解義疏",
 "蘋洲漁笛譜",
 "於潛令樓公進耕織二圖詩",
 "責備餘談",
 "附羣公帖跋",
 "石刻鋪叙",
 "江西詩派小序",
 "詩傳注疏",
 "附攷證",
 "故宮遺錄",
 "洞霄詩集",
 "石湖詞",
 "和石湖詞",
 "花外集",
 "碧山樂府",
 "昌武段氏詩義指南",
 "離騷集傳",
 "山居新話",
 "鬼董",
 "今水經",
 "表",
 "佐治藥言",
 "相臺書塾刊正九經三傳沿革例",
 "元真子",
 "承旨學士院記",
 "翰林學士記",
 "翰林院故事",
 "翰林學士院舊規",
 "重修承旨學士壁記",
 "禁林讌會集",
 "次續翰林志",
 "學士年表",
 "翰苑題名",
 "碧血錄",
 "周端孝先生血疏貼黃冊",
 "張子野詞",
 "貞居詞",
 "集事詩鑒",
 "天水冰山錄不分卷附錄一卷",
 "鈐山堂書畫記",
 "修唐書史臣表",
 "皇宋書錄",
 "蘇沈內翰良方",
 "宜州乙酉家乘",
 "頤菴居士集",
 "西塘集耆舊續聞",
 "勿菴歷算書目",
 "黃山領要錄",
 "世善堂藏書目錄",
 "測圓海鏡細草",
 "五代史記纂誤補",
 "山靜居畫論",
 "茗香詩論",
 "孝經鄭註",
 "附補證",
 "孝經鄭氏解",
 "弧矢算術細草",
 "黃氏日抄古今紀要逸編",
 "丙寅北行日譜",
 "粵行紀事",
 "三山鄭菊山先生清雋集",
 "所南翁一百二十圖詩集",
 "附錦錢餘笑",
 "鄭所南先生文集",
 "重彫足本鑒誡錄",
 "松窗百說",
 "北軒筆記說",
 "吳禮部詩話",
 "讀易別錄",
 "古今偽書考",
 "石湖紀行三錄",
 "北行日錄",
 "放翁家訓",
 "湛淵遺藳",
 "趙待制遺藳",
 "王國器詞",
 "陽春集",
 "草窗詞",
 "吹劒錄外集",
 "宋遺民錄",
 "天地閒集",
 "宋舊官人詩詞",
 "竹譜詳錄",
 "書學捷要",
 "履齋示兒編",
 "附校補",
 "覆校",
 "霽山先生集",
 "五行大義",
 "梅花喜神譜",
 "斜川集",
 "訂誤",
 "道命錄",
 "透簾細草",
 "續古摘奇算法",
 "丁巨算法",
 "緝古算經細草",
 "縐雲石圖記",
 "靜春堂詩集",
 "紅蕙山房吟藳",
 "克庵先生尊德性齋小集",
 "全唐詩逸",
 "廣釋名",
 "餘姚兩孝子萬里尋親記",
 "畫梅題記",
 "陶靖節先生詩",
 "補注",
 "謝宣城詩集",
 "國山碑攷",
 "詩譜補亡後訂",
 "桃溪客語",
 "拙政園詩集",
 "靜庵賸稿",
 "拙政園詩餘",
 "玉窗遺稿",
 "梅花園存稿",
 "許氏詩譜鈔",
 "扶風傳信錄",
 "王節愍公遺集",
 "西湖蘇文忠公祠從祀議",
 "南宋方爐題咏",
 "讒書",
 "附校",
 "孫氏爾雅正義拾遺",
 "拜經樓詩集十二卷續編四卷再續編一卷",
 "萬花漁唱",
 "珠樓遺稿",
 "哀蘭絕句",
 "蠡塘漁乃",
 "海潮說",
 "論印絕句",
 "孟子外書四篇",
 "棠湖詩稿",
 "蜀石經毛詩考異",
 "拜經樓詩話",
 "愚谷文存",
 "拜經樓藏書題跋記",
 "都公譚纂",
 "北牕瑣語",
 "南中紀聞",
 "耳新",
 "屏居十二課",
 "夢憶",
 "汴京勼異記",
 "小隱書全帖",
 "嶠南瑣記",
 "揮麈詩話",
 "敝帚齋餘談",
 "槎上老舌",
 "冷賞",
 "說文解字韻譜",
 "主客圖",
 "寶藏論",
 "心要經",
 "鄭氏古文尚書",
 "程氏考古編",
 "敷文鄭氏書說",
 "洪範統",
 "東坡烏臺詩案",
 "韓氏山水純全集",
 "產育寶慶集",
 "出行寶鏡",
 "翼元",
 "靖康傳信錄",
 "淳熙薦士錄",
 "青溪弄兵錄",
 "建炎筆錄",
 "辯誣筆錄",
 "采石瓜州斃亮記",
 "家訓筆錄",
 "建炎以來朝野襍記甲集",
 "省心襍言",
 "三國紀年",
 "肎綮錄",
 "燕魏雜記",
 "鳴鶴餘音",
 "升菴經說",
 "檀弓叢訓",
 "山海經補註",
 "秇林伐山",
 "古雋",
 "謝華啟秀",
 "哲匠金桴",
 "均薻",
 "升庵韻學七種",
 "古音後語",
 "古音附錄",
 "古音複字",
 "希姓錄",
 "升菴詩話",
 "法帖神品目",
 "名畫神品目",
 "金石古文",
 "古文韻語",
 "石鼓文音釋",
 "風雅逸篇",
 "古今風謠",
 "俗言",
 "𠩏麗情集",
 "升庵先生（楊慎）年譜",
 "大學古本旁註",
 "月令氣候圖說",
 "尚書古文考",
 "詩音辯略",
 "夏小正箋",
 "蜀語",
 "蜀碑記",
 "中麓畫品",
 "巵辭",
 "周禮摘箋",
 "儀禮古今考",
 "禮記補註",
 "易古文",
 "逸孟子",
 "十三經注疏錦字",
 "左傳官名考",
 "春秋三傳比",
 "蜀碑記補",
 "卍齊璅錄",
 "諸家藏畫簿",
 "博物要覽",
 "金石存",
 "通俗編",
 "南越筆記",
 "賦話",
 "詩話",
 "曲話",
 "六書分毫",
 "古音合",
 "尾蔗叢談",
 "奇字名",
 "樂府侍兒小名",
 "通詁",
 "勦說",
 "四家選集",
 "小倉選集",
 "夢樓選集",
 "甌北選集",
 "童山選集",
 "制義科瑣記",
 "然犀志",
 "出口程記",
 "方言藻",
 "粵風",
 "粵歌",
 "猺歌",
 "苗歌",
 "獞歌",
 "蜀雅",
 "醒園錄",
 "萬善堂集",
 "李石亭詩集",
 "李石亭文集",
 "金五代詩九",
 "童山詩集",
 "粵東皇華集",
 "淡墨錄",
 "羅江縣志",
 "翼玄",
 "州縣提網",
 "馮尊師二十首",
 "升菴先生（楊慎）年譜",
 "尚書古字辨異",
 "鄭氏古文尚書證訛",
 "童山詩音說",
 "春秋左傳會要",
 "雨村詩話",
 "雨村詞話",
 "雨村曲話",
 "樂府侍兒小名錄",
 "諸家藏書簿",
 "井蛙雜記",
 "全五代詩",
 "夏小正攷注",
 "老子道德經攷異",
 "附篇目考",
 "釋名疏證",
 "續釋名",
 "王隱晉書地道記",
 "晉太康三年地記",
 "晉書地理志新補正",
 "附圖",
 "說文解字舊音",
 "明堂大道錄",
 "禘說",
 "關中金石記",
 "中州金石記",
 "音同義異辯",
 "經典文字辨證書",
 "儀禮注疏詳校",
 "校正補遺",
 "附校勘補遺",
 "考",
 "闕文",
 "附注補併重校",
 "注補正",
 "壬子年重校",
 "羣書拾補初編",
 "五經正義表",
 "周易注疏校正",
 "周易略例校正",
 "尚書注疏校正",
 "春秋左傳注疏校正",
 "禮記注疏校補",
 "儀禮注疏校正",
 "呂氏讀詩記補闕",
 "史記惠景間侯者年表校補",
 "續漢書志注補校正",
 "晉書校正",
 "魏書校補",
 "宋史孝宗紀補脫",
 "金史補脫",
 "資治通鑑序補逸",
 "文獻通考經籍校補",
 "史通校正",
 "新唐書糾謬校補",
 "山海經圖讚補逸",
 "水經序補逸",
 "鹽鐵論校補",
 "新序校補",
 "說苑校補",
 "申鑒校正",
 "列子張湛注校正",
 "韓非子校正",
 "晏子春秋校正",
 "風俗通義校正逸文",
 "新論校正",
 "潛虛校正",
 "春渚紀聞補闕",
 "嘯堂集古錄校補",
 "鮑照集校補",
 "韋蘇州集校正拾遺",
 "元微之文集校補",
 "白氏文集校正",
 "林和靖集校正",
 "明史藝文志",
 "宋史藝文志補",
 "補遼金元藝文志",
 "鍾山札記",
 "龍城札記",
 "解舂集文鈔",
 "詩鈔",
 "抱經堂文集",
 "春秋左傳補註",
 "左傳評",
 "四聲切韻表",
 "聲韻考",
 "鳳墅殘帖釋文",
 "牧民忠告",
 "風憲忠告",
 "廟堂忠告",
 "蒿庵閒話",
 "離騷草木巰",
 "於潛令樓公進耕職二圖詩",
 "本朝名家詩鈔小傳",
 "蔗塘外集",
 "諾皐記",
 "李泌傳",
 "仙吏傳",
 "英雄傳",
 "馮燕傳",
 "蔣子文傳",
 "杜子春傳",
 "龍女傳",
 "妙女傳",
 "神女傳",
 "李娃傳",
 "非烟傳",
 "南柯記",
 "枕中記",
 "揚州夢記",
 "妝樓記",
 "雷民傳",
 "離魂記",
 "再生記",
 "幻戲志",
 "幻異志",
 "靈應傳",
 "遺史記聞",
 "小娥傳",
 "陶說",
 "說郛雜著",
 "王烈婦",
 "西北域記",
 "盆玩箋",
 "魚鶴箋",
 "山齋箋",
 "麗體金膏",
 "拜颺集",
 "峝谿纖志",
 "韻學指要",
 "古樂復興錄",
 "明堂問",
 "白鷺洲主客說詩",
 "八紘譯史",
 "八紘荒史",
 "西番譯語",
 "西藏記",
 "說文解字繫傳",
 "庭聞錄",
 "六經奧論鈔",
 "西湖月觀",
 "太公三略",
 "江東十鑑",
 "笨夫詩鈔",
 "滄洲近詩",
 "七頌堂詩集",
 "風塵備忘錄",
 "公餘偶筆",
 "太上黃庭內景玉經童註",
 "黃帝陰符經竊註",
 "烏衣香牒",
 "春駒小譜",
 "說儲",
 "自湖廣武陵至貴州水旱路程記",
 "龍湖閒話",
 "龍舒居士淨土文",
 "閑窗括異志",
 "博識續箋",
 "搜採異聞錄",
 "殷芸小說",
 "奉天錄",
 "附盧注攷證",
 "古文尚書",
 "逸文",
 "蒼頡篇",
 "燕丹子",
 "孫子十家註",
 "附敍錄",
 "遺說",
 "元和郡縣圖志",
 "括地志",
 "故唐律疏議",
 "釋文纂例",
 "宋提刑洗寃集錄",
 "附聖朝頒降新例",
 "問字堂集",
 "岱南閣集",
 "泲上停雲集",
 "平津館文稿",
 "五松園文稿",
 "嘉穀堂集",
 "夏小正傳",
 "急就章考異",
 "王無功集",
 "附逸文",
 "魏武帝註孫子",
 "司馬灋",
 "牟子",
 "黃帝五書",
 "黃帝龍首經",
 "黃帝金匱玉衡經",
 "黃帝援三子玄女經",
 "廣黃帝本行記",
 "軒轅黃帝傳",
 "漢禮器制度",
 "漢官",
 "漢官解詁",
 "漢舊儀",
 "漢官典職儀式選用",
 "漢儀",
 "魏三體石經遺字考",
 "琴操",
 "物理論",
 "譙周古史考",
 "華氏中藏經",
 "素女方",
 "千金寶要",
 "祕授清寧丸方",
 "寰宇訪碑錄",
 "建立伏博士始末",
 "續古文苑",
 "尚書今古文注疏",
 "芳茂山人詩錄",
 "長離閣詩集",
 "易義攷逸",
 "馬王易義",
 "儀禮喪服馬王注",
 "禹貢地理古注考",
 "釋人注",
 "毛詩馬王微",
 "明堂考",
 "鄭氏遺書",
 "爾雅漢注",
 "說文正字",
 "江寧金石待訪錄",
 "神農本草經",
 "逸子書",
 "許慎淮南子注",
 "桓子新論",
 "典論",
 "皇覽",
 "司馬彪莊子注",
 "莊子注考逸",
 "列女詩并序",
 "孟子劉注",
 "經典集林",
 "歸藏",
 "春秋決獄",
 "石渠禮論",
 "喪服變除",
 "六藝論",
 "春秋土地名",
 "汲冢瑣語",
 "楚漢春秋",
 "茂陵書",
 "七略",
 "蜀王本紀",
 "鄭玄別傳",
 "臨海記",
 "公孫尼子",
 "魯連子",
 "太公金匱",
 "氾勝之書",
 "黃帝問玄女兵法",
 "靈憲",
 "渾天儀",
 "師曠占",
 "范子計然",
 "白澤圖",
 "漢志水道考證",
 "二渠九河考",
 "關中水道記",
 "後漢書補表",
 "文選理學權輿",
 "文選理學權輿補",
 "文選考異",
 "文選李注補正",
 "李氏易解賸義",
 "明畫錄",
 "好古堂書畫記",
 "香研居詞麈",
 "精選名儒草堂詩餘",
 "遂昌山人雜錄",
 "北牕炙輠",
 "皇朝武功紀盛",
 "梅磵詩話",
 "御史臺精舍碑題名",
 "郎官石柱題名",
 "新刊祕訣三命指迷賦",
 "乾元秘旨",
 "質疑",
 "文瑞樓藏書目錄",
 "學治臆說",
 "續說",
 "說贅",
 "月滿樓詩別集",
 "晉十六國詠史詩",
 "北齊詠史詩",
 "南都詠史詩",
 "南唐雜事詩",
 "五代詠史詩",
 "勝國宮闈詩",
 "懷師友詩",
 "劉涓子鬼遺方",
 "雲莊四六餘話",
 "玉山璞稿",
 "玉山逸稿",
 "滄浪櫂歌",
 "周禮",
 "附札記",
 "儀禮",
 "附校錄",
 "續校",
 "夏小正經傳集解",
 "梁公九諫",
 "汲古閣珍藏秘本書目",
 "延令宋版書目",
 "季滄葦藏書目",
 "藏書記要",
 "洪氏集驗方",
 "博物誌",
 "新刊宣和遺事前集",
 "百宋一廛賦",
 "汪本隸釋刊誤",
 "蕘言",
 "述德繼聲",
 "省餘游草",
 "三經音義",
 "孝經今文音義",
 "論語音義",
 "船山詩選",
 "同人唱和詩",
 "夢境圖唱和詩集",
 "狀元會倡和詩集",
 "虎丘詩唱和詩集",
 "千手千眼觀世音菩薩廣大圓滿無礙大悲心陀羅尼經",
 "泰軒易傳",
 "周易經疑",
 "詩義指南",
 "詩傳注巰",
 "新編詩義集說",
 "禮記要義",
 "五服圖解",
 "九經疑",
 "四書箋義",
 "紀遺",
 "讀論語叢說",
 "讀中庸叢說",
 "四書待問",
 "樂書要錄",
 "爾雅新義",
 "集篆古文韻海",
 "隸韻",
 "續古篆韻",
 "增廣鐘鼎篆韻",
 "續復古編",
 "一切經音義",
 "通紀（一名通曆）",
 "資治通鑑釋文",
 "編年通載",
 "增入名儒講義皇宋中興兩朝聖政",
 "分類事目",
 "皇宋通鑑長編紀事本末",
 "皇元征緬錄",
 "招捕總錄",
 "唐陸宣公奏議註",
 "賢良進卷",
 "諸葛武侯傳",
 "運使復齋郭公言行錄",
 "九國志殘本",
 "雲間志",
 "嘉定鎮江志",
 "淳祐臨安志",
 "玉峰志",
 "玉峰續志",
 "至順鎮江志",
 "崑山郡志",
 "重修琴川志",
 "南嶽總勝集",
 "莆陽比事",
 "長春子遊記",
 "遊志續編",
 "大常因革禮",
 "律文",
 "衢本郡齋讀書志",
 "致堂讀史管見",
 "孔叢子注",
 "聱隅子",
 "孫子十家注",
 "孫子遺說",
 "司馬法直解",
 "尉繚子直解",
 "難經集注",
 "中藏經",
 "玉函經",
 "史載之方",
 "傷寒明理論",
 "陳氏小兒病源方論",
 "類編朱氏集驗醫方",
 "大宋寶祐四年丙辰歲會天萬年具注曆",
 "楊氏算法",
 "四元玉鑑",
 "嘉量算經",
 "問答",
 "六壬大占",
 "遁甲符應經",
 "三術撮要",
 "三曆撮要",
 "書經補遺",
 "羣書治要",
 "臣軌",
 "為政善報事類",
 "養正圖解",
 "左氏摘奇",
 "回溪先生史韻",
 "自號錄",
 "漢唐事箋前集",
 "羣書通要",
 "歷代蒙求纂注",
 "策要",
 "羣書類編故事",
 "續世說",
 "醉翁談錄",
 "夷堅甲志",
 "乙志",
 "丙志",
 "丁志",
 "古清涼傳",
 "廣清涼傳",
 "續清涼傳",
 "黃帝陰符經疏",
 "道德真經傳",
 "道德真經集解",
 "道德經解義",
 "道德經論兵要義述",
 "關尹子言外經旨",
 "列子注",
 "通玄真經注",
 "陸士衡文集",
 "支遁集",
 "陶靖節詩註",
 "華陽陶隱居集",
 "岑嘉州集",
 "釣磯文集",
 "晁具茨先生詩集",
 "增廣箋註簡齋詩集",
 "玉堂類藳",
 "西垣類藳",
 "毅齋詩集別錄",
 "平安悔稿",
 "南海百詠",
 "史詠集",
 "古逸民先生集",
 "桐江集",
 "貞一齋文",
 "詩稿",
 "蟻術詩選",
 "梅花百詠",
 "玉山璞槁",
 "東皐先生詩集",
 "王徵士詩",
 "松雨軒詩集",
 "慎齋集",
 "觀瀾文集甲集",
 "注解章泉澗泉二先生選唐詩",
 "分門纂類唐歌詩",
 "東漢文鑑",
 "諸儒奧論策學統宗前集",
 "詩苑眾芳",
 "元風雅",
 "青雲梯",
 "編類運使復齋郭公敏行錄",
 "聲律關鍵",
 "詳註周美成片玉集",
 "樵歌",
 "王周士詞",
 "遺山樂府",
 "蟻術詞選",
 "陽春白雪",
 "名儒草堂詩餘",
 "名家詞",
 "詞源",
 "新增詞林要韻",
 "九經疑難",
 "東臯先生詩集",
 "尚書鄭注",
 "尚書中候鄭注",
 "司馬氏書儀",
 "爾雅鄭註",
 "正文",
 "讀詩拙言",
 "建炎維揚遺錄",
 "建炎復辟記",
 "吳地說",
 "古本葬書",
 "葬經翼不分卷圖",
 "八陣合變圖說",
 "增廣太平惠民和劑局方",
 "用藥總論",
 "法書要",
 "西陽雜俎",
 "鑒誡錄",
 "蒙求正文",
 "集註",
 "象教皮編",
 "周禮序官考",
 "考定檀弓",
 "惠氏讀說文記",
 "席氏讀說文記",
 "音學辨微",
 "附三十六字母辨",
 "千字文萃",
 "皇上七旬萬壽千字文",
 "御製全韻詩恭跋千字文",
 "毛西河傳贊",
 "別本千字文續千字文再續千字文",
 "別本續千字文",
 "庚申紀事",
 "徐海本末",
 "東江始末",
 "存是錄",
 "三藩紀事本末",
 "革除遺事節本",
 "思陵典禮紀",
 "思陵勤政紀",
 "廣右戰功錄",
 "先撥志始",
 "條奏疏稿",
 "續刊",
 "嘉靖以來內閣首輔傳",
 "詔獄慘言",
 "天變邸抄",
 "煙艇永懷",
 "端巖公年譜",
 "汪直傳",
 "維揚殉節紀略",
 "金姬傳",
 "別記",
 "劉豫事蹟",
 "于公德政錄",
 "甯海將軍固山貝子功續錄",
 "從征緬甸日記",
 "翁鐵庵年譜",
 "蜀碧",
 "歷代山陵考",
 "西洋朝貢典錄",
 "譎觚",
 "虞鄉雜記",
 "塞外雜識",
 "西湖紀遊",
 "西湖手鏡",
 "明內廷規制考",
 "內閣志",
 "重訂帝王紀年纂要",
 "伐蛟說",
 "救荒野譜",
 "明事斷略",
 "蔣氏家訓",
 "海寇議",
 "救命書",
 "手臂錄",
 "峨嵋槍法",
 "夢綠堂槍法",
 "喉科祕本",
 "附喉科附方",
 "種痘心法",
 "種痘指掌",
 "祕傳水龍經",
 "葬經箋註",
 "陽宅撮要",
 "傳神秘要",
 "題畫詩",
 "畫跋",
 "紅朮軒紫泥法",
 "石譜",
 "參譜",
 "本心齋蔬食譜",
 "漱華隨筆",
 "列朝盛事",
 "玉堂薈記",
 "花當閣叢談",
 "村老委談",
 "柳南隨筆",
 "周忠介公燼餘集",
 "椒山遺囑",
 "盧忠肅公書牘",
 "浩氣吟",
 "烏魯木齊雜詩",
 "宮詞小纂",
 "元宮詞",
 "擬古宮詞",
 "洪武宮詞",
 "擬故宮詞",
 "圍爐詩話",
 "西崑發微",
 "尚書緯",
 "尚書考靈曜",
 "尚書帝命驗",
 "尚書五行傳",
 "尚書璇璣鈐",
 "尚書刑德放",
 "尚書運期授",
 "尚書帝驗期",
 "中候握河紀",
 "中候考河命",
 "中候摘洛戒",
 "中候雜篇",
 "中候運行",
 "中候洛予命",
 "中候擿洛戒",
 "中候義明",
 "中候勅省圖",
 "中候稷起",
 "中候準讖哲",
 "洪範緯",
 "春秋元命包",
 "春秋演孔圖",
 "春秋文耀鉤",
 "春秋考異郵",
 "春秋漢含孳",
 "春秋保乾圖",
 "春秋握誠圖",
 "春秋內事",
 "春秋命歷序",
 "易坤靈圖",
 "易河圖數",
 "易筮類謀",
 "易九厄讖",
 "易雜緯",
 "易辨終備",
 "易萌氣樞",
 "易中孚傳",
 "易運期",
 "易通統圖",
 "易統驗元圖",
 "禮緯",
 "樂緯",
 "樂叶圖徵",
 "樂動聲儀",
 "詩緯",
 "詩推度災",
 "詩汎歷樞",
 "論語緯",
 "論語比考讖",
 "論語譔考讖",
 "論語摘輔象",
 "論語摘衰聖",
 "論語陰嬉讖",
 "孝經中契",
 "孝經威嬉拒",
 "孝經內事圖",
 "河圖緯",
 "河圖絳象",
 "河圖稽耀鉤",
 "河圖帝覽嬉",
 "河圖挺佐輔",
 "河圖握矩記",
 "河圖雜緯篇",
 "河圖祕徵",
 "河圖帝通紀",
 "河圖著命",
 "河圖真紀鉤",
 "河圖要元篇",
 "河圖考靈曜",
 "河圖提劉篇",
 "河圖會昌符",
 "河圖玉版",
 "洛書緯",
 "洛書靈准聽",
 "洛書甄曜度",
 "洛書摘六辟",
 "洛書錄運法",
 "河洛讖",
 "孔子河洛讖",
 "錄運期讖",
 "甄曜度讖",
 "征南錄",
 "救荒全書",
 "荒政叢言",
 "荒政考",
 "荒政議",
 "賑豫紀略",
 "荒箸略",
 "救荒策",
 "常平倉考",
 "義倉考",
 "社倉考",
 "準齋雜說",
 "神機制敵太白陰經",
 "傷寒微旨論",
 "珞琭子賦註",
 "棊經",
 "欽定錢錄",
 "陰符經疏",
 "春秋或辯",
 "春秋識小錄三種",
 "春秋職官考略",
 "春秋地名辨異",
 "附晉書地理志證今",
 "左傳人名辨異",
 "中外孝經",
 "孝經外傳",
 "箴膏肓",
 "讀書瑣記",
 "轉注古義考",
 "官韻考異",
 "續方言補正",
 "夾漈遺稾",
 "可儀堂文集",
 "春秋經玩",
 "春秋左傳分國土地名",
 "左傳職官",
 "左傳器物宮室",
 "五經贊",
 "備邊屯田車銃議",
 "車銃圖",
 "倭情屯田議",
 "金川瑣記",
 "至游子",
 "夢占逸旨",
 "讀書偶見",
 "學福齋雜著",
 "岳忠武王集",
 "丁孝子詩集",
 "刻燭集",
 "舜典補亡",
 "論語絕句",
 "駮五經異義",
 "武宗外紀",
 "勝朝彤史拾遺記",
 "炳爥偶鈔",
 "讀史論略",
 "古算器考",
 "歷學疑問補",
 "半村野人閒談",
 "一椶居詩稿",
 "魯齋述得",
 "奉使俄羅斯行程錄",
 "附日本雜詩",
 "異域竹枝詞",
 "三垣疏稿",
 "二儀銘補注",
 "歷學答問",
 "風月堂雜識",
 "學圃餘力",
 "王義士輞川詩鈔",
 "北郊配位尊西嚮議",
 "昏禮辨正",
 "大小宗通繹",
 "四書索解",
 "紀元要略",
 "海潮輯說",
 "吾師錄",
 "聰訓齋語",
 "中星表",
 "呵凍漫筆",
 "墨畬錢鎛",
 "瓠里子筆談",
 "蓉塘記聞",
 "夏內史集",
 "說學齋經說",
 "辨定嘉靖大禮議",
 "儒林譜",
 "雲間第宅志",
 "恥言",
 "修慝餘編",
 "太玄解",
 "潛虛解",
 "素覆子",
 "握奇經解",
 "東皋雜鈔",
 "聲調譜拾遺",
 "古詩十九首解",
 "詩疑",
 "左氏蒙求註",
 "明洪武四年進士登科錄",
 "淞故述",
 "南華經傳釋",
 "經天該",
 "地理古鏡歌",
 "翻卦挨星圖訣考著",
 "一草亭目科全書",
 "叩舷憑軾錄",
 "交行摘稿",
 "貞蕤稾略文",
 "詩",
 "正易心法",
 "學校問",
 "小國春秋",
 "小兒語",
 "續小兒語",
 "滇南新語",
 "松江衢歌",
 "淞南樂府",
 "遠鏡說",
 "滇南憶舊錄",
 "紀聽松菴竹鑪始末",
 "雜詠百二十首",
 "月山詩集",
 "月山詩話",
 "鎌山草堂詩合鈔",
 "四繪軒詩鈔",
 "杜詩雙聲疊韻譜括略",
 "禘祫答問",
 "樂縣考",
 "經義知新記",
 "漢西京博士考",
 "河源紀略承修稿",
 "泰山道里",
 "治蠱新方",
 "方圓闡幽",
 "弧矢啟袐",
 "祛疑說",
 "高東溪集",
 "選注規李",
 "選學糾何",
 "卦本圖攷",
 "春秋春王正月考",
 "辨疑",
 "魏氏補證",
 "河州景忠錄",
 "附記",
 "江上孤忠錄",
 "元故宮遺錄",
 "楚南小紀",
 "楚峝志略",
 "中衢一勺",
 "錢幣考",
 "傷寒論翼",
 "庚子銷夏記校文",
 "五代宮詞",
 "靜安八詠集",
 "附敘錄",
 "附列子沖虛至德真經釋文",
 "尸子尹文子合刻",
 "存疑",
 "永嘉先生八面鋒",
 "李泌博",
 "於潛令樓公進耕織圖詩",
 "本朝詩鈔小傳",
 "國朝麗體金膏",
 "匡廬紀勝",
 "竟山樂錄四錄",
 "還冤志",
 "丙丁龜鑑續錄",
 "續丙丁龜鑑",
 "復續丙丁龜鑑",
 "陸清獻公（隴其）年譜原本",
 "楊鐵齋中庸講語",
 "楊鐵齋小學劄記",
 "峰泖詩鈔",
 "王勉軒查山問答",
 "呂仲子先生四禮翼",
 "劉念臺先生人譜",
 "陶菴集",
 "黃嘉定吾師錄",
 "日省錄",
 "懺摩錄",
 "同文考證",
 "俗字證誤",
 "字體辨正",
 "敬避字樣",
 "重刊辨正通俗文字",
 "重編五經文字",
 "重編九經字樣",
 "龍學孫公春秋經解",
 "春秋經傳集解",
 "公是先生七經小傳",
 "古品節錄",
 "六如詩鈔",
 "鷓鴣斑",
 "四書詩",
 "庚子消夏錄碑帖攷",
 "返生香",
 "小倉山房續詩品",
 "茗柯文初編",
 "二編",
 "三編",
 "四編",
 "茗柯詞",
 "竹鄰遺稾",
 "齊物論齋賦",
 "安甫遺學",
 "雲在文稾",
 "三十六字母辨",
 "洪武聖記",
 "思陵典禮記",
 "思陵勤政記",
 "庚申記事",
 "三藩記事本末",
 "烟艇永懷",
 "翁鐵菴年譜",
 "星槎聖覽",
 "喉科秘本",
 "葬經箋注",
 "漢石經殘本",
 "蜀石經殘本",
 "急就",
 "新譯大方廣佛華嚴經音義",
 "資治通鑑刊本識誤",
 "嚴永思先生通鑑補正略",
 "平津館鑒藏記書籍",
 "廉石居藏書記",
 "平津館鑒藏書畫記",
 "朱子周易參同契考異",
 "朱子陰符經考異",
 "東坡先生翰墨尺牘",
 "山谷老人刀筆",
 "題跋",
 "楊升菴先生異魚圖贊",
 "馮氏小集",
 "鈍吟集",
 "餘集",
 "遊仙詩",
 "香奩集",
 "復古香奩集",
 "西湖竹枝詞",
 "續夷堅志",
 "遺山先生（元好問）年譜略",
 "硯北雜誌",
 "寳古堂重考古玉圖",
 "明誠意伯溫靈棋經解",
 "古今藥石",
 "海嶽志林",
 "聊齋志異拾遺",
 "墨梅人名錄",
 "日本攷略",
 "牧鑑",
 "禮記偶箋",
 "校正康對山先生武功縣志",
 "校正韓汝慶先生朝邑縣志",
 "易圖定本",
 "詩問",
 "水西紀略",
 "碧幢雜識",
 "裨勺",
 "古林金石表",
 "七頌堂詞繹",
 "遠志齋詞衷",
 "金粟詞話",
 "遇變記略",
 "再生記略",
 "鄂渚紀事",
 "畫荃",
 "天文考略",
 "鍾律陳數",
 "掃軌閒談",
 "廣錢譜",
 "川船記",
 "續曲品",
 "在園雜志",
 "看蠶詞",
 "潯谿紀事詩",
 "秌室遺文",
 "吳興藏書錄",
 "吳興山墟名",
 "吳興記",
 "吳興入東記",
 "吳興統記",
 "吳興志續編",
 "清湘樓詩選",
 "苕谿漁隱詩藁",
 "湖錄記事詩",
 "苕谿漁隱詞",
 "蜀產吟",
 "增補太玄集注",
 "商邱史記",
 "杜主開明前志",
 "望帝杜宇叢帝鼈令前志",
 "岷陽古帝墓祠後志",
 "蜀破鏡",
 "國朝古文選",
 "楊文憲公（愼）年譜",
 "學宮禮器圖",
 "司馬溫公詩集",
 "何竹有詩集",
 "岳容齋詩集",
 "許水南詩集",
 "掣鯨堂詩集",
 "小方壺試律詩",
 "孫春皐詩集",
 "文鈔",
 "虞文靖公道園全集詩",
 "詩遺稿",
 "蜀詩",
 "瘦石文鈔",
 "學宮輯略",
 "理學備考證編",
 "圖書檢要",
 "諸經緯遺",
 "易川靈圖",
 "易通掛驗",
 "詩紀歷圖",
 "春秋感情符",
 "禮稽命徴",
 "孝經授神契",
 "五經析疑",
 "經傳摭餘",
 "左氏兵法",
 "南華通",
 "虞長公史隟",
 "續史隟",
 "日知錄史評",
 "摘纂隨園史論",
 "重訂懿畜編",
 "金華鄭氏家範",
 "范氏義莊規矩",
 "四禮翼",
 "四禮辨俗",
 "農桑書錄要",
 "畫簾緒論",
 "呂榮公官箴",
 "國朝四庫全書辨正通俗文字",
 "四聲纂句",
 "譚誤",
 "益聞散錄",
 "說詩啐語",
 "文談",
 "四書文法摘要",
 "玩易意見",
 "石渠意見",
 "補缺",
 "周易本義爻徵",
 "虛字說",
 "雲南機務抄黄",
 "會稽三賦註",
 "京畿金石考",
 "雍州金石記",
 "記餘",
 "嚴陵講義",
 "正蒙會稿",
 "宋四子抄釋",
 "衞生寶鑑",
 "六如畫譜",
 "新增格古要論",
 "元城語錄解",
 "行錄解",
 "兩山墨談",
 "見物",
 "書敘指南",
 "表異祿",
 "老子集解",
 "古文周易參同契註",
 "楚辭補註",
 "呂涇野經說",
 "周易說翼",
 "尚書說要",
 "毛詩說序",
 "春秋說志",
 "禮問",
 "詩氏族考",
 "春秋三傳異文釋",
 "春秋左傳異文釋",
 "春秋公羊傳異文釋",
 "春秋穀梁傳異文釋",
 "靖海紀略",
 "箕田攷",
 "峽石山水志",
 "漢魏六朝墓誌銘纂例",
 "石藥爾雅",
 "德星堂家訂",
 "得全居士詞",
 "澹菴長短句",
 "燕喜詞",
 "茗齋詩餘",
 "甌香館集",
 "瓊花集",
 "初月樓古文緒論",
 "初月樓論書隨筆",
 "山靜居詩話",
 "曝書雜記",
 "小蓬海遺詩",
 "屑屑集",
 "江山風月譜",
 "有聲畫",
 "詩辨說",
 "非詩辨妄",
 "禮記集說辨疑",
 "中庸傳",
 "孝經鄭氏注",
 "方舟經說",
 "經籍跋文",
 "中興備覽",
 "金石錄補",
 "續跋",
 "砥齋題跋",
 "隱綠軒題識",
 "蘇齋題跋",
 "瘞鶴銘考",
 "石門碑醳",
 "榮祭酒遺文",
 "斠補隅錄",
 "爾雅南昌本校勘記訂補",
 "續宋中興編年資治通鑑校",
 "吳越春秋校",
 "錢塘遺事校",
 "宣和奉史高麗圖經校",
 "管子校",
 "荀子考異",
 "意林逸文",
 "酉陽雜俎校",
 "唐摭言校",
 "蘆浦筆記校",
 "後山集校",
 "倉頡篇",
 "周易注",
 "漢記",
 "漢後記",
 "儒林傳稿",
 "正誼錄",
 "律綱",
 "秋審實緩",
 "章程",
 "直省附錄",
 "臚雲集",
 "消暑隨筆",
 "附子目",
 "太乙舟文集",
 "涇西書屋詩稿",
 "文稿",
 "胥屏山館詩存",
 "文存",
 "青霞仙館詩錄",
 "端綺集",
 "義例",
 "數書九章",
 "詳解九章算法",
 "纂類",
 "楊輝算法",
 "來齋金石刻考略",
 "寓意錄",
 "煙霞萬古樓詩選",
 "仲瞿詩錄",
 "秋紅丈室遺詩",
 "陔南池館遺集",
 "雙樹生詩草",
 "紀半樵詩",
 "思適齋集",
 "儀鄭堂殘稾",
 "賜硯齋題畫偶錄",
 "居易堂殘稿",
 "連山歸藏逸文",
 "焦氏易林吉語",
 "造化經綸圖",
 "孔壁書序",
 "武王克殷日紀",
 "詩經世本日",
 "笙詩補亡",
 "古逸詩載",
 "春秋紀年",
 "春秋地名攷略目",
 "五國執政表",
 "戰國七雄圖說",
 "郊說",
 "爾雅歲陽攷",
 "孔門弟子攷",
 "門人攷",
 "孟子弟子攷",
 "集聖賢羣輔錄",
 "抱朴子騈言",
 "玉海祥瑞錄",
 "科場則例",
 "皇朝鼎甲錄",
 "簪纓盛事錄",
 "稽古齋讌集",
 "四書集註引用姓氏攷",
 "論語詩",
 "四庫全書辨正通俗文字",
 "明人尺牘",
 "熙朝尺牘",
 "八磚吟館詩存",
 "想當然詩",
 "百花吟",
 "勸真詩",
 "道情",
 "心相編",
 "繡譜",
 "煙譜",
 "游仙集",
 "小蓬萊賸藁",
 "荒政輯要",
 "揅經室一集",
 "四集詩",
 "再續集",
 "禮經釋例",
 "孝經義疏補",
 "詁經精舍文集",
 "述學",
 "儀禮石經校勘記",
 "七經孟子考文併補遺",
 "雕菰集",
 "蜜梅花館詩錄",
 "曾子注釋",
 "恆言錄",
 "揅經室詩錄",
 "淮海英靈集甲集",
 "丙集",
 "丁集",
 "戊集",
 "壬集",
 "癸集",
 "小滄浪筆談",
 "廣陵詩事",
 "儀鄭堂文",
 "八甎吟館刻燭集",
 "歷代帝王年表",
 "帝王廟諡年諱譜",
 "新刊古列女傳",
 "附續列女傳",
 "疇人傳",
 "地球圖說",
 "附補圖",
 "積古齋鐘鼎彝器款識",
 "小琅嬛叢記",
 "文筆考",
 "滇南古金石錄",
 "漢延熹西嶽華山碑考",
 "石渠隨筆",
 "周無專鼎銘攷",
 "呻吟語選",
 "溉亭述古錄",
 "愚溪詩稾",
 "讀書敏求記",
 "周易翼",
 "周易翼釋義",
 "易卦候",
 "論語集解",
 "敍說",
 "孟子補義",
 "學春秋理辯",
 "尚書述",
 "史記短長說",
 "告蒙編",
 "台灣鄭氏始末",
 "兩淵",
 "東林粹語",
 "盤溪歸釣圖題辭",
 "德輿子",
 "中篇",
 "大象賦",
 "記𠸄咭唎求澳始末",
 "寄生館集",
 "醫宗寶笈",
 "相地指迷",
 "嶺南集",
 "德輿集",
 "青玉館集",
 "禹頁說斷",
 "儀禮釋例",
 "中候敕省圖",
 "易萠氣樞",
 "易通驗元圖",
 "四書箋義纂要",
 "續遺",
 "大學章句箋義",
 "或問箋義",
 "註疏纂要",
 "中庸章句箋義",
 "論語集註箋義",
 "孟子集註箋義",
 "經傳釋詞",
 "孫氏唐韻考",
 "元朝征緬錄",
 "廬山記略",
 "北道刊誤誌",
 "七國攷",
 "類考",
 "前編",
 "難經集註",
 "曉庵新法",
 "五星行度解",
 "數學",
 "續數學",
 "數學補論",
 "歲實消長辯",
 "恒氣註歷辯",
 "冬至權度",
 "七政衍",
 "金水發微",
 "中西合法擬草",
 "算賸",
 "正弧三角疏義",
 "推步法解",
 "天步真原人命部",
 "遠西奇器圖說錄最",
 "新製諸器圖說",
 "附校勘記逸文",
 "古今姓氏書辯證",
 "賈氏譚錄",
 "大方廣佛華嚴經音義",
 "文始真經言外經旨",
 "附宣鑪博論",
 "純吟雜錄",
 "禹貢山川地理圖",
 "春秋胡氏³辨疑",
 "內閣小志",
 "內閣故事",
 "襄陽守城錄",
 "易大誼",
 "帝王世紀",
 "文選敂音",
 "吳乘竊筆",
 "乘軺錄",
 "南宋古蹟考",
 "淮南天文訓補註",
 "三魚堂日記",
 "辛巳泣蘄錄",
 "漢書西域傳補註",
 "明夷待訪錄",
 "燕寢考",
 "長春真人西遊記",
 "西游記金山以東釋",
 "南華真經章句音義",
 "章句餘事",
 "餘事雜錄",
 "莊列十論",
 "難光錄",
 "隨筆漫談",
 "曲律",
 "大唐郊祀錄",
 "少廣正負術內篇",
 "爾雅圖贊",
 "山海經圖贊",
 "毛鄭詩考證",
 "格庵奏稿",
 "對數探原",
 "燕樂考原",
 "經學巵言",
 "禮學巵言",
 "罍庵雜述",
 "守山閣賸稿",
 "聖域述聞",
 "皇朝經籍志",
 "歷代統系錄",
 "歷代紀元表",
 "年號分韻錄",
 "郡縣分韻考",
 "三志合編",
 "朝邑韓志",
 "武功康志",
 "靈壽陸志節本",
 "歷代職官表",
 "避諱錄",
 "古誌石華",
 "姓氏解紛",
 "湖南方物志",
 "詩韻檢字",
 "韻字辨似",
 "癡學",
 "顏魯公文集",
 "顏魯公年譜",
 "集古錄跋尾",
 "集古錄目",
 "明尺牘墨華",
 "賢母錄",
 "旌節錄",
 "大溈山房遺藳",
 "紅雪詞鈔",
 "三十六灣草廬稿",
 "茶香閣遺事",
 "嵰山甜雪",
 "三長物齋詩略",
 "夏小正試帖",
 "三長物齋文略",
 "易大義",
 "古史輯要",
 "順宗實錄",
 "二十二史感應錄",
 "廣名將傳",
 "酌中志",
 "火攻挈要",
 "慎守要錄",
 "調燮類編",
 "菰中隨筆",
 "桂苑筆耕集",
 "敬齌古今黈",
 "揭曼碩詩",
 "青藤書屋文集",
 "漁隱叢話",
 "四溟詩話",
 "宋四六話",
 "茶董補",
 "酒顛補",
 "尺牘新鈔",
 "顏氏家藏尺牘",
 "姓氏考",
 "翼梅",
 "厤學補論",
 "恆氣註厤辯",
 "女科",
 "產後編",
 "海錄",
 "新釋地理備考全書",
 "全體新論",
 "元朝祕史",
 "唐兩京城坊攷",
 "漢石例",
 "句股截積和較算術",
 "橢圜術",
 "鏡鏡詅癡",
 "癸巳存稿",
 "湖北金石詩",
 "落颿樓文稿",
 "說文解字義證",
 "永樂大典目錄",
 "稽瑞",
 "字㝈",
 "漢魏六朝志墓金石例",
 "唐人志墓諸例",
 "峨嵋鎗法",
 "武備輯要",
 "武備輯要續編",
 "安瀾紀要",
 "迴瀾紀要",
 "陰符七篇",
 "計倪子",
 "戴氏鼠璞",
 "聽雨紀談一巷",
 "物原",
 "山水忠肝集摘要",
 "大六壬苗公射覆鬼撮腳",
 "痛餘雜錄",
 "豪譜",
 "遊戲錄",
 "焦氏筆乘",
 "揭文安公文粹",
 "潞水客談",
 "陶庵夢憶",
 "天香閣隨筆",
 "天香閣集",
 "芻蕘奧論",
 "叔苴子內篇",
 "西洋朝頁典錄",
 "緒言",
 "聲類",
 "宋遼金元四史朔閏考",
 "國史經籍志",
 "文史通義",
 "校讐通義",
 "經義考補正",
 "小石帆亭五言詩續鈔",
 "蘇詩補注",
 "志道集",
 "石洲詩話",
 "北江詩話",
 "玉山草堂續集",
 "敘古千文",
 "草廬經略",
 "字觸",
 "今世說",
 "飲水詩集",
 "詞集",
 "遺言",
 "日湖漁唱",
 "秋笳集",
 "絳雲樓書目",
 "述古堂藏書目",
 "宋板書目",
 "林屋唱酬錄",
 "焦山紀遊集",
 "沙河逸老小稿",
 "嶰谷詞",
 "南齋集",
 "胡子知言",
 "疑義",
 "後漢書補注",
 "詩書古訓",
 "十三經音略",
 "說文聲系",
 "文館詞林",
 "兩京新記",
 "太上感應篇注",
 "紀元編",
 "中興禦侮錄",
 "樓山堂集",
 "朱子論學切要語",
 "韓柳年譜",
 "韓文（愈）類譜",
 "韓吏部文公集年譜",
 "韓文公歷官記",
 "韓子年譜",
 "柳先生（宗元）年譜",
 "疑年錄",
 "續疑年錄",
 "米海岳（芾）年譜",
 "元遺山先生（好問）年譜",
 "附墓圖記略",
 "菉竹堂書目",
 "菉竹堂碑目",
 "寒山堂金石林時地考",
 "勝飲編",
 "采硫日記",
 "嵩洛訪碑日記",
 "通志堂經解目錄",
 "蘇米齋蘭亭考",
 "孫氏周易集解",
 "春秋穀梁傳時月日書法釋例",
 "詞林韻釋",
 "漢書地理志稽疑",
 "國策地名考",
 "隸經文",
 "國朝漢學師承記",
 "國朝經師經義目錄",
 "國朝宋學淵源記",
 "顧亭林先生（炎武）年譜",
 "閻潛邱先生（若璩）年譜",
 "倪文正公（元璐）年譜",
 "南雷文定前集",
 "詩歷",
 "世譜",
 "程侍郎遺集",
 "李元賓文集文編",
 "羅鄂州小集",
 "羅郢州遺文",
 "陽春百雪",
 "春秋國都爵姓考",
 "儀禮管見",
 "孝肅包公奏議",
 "書義主意",
 "羣英書義",
 "焦氏類林",
 "西域釋地",
 "西陲要略",
 "續談助",
 "十州記",
 "北道刊誤志",
 "文武兩朝獻替記",
 "聖宋掇遺",
 "沂公筆錄",
 "漢孝武內傳",
 "膳夫經手錄",
 "益齋亂稿",
 "十遺",
 "附集誌",
 "靜齋至正直記",
 "鳳氏經說",
 "比雅",
 "求表捷術",
 "對數簡法",
 "續對數簡法",
 "外切密率",
 "假數測圓",
 "紹興題名錄",
 "寶祐登科錄",
 "唐昭陵石蹟考略",
 "附謁唐昭陵記",
 "雲中紀程",
 "太清神鑒",
 "馭交記",
 "述學內篇",
 "續黔書",
 "烟霞萬古樓文集",
 "詩選",
 "梅邊吹笛譜",
 "補錄",
 "崔舍人玉堂類稿",
 "西垣類稿",
 "樂經律呂通解",
 "六書轉注錄",
 "延令宋板書目",
 "季滄葦書目",
 "墨緣彙觀錄",
 "蜀中名勝記",
 "補宋書刑法志",
 "補宋書食貨志",
 "補宋書故",
 "姑溪居士文集",
 "授堂文鈔",
 "南北朝文鈔",
 "爾雅集注",
 "爾雅音",
 "四書私談",
 "章水經流攷",
 "噶喇吧紀略",
 "庚辛日記",
 "出圍城記",
 "射訣集益",
 "受正元機神光經",
 "水盤八針法",
 "地理真蹤",
 "從亡隨筆",
 "輯古算經補注",
 "心說",
 "四率淺說",
 "論文偶記",
 "登瀛寶筏",
 "墨訣",
 "作文法",
 "讀山谷詩評",
 "策學例言",
 "作賦例言",
 "試律須知",
 "宜黃竹枝詞",
 "屈安人遺詩",
 "學靜軒遺詩",
 "剿辦崇仁會匪事略",
 "保甲團練事宜",
 "學道粹言",
 "異疾志",
 "本草經解要附餘",
 "本草綱目正誤",
 "痲疹證治要略",
 "奇證祕錄",
 "史學纂要",
 "家戒要言",
 "廣卓異記",
 "古奇器錄附江東藏書目錄小序",
 "司牧寶鑑",
 "雙甦歌",
 "廣陵儲王趙宋景蔣曾桑朱宗列傳",
 "陳法直指",
 "岳忠武王年譜",
 "岳忠武王遺事",
 "魏忠賢始末",
 "又續錄",
 "三續錄",
 "附列傳",
 "年表",
 "三續千字文注",
 "助字辨略",
 "九水山房文存",
 "惜袌先生尺牘",
 "孔氏祖庭廣記",
 "附校譌",
 "續補校",
 "質孔說",
 "論語竢質",
 "六書說",
 "考工記",
 "劉江東家藏善本葬書",
 "傷寒九十論",
 "補校",
 "三教平心論",
 "西齋淨土詩",
 "九賢祕典",
 "角力記",
 "鷃林子",
 "李師師外傳",
 "霜猨集",
 "蓮堂詩話",
 "九邊圖論",
 "海防圖論",
 "易義參",
 "三易偶解",
 "歸藏母經",
 "春秋經文三傳異同考",
 "月令考",
 "補晉兵制",
 "明邊鎮題名考",
 "鄭氏書目考",
 "出塞圖畫山川記",
 "本朝八旗軍志",
 "古州雜記",
 "西域瑣記",
 "西域詩",
 "西域記聞",
 "漷陰志略",
 "禾中災異錄",
 "圓明園記",
 "陳氏安瀾園記",
 "太白山行紀",
 "西湖游記",
 "茅山紀遊",
 "浙行偶記",
 "北游日記",
 "越游小錄",
 "客舍偶聞",
 "閩幕紀略",
 "塘報稿",
 "秋思草堂遺集雲遊始末記",
 "研堂見聞雜記",
 "欠菴避亂小記",
 "罪言",
 "均賦策",
 "橫橋堰水利紀事",
 "賑粥議",
 "星新經",
 "釋天",
 "地震說",
 "知聖道齋讀書跋尾",
 "金石跋尾",
 "所見古書述",
 "三藏聖教序考",
 "訪碑圖題記",
 "修武氏祠堂記",
 "賣藝文",
 "近鑑",
 "東省養蠶成法",
 "亳州牡丹說",
 "端溪硯坑記",
 "端硯銘",
 "硯銘",
 "倪氏雜記筆法",
 "畫筌析覽",
 "强恕齋畫論",
 "板橋題畫",
 "畫蘭題記",
 "冬心雜記",
 "冬心先生畫竹題記",
 "冬心畫梅題記",
 "冬心畫馬題記",
 "冬心畫佛題記",
 "冬心自寫真題記",
 "冬心齋研銘",
 "賞鑑雜說",
 "汪氏說鈴",
 "急痧方論",
 "春雪亭詩話",
 "聊齋誌異拾遺",
 "續諧鐸",
 "寶仁堂鹿革囊",
 "海漚小譜",
 "古詩十九首箋注",
 "吳梅村歌詩",
 "學庸孟子詩",
 "論書目唱和集",
 "二十四畫品",
 "紅蟫館詞雋",
 "讀魏書地形志隨筆",
 "枉了集",
 "南都防亂公揭",
 "黃山遊記",
 "可懷錄",
 "韞山堂讀書偶得",
 "破鐵網",
 "龔安節先生畫訣",
 "畫梅題跋",
 "瘍科淺說",
 "榕巢詞話",
 "蘇詩辨正",
 "拙政園圖題詠",
 "東阿詩鈔",
 "畫蘭題句",
 "燒香曲",
 "春草園小景分記",
 "國初品級考",
 "葉兒樂府",
 "夢西湖絕句",
 "西湖吟",
 "洋涇雜事詩",
 "同治乙丑補試黌案",
 "全唐詩錄補遺",
 "彭孝介雜著",
 "悔少集注",
 "重訂曲海總目",
 "左傳博議拾遺",
 "律呂元音",
 "豐清敏公遺事",
 "札記",
 "醫經正本書",
 "謝幼槃文集",
 "西渡詩集",
 "武陵山人雜著",
 "洪老圃集",
 "孫耕閒集",
 "至正庚辛唱和集",
 "中堂事記",
 "無寃錄",
 "揚州畫舫詞",
 "玉雨堂書畫記",
 "平定粵寇紀略十八附記",
 "古謠諺",
 "曼陀羅華閣瑣記",
 "詞律校勘記",
 "采香詞",
 "初學史論合編",
 "讀史方輿紀要統論",
 "方輿紀要形勢論略",
 "夢窗甲稾",
 "乙稾",
 "丙稾",
 "丁稾",
 "婦科祕方",
 "胎產護生篇",
 "太乙神鍼方",
 "克復金陵勳德記",
 "勸濟飢民詩",
 "玉紀",
 "藝蘭四說",
 "傳心要語",
 "弟子規",
 "歷代帝王紀年考",
 "闇脩記",
 "敬亭先生（陳心一）年譜",
 "孝經本義",
 "課心錄",
 "真州救荒錄",
 "王香峯先生文集",
 "高淳義學義倉輯略",
 "心學小印",
 "朱文公白鹿洞書院揭示集解",
 "惺齋答問",
 "敷文書說",
 "書繹",
 "詩繹",
 "箴膏肓起廢疾發墨守",
 "左傳義法舉要",
 "古本大學解",
 "爾雅古義",
 "爾雅犍為文學注",
 "爾雅注",
 "爾雅音注",
 "爾雅音義",
 "爾雅音汪",
 "爾雅眾家注",
 "西藏賦",
 "普法戰紀輯要",
 "治要節鈔",
 "圖畫寶鑑",
 "卻掃篇",
 "離騷經註",
 "九歌註",
 "揚州足徵錄",
 "陽宅闢謬",
 "松陽鈔存",
 "切近編",
 "張楊園先生（覆祥）年譜",
 "忱行錄",
 "漢丞相諸葛忠武侯列傳",
 "史文擥要",
 "重訂河防通議",
 "明九邊考",
 "宋簽判龍川陳先生文鈔",
 "宋少保岳顎王行實編年",
 "建炎德安守禦錄",
 "守城機要",
 "宋丞相李忠定公輔政本末",
 "宋季昭忠錄",
 "心史",
 "家禮辨說",
 "明新建伯王文成公傳本",
 "文朱先生行狀",
 "附刻",
 "毛詩古音攷",
 "屈宋古音攷",
 "李氏蒙求",
 "北溪先生四書字義",
 "道學二辨",
 "漢書蒙拾",
 "後漢書蒙拾",
 "晉書補傳贊",
 "文選課虛",
 "夏小正正義",
 "爾雅直音",
 "弟子職正音",
 "急就篇直音",
 "說文逸字",
 "說文聲讀表",
 "古今韵攷",
 "切韻",
 "莆陽黃御史集",
 "聲調三譜",
 "然鐙記聞",
 "律詩定體",
 "小石帆亭著錄",
 "聲調前譜",
 "後譜",
 "續譜",
 "漁洋山人秋柳詩箋",
 "東古文存",
 "內功圖說",
 "求雨篇",
 "明刑弼教錄",
 "讀律心得",
 "爽鳩要錄",
 "公門不費錢功德錄",
 "正俗備用字解",
 "周公年表",
 "簠齋傳古別錄",
 "木皮子詞",
 "王太常集",
 "王布政集",
 "梭山農譜",
 "兵法彙編",
 "補輯",
 "乾坤正氣集",
 "宋宗忠簡公集",
 "宋岳忠武王集",
 "宋謝文節公集",
 "陸象山先生集節要",
 "南華經解",
 "太上感應篇",
 "純陽祖師玉樞寶經讚解",
 "純陽祖師金剛般若波羅密經註講",
 "指月錄",
 "新刊釋氏十三經",
 "大方廣圓覺修多羅了義經",
 "大佛頂如來密因修證了義諸菩薩萬行首楞嚴經",
 "楞伽阿跋多羅寶經",
 "維摩詰所說經",
 "不可思議解脫經",
 "無量壽經",
 "阿彌陀經",
 "觀無量壽佛經",
 "佛說金剛般若波羅蜜經",
 "金剛般若波羅蜜多心經",
 "妙法蓮華經",
 "佛垂般涅槃略說教誡經",
 "佛遺教經",
 "佛說八大人覺經",
 "首楞嚴神咒灌頂疏",
 "密宗綱要譯釋陀羅尼九章",
 "歷代帝王世次紀",
 "歷代世系紀年編",
 "歷代建元重號",
 "天象災祥分類攷",
 "數學心得",
 "孫文定公南遊記",
 "秦邊紀略",
 "廣列女傳",
 "箴膏肓起廢疾發墨",
 "孝經鄭注",
 "駁五經異議",
 "吳郡圖經續紀",
 "長春真人西游記",
 "明刑管見錄",
 "祇可自怡",
 "求放心齋詩鈔",
 "判餘隨錄",
 "選輯騈珠小草",
 "並蒂芙蓉館倡酬集",
 "安豐聯詠",
 "秋燈集錦",
 "西行日記",
 "兩宦江南紀略",
 "淮程旅韻",
 "勸諭十二條",
 "遂初詩草",
 "虞氏易消息圖說初稾",
 "大誓答問",
 "求古錄禮說補遺",
 "公羊逸禮攷徵",
 "喪禮經傳約",
 "止觀輔行傳宏決",
 "輔行記",
 "炳燭編",
 "橋西雜記",
 "蕙西先生遺稿",
 "張文節公遺集",
 "越三子集",
 "亢藝堂集",
 "陳比部遺集",
 "西鳧草",
 "啗敢覽館稿",
 "壬申消夏詩",
 "尚書序錄",
 "春秋左氏古義",
 "說文管見",
 "古韵論",
 "鹽法議略",
 "黃帝內經素問校義",
 "藝芸書舍宋元本書目",
 "玉井山館筆記",
 "舊游日記",
 "宋四家詞選",
 "癸酉消夏詩",
 "南苑唱和詩",
 "別雅訂",
 "許印林遺著",
 "非石日記鈔",
 "鈕非石遺文",
 "炳燭室雜文",
 "天馬山房詩別錄",
 "沈四山人詩錄",
 "吳郡金石目",
 "稽瑞樓書目",
 "懷舊集",
 "愛吾廬文鈔",
 "劉貴陽說經殘稿",
 "劉氏遺箸",
 "寶鐵齋金石文跋尾",
 "百塼考",
 "陳簠齋丈筆記",
 "手札",
 "鮑臆園丈手札",
 "幽夢續影",
 "徐元歎先生殘稾",
 "浪齋新舊詩",
 "二苕詩集",
 "萬卷書屋詩存",
 "楙花盦詩",
 "石氏喬梓詩集",
 "聽雨樓詩",
 "葵青居詩錄",
 "附夢蜨草",
 "小草庵詩鈔",
 "日本金石年表",
 "春秋左氏傳地名補注",
 "周人經說",
 "王氏經",
 "音略",
 "音略攷證",
 "論語孔注辨偽",
 "爾雅補注殘本",
 "攷證",
 "說文古籀疏證",
 "國史考異",
 "平定羅剎方略",
 "西清筆記",
 "涇林續記",
 "廣陽雜記",
 "無事為福齋隨筆",
 "范石湖詩集注",
 "半氈齋題跋",
 "南澗文集",
 "冬青館古宮詞",
 "思補齋筆記",
 "竹汀先生日記鈔",
 "古泉叢話",
 "裝璜志",
 "清祕藏",
 "清河祕篋書畫表",
 "傷寒百證歌",
 "經絡歌訣",
 "傷寒六經定法",
 "藥症忌宜",
 "昭代名人尺牘小傳",
 "無聲詩史",
 "南唐書合刻",
 "玉臺畫史",
 "詒晉齋集",
 "芳堅館題跋",
 "太乙照神經",
 "神相證驗百條",
 "歷代長術輯要",
 "附古今推步諸術考",
 "養素居畫學鉤深",
 "媕雅堂詩話",
 "葉氏眼科方",
 "慎疾芻言",
 "隨山宇方鈔",
 "溫熱經緯",
 "戴氏三俊集",
 "重蔭樓詩集",
 "種玉山房詩集",
 "紅蕉盦詩集",
 "傳書樓詩稿",
 "壽花軒詩略",
 "濾月軒詩集",
 "詩餘",
 "荔牆詞",
 "鷓言內篇",
 "儒林瑣記",
 "浮湘訪學集",
 "白香亭詩",
 "堅白齋詩存",
 "湘綺樓詩",
 "移芝室詩鈔",
 "思貽堂詩",
 "養知書屋詩集",
 "瞑庵詩錄",
 "藻川堂詩集",
 "綠漪草堂詩鈔",
 "袌遺草堂詩鈔",
 "柈湖詩錄",
 "瞑庵雜識",
 "二識",
 "柔遠新書",
 "雨窗消意錄甲部",
 "晦鳴錄",
 "瞑庵學詩",
 "瞑庵叢稿",
 "金軺籌筆",
 "陸路通商章程",
 "鄂商前往中國貿易過界卡倫單",
 "附周易本義考",
 "易學啟蒙",
 "啟蒙五贊",
 "書序集傳",
 "四書集疏附正",
 "論語緒言",
 "小學句讀記",
 "大學直解",
 "太極圖集解",
 "小學",
 "資治通鑑綱目",
 "朱子大全文集",
 "四書講義",
 "淮雲問答",
 "論學酬答",
 "韋庵經說",
 "毋欺錄",
 "潘瀾筆記",
 "承華事略",
 "校正朝邑志",
 "吳門耆舊記",
 "松窗快筆",
 "海虞畫苑略",
 "稼書先生（陸隴其）年譜",
 "汲古閣校刻書目",
 "刻板存亡考",
 "勿藥須知",
 "尋花日記",
 "看花雜詠",
 "冬心先生三體詩",
 "墨井詩鈔",
 "三巴集",
 "𡒃中雜詠",
 "墨井題跋",
 "海珊詩鈔",
 "蓺庵遺詩",
 "明人詩品",
 "夢曉樓隨筆",
 "虞東先生文錄",
 "經緯集",
 "寓山注",
 "采薇吟殘稿",
 "耕烟草堂詩鈔",
 "秋水堂遺詩",
 "寶善堂遺稿",
 "實齋劄記鈔",
 "賈比部遺集",
 "瓣香外集",
 "古易音訓",
 "傳經表",
 "通經表",
 "漢書西域傳補注",
 "弟子職集解",
 "呂子校補",
 "對策",
 "誌銘廣例",
 "金石例補",
 "春秋夏正",
 "家語疏證",
 "知聖道齋讀書跋",
 "廉石居臧書記",
 "銅熨斗齋隨筆",
 "癖談",
 "疑年表",
 "太歲超辰表",
 "後甲集",
 "躍雷館日記",
 "晚學集",
 "元魏熒陽鄭文公摩崖碑跋",
 "字林考逸",
 "毛詩重言",
 "毛詩雙聲疊韻說",
 "戰國策釋地",
 "南江札記",
 "陶邕州小集",
 "書經注",
 "註陸宣公奏議",
 "海藏老人陰證略例",
 "本草衍義",
 "東萊呂紫微師友雜志",
 "東萊呂紫微雜說",
 "可書",
 "地理葬書集註",
 "葬書問對",
 "乙巳占",
 "太上老子道德經集解",
 "夷堅志甲集",
 "許國公奏議",
 "漢丞相諸葛忠武侯傳",
 "首圖說",
 "末總載",
 "新編張仲景註解傷寒發微論",
 "新編張仲景註解傷寒百證歌",
 "蔡中郎文集",
 "外傳",
 "至書",
 "宋徽宗聖濟經",
 "衞生家寶產科備要",
 "十洲記",
 "附釋文",
 "雲煙過眼錄",
 "雲煙過眼錄續集",
 "三厤撮要",
 "新編分門古今類事",
 "韓詩遺說",
 "訂譌",
 "九經學",
 "尗廬札記",
 "从古堂款識學",
 "偁陽雜錄",
 "英吉利廣東入城始末",
 "東籬耦談",
 "阮亭詩餘",
 "書巖賸稿",
 "二十一都懷古詩",
 "勇盧閒詰",
 "虞氏易事",
 "補五代史藝文志",
 "六壬神定經",
 "天問閣集",
 "鮓話",
 "西藏攷",
 "讀史舉正",
 "弟子職注",
 "餘生錄",
 "甲乙雜箸",
 "遯翁隨筆",
 "鄭堂札記",
 "春秋朔閏異同",
 "金源劄記",
 "存漢錄",
 "守麇記略",
 "敬脩堂釣業",
 "張忠烈公（煌言）年譜",
 "憶書",
 "曹州牡丹譜",
 "天慵菴筆記",
 "奇門金章",
 "墨妙亭碑目攷",
 "附考",
 "鄭氏遺書五種",
 "沈氏經學六種",
 "陸氏經典異文輯",
 "經典異文補",
 "左傳列國職官",
 "石經殘字考",
 "九經補",
 "許氏說文解字雙聲疊韻譜",
 "兩漢五經博士考",
 "金石訂例",
 "第六絃溪文鈔",
 "駢雅訓纂",
 "春秋左氏古經",
 "五十凡",
 "文字蒙求",
 "說文楬原",
 "說文發疑",
 "篆刻十三略",
 "附疑義",
 "錄餘",
 "輿地形勢論",
 "帝王世紀續補",
 "意林逸文補",
 "歷代載籍足徵錄",
 "補晉兵志",
 "古史考",
 "安定言行錄",
 "風水袪惑",
 "唐御史臺精舍題名考",
 "唐尚書省郎官石柱題名考",
 "讀書雜識",
 "彬雅",
 "說文淺說",
 "天元一術圖說",
 "菊逸山房天學",
 "火珠林",
 "滴天髓",
 "相字祕牒",
 "滇緬錄",
 "黔記",
 "吳三桂紀略",
 "平滇始末",
 "吳逆取亡錄",
 "明季遺聞拾遺",
 "臨安旬制紀",
 "甲申核真略",
 "南行日記",
 "粵行小紀",
 "河南程氏全書",
 "河南程氏遺書",
 "河南程氏外書",
 "河南程氏文集",
 "周易程氏傳",
 "河南程氏經說",
 "河南程氏粹言",
 "晦庵先生朱文公文集",
 "國朝諸老先生論語精義",
 "孟子精義",
 "楚辭集註",
 "辯證",
 "許文正公遺書",
 "文敬胡先生集",
 "倭文端公遺書",
 "拙修集",
 "理學宗傳辨正",
 "三禮從今",
 "比例匯通",
 "涇川文載小傳",
 "六書叚借經徵",
 "六書例解",
 "形聲類篇",
 "東南紀略",
 "夏蟲自語",
 "曼先生語錄",
 "青囊天玉通義",
 "區田圖說",
 "握奇經定本",
 "正義",
 "劉海峯文鈔",
 "玉餘外編文鈔",
 "柏堂賸稿",
 "毗陵楊氏詩存五種",
 "匪石山房詩鈔",
 "南蘭紀事詩鈔",
 "白雲樓詩鈔",
 "逸齋詩鈔",
 "抱璞山房詩鈔",
 "絡緯吟",
 "錢左才集",
 "春雨樓詩鈔",
 "蓉湖草堂存稿",
 "吳瑟甫歌詩",
 "桮珓經",
 "夢萱室遺詩",
 "華庭詩鈔",
 "鄭氏詩譜考正",
 "小爾雅疏",
 "東南紀事",
 "西南紀事",
 "海東逸史",
 "李忠定公別集",
 "建炎進退志",
 "建炎時政記",
 "樵川二家詩",
 "滄浪吟",
 "澂景堂史測",
 "邵氏姓解辨誤",
 "亨甫詩選",
 "易卦變圖說",
 "切音蒙引",
 "日本國志序例",
 "越中觀感錄",
 "家語證偽",
 "理學齋導言",
 "退庵隨筆",
 "四科簡效方",
 "精選集驗良方",
 "理瀹駢文摘要",
 "申鄭軒遺文",
 "附經史問答校記",
 "退庵賸稿",
 "緯學原流興廢考",
 "風俗通義佚文",
 "鴻爪錄",
 "旅菴奏對錄",
 "管溪徐氏宗譜",
 "荀子大義錄",
 "信摭",
 "鄉談",
 "思古齋隨筆",
 "巾廂說",
 "越縵筆記",
 "牧羊指引",
 "山羊全書",
 "唐詩金粉",
 "螺江日記",
 "顧曲錄",
 "為政忠告",
 "大學日程",
 "虛字考",
 "鱷渚迴瀾記",
 "治潮芻言",
 "粵東勦匪紀略",
 "如不及齋詩鈔",
 "如不及齋詠史詩",
 "寒碧軒詩存",
 "古井遺忠集",
 "嶺南雜事詩鈔",
 "歷代名臣奏議選",
 "大清一統志表",
 "朝代紀元表",
 "羅豫章先生集",
 "潛庵先生全集",
 "困學錄",
 "湯文正公（斌）年譜定本",
 "胡文忠公遺集",
 "史忠正公集",
 "校訂困學紀聞三箋",
 "壯悔堂文集",
 "四憶堂詩集",
 "重刻西沱吳先生蠢遇錄（一名西沱奏議）",
 "初唐四傑集",
 "楊盈川集",
 "史記菁華錄",
 "周易觀彖大指",
 "念二史詠史詩註",
 "論語話解",
 "國朝名臣言行錄",
 "怡賢親王奏議",
 "陸清獻公（隴其）年譜定本",
 "朱文端公（軾）年譜",
 "近思錄集解",
 "朱子訓蒙詩百首",
 "附童蒙須知",
 "訓子從學帖",
 "北溪先生字義",
 "夜行燭",
 "呂子節錄",
 "聖學入門書",
 "附蔚村三約",
 "訓子語",
 "莅政摘要",
 "明賢蒙正錄",
 "課士直解",
 "培遠堂手札節存",
 "女學",
 "病榻夢痕錄節要",
 "衞道編",
 "教諭語",
 "弟子箴言",
 "銖寸錄",
 "觀瀾講義",
 "童蒙須知韻語",
 "教女彝訓",
 "為學大指",
 "鄉塾正誤",
 "闇修記",
 "程氏性理字訓",
 "讀書舉要",
 "恆齋日記",
 "性理淺說",
 "小學淺說",
 "廣三字經",
 "演教諭語",
 "懿言日錄",
 "乙丑禮闈分校日記",
 "靈峽學則",
 "先喆格言",
 "潘豐豫莊本書",
 "蠶桑實濟",
 "山居瑣言",
 "況太守集",
 "布衣陳先生遺集",
 "愧訥集",
 "柏廬外集",
 "陸桴亭先生文集",
 "虛直軒文集",
 "毋自欺室文集",
 "論文章本原",
 "詩本誼",
 "西夏紀事本末",
 "白香詞譜箋",
 "篋中詞",
 "復堂類集文",
 "復堂日記",
 "合肥三家詩錄",
 "待堂文",
 "池上題襟小集",
 "非見齋審定六朝正書碑目",
 "漢志水道疏證",
 "姑蘇名賢小記",
 "蘇詩查注補正",
 "鐵橋漫稿",
 "札樸",
 "經傳釋詞補",
 "六九齋饌述稾",
 "說文統釋自序",
 "音同義異辨",
 "說文經字攷",
 "說文答問疏證",
 "竹林答問",
 "西漢節義傳論",
 "明鑑前紀",
 "寶綸堂文鈔",
 "賞雨茅屋外集",
 "青芝山館駢體文集",
 "第一樓叢書附考",
 "忠義錄",
 "吳中財賦考",
 "滇南銅政考",
 "治安八議",
 "進呈鷹論",
 "農事直說",
 "衿陽雜錄",
 "東坡先生仇池筆記",
 "東人詩話",
 "朱淑貞斷腸詩集",
 "示兒長語",
 "懶真子",
 "困學齋雜記",
 "補鬻子",
 "冬心先生自度曲",
 "春宵寱賸",
 "蓺蘭說",
 "清風室文鈔",
 "吳越雜事詩錄",
 "鏡海樓詩集",
 "附文",
 "李西崖擬古樂府",
 "涪州石魚題名記",
 "小學盦遺書",
 "醫學總論",
 "女英傳",
 "光緒輿地韻編",
 "海寧縣志略",
 "錢氏考古錄",
 "春秋疑年錄",
 "辨名小記",
 "歷代名人生卒錄",
 "春秋公羊禮疏",
 "公羊問答",
 "孝經疑問",
 "鶴銘圖考",
 "蘇齋唐碑選",
 "姚氏藥言",
 "咽喉脈證通論",
 "務民義齋算學",
 "測圓密率",
 "橢圓正數",
 "截球解義",
 "弧三角拾遺",
 "朔食九服里差",
 "用表推日食三差",
 "造各表簡法",
 "大雲山房十二章圖說",
 "大雲山房雜記",
 "春艸堂遺稿",
 "小爾雅疏證",
 "說文引經攷",
 "說文檢字",
 "前徽錄",
 "中州金石目",
 "三十五舉",
 "再續三十五舉",
 "安吳論書",
 "寒秀艸堂筆記",
 "禮記天算釋",
 "爾雅補郭",
 "說文新附攷",
 "汲古閣說文訂",
 "說文校定本",
 "銷燬抽燬書目",
 "禁書總目",
 "違礙書目",
 "清聞齋詩存",
 "通玄真經",
 "沖虛至德真經",
 "春秋穀梁傳",
 "論語",
 "附晦庵先生校正周易繫辭精義",
 "南華真經注疏",
 "楚辭集注",
 "尚書釋音",
 "附校札",
 "琱玉集",
 "姓解",
 "韻鏡",
 "日本國見在書目錄",
 "漢書食貨志",
 "杜工部草堂詩箋",
 "傳序碑銘",
 "碣石調幽蘭",
 "天台山記",
 "南華真經",
 "爾雅疏",
 "張文昌文集",
 "皇甫持正文集",
 "李長吉文集",
 "許用晦文集",
 "鄭守愚文集",
 "孫可之文集",
 "老子道德經古本集注",
 "頤堂先生文集",
 "珞琭子三命消息賦",
 "附李燕陰陽三命",
 "山谷琴趣外篇",
 "附釋文互注禮部韻略",
 "條式",
 "漢雋",
 "張子語錄",
 "龜山語錄",
 "洞靈真經",
 "陶淵明詩",
 "昭德先生郡齋讀書志",
 "二本",
 "攷異",
 "名公書判清明集",
 "武經七書",
 "唐太宗李衞公問對",
 "春秋公羊疏",
 "乖崖先生文集",
 "附集",
 "謝幼槃竹友集",
 "中庸說",
 "程氏演繁露",
 "杜工部集",
 "七錄序目",
 "鄭學書目",
 "讀書叢錄節鈔",
 "南江文鈔",
 "日知錄集釋",
 "續刊誤",
 "廿一史約編",
 "里乘",
 "夢綠草堂槍法",
 "易筋經義",
 "服氣圖說",
 "行素堂集古印存",
 "金玉瑣碎",
 "六朝文絜",
 "袁文箋正",
 "歷代畫史彙傳",
 "鑒古百一詩",
 "書畫所見錄",
 "墨林今話",
 "玉餘尺牘附編",
 "楹聯集錦",
 "雨牕記所記",
 "西湖竹枝集",
 "銀瓶徵",
 "西湖遊記",
 "中西算學四種",
 "藤香館小品",
 "虞氏易禮",
 "易學闡元",
 "鄭氏詩譜攷正",
 "經書算學天文攷",
 "說雅",
 "初月樓四種",
 "初月樓文鈔",
 "初月樓詩鈔",
 "程子香文鈔",
 "尚絅堂駢體文",
 "确山駢體文",
 "成人篇",
 "各經承師立學考四編",
 "經典釋文敘錄",
 "詩攷補注",
 "禮記釋注",
 "苔岑經義鈔",
 "戴東原先生（震）年譜",
 "靈芬館雜著",
 "芙村文鈔",
 "仁在堂論文各法",
 "詩答問",
 "國朝駢體正宗評本",
 "愚一錄",
 "學詩闕疑",
 "廿二史諱略",
 "松花庵韻史",
 "六如居士畫譜",
 "臨池心解",
 "篆刻鍼度",
 "薛文清公讀書錄鈔",
 "荊園語錄",
 "澄懷園語",
 "匏園掌錄",
 "元邱素話",
 "清嘉錄",
 "黃嬭餘話",
 "味水軒日記",
 "說部精華",
 "漁洋書籍跋尾",
 "南田畫跋",
 "古詩十九首說",
 "說詩晬語",
 "梅道人遺墨",
 "醉盦硯銘",
 "㬅盦壺盧銘",
 "詞林正韻",
 "發凡",
 "臨民要略",
 "學治一得編",
 "讀律琯朗",
 "吳中判牘",
 "洄溪醫案",
 "景岳新方砭",
 "理虛元鑑",
 "保生胎養良方",
 "嘉應平寇紀略",
 "石畫記",
 "供冀小言",
 "聽松廬詩略",
 "讀律提綱",
 "桐花閣詞鈔",
 "周禮注疏小箋",
 "面城樓集鈔",
 "磨甋齋文存",
 "止齋文鈔",
 "樂志堂文略",
 "是汝師齋遺詩",
 "景石齋詞略",
 "然燈記聞",
 "讀賦巵言",
 "魏鄭公諫錄續錄",
 "魏文貞公故事拾遺",
 "魏文貞公（徵）年譜",
 "新舊唐書合注魏徵列傳",
 "鮮虞中山國事表疆域圖說",
 "魏書校勘記",
 "西垣詩鈔",
 "西垣黔苗竹枝詞",
 "磨綺室詩存",
 "壽梅山房詩存",
 "登科記考",
 "春秋摘微",
 "公羊傳補注",
 "穀梁傳補注",
 "國語補注",
 "論語注",
 "羣經賸義",
 "操𢼝齋遺書",
 "易林釋文",
 "投壺考原",
 "佚禮扶微",
 "疇人傳三編",
 "說文職墨",
 "說文舊音補注",
 "改錯",
 "爾雅詁",
 "吳疆域圖說",
 "補水經注洛水涇水武陵五溪考",
 "開方用表簡術",
 "毛詩異文箋",
 "句股演代",
 "春秋世族譜拾遺",
 "鄭志攷證",
 "釋名補證",
 "三統術補衍",
 "推步迪蒙記",
 "史漢駢枝",
 "宋州郡志校勘記",
 "駉思室答問",
 "漢太初曆考",
 "心巢文錄",
 "蔡氏月令",
 "律呂古誼",
 "陸氏草本鳥獸蟲魚疏疏",
 "劉炫規杜持平",
 "周易二閭記",
 "方氏易學五書",
 "諸家易象別錄",
 "虞氏易象彙編",
 "周易卦象集證",
 "周易互體詳述",
 "周易卦變舉要",
 "易例輯略",
 "新修本草",
 "陶文",
 "詩經叶音辨訛",
 "春秋左傳服注存",
 "論語異文考證",
 "通鑑綱目釋地糾繆",
 "通鑑綱目釋地補註",
 "御覽書苑菁華",
 "廣川畫跋校勘記",
 "金石文字跋尾",
 "張氏四種",
 "墨表",
 "張仲景注解傷寒百證歌",
 "寶綸堂集",
 "京氏易",
 "卦氣解",
 "毛詩禮徵",
 "詩攷異字箋餘",
 "儀禮禮服通釋",
 "車制攷",
 "論語通釋",
 "荀勗笛律圖注",
 "管色攷",
 "律呂臆說",
 "爾雅一切注音",
 "說文聲類",
 "諧聲補逸",
 "續方言疏證",
 "漢書音義",
 "孫氏祠堂書目內編",
 "平津館鑒藏書籍記",
 "平津讀碑記",
 "海東金石存攷",
 "待訪目",
 "易餘籥錄",
 "舊學蓄疑",
 "羣書答問",
 "曉菴遺書",
 "秝法",
 "秝表",
 "大統秝啟蒙",
 "雜著",
 "開方通釋",
 "心得要旨",
 "穀梁大義述",
 "孝經徵文",
 "春秋平議",
 "有不為齋算學",
 "珠神真經",
 "東潛文稿",
 "易經解",
 "金氏尚書注",
 "詩深",
 "古文論語",
 "新集古文四聲韻",
 "新編經史正音切韻指南",
 "論語私箋",
 "春秋會義",
 "兩漢朔閏表",
 "漢太初以前朔閏表",
 "穆天子傳注疏",
 "靖炎兩朝見聞錄",
 "宋朝南渡十將傳",
 "使金錄",
 "金德運圖說",
 "石渠紀餘",
 "歷代宅京記",
 "岳陽紀勝彙編",
 "茗香堂史論",
 "養蒙大訓",
 "樗菴日錄",
 "過庭記餘",
 "黃帝內經素問遺篇",
 "天文精義賦",
 "名畫獵精錄",
 "童學書程",
 "雲林堂飲食製度集",
 "徐氏筆精",
 "同書",
 "明語林",
 "文選紀聞",
 "堯山堂偶雋",
 "文選編珠",
 "聲調",
 "曾文正公家訓",
 "篤素堂文集",
 "藝舟雙楫",
 "飛鴻堂印人傳",
 "南漢金石志",
 "九曜石刻錄",
 "冬心畫題記",
 "小學勾沈",
 "倉頡訓詁",
 "倉頡解詁",
 "三倉",
 "三倉訓詁",
 "三倉解詁",
 "凡將篇",
 "古文官書附古文奇字郭訓古文奇字",
 "勸學篇",
 "聖皇篇",
 "通俗文",
 "埤倉",
 "古今字詁",
 "雜字",
 "辨釋名",
 "韻集",
 "雜字解詁",
 "周成難字",
 "小學篇",
 "字苑",
 "字只",
 "音譜",
 "纂文",
 "纂要",
 "文字集略",
 "字略",
 "廣蒼",
 "字統",
 "韻略",
 "證俗音",
 "文字指歸",
 "字書",
 "字體",
 "異字苑",
 "字類",
 "字諟",
 "古今字音",
 "聲譜",
 "證俗文",
 "異字音",
 "顏書編年錄",
 "南海百詠續編",
 "說文辨疑",
 "條記",
 "說文釋例",
 "周櫟園印人傳",
 "丹溪朱氏脈因證治",
 "惲南田畫跋",
 "雨窗漫筆",
 "東莊論畫",
 "浦山論畫",
 "繪事津梁",
 "摹印傳燈",
 "脈藥聯珠",
 "脈藥聯珠古方考",
 "山南論畫",
 "寫竹雜記",
 "薛濤詩",
 "尚書蔡注考誤",
 "詩氏族攷",
 "藥證忌宜",
 "紅術軒紫泥法",
 "凹園詩鈔",
 "大地山河圖說",
 "春秋列國官名異同考",
 "尚書今古文五藏說",
 "周禮畿內授田考實",
 "柳庭輿地隅說",
 "儀禮疏",
 "篆書目錄偏旁字源五百四十部",
 "說文解字部目",
 "說文解字建首五百四十字",
 "唐陸宣公集",
 "西塘先生文集",
 "二李唱和集",
 "古文孝經",
 "李嶠雜詠",
 "文公朱先生感興詩",
 "武夷櫂歌",
 "左氏蒙求",
 "王翰林集註黃帝八十一難經",
 "蒙求",
 "西垣類稾",
 "宋景文公集",
 "陳希夷心相編",
 "長歷鈎玄",
 "綈裘寶書",
 "性命雙脩慧命正旨",
 "甲申傳信錄",
 "曾文正公大事記",
 "吳中平寇記",
 "平浙紀略",
 "中英和約",
 "附燕臺條約",
 "中東和約",
 "附中英南京舊約",
 "有正味齋日記",
 "甕牖餘談",
 "十三日備嘗記",
 "小家語",
 "梟林小史",
 "孿史",
 "詩句題解韻編四集",
 "文苑菁華",
 "經藝新畬",
 "談古偶錄",
 "宮閨聯名譜",
 "秦淮畫舫錄",
 "畫舫餘譚",
 "三十六春小譜",
 "揚州畫舫錄",
 "十洲春語",
 "竹西花事小錄",
 "燕臺花事錄",
 "吳門畫舫錄",
 "吳門畫舫續錄",
 "翰海",
 "有正味齋尺牘",
 "清暉閣贈貽尺牘",
 "異書四種",
 "仙壇花雨",
 "碧落雜誌",
 "雪窗新語",
 "天長宣氏三十六聲粉鐸圖詠",
 "鐸餘逸韻",
 "遯窟讕言",
 "眉珠盦憶語",
 "六合內外瑣言",
 "庸閒齋筆記",
 "客窗閒話",
 "印雪軒隨筆",
 "螢窗異草初稿",
 "鏡花水月",
 "夜雨秋燈錄",
 "影談",
 "潛庵漫筆",
 "語新",
 "蟲鳴漫錄",
 "志異續編",
 "儒林外史五十六回",
 "紅樓夢補四十八回",
 "西遊補十六回",
 "水滸後傳",
 "快心編",
 "昕夕閒談",
 "林蘭香",
 "返魂香傳奇",
 "瀛寰瑣記",
 "四溟瑣紀",
 "寰宇瑣紀",
 "格致彙編",
 "亞細亞東部地圖",
 "寰瀛畫報",
 "曾文正公（國藩）年譜",
 "重訂西青散記",
 "外科全生集",
 "野記",
 "雲間據目抄",
 "紀載彙編",
 "燕都日記",
 "董心葵事記",
 "東塘日劄",
 "江上遺聞",
 "閩事紀略",
 "安龍紀事",
 "戴重事錄",
 "過墟志",
 "金壇獄案",
 "辛丑紀聞",
 "嘯亭雜錄",
 "聖武記",
 "春融堂雜記八種",
 "滇行日錄",
 "征緬紀聞",
 "商洛行程記",
 "雪鴻再錄",
 "使楚叢譚",
 "臺懷隨筆",
 "師友淵源錄",
 "三岡識略",
 "景船齋雜記",
 "滬城備考六年",
 "閩雜記",
 "粵屑",
 "豫軍紀略",
 "淮軍平捻記",
 "山東軍興紀略",
 "歷代陵寢備考",
 "歷代宗廟附考",
 "史餘萃覽",
 "勝國文徵",
 "和約彙抄",
 "點勘記",
 "附省堂筆記",
 "文海披沙",
 "藝林伐山",
 "表異錄",
 "夢園叢說內篇",
 "零金碎玉",
 "鋤經書舍零墨",
 "閏秀詩評",
 "白門新柳記",
 "詞媛姓氏錄",
 "屑玉叢譚初集",
 "從扈隆福寺小記",
 "夢談隨錄",
 "孔氏三出辯",
 "燕京雜記",
 "營口雜記",
 "越州紀略",
 "常熟紀變始末",
 "守虞日記",
 "松江府志摘要",
 "海天餘話",
 "蜂房春秋",
 "花史",
 "羅浮夢記",
 "四海記",
 "科場燄口",
 "秋紅霓詠",
 "霜猿集",
 "仙閨集",
 "山曉閣詞集",
 "屑玉叢談二集",
 "廿二史發蒙",
 "攤飯續談",
 "南遊記",
 "黃山紀遊",
 "豐暇筆談",
 "緖南筆談",
 "小螺盦病榻憶語",
 "杭俗遺風",
 "蕉牕聞見錄",
 "廣哀詩",
 "冰谿吟草",
 "夢遊赤壁圖題詞",
 "題紅詞",
 "屑玉叢譚三集",
 "偽鄭逸事",
 "番境補遺",
 "海上紀略",
 "晉人塵",
 "西征日記",
 "晉藏小錄",
 "旃林紀略",
 "拉臺四境",
 "應差蠻族",
 "煙話",
 "買愁集",
 "茶餘漫錄",
 "㻬琈山房紅樓夢詞",
 "如是觀園",
 "園居錄詩鑑",
 "餞月樓詩鈔",
 "十二詞品",
 "續十二詞品",
 "屑玉叢譚四集",
 "笠夫雜錄",
 "楊氏雜錄",
 "客中異聞錄",
 "三湘從事紀",
 "璣園寄梗錄",
 "梁園花影",
 "今樂府",
 "九九樂府",
 "獨悟庵叢鈔",
 "浮生六記",
 "鏡亭軼事",
 "天山清辨",
 "硯雲甲編",
 "明良錄",
 "硯雲乙編",
 "續異書四種",
 "隨園瑣記",
 "香飲樓賓談",
 "驚喜集",
 "閨律",
 "癡說四種",
 "紅樓夢精義",
 "紅樓夢雜詠",
 "紅樓夢觥史",
 "紅樓夢排律",
 "饋貧糧",
 "尺牘集錦",
 "雙桂軒尺牘",
 "夢花亭尺牘",
 "蓬萊館尺牘",
 "六梅書屋尺牘",
 "耳郵",
 "澆愁集",
 "笑史",
 "聞見異辭",
 "山中一夕話",
 "臺灣外記",
 "女才子",
 "雪月梅傳五十回",
 "青樓夢六十四回",
 "何典十回",
 "點石齋字彙",
 "英字入門",
 "晚笑堂畫傳",
 "耕織圖",
 "顏魯公玄秘塔",
 "王夢樓先生墨蹟",
 "四續",
 "歷下志遊",
 "漫遊記略",
 "瓠園集",
 "重修滬游雜記",
 "滇南雜詩",
 "顧陸遺詩",
 "曾侯日記",
 "航海述奇",
 "霆軍紀略",
 "平定粵匪記略",
 "中西紀事",
 "中俄和約",
 "萬國史記",
 "使琉球記",
 "西事類編",
 "東藩紀要",
 "續編綏寇紀略",
 "畫舫續錄投贈",
 "國朝閨秀香咳集",
 "鴻雪軒紀艷",
 "評花新譜",
 "鳳城品花記",
 "宣南雜俎",
 "側帽餘談",
 "海上羣芳譜",
 "會湖雜文",
 "筆餘",
 "息盦尺牘",
 "附存",
 "通問便集",
 "欣賞齋尺牘",
 "五色瓜廬尺牘叢",
 "梅香館尺牘",
 "東池草堂尺牘",
 "尺牘初桄",
 "音註小倉山房尺牘",
 "詳註筆耕齋尺牘",
 "分類尺牘備覽",
 "薑露庵雜記",
 "壺天錄",
 "蕉軒摭錄",
 "道聽塗說",
 "鸝砭軒質言",
 "昔柳摭談",
 "茶餘談薈",
 "薈蕞編",
 "三異筆談",
 "笑笑錄",
 "四夢彙譚",
 "筆夢清談",
 "刼夢淚談",
 "游夢倦談",
 "塵夢醒談",
 "妙香室叢話",
 "小豆棚",
 "西湖拾遺",
 "新刻三寶太監西洋通俗演義",
 "紅樓復夢一百回",
 "風月夢三十二回",
 "兒女英雄傳四十回首一回",
 "後西遊記四十回",
 "新刻鍾伯敬先生批評封神演義",
 "第五才子書水滸傳七十回續四十八回",
 "結水滸全傳",
 "小五義一百二十四回續一百二十四回",
 "鏡花緣一百回",
 "繪芳錄八十回",
 "十粒金丹六十六回",
 "筆生花三十二回",
 "東廂記",
 "鑄史駢言",
 "醒睡錄初集",
 "讀史探驪錄",
 "稟啟零紈",
 "記聞類編",
 "靈檀碎金",
 "啟矇真諦",
 "異授眼科",
 "三借廬贅譚",
 "粉墨叢談",
 "此中人語",
 "思益堂日札",
 "尚書中侯",
 "尚書緯璇機鈐",
 "尚書緯考靈曜",
 "尚書緯刑德放",
 "尚書緯帝命驗",
 "尚書緯運期授",
 "詩緯推度災",
 "詩緯氾歷樞",
 "詩緯含神霧",
 "禮緯含文嘉",
 "禮緯稽命徵",
 "禮緯斗威儀",
 "樂緯動聲儀",
 "樂緯稽耀嘉",
 "樂緯叶圖徵",
 "春秋緯文耀鉤",
 "春秋緯運斗樞",
 "春秋緯感精符",
 "春秋緯合誠圖",
 "春秋緯考異郵",
 "春秋緯保乾圖",
 "春秋緯漢含孳",
 "春秋緯佐助期",
 "春秋緯握誠圖",
 "春秋緯潛潭巴",
 "春秋緯說題辭",
 "春秋緯演孔圖",
 "春秋緯元命苞",
 "孝經緯援神契",
 "孝經緯鉤命訣",
 "孝經章句",
 "孝經雌雄圖",
 "孝經古秘",
 "論語讖",
 "宋葉文康公禮經會元節本",
 "經師經義目錄",
 "十三經注疏序",
 "篆訣辯釋",
 "說文通論",
 "文選古字通疏證",
 "字林經策萃華",
 "白石道人詩集",
 "附錄補遺",
 "白石詩詞評論",
 "白石道人逸事",
 "逸事補遺",
 "逸事",
 "衍波詞",
 "納蘭詞",
 "靈芬館詞",
 "蘅夢詞",
 "浮眉樓詞",
 "懺餘綺語",
 "爨餘詞",
 "拜石山房詞鈔",
 "憶雲詞甲稾",
 "刪存",
 "微波詞",
 "松壺畫贅",
 "松壺畫憶",
 "縵雅堂駢體文",
 "笙月詞",
 "花影詞",
 "娛園叢刻",
 "筆史",
 "端谿硯史",
 "書畫說鈴",
 "頻羅庵論書",
 "周易姚氏學",
 "左傳舊疏考正",
 "儀禮古今文疏義",
 "刊謬正俗",
 "隋經籍志考證",
 "淮南天文訓補注",
 "人譜類記增訂",
 "葬經內篇",
 "離騷箋",
 "龍經疑龍",
 "撼龍統說",
 "指南後錄",
 "酌中志餘",
 "東林朋黨錄",
 "東林點將錄",
 "東林同志錄",
 "東林籍貫",
 "盜柄東林夥",
 "夥壞封疆錄",
 "天鑒錄",
 "欽定逆案",
 "風角書",
 "重訂擬瑟譜",
 "律呂新義",
 "樂府傳聲",
 "二林居集",
 "三國志辨疑",
 "後漢郡國令長攷",
 "三國職官表",
 "周官指掌",
 "紀事約言",
 "舊唐書疑義",
 "全浙詩話刊誤",
 "三國紀年表",
 "五代紀年表",
 "字體蒙求",
 "紉芳齋文集",
 "中田詩草",
 "對語",
 "毛詩異同評",
 "難孫氏毛詩評",
 "周易述翼",
 "慶元偽學逆黨籍",
 "附雜記",
 "洞天帖錄",
 "魚鶴品",
 "心相百二十善",
 "綠陰亭集二集",
 "侯氏書品",
 "虛舟題跋原",
 "虛舟題跋",
 "瀛奎律髓刊誤",
 "四家詠史樂府",
 "鐵厓詠史",
 "鐵厓小樂府",
 "西涯樂府",
 "兩晉南北史樂府",
 "唐宋小樂府",
 "明史樂府",
 "柳亭詩話",
 "草堂詩餘",
 "讀周易日記",
 "讀尚書日記",
 "讀毛詩日記",
 "讀周禮日記",
 "讀儀禮日記",
 "讀小戴禮盧植注日記",
 "讀小戴禮日記",
 "讀小戴日記",
 "讀孝經日記",
 "讀爾雅日記",
 "讀爾雅補記",
 "讀尒疋日記",
 "讀說文玉篇日記",
 "讀段注說文解字日記",
 "讀說文日記",
 "讀史記日記",
 "讀漢書日記",
 "讀通鑑日記",
 "讀史日記三種",
 "前漢匈奴表",
 "後漢匈奴表",
 "晉五胡表",
 "讀文選日記",
 "治算學日記三種",
 "垂綫互求術",
 "平方和較術",
 "疊徵比例術",
 "學古堂日記叢鈔",
 "音分古義",
 "游志續編",
 "雞窗叢語",
 "寒夜叢談",
 "蕙櫋雜記",
 "昌黎先生集攷異",
 "得一齋雜著四種",
 "西輶日記",
 "印度劄記",
 "遊歷芻言",
 "西徼水道",
 "紀元考",
 "鴻雪偶留",
 "諏吉新書",
 "成語",
 "占候",
 "冷香室遺稿",
 "百衲琴",
 "周易古本十二篇附音訓",
 "孟志編略",
 "孝經鄭注附音",
 "望溪文集補遺",
 "奉萱草堂文續集",
 "續高士傳",
 "征東實紀",
 "續入",
 "浙程備覽",
 "黑龍江述略",
 "國朝未栞遺書志略",
 "清儀閣金石題識",
 "泉志校誤",
 "多暇錄",
 "北窗囈語",
 "明宮詞",
 "袁海叟詩集",
 "漁洋山人集外詩",
 "樊榭山房集外詩",
 "寄生山館詩賸",
 "瘦玉詞鈔",
 "大瓠堂詩錄",
 "梅村詩話",
 "漁洋山人詩問",
 "牙牌參禪圖譜",
 "暢叙譜",
 "倫敦竹枝詞",
 "校正元親征錄",
 "衞藏通志",
 "附校字記",
 "黑龍江外記",
 "吉林外記",
 "寧古塔記略",
 "嚴州圖經",
 "附校字說",
 "說文審音",
 "蠶桑說",
 "蠶事要略",
 "廣蠶桑說輯補",
 "黃帝內經太素",
 "黃帝內經明堂",
 "汪氏兵學三書",
 "太公兵法逸文",
 "武侯八陣兵法輯略",
 "附用陣雜錄",
 "衞公兵法輯本",
 "附舊唐書李靖傳攷證",
 "雲氣占候",
 "老子本義",
 "會典簡明錄",
 "湛然居士文集",
 "姚文敏公遺稿",
 "奏議補缺",
 "袁氏藝文志",
 "詩錄",
 "漸西村人初集",
 "安般簃集",
 "春闈雜詠",
 "于湖小集",
 "金陵雜事詩",
 "漚簃擬墨",
 "廣雅碎金",
 "守身執玉軒遺文",
 "于湖題襟集",
 "桐溪耆隱集",
 "榆園雜興詩",
 "經籍舉要",
 "家塾課程",
 "尊經閣募捐藏書章程",
 "祀典錄",
 "中江尊經閣藏書目",
 "中江講院建立經誼治事兩齋章程",
 "合肥相國壽言",
 "香嚴老人壽言",
 "尚書記",
 "校逸",
 "元和郡縣志闕卷逸文",
 "原目",
 "教童子法",
 "東湖叢記",
 "苔石效顰集",
 "萬善花室文藳",
 "齊雲山人文集",
 "立山詞",
 "竹鄰詞",
 "齊物論齋詞",
 "香草詞",
 "洞簫詞",
 "碧雲盦詞",
 "樂府餘論",
 "柳下詞",
 "萬善花室詞",
 "金梁夢月詞",
 "懷夢詞",
 "三十六陂漁唱",
 "冰蠶詞",
 "汀鷺詩餘",
 "湖海草堂詞",
 "水雲樓詞",
 "詩賸藳",
 "蘭紉詞",
 "瓠落詞",
 "定海遺愛錄",
 "舊德集",
 "開成石經圖攷",
 "大唐創業起居",
 "安祿山事迹",
 "中興戰功錄",
 "玉牒初草",
 "宋中興學士院題名",
 "東宮官寮題名",
 "行在雜買務雜賣場提轄官題名",
 "三公年表",
 "元河南志",
 "棲霞小志",
 "唐兩京城坊攷補記",
 "游城南記",
 "據鞍錄",
 "遼東行部志",
 "偽齊錄",
 "寓庵集",
 "靜軒集",
 "清河集",
 "菊潭集",
 "蘇潁濱年表",
 "孫淵如先生（星衍）年譜",
 "曾公遺錄",
 "澹餘筆記",
 "真賞齋賦",
 "河賦注",
 "錢竹汀日記",
 "農丹",
 "強萼圃太守上當事三書",
 "古泉山館題跋",
 "敬齋先生古今黈",
 "康熙朝品級考",
 "周世宗實錄",
 "後村雜記",
 "簡莊隨筆",
 "讀金石萃編條記",
 "攝山紀遊集",
 "公車徵士小錄",
 "東林同難錄",
 "同難列傳",
 "同難附傳",
 "國史貳臣傳表",
 "保舉經學名單",
 "南宋江陰軍乾明院羅漢尊號碑",
 "王貽上與林吉人手札",
 "王貽上與汪于鼎手札",
 "題嵩洛訪碑圖",
 "復初齋王漁洋詩評",
 "星伯先生小集",
 "瞿木夫文集",
 "順德師著述",
 "西游錄注",
 "和林金石攷",
 "朔方備乘札記",
 "稽瑞樓文草",
 "吳山子遺文",
 "學宛堂詩稿",
 "思菴閒筆",
 "京本通俗小說",
 "南朝史精語",
 "今存碑目",
 "張說之文集",
 "邗記",
 "紅薇翠竹詞",
 "仲軒詞",
 "里堂家訓",
 "因柳閣詞鈔",
 "傳是樓宋元板書目",
 "坦庵枕函待問編",
 "客齋餘話",
 "古今青白眼",
 "花傭月令",
 "尚書餘論",
 "敤經筆記",
 "楚漢諸侯疆域志",
 "金石三例續編",
 "十三經詁答問",
 "九數外錄",
 "校續補",
 "芳茂山人文集",
 "四禮榷疑",
 "漢魏六朝墓銘纂例",
 "補寰宇訪碑錄",
 "失編",
 "附刊誤",
 "玉溪生詩說",
 "金石稱例",
 "金石綜例",
 "石經閣金石跋文",
 "鍼灸甲乙經",
 "孟子時事略",
 "讀孟質疑",
 "漢學商兌",
 "遜志堂雜鈔",
 "醫學讀書記",
 "靜香樓醫案",
 "何氏心傳",
 "經史百家簡編",
 "三通序",
 "三才略",
 "羣書治要子鈔",
 "水經注西南諸水考",
 "摹印述",
 "篤素堂集鈔",
 "曾文正公雜著鈔",
 "蔣丹林學使義學規條",
 "張香濤學使學究語",
 "牧令書鈔",
 "風俗通姓氏篇",
 "十三州志",
 "金華赤松山志",
 "島夷誌略",
 "元儒攷略",
 "楊忠愍公集",
 "元親征錄",
 "陶庵集",
 "谷簾學吟",
 "崇禎五十宰相傳",
 "崇禎內閣行略",
 "閣臣年表",
 "山窗覺夢節要",
 "梅溪先生勸學質言",
 "竹窗存稿",
 "周易解故",
 "易釋",
 "易緯略義",
 "象數論",
 "尚書伸孔篇",
 "禹貢班義述",
 "附漢糜水入尚龍谿考",
 "書蔡傳附釋",
 "詩集傳附釋",
 "毛詩傳箋通釋",
 "毛詩後箋",
 "毛詩天文考",
 "儀禮古今文異同疏證",
 "儀禮私箋",
 "輪輿私箋",
 "大戴禮記解詁",
 "春秋規過考信",
 "春秋述義拾遺",
 "附河間劉氏書目考",
 "春秋公羊注疏質疑",
 "孟子趙注補正",
 "爾雅匡名",
 "爾雅注疏本正誤",
 "說文引經證例",
 "潛揅堂說文答問疏證",
 "廣潛研堂說文答問疏證",
 "說文本經答問",
 "小爾雅訓纂",
 "輶軒使者絕代語釋別國方言箋疏",
 "附校議",
 "釋穀",
 "急就章攷異",
 "漢碑徵經",
 "吳氏遺箸",
 "小學說",
 "廣韻說",
 "句溪雜箸",
 "劉氏遺書",
 "論語駢枝",
 "經傳小記",
 "國語補校",
 "荀子補注",
 "淮南子補校",
 "方言補校",
 "漢學拾遺",
 "愈愚錄",
 "學詁齋文集",
 "廣經室文鈔",
 "幼學堂文稿",
 "白田草堂存稾",
 "陳司業遺書",
 "掌錄",
 "東塾遺書",
 "水經注西南諸水攷",
 "弧三角平視法",
 "三統術詳說",
 "無邪堂答問",
 "親屬記",
 "先聖生卒年月日攷",
 "朱子語類日鈔",
 "人範",
 "少室山房集",
 "少室山房筆叢",
 "經籍會通",
 "丹鉛新錄",
 "史書佔𠌫",
 "藝林學山",
 "九流緒論",
 "四部正譌",
 "三墳補逸",
 "二酉綴遺",
 "華陽博議",
 "莊嶽委談",
 "玉壺遐覽",
 "雙樹幻鈔",
 "詩藪內編",
 "雜編",
 "史記志疑",
 "史記三書正譌",
 "史記月表正譌",
 "史表功比說",
 "史記注補正",
 "史記毛本正誤",
 "漢書辨疑",
 "漢書注校補",
 "人表攷",
 "漢書人表攷校補",
 "後漢書辨疑",
 "續漢書辨疑",
 "後漢書注補正",
 "後漢書注又補",
 "後漢書補注續",
 "前漢書注攷證",
 "後漢書注攷證",
 "三國志旁證",
 "三國志補注續",
 "三國志注證遺",
 "新校晉書地理志",
 "晉書校勘記",
 "晉宋書故",
 "新舊唐書互證",
 "宋遼金元四史朔閏攷",
 "遼史拾遺補",
 "金史詳校",
 "元史譯文證補",
 "後漢書三公年表",
 "補後漢書蓺文志",
 "補續漢書蓺文志",
 "補三國蓺文志",
 "補三國疆域志",
 "補晉書藝文志",
 "東晉畺域志",
 "十六國畺域志",
 "東晉南北朝輿地表",
 "補梁疆域志",
 "南北史年表",
 "南北史世系表",
 "南北史帝王世系表",
 "補遼金元蓺文志",
 "補三史蓺文志",
 "補元史蓺文志",
 "元史氏族表",
 "十七史商榷",
 "廿二史攷異",
 "廿二史劄記",
 "諸史考異",
 "讀書叢錄",
 "歷代地理沿革表",
 "廿一史四譜",
 "九史同姓名略",
 "三史同名錄",
 "西魏書",
 "續唐書",
 "晉書輯本",
 "晉史草",
 "晉諸公別傳",
 "晉紀輯本",
 "晉紀",
 "惠帝起居注",
 "晉陽秋輯本",
 "漢晉春秋輯本",
 "漢晉春秋",
 "三十國春秋輯本",
 "三十國春秋",
 "蜀李書",
 "漢趙記",
 "趙書",
 "二石傳",
 "秦書",
 "南燕書",
 "秦記",
 "後秦記",
 "涼記",
 "西河記",
 "燉煌實錄",
 "燕志",
 "晉書地道記",
 "十六國春秋輯補",
 "十六國春秋纂錄校本",
 "太常因革禮",
 "附校識",
 "附校刊識語",
 "中興小記",
 "國語翼解",
 "屈子離騷彙訂",
 "雜文箋略",
 "屈原賦注",
 "楚辭天問箋",
 "韓集補注",
 "爾雅稗疏",
 "前漢紀校釋",
 "後漢記校釋",
 "讀四元玉鑑記",
 "讀代數術記",
 "盈朒演代",
 "代數盈朒細草",
 "古文官書",
 "倉頡篇補本續",
 "纂要解",
 "桂苑珠叢",
 "孝經本質",
 "春秋異地同名攷",
 "左傳杜註拾遺",
 "律書律數條義疏",
 "夏小正傳校勘記",
 "補音",
 "補後漢書藝文志",
 "淮城日記",
 "寅賓錄",
 "白耷山人（閻爾梅）年譜",
 "望社姓氏考",
 "東倭表",
 "東倭考",
 "治安末議",
 "日知錄校正",
 "漱六山房讀書記",
 "丁氏遺著殘稿",
 "漢隸今存錄",
 "淮陰金石僅存錄",
 "國朝人書評",
 "蜀游手記",
 "三案始末",
 "義貞事跡",
 "歷代鼎甲錄",
 "山陽河下園亭記",
 "金壺浪墨",
 "青氈夢",
 "古藤書屋詩存",
 "聽雨草堂詩存",
 "寓庸室遺草",
 "虛靜齋詩藁",
 "耳鳴山人賸藁",
 "渾齋小藁",
 "使東詩錄",
 "說文疊韵",
 "漢官答問",
 "土魯番侵掠哈密事蹟",
 "練勇芻言",
 "墨子刊誤",
 "天算捷表",
 "亭林文集",
 "嘉定錢氏藝文志略",
 "先德述聞",
 "怡志堂文鈔",
 "全謝山先生遺詩",
 "天問閣外集",
 "嘯劍山房詩鈔",
 "虛白山房詩集",
 "聖祖五幸江南恭錄",
 "克復諒山大略",
 "拳匪聞見錄",
 "韓南溪四種",
 "獨山平匪記",
 "遵義平匪日記",
 "苗變記事",
 "南溪韓公（超）年譜",
 "玩寇新書回目",
 "澳門公牘錄存",
 "蒙古西域諸國錢譜",
 "經典釋文補條例",
 "借閒隨筆",
 "中興政要",
 "明史分稿殘編",
 "己庚編",
 "西藏紀述",
 "章谷屯志略",
 "萬象一原",
 "埃及碑釋",
 "木剌夷補傳稿",
 "轉徙餘生說",
 "奉使英倫記",
 "皇象本急就章",
 "說文解字索隱",
 "補例",
 "漢事會最人物志",
 "菉友肊說",
 "洨民遺文",
 "欽定四庫全書總目提要四部類敍",
 "先正讀書訣",
 "使德日說",
 "德國議院章程",
 "英軺私記",
 "新嘉坡風土記",
 "中西度量權衡表",
 "光論",
 "人參攷",
 "積古齋藏器目",
 "平安館藏器目",
 "清儀閣藏器目",
 "懷米山房藏器目",
 "兩罍軒藏器目",
 "木庵藏器目",
 "梅花草盦藏器目",
 "簠齋藏器目",
 "愙齋藏器目",
 "天壤閣雜記",
 "董華亭書畫錄",
 "畫友詩",
 "士禮居藏書題跋記續",
 "江寧金石待訪目",
 "山左南北朝石刻存目",
 "漢鼓吹鐃歌十八曲集解",
 "碧城仙館詩鈔",
 "聽園西疆雜述詩",
 "瓊州雜事詩",
 "匪石山人詩",
 "文史通義補編",
 "附鈔本目",
 "刊本所有鈔本所無目",
 "和林金石錄",
 "和林考",
 "前塵㝱影錄",
 "西遊錄注",
 "澳大利亞洲新志",
 "張憶娘簪華圖卷題詠一卷",
 "國語校文",
 "嘉蔭簃藏器目",
 "愛吾鼎齋藏器目",
 "石泉書屋藏器目",
 "雙虞壺齋藏器目",
 "簠齋藏器目第二本",
 "選青閣藏器目",
 "藏書紀事詩",
 "沅湘通藝錄",
 "四書文",
 "日本華族女學校規則",
 "黃蕘圃先生（丕烈）年譜",
 "塞北紀行",
 "帕米爾圖說",
 "帕米爾輯略",
 "澳大利亞洲志譯本",
 "咸豐以來功臣別傳",
 "元書后妃公主列傳",
 "琿牘偶存",
 "中越東西定議全界約文",
 "美利加英屬地小志",
 "外交餘勢",
 "斷腸記",
 "立方奇法",
 "求一捷術",
 "三家詩補遺",
 "爾雅補注",
 "說文段注校三種",
 "徐星伯說文段注札記",
 "龔定菴說文段注札記",
 "桂未谷說文段注鈔",
 "補鈔",
 "華陽陶隱居內傳",
 "沈下賢文集",
 "曝書亭刪餘詞",
 "曝書亭詞手稿原目",
 "嚴冬有詩集",
 "疑雨集",
 "古今書刻",
 "南廱志經籍考",
 "萬卷堂書目",
 "絳雲樓書目補遺",
 "靜惕堂書目宋人集",
 "元人文集",
 "竹𡹛盦傳鈔書目",
 "結一廬書目",
 "附宋元本書目",
 "唐女郎魚玄機詩",
 "素女經",
 "玉房祕訣",
 "指要",
 "洞玄子",
 "天地陰陽交歡大樂賦",
 "燕蘭小譜",
 "觀劇絕句",
 "木皮散人鼓詞",
 "萬古愁曲",
 "乾嘉詩壇點將錄",
 "重刻足本乾嘉詩壇點將錄",
 "三教源流搜神大全",
 "月令章句",
 "古今夏時表",
 "附易通卦驗節候校文",
 "天文本單經論語校勘記",
 "孟子章句",
 "附劉熙事蹟考",
 "六書古微",
 "同聲假借字攷",
 "釋人疏證",
 "說文讀若字考",
 "附說文讀同字考",
 "說文籀文考證",
 "佚事",
 "宋趙忠定奏議",
 "宋忠定趙周王別錄",
 "祕書省續編到四庫闕書目",
 "藏書十約",
 "書林清話",
 "附訂譌",
 "瑞應圖記",
 "郭氏玄中記",
 "淮南鴻烈閒詁",
 "游藝巵言",
 "晉司隸校尉傳玄集",
 "古泉雜詠",
 "消夏百一詩",
 "觀畫百詠",
 "崑崙皕詠",
 "崑崙集",
 "曲中九友詩",
 "觀古堂詩集",
 "郋園山居文錄",
 "觀古堂文外集",
 "觀古堂駢儷文",
 "石林遺事",
 "疏香閣遺錄",
 "郋園論學書札",
 "南癰志經籍攷",
 "百川書志",
 "徵刻書啟五先生事略",
 "佳趣堂書目",
 "孝慈堂書目",
 "潛采堂宋人集目錄",
 "元人集目錄",
 "求古居宋本書目",
 "竹崦盦傅鈔書目",
 "別本結一廬書目",
 "唐人小傳三種",
 "高力士外傳",
 "安祿山事跡",
 "校記",
 "辛丑消夏記",
 "石林治生家訓要略",
 "禮記解",
 "拾遺補",
 "鸝吹",
 "梅花詩",
 "愁言",
 "芳雪軒遺集",
 "疏香閣遺集",
 "鴛鴦夢",
 "窈聞",
 "伊人思",
 "百旻遺草",
 "秦齋怨",
 "𡵆雁哀",
 "彤奩續些",
 "靈護集",
 "瓊花鏡",
 "巳畦文集",
 "殘餘詩稿",
 "汪文摘謬",
 "附校記",
 "葉學山先生詩稿",
 "分干詩鈔",
 "義烏朱氏論學遺札",
 "佛說四十二章經注",
 "佛說十八泥犂經",
 "佛說鬼問目蓮經",
 "餓鬼報應經",
 "佛說雜藏經",
 "甌鉢羅室書畫過目攷",
 "典禮質疑",
 "巴陵人物志",
 "漢律輯證",
 "讀書法彙",
 "桐華閣六集",
 "桐華閣詞鈔",
 "程尚書禹貢論",
 "詩譜拾遺",
 "谷音集",
 "元次山詩集",
 "周禮解",
 "魯論語",
 "宣靖備史",
 "崇禎遺錄",
 "獨寤園叢鈔四種",
 "西域行程記",
 "西域蕃國志",
 "西蕃事蹟",
 "清綺齋藏書目",
 "御譯大藏經目錄",
 "拙政編",
 "楝花磯隨筆",
 "讀書雜錄",
 "乙閏錄",
 "存友札",
 "章氏遺書三種",
 "乙卯劄記",
 "知非日札",
 "論修史籍考要略",
 "海外新書",
 "脚氣治法",
 "奇門臆解",
 "耄餘詩話",
 "勵志雜錄",
 "弟子職音誼",
 "還初堂詞鈔",
 "椿蔭堂詩存稿",
 "鬱華閣遺集詩",
 "白山詞介",
 "西齋偶得",
 "意園文略",
 "靈峯草堂集",
 "鳧氏為鍾圖說補義",
 "天全石錄",
 "孟子外書補注",
 "孟子弟子考補正",
 "奇觚室樂石文述",
 "翰林學士集",
 "毛詩草木鳥獸蟲魚疏校正",
 "晉泰始笛律匡謬",
 "古經天象考",
 "緒說",
 "國志蒙拾",
 "金石文字辨異",
 "歲星表",
 "質疑刪存",
 "清白士集校補",
 "尚書隸古定釋文",
 "附隸古定經文",
 "春秋三家異文覈",
 "左傳杜註辨證",
 "古墨齋金石跋",
 "安徽金石略",
 "涇川金石記",
 "衡齋算學",
 "讀史札記",
 "論學劄說十則",
 "松崖文鈔",
 "周易通論月令",
 "尚書義考",
 "晚書訂疑",
 "宮室攷",
 "四書是訓",
 "四書拾義",
 "鐵橋金石跋",
 "金石萃編補目",
 "元碑存目",
 "經史質疑錄",
 "松崖筆記",
 "九曜齋筆記",
 "丙辰劄記",
 "周易虞氏略例",
 "周易倚數錄",
 "周禮補注",
 "說文解字通正",
 "小爾雅義證",
 "元耶律文正公西游錄略注補",
 "隋唐刻石拾遺",
 "關中金石記隋唐石刻原目",
 "括蒼金石志補遺",
 "大玄闡祕",
 "交翠軒筆記",
 "退餘叢話",
 "讀易漢學私記",
 "春秋亂賊考",
 "說文解字述誼",
 "周秦名字解故補",
 "盛京彊域考",
 "南江書錄",
 "南邨帖攷",
 "開方之分還原術",
 "意林注",
 "瑟榭叢談",
 "聚星札記",
 "古柏齋讀書雜識",
 "文選箋證",
 "落帆樓文遺稿",
 "朝邑志",
 "五峯山志",
 "豁落斗",
 "大衍新法",
 "晉風",
 "弟子職章句訓纂",
 "光菴集",
 "杜東原詩集",
 "野航文稿",
 "周易考占",
 "韓詩內傳徵",
 "周禮故書考",
 "周官禮經注正誤",
 "冕服考",
 "孟子七篇諸國年表",
 "說",
 "說文徐氏新補新附攷證",
 "劉更生（向）年表",
 "管子義證",
 "臨川答問",
 "增廣新術",
 "南陵縣建置沿革表",
 "周易諸卦合象考",
 "周易互體卦變考",
 "易經象類",
 "盧氏禮記解詁",
 "蔡氏月令章句",
 "夏小正分箋",
 "鄭氏三禮目錄",
 "何休注訓論語述",
 "爾雅小箋",
 "鄭氏六藝論",
 "經考",
 "說文諧聲孳生述",
 "隸通",
 "續方言又補",
 "後漢儒林傳補逸",
 "附續增",
 "唐折衝府考",
 "中州金石目錄",
 "讀書小記",
 "焦里堂先生軼文",
 "崔府君祠祿",
 "瓊琚譜",
 "我信錄",
 "花部農譚",
 "兩般秋雨庵詩選",
 "張家口至烏里雅蘇台竹枝詞",
 "無益有益齋論畫詩",
 "梡鞠錄",
 "念宛齋詞鈔",
 "海漚漁唱",
 "雲起軒詞鈔",
 "新聲譜",
 "蒼崖先生金石例",
 "樂府新編陽春白雪前集",
 "鄉儀",
 "廣成先生玉函經",
 "忘憂清樂集",
 "佚文",
 "律服考古錄",
 "山左碑目",
 "徐雨峯中丞勘語",
 "四溟山人詩集",
 "後梁春秋",
 "齊物論齋文集",
 "退廬疏稿",
 "王船山讀通鑑論辨正",
 "驢背集",
 "劉向別錄",
 "劉歆七略",
 "隋經籍志攷證",
 "七略別錄",
 "蔡邕月令章句",
 "周書時訓",
 "詩經四家異文攷補",
 "說文解字校勘記殘稾",
 "仁廟聖政記",
 "西域水道記校補",
 "寒山金石林部目",
 "昭陵碑錄",
 "潛采堂書目四種",
 "全唐詩未備書目",
 "明詩綜采摭書目",
 "兩淮鹽筴書引證書目",
 "竹垞行笈書目",
 "滂喜齋宋元本書目",
 "曲錄",
 "戲曲攷原",
 "鹿門集",
 "方叔淵遺稾",
 "香山九老會詩",
 "古洋遺響集",
 "南唐二主詞",
 "平園近體樂府",
 "後村別調",
 "眉庵詞",
 "毛鄭詩斠議",
 "幕巢館札記",
 "懷珉精舍金石跋",
 "湖海樓集拾遺",
 "謀野集刪",
 "鍊庵駢體文選",
 "實獲齋文鈔",
 "駢花閣文選",
 "晦僧文略",
 "樸學齋文鈔",
 "怡情小品",
 "石遺室詩友詩錄",
 "湖海同聲集",
 "石閭集",
 "掣鯨堂集",
 "明詩紀事鈔",
 "漁洋山人感舊集小傳",
 "續詩人徵略後集",
 "諸華香室閨秀詩鈔",
 "五湖遊稿",
 "江鄉漁話",
 "銅仙殘淚",
 "芙蓉莊紅豆錄",
 "謎話",
 "羅浮紀游",
 "蘿菴遊賞小志",
 "建康同遊記",
 "說林",
 "馬氏隨筆",
 "今齊諧",
 "海底讐",
 "異伶傳",
 "今詞綜",
 "夢玉詞",
 "飲瓊漿館詞",
 "勉憙集詞",
 "鷗夢詞",
 "韻麋詞",
 "盂蘭夢",
 "瓊花夢（一名江花夢）",
 "望夫石",
 "姽嫿封",
 "綠天香雪簃詩話",
 "眉韻樓詩話",
 "詩羣",
 "小三吾亭詞話",
 "道咸同光四朝詩史一斑錄初編敍例",
 "雪樵詩存*",
 "悼亡題咏集",
 "欠愁集",
 "類次書肆說鈴",
 "璇璣遺述",
 "尚書通義殘稿",
 "紀慎齋求雨全書",
 "綠蘿山莊駢體文集",
 "崇雅堂駢體文鈔",
 "汪容甫先生詩集",
 "易義來源",
 "蟲薈",
 "四家纂文敍錄彙編",
 "問湘樓駢文初稿",
 "息園舊德錄",
 "能一編",
 "諫垣七疏",
 "志遠齋史話",
 "止焚稿",
 "雌雄淵",
 "周易費氏學",
 "尚書誼略",
 "中庸篇義",
 "左忠毅公（光斗）年譜定本",
 "莊子故",
 "屈賦微",
 "道旁散人集",
 "敦艮吉齋文鈔",
 "詩存",
 "詩存補遺",
 "鄭東父遺書",
 "論書序大傳",
 "書張尚書之洞勸學篇後",
 "雜箸",
 "樞言",
 "罪言存略",
 "籌洋芻議",
 "乘槎筆記",
 "使西紀程",
 "使東述略",
 "出洋瑣記",
 "滬游脞記",
 "日本記游",
 "乖崖集存",
 "簡明限期表",
 "峨秀堂詩鈔",
 "惜心書屋詩鈔",
 "懶雲山莊詩鈔",
 "桐屋遺稾",
 "蘭谷遺稾",
 "味蔗軒詩鈔",
 "雙桐書屋賸藁",
 "榆塞紀行錄",
 "汧陽述古編",
 "江上草堂前稾",
 "代耕堂中稾",
 "噩夢",
 "黃書",
 "日錄",
 "甘薯錄",
 "畿輔水利議",
 "東塾讀書記",
 "附校勘",
 "龔定盦集",
 "春秋述義",
 "古微堂內集",
 "書林揚觶",
 "郭侍郎洋務文鈔",
 "韓詩",
 "毛詩國風定本",
 "毛詩注疏校勘記校字補",
 "周禮注疏校勘記校字補",
 "三禮經義附錄",
 "呂氏春秋補校",
 "何承天纂要文徵遺",
 "唐月令續考",
 "唐月令注續補遺",
 "唐月令注跋",
 "瓞園經說",
 "左傳通釋",
 "附補正",
 "左傳同名彙紀",
 "左女彙紀",
 "左女同名附紀",
 "左淫類紀",
 "四書集註考證",
 "四書集釋就正藁",
 "經說管窺",
 "廣雅疏證拾遺",
 "說文新附考",
 "治家格言繹義",
 "六事箴言",
 "公門懲勸錄",
 "石成金官紳約",
 "十反說",
 "得酒趣齋詩鈔",
 "附硯銘",
 "環碧主人賸稿",
 "蘇門山人登嘯集",
 "蘇門山人登嘯集詩鈔",
 "運甓編",
 "小穜字林試帖偶存",
 "蓮鷺雙谿舍遺稿",
 "理學正宗",
 "湯文正公遺書擇抄",
 "陸清獻公治嘉格言",
 "圖民錄",
 "性理易讀",
 "太極圖說",
 "通書",
 "西銘",
 "正蒙",
 "程朱粹言",
 "史鑑節要便讀",
 "小學韻語",
 "白石道人續書譜",
 "周子全書",
 "二程全書",
 "明道文集",
 "伊川文集",
 "伊川易傳",
 "伊川經說",
 "張子年譜",
 "和靖尹先生文集",
 "小學六卷附考異",
 "近思錄十四卷附考異",
 "附文集正譌",
 "文集記疑",
 "正譌記疑補遺",
 "朱子遺書重刻合編",
 "國朝諸老先生論孟精義",
 "延平李先生師弟子答問",
 "朱子遺書重刻記疑",
 "附正譌",
 "記疑",
 "附重刊朱子通鑑綱目原本改字備考",
 "程朱行狀",
 "程明道先生行狀",
 "朱子行狀",
 "陳北溪先生文集",
 "陸清獻公（隴其）年譜",
 "復齋錄",
 "朱子五書",
 "信好錄",
 "清麓文集",
 "日記",
 "賀復齋先生行狀",
 "清麓答問",
 "遺語",
 "遺事",
 "學庸集疏",
 "四書凝道錄",
 "禮記傳",
 "東萊先生音註唐鑑",
 "附音註考異",
 "唐陸宣公翰苑集",
 "宋名臣言行錄前集",
 "外集附",
 "韓文考異",
 "外集考異",
 "遺文考異",
 "四忠集",
 "諸葛忠武侯文集",
 "宋宗忠簡公文集",
 "岳忠武王文集",
 "史忠正公文集",
 "伊川擊壤集",
 "近思續錄",
 "真文忠公心經",
 "楊忠愍公全集",
 "開知錄",
 "治平大略",
 "辨學七種",
 "閑闢錄",
 "學蔀通辯",
 "朱子為學次第考",
 "明辨錄",
 "姚江學辨",
 "九畹古文",
 "薛仁齋先生遺集",
 "養蒙書九種",
 "真西山先生教子齋規",
 "朱子童蒙須知",
 "朱子訓子帖",
 "白鹿洞揭示",
 "敬齋箴",
 "程蒙齋性理字訓",
 "養正叢編",
 "桐閣性理十三論",
 "學旨要略",
 "曾子點註",
 "四書字類釋義",
 "書考辯",
 "誨兒編",
 "訓蒙詩輯解",
 "西銘講義",
 "訓蒙千文註",
 "楊園訓子語",
 "訓蒙千交",
 "清麓訓詞",
 "經世家禮鈔",
 "周易詳說",
 "春秋筆削微旨",
 "孟子要略",
 "國學講義",
 "聖祖仁皇帝庭訓格言",
 "福永堂彙鈔",
 "地球韻言",
 "學韻紀要",
 "池陽吟草",
 "續草",
 "鄭谷詩存",
 "二南遺音",
 "蒙養書十三種",
 "明呂近溪先生小兒語",
 "呂新吾先生演小兒語",
 "二語合編",
 "呂近溪小兒語",
 "呂新吾續小兒語",
 "天谷老人小兒語補",
 "李西漚老學究語",
 "宮南莊醒世要言",
 "呂新吾訓子詞",
 "呂新吾好人歌",
 "堊室錄感",
 "父師善誘法",
 "帝王甲子記",
 "訓俗簡編",
 "儀小經",
 "衡門芹",
 "半半山莊農言著實",
 "握奇經訂本",
 "女學七種",
 "訓女三字文",
 "呂近溪女兒語",
 "女兒經",
 "女訓約言",
 "宋尚宮女論語",
 "雙柏齋女史吟",
 "女史吟",
 "四言閨鑑",
 "關學原編",
 "損齋文鈔",
 "外集鈔",
 "清麓（賀瑞麟）年譜",
 "論語述何",
 "今古學考",
 "分撰兩戴記章句凡例",
 "春秋左傳古義凡例",
 "何氏公羊解詁十論",
 "續十論",
 "再續十論",
 "春秋天子二伯方伯卒正附庸尊卑表",
 "新學偽經考",
 "長興學記",
 "致曲術",
 "佛爾雅",
 "公法總論",
 "西學課程彙編",
 "橢圜求周術",
 "對數尺說",
 "嗇庵手鏡",
 "西江幕遊記",
 "漢槎友扎",
 "城南夜話",
 "續話",
 "惠泉鴻爪",
 "蕉雨吟稿",
 "半淞詩存",
 "半生自紀",
 "金壺醉墨",
 "使閩日記",
 "趙忠節公遺墨",
 "閒雲舒一卷附亙虹日記一卷",
 "同川紀事百詠",
 "核桃吟",
 "鹿城夢憶（原名鹿城紀舊）",
 "于雲殘册（原名情種筆記）",
 "自感叠韻六十章",
 "殉難傳題詞",
 "躬恥齋格言",
 "畿輔紀聞",
 "湖濱匪災紀略",
 "荻塘櫂歌",
 "月季花譜",
 "吳評悅容編",
 "課花樓詩存",
 "省身藥石",
 "東歸日記",
 "錢氏三種",
 "金塗銅塔攷",
 "鐵券攷",
 "銀簡攷",
 "侯鯖新錄",
 "療閒集",
 "廣輿記提要",
 "蓄艾錄",
 "噴飯錄",
 "聽雨錄",
 "碎金錄",
 "談閩錄",
 "昨非錄",
 "戚少保軍中占書",
 "燕臺花表",
 "陽羨風土記",
 "附校刊記",
 "續補輯",
 "考證",
 "青暘集",
 "江陰李氏得月樓書目摘錄",
 "藏說小萃七種",
 "戒庵漫筆",
 "名家詞集十種",
 "二主詞",
 "子野詞",
 "東山詞",
 "信齋詞",
 "竹洲詞",
 "虛齋樂府",
 "松雪詞",
 "天錫詞",
 "古山樂府",
 "江南春詞集",
 "李仲達被逮紀略",
 "荔支譜",
 "經書言學指要",
 "守一齋筆記",
 "客牕二筆",
 "春及堂藳",
 "笏巖詩鈔",
 "讀雪山房唐詩凡例",
 "讀雪山房雜著",
 "雲溪樂府",
 "玉塵集",
 "勇盧閒詰評語",
 "篤慎堂燼餘詩稿",
 "松筠閣貞孝錄",
 "附錄一卷",
 "緯青遺稿",
 "澹盦自娛草",
 "詞賸",
 "仲安遺草",
 "存齋古文",
 "傳忠堂學古文",
 "沈子磻遺文正編",
 "鷗堂賸藁",
 "東鷗草堂詞",
 "鷗堂日記",
 "水雲樓賸藁",
 "玉記補",
 "表忠錄",
 "思忠錄",
 "冰泉唱和集",
 "續和",
 "再續和",
 "江陰藝文志",
 "校補",
 "灕江雜記",
 "灕江游草",
 "赤溪雜志",
 "霞城唱和集",
 "陶廬雜憶",
 "續咏",
 "補咏",
 "陶廬後憶",
 "陶廬五憶",
 "陶廬六憶",
 "粟香隨筆",
 "呂用晦文集",
 "李氏焚書",
 "王陽明先生傳習錄",
 "顏氏學記",
 "顏習齋先生（元）年譜",
 "瘳忘編",
 "續論",
 "附後",
 "李恕谷先生（塨）年譜",
 "張蒼水全集",
 "題咏",
 "冰槎集題中人物攷略",
 "傳略補",
 "戴褐夫集",
 "附紀行",
 "紀略",
 "戴刻戴褐夫集目錄",
 "吳長興伯集",
 "唱酬餘響",
 "袍澤遺音",
 "葉天寥自撰年譜",
 "天寥年譜別記",
 "半不軒留事",
 "禁書目錄",
 "奏繳咨禁書目",
 "吾汶藁",
 "歸玄恭先生文續鈔",
 "錦錢餘笑",
 "鄭所南文集",
 "張文烈公遺詩",
 "真山民詩集",
 "投筆集",
 "靖康孤臣泣血錄",
 "吳赤溟先生文集",
 "天地間集",
 "冬青樹引註",
 "謝皐羽先生（翱）年譜",
 "金華遊錄注",
 "謝皐羽墓錄",
 "湖隱外史",
 "行朝錄",
 "留都見聞錄",
 "刼灰錄",
 "明季復社紀略",
 "湖西遺事",
 "虔臺逸史",
 "嶺上紀行",
 "孑遺錄",
 "燼餘錄",
 "南渡錄",
 "金陵癸甲摭談",
 "草莽私乘",
 "蘇城紀變",
 "陸石丞蹈海錄",
 "續甬上耆舊詩集",
 "貫華堂才子書彙稿",
 "聖嘆外書",
 "唱經堂杜詩解",
 "唱經堂古詩解",
 "唱經堂左傳釋",
 "唱經堂釋小雅",
 "唱經堂釋孟子四章",
 "唱經堂批歐陽永叔詞十二首",
 "聖嘆內書",
 "唱經堂通宗易論",
 "唱經堂聖人千案",
 "唱經堂語錄纂",
 "聖嘆雜篇",
 "唱經堂隨手通",
 "日知錄之餘",
 "容甫先生遺詩",
 "讀晝錄",
 "印人傳",
 "江邨銷夏錄",
 "龔定盦別集",
 "定盦詩集定本",
 "詞定本",
 "集外未刻詩",
 "集外未刻詞",
 "吳越所見書畫錄",
 "松圓浪淘集",
 "偈庵集",
 "梅村文集",
 "天游閣集",
 "詩補",
 "謫麐堂遺集文",
 "庚子銷夏記",
 "南雷餘集",
 "東莊吟稿",
 "帶經堂書目",
 "清暉贈言",
 "書畫題跋記",
 "三吳舊語",
 "山居隨筆",
 "史館藳傳",
 "墨子經說解",
 "葦間詩稿",
 "茗柯文稿",
 "蒼潤軒碑跋",
 "曝書亭文藁",
 "清儀閣古印附注",
 "淵雅堂文藁",
 "蜀石經校記",
 "毛詩九穀考",
 "國史儒林傳",
 "三垣筆記",
 "太宗皇帝實錄",
 "西遼立國本末考",
 "疆域考",
 "都城考",
 "島夷志略廣證",
 "永憲錄",
 "元婚禮貢舉考",
 "士禮居藏書題跋再續記",
 "清學部圖書館善本書目",
 "敦煌石室經卷中未入藏經論著述目一卷",
 "疑偽外道目錄",
 "雲臺金石記",
 "翠墨園語",
 "陽羨摩崖紀錄",
 "荊南遊草",
 "涪州石魚文字所見錄",
 "上谷訪碑記",
 "陸麗京雪罪雲遊記",
 "記桐城方戴兩家書案",
 "金粟逸人逸事",
 "越縵堂日記鈔",
 "蓬山密記",
 "牧齋遺事",
 "吳兔牀日記",
 "何蝯叟日記",
 "鄭鄤事蹟",
 "羽琌山民逸事",
 "雲自在堪筆記",
 "二顧先生遺詩",
 "萬年少遺詩",
 "章實齋文鈔",
 "陳東塾先生讀詩日錄",
 "經典文字考異",
 "海外慟哭記",
 "申范",
 "歲貢士壽臧府君（徐同柏）年譜",
 "長溪瑣語",
 "潛采堂宋金元人集目",
 "靜惕堂藏宋元人集目",
 "庚子消夏記校文",
 "清學部圖書館方志目",
 "金石餘論",
 "寶素室金石書畫編年錄",
 "金石學錄",
 "泰山石刻記",
 "纖言",
 "元郭天錫手書日記真迹",
 "玉几山房聽雨錄",
 "巾箱說",
 "紀善錄",
 "雲自在龕筆記",
 "明何元朗徐陽初曲論",
 "靈谷紀遊稿",
 "竹垞老人晚年手牘",
 "亭林先生集外詩",
 "附亭林詩集校文",
 "棗林詩集",
 "吾炙集小傳",
 "新雕皇朝類苑",
 "大元聖政國朝典章",
 "新集至治條例",
 "附中州樂府",
 "鐵崖先生古樂府",
 "鐵崖先生詩集",
 "蛻菴詩",
 "江東白苧",
 "蕭爽齋樂府",
 "梅村家藏藁",
 "詩補遺",
 "文補遺",
 "梅村先生年譜",
 "世系",
 "梅村先生樂府三種",
 "秣陵春傳奇",
 "雙影記",
 "通天臺",
 "臨春閣",
 "讀曲叢刊",
 "魏良輔曲律",
 "衡曲塵譚",
 "南詞敍錄",
 "劇說",
 "盛明雜劇三十種",
 "高唐夢",
 "五湖遊",
 "遠山戲",
 "洛水悲",
 "四聲猿",
 "漁陽三弄",
 "翠鄉夢",
 "雌木蘭",
 "女狀元",
 "昭君出塞",
 "文姬入塞",
 "袁氏義犬",
 "霸亭秋",
 "鞭歌妓",
 "簪花髻",
 "北邙說法",
 "團花鳳",
 "桃花人面",
 "死裏逃生",
 "中山狼",
 "鬱輪袍",
 "紅線女",
 "崑崙奴",
 "花舫緣",
 "春波影",
 "廣陵月",
 "真傀儡",
 "男王后",
 "再生緣",
 "一文錢",
 "齊東絕倒",
 "盛明雜劇二集三十種",
 "風月牡丹僊",
 "香囊怨",
 "武陵春",
 "蘭亭會",
 "寫風情",
 "午日吟",
 "南樓月",
 "赤壁遊",
 "龍山宴",
 "同甲會",
 "易水寒",
 "夭桃紈扇",
 "碧蓮繡符",
 "丹桂鈿合",
 "素梅玉蟾",
 "脫囊穎",
 "曲江春",
 "魚兒佛",
 "雙鶯傳",
 "不伏老",
 "虬髯翁",
 "英雄成敗",
 "紅蓮債",
 "絡冰絲",
 "錯轉輪",
 "蕉鹿夢",
 "櫻桃園",
 "逍遙遊",
 "相思譜",
 "石巢傳奇四種",
 "詠懷堂新編勘蝴蝶雙金榜記",
 "詠懷堂新編燕子箋記",
 "詠懷堂新編十錯認春燈謎記",
 "遙集堂新編馬郎俠牟尼合記",
 "新編五代史平話",
 "剪燈新話",
 "剪燈餘話",
 "醉醒石",
 "隸古文尚書顧命殘本補考",
 "沙州志",
 "附校錄札記",
 "西州志",
 "慧超往五天竺國傳殘卷",
 "溫泉銘殘卷",
 "沙州文錄",
 "般若波羅蜜多心經",
 "五臺山聖境讚殘卷",
 "老子化胡經",
 "軼文",
 "摩尼經殘卷附摩尼教流行中國考略一卷",
 "景教三威蒙度讚",
 "沙州石室文字記",
 "流沙訪古記",
 "隸古定尚書",
 "春秋穀梁傳解釋",
 "論語鄭氏注",
 "春秋後國語",
 "閫外春秋",
 "張延綬別傳",
 "張義潮傳",
 "春秋後語卷背記",
 "水部式",
 "諸道山河地名要略",
 "殘地志",
 "貞元十道錄",
 "沙州圖經",
 "西州圖經",
 "太公家教",
 "星占",
 "陰陽書",
 "修文殿御覽",
 "免園策府",
 "唐人選唐詩",
 "大雲無想經",
 "摩尼教規",
 "異語",
 "漢志武成日月表",
 "奉使朝鮮倡和集",
 "邊略",
 "伏西紀事",
 "安邊紀事",
 "靖南紀事",
 "楊監筆記",
 "山中聞見錄",
 "內閣大庫檔冊",
 "龍瑞觀禹穴陽明洞天圖經",
 "湟中雜記",
 "硯林拾遺",
 "濮陽蒲汀李先生家藏目錄",
 "脈望館書目",
 "近古堂書目",
 "四明天一閣藏書目錄",
 "也是園藏書目",
 "傳是樓宋元本書目",
 "知聖道齋書目",
 "東漢書刊誤",
 "校錄劄記",
 "一切如來尊勝陀羅尼",
 "肇論中吳集解",
 "流沙墜簡",
 "考釋",
 "補遺考釋",
 "秦金石刻辭",
 "秦漢瓦當文字",
 "權衡度量實驗攷",
 "蒿里遺珍",
 "四朝鈔幣圖錄",
 "慧超往五天竺傳",
 "北巡私記",
 "雲東逸史（姚綬）年譜",
 "簠齋金石文考釋",
 "芒洛冢墓遺文",
 "西陲石刻錄",
 "簡牘檢署攷",
 "伯生詩後",
 "大元海運記",
 "西夏姓氏錄",
 "襄理軍務紀略",
 "卜子（商）年譜",
 "杜東原先生（瓊）年譜",
 "陳乾初先生（確）年譜",
 "王文簡公（引之）行狀",
 "謹案二十五等人圖",
 "太玄真一本際經",
 "吉貝居雜記",
 "讀書雜記",
 "列女傳補注正譌",
 "國朝隸品",
 "洛陽石刻錄",
 "陶齋金石文字跋尾",
 "天下同文前甲集",
 "鶴澗先生遺詩",
 "十憶詩",
 "吳山夫先生（玉搢）年譜",
 "丁亥詩鈔",
 "匪石先生文集",
 "頤志齋文鈔",
 "頤志齋感舊詩",
 "島夷誌略校注",
 "日本橘氏敦煌將來藏經目錄",
 "洛誥箋",
 "明堂廟寢通考",
 "釋幣",
 "古禮器略說",
 "鬼方昆夷玁狁考",
 "不𡠧敦蓋銘考釋",
 "生霸死霸考",
 "三代地理小記",
 "秦漢郡考",
 "古胡服考",
 "宋代金文著錄表",
 "國朝金文著錄表",
 "壬癸集",
 "三國志證聞校勘記",
 "高昌麴氏年表",
 "瓜沙曹氏年表",
 "元和姓纂校勘記",
 "西陲石刻後錄",
 "漢石存目",
 "魏晉石存目",
 "洛陽存古閣藏石目",
 "海外貞珉錄",
 "三韓冢墓遺文目錄",
 "五十日夢痕錄",
 "尚書釋文",
 "道書",
 "律音義",
 "本艸集注序錄",
 "卜筮書第二十三",
 "大唐三藏玄奘法師表啟",
 "佛國禪師文殊指南圖讚",
 "新槧大唐三藏法師取經記",
 "音注孟子",
 "魏三字石經尚書殘石",
 "蜀石經春秋穀梁傳殘石",
 "北宋嘉祐石經周禮禮記殘石",
 "葉石林模急就章",
 "契文舉例",
 "北宋二體石經禮記檀弓殘石",
 "吏部條法",
 "黃山圖經",
 "黃山圖",
 "祕府略",
 "春秋穀梁傳集解",
 "周易經典釋文",
 "贊道德經義疏",
 "略出籯金",
 "類書殘卷",
 "文選集註殘卷",
 "羣經字類",
 "欽定石渠寶笈三編總目",
 "浣花詞",
 "番漢合時掌中珠殘卷",
 "金石萃編未刻稿",
 "楚州金石錄",
 "存目",
 "恆農專錄",
 "楚州城甎錄",
 "地券徵存",
 "專誌徵存",
 "皇宋十朝綱要",
 "續宋中興編年資治通鑑",
 "黑韃事略",
 "西遊錄",
 "金文靖公前北征錄",
 "星槎勝覽前集",
 "敦煌零拾",
 "秦婦吟",
 "云謠集雜曲子",
 "季布歌",
 "佛曲三種",
 "俚曲三種",
 "小曲三種",
 "懷岷精舍金石跋尾",
 "國史列傳",
 "古寫本貞觀政要",
 "佚篇",
 "食醫心鑑",
 "四夷館考",
 "蒿里遺文目錄",
 "雪堂藏古器物目",
 "江邨書畫目",
 "三補唐折衝府考補",
 "敦煌石室碎金",
 "春秋左氏傳",
 "燉煌錄",
 "殘職官書",
 "唐天成元年殘曆",
 "後晉天福四年殘曆",
 "宋淳化元年殘曆",
 "老子義",
 "老子玄通經",
 "天應經",
 "道家",
 "唐律疏議",
 "食療本草",
 "周公卜法",
 "話雨樓碑帖目錄",
 "粵西得碑記",
 "廣雅疏證補正",
 "爾雅郝注刊誤",
 "三朝大議錄",
 "金陵野鈔",
 "南都死難紀略",
 "平叛記",
 "善隣國寶記",
 "荼史",
 "皇華紀程",
 "續百家姓印譜考略",
 "遺山先生新樂府",
 "虞山人詩",
 "塔影園集",
 "乙丑集",
 "明本大字應用碎金",
 "散頒刑部格",
 "楊大洪先生忠烈實錄",
 "趙客亭先生（于京）年譜紀略",
 "秣陵盛氏族譜",
 "東陵盜案彙編",
 "陸尚寶遺文",
 "如此齋詩",
 "蒿庵集捃逸",
 "萬季野先生遺稿",
 "惺齋詩課",
 "霜柯餘響集",
 "論語殘卷",
 "老子殘卷六種一卷",
 "維摩詰經解二種",
 "百行章",
 "療服石醫方",
 "後唐天成元年殘歷",
 "後晉天福四年殘歷",
 "後晉天福十一年殘歷",
 "書議殘葉",
 "占書殘葉",
 "開蒙要訓",
 "書儀斷片",
 "尺櫝殘葉",
 "魚歌子詞殘葉",
 "先天大順等戶籍四種",
 "開元殘牒",
 "文殊問疾佛曲",
 "殘道家書二種",
 "大道通玄要",
 "大玄真一本際經",
 "太上靈寶洗浴身心經",
 "十戒經",
 "大品第廿四",
 "大集經",
 "摩訶般若波羅蜜經",
 "佛說安宅呪經",
 "殘寫經二種",
 "經義二種",
 "唐人行書經義",
 "唐人草書經贊",
 "魏晉間書殘律三種",
 "牧齋集外詩",
 "柳如是詩",
 "龍川先生詩鈔",
 "素蘭集",
 "南詔野史",
 "蘇門游記",
 "藝能編",
 "梅溪筆記",
 "論文連珠",
 "湘煙閣詩鐘",
 "三唐詩品",
 "樊園五日戰時記",
 "小說考證",
 "論嶺南詞絕句",
 "神州異產志",
 "慧觀室謎話",
 "繩齋印稾",
 "樂府釋",
 "香草箋",
 "吟梅閣集唐",
 "王夢樓絕句",
 "勉鋤山館存稿",
 "樊園戰詩續記",
 "吳社詩鐘",
 "絜園詩鐘",
 "清朝論詩絕句",
 "小說閒話",
 "筆志",
 "種菊法",
 "鵲華行館詩鐘",
 "西海紀行卷",
 "天外歸槎錄",
 "絜園詩鐘續錄",
 "姚黃集輯",
 "頤和園詞",
 "在山泉詩話",
 "丁叔雅遺集",
 "海天詩話",
 "燈謎源流攷",
 "江隣幾雜志",
 "雲鶴先生遺詩",
 "五岳遊記",
 "拙存堂碑帖題跋",
 "九宮新式",
 "學書雜論",
 "學畫雜論",
 "秉蘭錄",
 "散原精舍集外詩",
 "樸學齋夜談",
 "續杜工部詩話",
 "澹廬讀畫詩",
 "桂隱百課",
 "四並集",
 "玉照堂梅品",
 "冬心先生畫記五種",
 "冬心先生自寫真題記",
 "冬心先生畫佛題記",
 "冬心畫竹題記",
 "讀畫紀聞",
 "續書法論",
 "越縵堂筆記",
 "琴軒集",
 "治安要議",
 "擬古樂府",
 "懸榻齋詩集",
 "陳獻孟遺詩",
 "長春道教源流",
 "浮山志",
 "荔莊詩存",
 "勝朝粵東遺民錄",
 "宋東莞遺民錄",
 "詩文補遺",
 "宋臺秋唱",
 "晉唐指掌",
 "晉五胡指掌",
 "唐藩鎮指掌",
 "陽山志",
 "明懿安皇后外傳",
 "雞窗叢話",
 "柿葉軒筆記",
 "鉅鹿東觀集",
 "崑山雜詠",
 "重編紅雨樓題跋",
 "重編桐庵文稿",
 "雲間三子新詩合稿",
 "離憂集",
 "從游集",
 "頑潭詩話",
 "星湄詩話",
 "晚香書札",
 "徐巡按揭帖",
 "民抄董宦事實",
 "龔安節先生遺文",
 "龔安節先生年譜",
 "歸玄恭先生（莊）年譜",
 "汪堯峯先生（琬）年譜",
 "紅葉村詩稾",
 "校正萬古愁",
 "擊筑餘音",
 "新樂府",
 "殢花詞",
 "鶯邊詞",
 "留漚唫館詞存",
 "紅蕉詞",
 "元史弼違",
 "爨龍顏碑考釋",
 "怡松軒金石偶記",
 "顧千里先生（廣圻）年譜",
 "雙峯先生內外服制通釋",
 "刑統賦解",
 "粗解刑統賦",
 "別本刑統賦解",
 "刑統賦疏",
 "河汾旅話",
 "穆參軍遺事",
 "吳興沈夢麟先生花谿集",
 "來鶴亭集",
 "玉斗山人文集",
 "籀䯧詩詞",
 "二黃先生詩葺",
 "輔行記校注",
 "瑞安黃氏蔘綏閣舊本書目初編",
 "曝書隨筆",
 "𨌰鄦樓遺稿",
 "召對紀實",
 "被難紀略",
 "校碑隨筆",
 "越畫見聞",
 "須靜齋雲煙過眼錄",
 "敦交集",
 "東洲艸堂金石跋",
 "武林金石記",
 "檢圖之例",
 "戊戍履霜錄",
 "堅冰志",
 "光宣僉載",
 "殘明紀事",
 "清賢記",
 "棗林雜俎",
 "尖陽叢筆",
 "陳一齋先生文集",
 "傅徵君霜紅龕詩鈔",
 "百宋一廛書錄",
 "魏書地形志校錄",
 "漢石經攷異補正",
 "內閣藏書目錄",
 "月隱先生遺集",
 "古泉山館金石文編殘稿",
 "燼宮遺錄",
 "對客燕談",
 "魯春秋",
 "北征紀略",
 "使臣碧血",
 "後村先生題跋",
 "攻媿題跋",
 "國初羣雄事略",
 "東都事略校勘記",
 "東都事略校記",
 "歷代職源撮要",
 "續吳郡志",
 "蔣子萬機論",
 "桓氏世要論",
 "劉氏政論",
 "典語",
 "杜氏篤論",
 "西吳里語",
 "五代史記補考",
 "得樹樓雜鈔",
 "山谷先生（黃庭堅）年譜",
 "圍鑪詩話",
 "滄浪嚴先生吟卷",
 "新編醉翁談錄",
 "虔臺節略",
 "彭節愍公家書",
 "左傳杜解集正",
 "閩行隨筆",
 "逸經補正",
 "嶺海焚餘",
 "汪氏珊瑚網法書題跋",
 "汪氏珊瑚網名畫題跋",
 "後山先生集",
 "貞一齋雜著",
 "春秋傳禮徵",
 "求是齋碑跋",
 "太平治蹟統類",
 "簡莊疏記",
 "花村談往",
 "藏一話腴甲集",
 "廣元遺山（好問）年譜",
 "祗欠庵集",
 "後漢藝文志",
 "三國藝文志",
 "重刊湖海新聞夷堅續志前集",
 "鐙下閑談",
 "成都氏族譜",
 "新纂香譜",
 "吹景集",
 "深柳堂文集",
 "疊翠居文集",
 "勘書巢未定稿",
 "秋水文叢外集",
 "古宮詞注",
 "魚計軒詩話",
 "尚書註疏",
 "樂書正誤",
 "唐書藝文志",
 "孫諫議唐史記論",
 "唐書直筆新例",
 "新例須知",
 "改正湘山野錄",
 "反離騷",
 "寒山詩集",
 "附豐干拾得詩",
 "范文正公政府奏議",
 "此山先生詩集",
 "曹子建文集",
 "歌詩編",
 "草窗韻語",
 "雪巖吟草甲卷忘機集一卷",
 "朱慶餘詩集",
 "李丞相詩集",
 "周賀詩集",
 "註鶴山先生渠陽詩",
 "宋金元本書影",
 "鐵琴銅劍樓藏書目錄",
 "容安齋詩集",
 "秋影樓詩集",
 "楊太后宮詞",
 "敦煌古寫本周易王注校勘記",
 "周書顧命禮徵",
 "周書顧命後考",
 "樂詩考略",
 "祼禮搉",
 "五宗圖說",
 "韓氏三禮圖說",
 "爾雅草木蟲魚鳥獸釋例",
 "蒙雅",
 "釋史",
 "毛公鼎銘考釋",
 "史籀篇疏證",
 "倉頡篇殘簡考釋",
 "漢代古文考",
 "魏石經考",
 "小學叢殘四種",
 "字樣",
 "開元文字音義",
 "韻銓",
 "韻英",
 "甎文考略",
 "餘",
 "流沙墜簡考釋補正",
 "漢魏博士考",
 "大元馬政記",
 "隨志",
 "江氏音學敍錄",
 "古韻總論",
 "廿一部諧聲表",
 "入聲表",
 "唐韻四聲正",
 "兩周金石文韻讀",
 "唐韻別考",
 "韻學餘說",
 "操風瑣錄",
 "殷卜辭中所見先公先王考",
 "殷卜辭中所見先公先王續考",
 "殷周制度論",
 "古本竹書紀年輯校",
 "今本竹書紀年疏證",
 "太史公繫年考略",
 "宋史忠義傳王稟補傳",
 "清真先生遺事",
 "元高麗紀事",
 "元代畫塑記",
 "大元倉庫記",
 "大元氈罽工物記",
 "大元官制雜記",
 "唐折衝府考補",
 "日知錄續補正",
 "永觀堂海內外雜文",
 "補逸",
 "山海經箋疏",
 "圖讚",
 "列女傳補注",
 "校正",
 "兩漢紀字句異同考",
 "附補華陽國志三州郡縣目錄",
 "古孝子傳",
 "孝子傳補遺",
 "三輔故事",
 "洛陽迦藍記鉤沈",
 "陸子新語校注",
 "伏侯古今注",
 "又補遺",
 "注補并重校",
 "再補遺",
 "列仙傳校正本",
 "讚",
 "計然萬物錄",
 "修文御覽",
 "附補注",
 "兩漢三國學案",
 "春秋正義",
 "榖梁疏",
 "明史攷證攟逸",
 "附識",
 "附識補遺",
 "安龍逸史",
 "天寥道人自撰年譜",
 "年譜別記",
 "甲行日注",
 "查東山（繼佐）年譜",
 "書湖州莊氏史獄",
 "東山外紀",
 "附寅賓錄",
 "查他山先生（慎行）年譜",
 "厲樊榭先生（鶚）年譜",
 "瞿木夫先生自訂年譜",
 "武進李先生（兆洛）年譜",
 "先師小德錄",
 "言舊錄",
 "南唐書注",
 "南唐書補注",
 "雲南水道考",
 "滇南山水辨誤",
 "中書典故彙記",
 "重詳定刑統",
 "台州金石錄",
 "甎錄",
 "金石甎文闕訪目",
 "嚴州金石錄",
 "授時厤故",
 "訂訛類編",
 "樸學齋筆記",
 "重刊增廣分門類林雜說",
 "閒漁閒閒錄",
 "道德真經注疏",
 "王荊公詩集李壁注勘誤補正",
 "王荊公文集注",
 "廣陵先生文集",
 "漫堂文集",
 "傅與礪詩集",
 "綠窗遺稿",
 "遺詩",
 "王靜學先生文集",
 "翁山文外",
 "句餘土音補注",
 "復初齋集外詩",
 "集外文",
 "翁比部詩鈔",
 "咄咄吟",
 "黃忠節公甲申日記",
 "四書說約",
 "中庸切己錄",
 "事天謨",
 "程山先生日錄",
 "進語",
 "耐俗軒新樂府",
 "向惕齋先生集",
 "周易集義",
 "喪服鄭氏學",
 "庚子西行記事",
 "漢管處士（寧）年譜",
 "玉溪生（李商隱）年譜會箋",
 "司馬溫國文正公（光）年譜",
 "王荊國文公（安石）年譜",
 "金稷山段氏二妙（成己、克己）年譜",
 "水經注正誤舉例",
 "漢書地理志水道圖說補正",
 "今水經注",
 "京師五城坊巷衚衕集",
 "京師坊巷志",
 "唐賈耽記邊州入四夷道里考實",
 "渤海國志",
 "渤海疆域考",
 "禮議",
 "四庫全書表文箋釋",
 "垛積衍術",
 "橫楊札記",
 "蕉廊脞錄",
 "山海經地理今釋",
 "天問閣文集",
 "海棠居詩集",
 "傳經室文集",
 "賦鈔",
 "心嚮往齋詩文集",
 "絅齋隨筆",
 "勿二三齋詩集",
 "飲冰子詞存",
 "紹仁齋浦游吟",
 "林風閣詩鈔",
 "通義堂文集",
 "校經室文集",
 "遜齋文集",
 "王文敏公遺集",
 "雪橋詩話",
 "元西湖書院重整書目",
 "內板經書紀略",
 "四庫全書薈要目",
 "南薰殿尊藏圖像目",
 "茶庫藏貯圖像目",
 "道藏闕經目錄",
 "藏逸經書",
 "儒藏說",
 "孝獻莊和至德宣仁溫惠端敬皇后行狀",
 "附傳",
 "大清孝定景皇后事略",
 "東朝崇養錄",
 "徑山遊草",
 "雁影齋詩",
 "繡谷亭薰習錄經部",
 "集部",
 "清吟閣書目",
 "寶書閣著錄",
 "一角編",
 "端石擬",
 "附藜閣十硯銘",
 "竹垞小志",
 "尊道堂詩鈔",
 "詩畫巢遺稿",
 "飛白錄",
 "清儀閣雜詠",
 "骨董十三說",
 "匋雅",
 "世說新書",
 "監本纂圖重言重意互注點校尚書",
 "纂圖互註禮記",
 "附春秋二十國年表",
 "春秋公羊經傳解詁",
 "附序錄",
 "辨譌",
 "大廣益會玉篇",
 "司馬溫公稽古錄",
 "資治通鑑外紀",
 "劉向古列女傳",
 "五朝名臣言行錄",
 "三朝名臣言行錄",
 "劉向新序",
 "孫子集注",
 "重廣補註黃帝內經素問",
 "黃帝素問靈樞經",
 "新編金匱要略方論",
 "注解傷寒論",
 "新刊王氏脈經",
 "重修政和經史證類備用本草",
 "附說玄",
 "慎子內篇",
 "附內篇校文",
 "附校語",
 "唐段少卿酉陽雜俎",
 "翻譯名義集",
 "陸士龍文集",
 "箋注陶淵明集",
 "鮑氏集",
 "梁昭明太子文集",
 "梁江文通文集",
 "庾子山集",
 "寒山詩",
 "附慈受擬寒山詩",
 "幽憂子集",
 "駱賓王文集",
 "陳伯玉文集",
 "唐丞相曲江張先生文集",
 "分類補註李太白詩",
 "分類編次文",
 "分門集註杜工部詩",
 "杜工部年譜",
 "須溪先生校本唐王右丞集",
 "唐元次山文集",
 "附行狀",
 "碑銘",
 "舊史本傳",
 "新史本傳",
 "岑嘉州詩",
 "晝上人集",
 "劉隨州文集",
 "韋刺史詩集",
 "錢考功集",
 "權載之文集",
 "補刻",
 "朱文公校昌黎先生文集",
 "增廣註釋音辯唐柳先生集",
 "劉夢得文集",
 "呂和叔文集",
 "唐張司業詩集",
 "唐李文公集",
 "歐陽行周文集",
 "孟東野詩集",
 "唐賈浪仙長江集",
 "李文饒文集",
 "集外文章",
 "白氏文集",
 "唐李義山詩集",
 "李義山文集",
 "溫庭筠詩集",
 "唐劉蛻集",
 "唐孫樵集",
 "李羣玉詩集",
 "碧雲集",
 "唐李推官披沙集",
 "皮日休文集",
 "唐甫里先生文集",
 "玉川子詩集",
 "司空表聖詩集",
 "玉山樵人集",
 "唐黃先生文集",
 "甲乙集",
 "徐公文集",
 "河東先生集",
 "王黃州小畜集",
 "王黃州小畜外集",
 "宋林和靖先生詩集",
 "河南穆公集",
 "范文正公集",
 "范文正公年譜",
 "言行拾遺事錄",
 "范文正公鄱陽遺事錄",
 "河南先生文集",
 "蘇學士文集",
 "溫國文正公文集",
 "直講李先生文集",
 "直講李先生年譜",
 "門人錄",
 "陳眉公先生訂正丹淵集",
 "石室先生（文同）年譜",
 "南豐先生元豐類藳",
 "宛陵先生集",
 "歐陽文忠公集",
 "居士集",
 "易童子問",
 "外制集",
 "內制集",
 "表奏書啟四六集",
 "河東奉使奏草",
 "河北奉使奏草",
 "奏事錄",
 "濮議",
 "崇文總目敍釋",
 "筆說",
 "近體樂府",
 "書簡",
 "廬陵歐陽文忠公年譜",
 "臨川先生文集",
 "增刊校正王狀元集註分類東坡先生詩",
 "東坡紀年錄",
 "經進東坡文集事略",
 "欒城應詔集",
 "豫章黃先生文集",
 "后山詩註",
 "張右史文集",
 "濟北晁先生雞肋集",
 "附正誤",
 "簡齋先生年譜",
 "簡齋詩外集",
 "于湖居士文集",
 "晦菴先生朱文公文集",
 "止齋先生文集",
 "梅溪先生廷試策奏議",
 "詩文前集",
 "象山先生全集",
 "盤洲文集八十集附錄",
 "盤洲文集",
 "石湖居士詩集",
 "澗谷精選陸放翁詩集前集",
 "須溪精選後集",
 "水心先生文集",
 "重校鶴山先生大全文集",
 "西山先生真文忠公文集",
 "歌曲",
 "歌曲別集",
 "後村先生大全集",
 "文山先生全集",
 "閑閑老人滏水文集",
 "遺山先生文集",
 "秋澗先生大全集",
 "剡源戴先生文集",
 "松雪齋文集",
 "詩文外集",
 "靜修先生文集",
 "翰林楊仲弘詩",
 "揭文安公全集",
 "范德機詩集",
 "淵穎吳先生集",
 "金華黃先生文集",
 "柳待制文集",
 "薩天錫詩集",
 "句曲外史貞居先生詩集",
 "倪雲林先生詩集",
 "東維子文集",
 "鐵崖先生復古詩集",
 "宋學士文集",
 "太師誠意伯劉文成公集",
 "清江貝先生文集",
 "蘇平仲文集",
 "高太史大全集",
 "高太史鳧藻集",
 "扣舷集",
 "匏翁家藏集",
 "陽明先生集要",
 "陽明先生年譜",
 "理學編",
 "經濟編",
 "文章編",
 "王文成公全書",
 "傳習錄",
 "朱子晚年定論",
 "文錄續編",
 "世德紀",
 "重刊荊川先生文集",
 "新刊外集",
 "震川先生集",
 "亭林詩集",
 "亭林餘集",
 "南雷文案",
 "外卷",
 "吾悔集",
 "撰杖集",
 "子劉子行狀",
 "南雷詩曆",
 "學箕初稿",
 "薑齋詩文集",
 "牧齋初學集",
 "牧齋有學集",
 "梅村家藏藳",
 "漁洋山人精華錄",
 "堯峰文鈔",
 "笛漁小藳",
 "陳迦陵文集",
 "儷體文集",
 "湖海樓詩集",
 "迦陵詞全集",
 "敬業堂詩集",
 "望溪先生文集",
 "集外文補遺",
 "方望溪先生年譜",
 "又",
 "集外詞",
 "集外曲",
 "惜抱軒文集",
 "戴東原集",
 "戴東原先生年譜",
 "鮚埼亭集",
 "全謝山先生年譜",
 "經史問答",
 "鮚埼亭詩集",
 "洪北江詩文集",
 "洪北江先生年譜",
 "孫淵如詩文集",
 "長離閣集",
 "潛研堂文集",
 "詩續集",
 "大雲山房文稿初集",
 "言事",
 "定盦文集",
 "定盦文集補編",
 "茗柯文補編",
 "曾文正公詩集",
 "附校文",
 "重校正唐文粹",
 "西崑詶唱集",
 "皇朝文鑑",
 "國朝文類",
 "皇元風雅前集",
 "皇明文衡",
 "增修詩話總龜",
 "花閒集",
 "唐宋諸賢絕妙詞選",
 "中興以來絕妙詞選",
 "增修箋註妙選羣英草堂詩餘前後集",
 "朝野新聲太平樂府",
 "東萊呂太史春秋左傳類編",
 "作邑自箴",
 "龜山先生語錄",
 "法書攷",
 "飲膳正要",
 "揮塵前錄",
 "宋之問集",
 "雪竇顯和尚明覺大師頌古集",
 "拈古",
 "瀑泉集",
 "山谷外集詩注",
 "嵩山文集",
 "卷三負薪對校勘表一卷",
 "沈忠敏公龜谿集",
 "東萊先生詩集",
 "范香溪先生文集",
 "范蒙齋先生遺文",
 "范楊溪先生遺文",
 "石屏詩集",
 "梅亭先生四六標準",
 "錦錢餘笑二十四首",
 "先天集",
 "山屋許先生事錄",
 "蕭冰厓詩集拾遺",
 "許白雲先生文集",
 "存復齋文集",
 "青陽先生文集",
 "張光弼詩集",
 "茗齋集",
 "明詩",
 "雍熙樂府",
 "白雲齋選訂樂府吳騷合編",
 "詩本義",
 "鄭氏詩譜補亡",
 "析城鄭氏家塾重校三禮圖",
 "張狀元孟子傳",
 "附補遺又附校勘記",
 "明史鈔略",
 "罪惟錄",
 "東山國語",
 "弔伐錄",
 "天下郡國利病書",
 "顧亭林先生年譜",
 "經進風憲忠告",
 "故唐律疏義",
 "附律音義",
 "圖畫攷",
 "古今註",
 "丞相魏公譚訓",
 "南村輟耕錄",
 "景德傳燈錄",
 "文始真經",
 "新雕洞靈真經",
 "唐皇甫冉詩集",
 "唐皇甫曾詩集",
 "梨嶽詩集",
 "新彫注胡曾詠史詩",
 "唐祕書省正字先輩徐公釣磯文集",
 "忠愍公詩集",
 "鐔津文集",
 "參寥子詩集",
 "沈氏三先生文集",
 "西溪文集",
 "雲巢集",
 "眉山唐先生文集",
 "默堂先生文集",
 "有宋福建莆陽黃仲元四如先生文藁",
 "龜巢藁",
 "夷白齋藁",
 "密菴詩藁",
 "文藁",
 "白沙子",
 "居易堂集",
 "集外詩文",
 "寶氏聯珠集",
 "梨園按試樂府新聲",
 "讀易雜說",
 "大正博覽會參觀記",
 "漢魏碑考",
 "拙存堂題跋",
 "石泉書屋金石題跋",
 "跋南雷文定",
 "玉井搴蓮集",
 "岱游集",
 "同文集",
 "媕雅堂詩集",
 "警庵文存",
 "抱潛詩存",
 "十五福堂筆記",
 "女世說",
 "嫩想盦殘藁",
 "紅燭詞",
 "定盦遺箸",
 "定盦先生年譜外記",
 "春秋左傳杜注校勘記",
 "聖賢高士傳贊",
 "道德真經指歸",
 "費氏遺書三種",
 "弘道書",
 "荒書",
 "燕峯詩鈔",
 "識誤",
 "重雕改正湘山野錄",
 "離騷",
 "附攷",
 "附集證",
 "東山遺集二種",
 "釣業",
 "粵游雜詠",
 "天足考略",
 "純飛館詞",
 "彤芬室文",
 "彤芬室筆記",
 "五藩檮乘",
 "可言",
 "五刑考略",
 "秀水董氏五世詩鈔",
 "高雲鄉遺稿",
 "復盦覓句圖題詠",
 "小自立齋文",
 "真如室詩",
 "純飛館詞續",
 "四庫全書序",
 "姚彥長觀書例",
 "田隴初觀書後例",
 "四川省城尊經書院記",
 "輶軒語",
 "書目答問",
 "經義韻言",
 "天文歌略",
 "地學歌略",
 "別下齋書畫錄",
 "墨緣小錄",
 "持靜齋藏書紀要",
 "南濠居士金石文跋",
 "小鷗波館畫識",
 "畫寄",
 "遲鴻軒所見書畫錄",
 "國朝書畫家筆錄",
 "程氏攷古篇",
 "歷代壽考名臣錄",
 "雕菰樓集",
 "蜜梅花館文錄",
 "古書疑義舉例",
 "經讀攷異",
 "句讀敍述",
 "四書攷異",
 "羣經義證",
 "讀書脞錄",
 "家語證譌",
 "西圃題畫詩",
 "爾雅校義",
 "竹崦盦金石目錄",
 "論語孔子弟子目錄",
 "論語師法表",
 "瞥記",
 "讀歐記疑",
 "道古堂外集十二種",
 "禮經質疑",
 "經史質疑",
 "史記考證",
 "石鼓然疑",
 "孟塗駢體文",
 "鴻雪詞",
 "退葊詞",
 "儀鄭堂文集",
 "管子校正",
 "巢經巢文集",
 "屈廬詩稿",
 "忠傳",
 "復齋日記",
 "識小錄",
 "蓬窗類記",
 "山樵暇語",
 "消夏閑記摘抄",
 "西湖老人繁勝錄",
 "孫氏書畫鈔",
 "松下雜抄",
 "彭氏舊聞錄",
 "太僕行略",
 "天文書",
 "華夷譯語",
 "厓山集",
 "趙氏家法筆記",
 "傍秋亭雜記",
 "敬業堂集補遺",
 "扶風縣石刻記",
 "海濱外史",
 "明朝紀事本末補編",
 "書林外集",
 "唐石經攷異不分卷附補",
 "冥報記",
 "西山日記",
 "續名賢小記",
 "土苴集",
 "道餘錄",
 "東洲几上語",
 "枕上語",
 "存復齋續集",
 "後稿",
 "鼓枻稿",
 "雪庵字要",
 "鐙窗叢錄",
 "太和正音譜",
 "磯園稗史",
 "各省進呈書目",
 "漢泉漫稿",
 "肅雝集",
 "金囦集",
 "釋迦牟尼如來像法滅盡之記",
 "七曜曆日",
 "漢蕃對音千字文殘卷",
 "音學緒餘",
 "三家詞品",
 "洮瓊館詞",
 "純飛館詞三集",
 "吳氏吉光集",
 "胥山朱氏述德錄",
 "瑞龍展墓日記",
 "附汪容甫先生遺文",
 "附鈔",
 "附恆產瑣言",
 "玉峯先生脚氣集",
 "徐文長佚草",
 "王屋山志",
 "大書長語",
 "折疑論",
 "續增補折疑頌論詩",
 "二十四孝原編",
 "二十四孝別集",
 "痧脹玉衡書",
 "疫痧草",
 "時疫白喉捷要",
 "嘉興徐子默先生吊脚痧論",
 "江氏百問目講禪師地理書",
 "地理索隱",
 "羅盤解",
 "梅花神數",
 "爛柯神機",
 "雜字便覽",
 "佛說大乘金剛經論",
 "毘陵天甯普能嵩禪師淨土詩",
 "附臨終舟楫要語",
 "雲間雜志",
 "雲間據目鈔",
 "醉鄉瑣志",
 "雲薖漫錄",
 "外家紀聞",
 "簷醉雜記",
 "竹素園叢談",
 "洪憲舊聞",
 "項城就任祕聞",
 "春秋后妃本事詩",
 "遯齋殘稿",
 "明事雜詠",
 "扶桑百八吟",
 "貫華叢錄",
 "福慧雙修庵小記",
 "雲郎小史",
 "論文瑣言",
 "八旗畫錄前編",
 "後編",
 "韓詩外傳疏證",
 "校漢書八表",
 "選學膠言",
 "文選筆記",
 "密齋隨錄",
 "信陽詩鈔",
 "何大復先生（景明）年譜",
 "師竹堂尺牘",
 "報慶紀行",
 "冷語",
 "質語",
 "王師竹先生（祖嫡）年譜",
 "學約書程",
 "龍潭小志",
 "賢首紀聞",
 "龍潭清話",
 "兩龍潭主人藏鏡圖",
 "題詞",
 "元城先生語錄",
 "髤飾錄",
 "附箋證",
 "豐溪存稿",
 "春卿遺稿",
 "張大家蘭雪集",
 "陳剛中詩集",
 "慮得集",
 "明周端孝先生血疏貼黃真蹟",
 "楊忠愍傳家寶訓",
 "瓶笙館修簫譜",
 "卓女當爐",
 "樊姬擁髻",
 "酉陽脩月",
 "博望訪星",
 "程氏心法三種",
 "蹶張心法",
 "長鎗法選",
 "單刀法選",
 "唐褚河南陰符經墨跡",
 "乾隆寶譜",
 "清內府藏古玉印",
 "金輪精舍藏古玉印",
 "天工開物",
 "欽定授衣廣訓",
 "寶硯堂硯辨",
 "雪宧繡譜",
 "牧牛圖頌",
 "又十頌",
 "問山亭主人遺詩正集",
 "補集",
 "月壺題畫詩",
 "撏撦集",
 "紅香館詩草",
 "雙清閣詩",
 "芸春館遺詩",
 "吟葒館遺詩",
 "秦樓月",
 "校正原本紅梨記",
 "紅梨花雜劇",
 "繡襦記",
 "幽閨怨佳人拜月亭記",
 "鴛鴦縧傳奇",
 "宣鑪博論",
 "宣德彝器圖譜",
 "宣德彝器譜",
 "宣爐小志",
 "離騷圖",
 "離騷圖像",
 "明刻傳奇圖像十種",
 "朱上如木刻四種",
 "淩烟閣功臣圖像",
 "無雙譜",
 "御製耕織圖詩",
 "御製避暑山莊圖詠",
 "雲臺二十八將圖",
 "經略洪承疇奏對筆記",
 "欽定補繪離騷圖",
 "園冶",
 "還初道人箸書二種",
 "菜根譚",
 "月旦堂仙佛奇踪",
 "經學導言",
 "白鵝洲小志",
 "九峯采蘭記",
 "鼎樓詩草",
 "番禺隱語解",
 "東齋雜誌",
 "南村草堂筆記",
 "窮忙小記",
 "番禺末業志",
 "聽雨樓隨筆",
 "齊家淺說",
 "自然略說",
 "白桃花館雜憶",
 "立德堂詩話*",
 "智因閣詩集*",
 "吉祥錄*",
 "明珠*",
 "治家要義",
 "達庵隨筆*",
 "耕雲別墅詩話*",
 "耕雲別墅詩集*",
 "詩學要言",
 "王制通論",
 "王制義按",
 "無終始齋詩文集",
 "孝經通論",
 "古今偽書考書後",
 "南橘廬詩草",
 "騰越杜亂紀實",
 "滇西兵要界務圖注",
 "文氏族譜續集",
 "鎮揚遊記",
 "吳郡西山訪古記",
 "九保金石文存",
 "九保詩錄",
 "九保節孝錄略",
 "虎阜金石經眼錄",
 "洞庭山金石",
 "闕塋石刻錄",
 "嶽峙山石刻",
 "觀貞老人壽序錄",
 "觀貞老人哀輓錄",
 "娛親雅言",
 "羅生山館詩集",
 "治平吟草",
 "李希白先生（學詩）年譜",
 "東齋詩鈔",
 "焦尾集",
 "罔措齋聯集",
 "重校稽古樓四書",
 "大學",
 "中庸",
 "飲虹五種",
 "琵琶賺雜劇",
 "茱萸會雜劇",
 "無為州雜劇",
 "仇宛娘雜劇",
 "燕子僧雜劇",
 "附補校注",
 "重訂穀梁春秋經傳古義疏",
 "釋范",
 "起起穀梁廢疾",
 "痙書或問",
 "本草鈔",
 "賁園詩鈔",
 "賁園書庫目錄輯略",
 "評書帖",
 "從戎紀略",
 "遲菴集杜詩",
 "董子定本",
 "復堂詩續",
 "復堂日記補錄",
 "復堂日記續錄",
 "復堂諭子書",
 "客人對",
 "客人三先生詩選",
 "李繡子先生詩",
 "宋芷灣先生詩",
 "黃公度先生詩",
 "客人駢體文選",
 "九章算經",
 "歷代名醫蒙求",
 "釋音",
 "音註河上公老子道德經",
 "常建詩集",
 "古玉圖攷補正",
 "論畫十則",
 "論書十則",
 "畫山水訣",
 "畫譚",
 "玉尺樓畫說",
 "寒松閣題跋",
 "印母",
 "周公謹印說刪",
 "今文房四譜",
 "定川草堂文集小品",
 "蘭易",
 "蘭史",
 "蘭蕙鏡",
 "藝蘭要訣",
 "養菊法",
 "藝菊簡易",
 "藝菊須知",
 "瓨荷譜",
 "蓮鄉題畫偶存",
 "談經",
 "魯文恪公集",
 "大隱樓集",
 "晉陵先賢傳",
 "素風居士集攟遺",
 "逸樓論史",
 "楚師儒傳",
 "潛江舊聞",
 "潛廬類稿",
 "潛廬詩錄",
 "潛廬隨筆",
 "古今文字通釋",
 "閩中金石略",
 "聞中金石略考證",
 "萬木草堂叢書目錄",
 "袁督師遺集",
 "張文烈遺集",
 "寒木居詩鈔",
 "袁督師配祀關岳議案",
 "哀烈錄",
 "汪兆銘庚戌被逮供詞",
 "寄禪遺詩",
 "焚餘草",
 "愁思集",
 "篁溪家譜",
 "篁溪歸釣圖題詞",
 "南海康先生傳",
 "達賴喇嘛傳",
 "班禪額爾德尼傳",
 "西藏大呼畢勒罕考",
 "西藏聖蹟考",
 "諸佛出世事蹟考",
 "榮武佛開光說法錄",
 "榮武佛傳",
 "白尊者普仁傳",
 "白尊者普仁舍利塔銘",
 "佛法靈感記",
 "甲戌雜感",
 "周易黃氏注",
 "兩漢書舊本攷",
 "毛本梁書校議",
 "新會修志條例",
 "肇慶修志章程",
 "潔盦金石言",
 "姑蘇名賢續紀",
 "鄭桐菴先生年譜",
 "鄭峚陽寃獄辨",
 "庉村志",
 "遊黃山記",
 "黟山紀游",
 "王司農題畫錄",
 "藝菊新編",
 "銅僊傳",
 "無名氏筆記",
 "潛吉堂雜著",
 "散花菴叢語",
 "寒螿詩藁存",
 "縹緲集",
 "如畫樓詩鈔",
 "梅笛菴詞賸藁",
 "詞說",
 "鄭易馬氏學",
 "倭情考略",
 "姑蘇名賢後紀",
 "寒山誌傳",
 "夢盦居士自編年譜",
 "鄭桐菴筆記",
 "春樹閒鈔",
 "音匏隨筆",
 "寙櫎日記鈔",
 "遂初堂集外詩文稿",
 "三百堂文集",
 "蕉雲遺詩",
 "東陵紀事詩",
 "霜厓讀畫錄",
 "孟子趙注考證",
 "兩漢訂誤",
 "閭邱先生自訂年譜",
 "竹垞府君行述",
 "家兒私語",
 "西廬家書",
 "資敬堂家訓",
 "荷香館瑣言",
 "天瓶齋書畫題跋",
 "天瓶齋書畫題跋補輯",
 "桐菴存稿",
 "寫禮廎遺詞",
 "唐開成石經考異",
 "釋書名",
 "遼廣實錄",
 "定思小紀",
 "惕齋見聞錄",
 "勞氏碎金",
 "鄭桐庵筆記補逸",
 "詠歸堂集",
 "始誦經室文錄",
 "桐月修簫譜",
 "羣經冠服圖考",
 "顏氏家訓斠記",
 "東湖乘",
 "雅園居士自敍",
 "徵君陳先生（奐）年譜",
 "歷代車戰考",
 "藏書題識",
 "孫淵如先生文補遺",
 "戲鷗居詞話",
 "叢話",
 "逸禮大義論",
 "靖康稗史七種",
 "宣和乙已奉使金國行程錄",
 "甕中人語",
 "開封府狀",
 "南征錄彙",
 "青宮譯語節本",
 "宋俘記",
 "行人司重刻書目",
 "梵麓山房筆記",
 "論語皇疏考證",
 "禮學大義",
 "楚辭音",
 "風人詩話",
 "一夢緣",
 "平圃雜記",
 "古歡堂經籍舉要",
 "石墨考異",
 "硯谿先生遺稿",
 "春影餘譜",
 "經學博采錄",
 "吳逆始末記",
 "存友札小引",
 "荔村隨筆",
 "一老庵文鈔",
 "一老庵遺稾",
 "三傳經文辨異",
 "孔子三朝記",
 "史記釋疑",
 "尚友記",
 "師友淵源記",
 "汪孟慈文集",
 "筠軒文鈔",
 "李匡易解賸義",
 "尚書注考",
 "泰誓答問",
 "體經奧旨",
 "論語鄭氏注輯",
 "小學鉤沈",
 "倉頡訓詁倉頡解詁",
 "三倉訓詁三倉解詁",
 "字指",
 "文略",
 "切韻指南",
 "太初以前朔閏表",
 "通鑑綱目釋地補注",
 "宋南渡十將傳",
 "樗庵日錄",
 "丹溪朱民脈因證治",
 "答問",
 "天文精義",
 "冬心畫題記五種",
 "冬心先生畫梅題記",
 "冬心先生畫馬題記",
 "清宮詞本事",
 "擊劍詞",
 "續千字文",
 "廣千字文",
 "范運吉傳",
 "黃氏家錄",
 "楊龜山先生（時）年譜考證",
 "四明山遊錄",
 "餘慶錄",
 "康熙御製百家姓",
 "青錦園賦草",
 "附廣連珠",
 "南雷文定五集",
 "定泉詩話",
 "閨詞雜怨",
 "宜園詞",
 "庫頁島志略",
 "合河政記",
 "明代祕籍三種",
 "草廬經略輿圖總論",
 "箸繭室詩集",
 "訓蒙駢句",
 "元代征倭記",
 "敬畏齋公牘",
 "袁小修日記",
 "珂雪齋外集又名遊居柿錄",
 "宋六十名家詞",
 "白石詞",
 "夢窗甲稿",
 "乙稿",
 "丙稿",
 "丁稿",
 "絕筆",
 "金谷遺音",
 "洺水詞",
 "空同詞",
 "文溪詞",
 "芸窗詞",
 "壽域詞",
 "後山詞",
 "琴趣外篇",
 "烘堂詞",
 "拍案驚奇",
 "西青散記",
 "賴古堂名賢尺牘新鈔",
 "金瓶梅詞話",
 "譚友夏合集",
 "華陽散稿",
 "瑯嬛文集",
 "元人雜劇全集",
 "關漢卿雜劇",
 "溫太真玉鏡臺",
 "錢大尹智寵謝天香",
 "趙盼兒風月救風塵",
 "包待制三勘蝴蝶夢",
 "包待制智斬魯齋郎",
 "杜蕊娘智賞金線池",
 "感天動地竇娥寃",
 "望江亭中秋切鱠",
 "錢大尹知勘緋衣夢",
 "關大王單刀會",
 "詐妮子調風月",
 "閨怨佳人拜月亭",
 "關張雙赴西蜀夢",
 "張君瑞慶團圞",
 "續西廂",
 "風流孔目春衫記殘本",
 "唐明皇哭香囊殘本",
 "王實甫雜劇",
 "四丞相高會麗春堂",
 "崔鶯鶯待月西廂記",
 "蘇小卿月夜販茶船殘本",
 "王彩雲絲竹芙蓉亭殘本",
 "晚進王生雜劇",
 "圍棋闖局",
 "白仁甫雜劇",
 "唐明皇秋夜梧桐雨",
 "裴少俊牆頭馬上",
 "董秀英花月東牆記殘本",
 "韓采蘋御水流紅葉殘本",
 "李克用箭射雙雕殘本",
 "高文秀雜劇",
 "黑旋風雙獻功",
 "須賈大夫𧫒范叔",
 "好酒趙元遇上皇",
 "周瑜謁魯肅殘本",
 "鄭廷玉雜劇",
 "楚昭公疎者下船",
 "布袋和尚忍字記",
 "包龍圖智勘後庭花",
 "看錢奴買寃家債主",
 "崔府君斷寃家債主",
 "馬致遠雜劇",
 "破幽夢孤雁漢宮秋",
 "半夜雷轟薦福碑",
 "呂洞賓三醉岳陽樓",
 "西華山陳摶高臥",
 "邯鄲道省悟黃粱夢",
 "江州司馬青衫泪",
 "馬丹陽三度任風子",
 "劉晨阮肇誤入桃源",
 "李文蔚雜劇",
 "同樂院燕青博魚",
 "李直夫雜劇",
 "便宜行事虎頭牌",
 "鄧伯道棄子留姪殘本",
 "庾吉甫雜劇",
 "朱太字風雪漁樵記",
 "吳昌齡雜劇",
 "唐三藏西天取經",
 "張天師斷風花雪月",
 "花間四友東坡夢",
 "鬼子母揭鉢記殘本",
 "武漢臣雜劇",
 "李素蘭風月玉壺春",
 "散家財天賜老生兒",
 "包待制智勘生金閣",
 "虎牢關三戰呂布殘本",
 "王仲文雜劇",
 "救孝子賢母不認屍",
 "漢張良辭朝歸山殘本",
 "諸葛亮秋風五丈原殘本",
 "李壽卿雜劇",
 "說鱄諸伍員吹簫",
 "月明和尚度柳翠",
 "鼓盆歌莊子嘆骷髏殘本",
 "尚仲賢雜劇",
 "洞庭湖柳毅傳書",
 "漢高皇濯足氣英布",
 "尉遲恭單鞭奪槊",
 "尉遲恭三奪槊",
 "海神廟王魁負桂英殘本",
 "陶淵明歸去來兮殘本",
 "鳳凰坡越娘背燈殘本",
 "石君寶雜劇",
 "魯大夫秋胡戲妻",
 "李亞仙花酒曲江池",
 "風月紫雲亭",
 "楊顯之雜劇",
 "臨江驛瀟湘秋夜雨",
 "鄭孔目風雪酷寒亭",
 "紀君祥雜劇",
 "趙氏孤兒大報讐",
 "戴善夫雜劇",
 "陶學士醉寫風光好",
 "柳耆卿詩酒翫江樓殘本",
 "李好古雜劇",
 "沙門島張生煮海",
 "王伯成雜劇",
 "李太白貶夜郎",
 "孫仲章雜劇",
 "河南府張鼎勘頭巾",
 "張國賓雜劇",
 "薛仁貴榮歸故里",
 "相國寺公孫合汗衫",
 "羅李郎大鬧相國寺",
 "康進之雜劇",
 "梁山泊李逵負荊",
 "岳伯川雜劇",
 "呂洞賓度鐵拐李岳",
 "羅光遠夢斷楊貴妃殘本",
 "石子章雜劇",
 "秦翛然竹塢聽琴",
 "黃貴孃秋夜竹窗雨殘本",
 "孟漢卿雜劇",
 "張孔目智勘魔合羅",
 "李進取雜劇",
 "神龍殿欒巴噀酒殘本",
 "李行道雜劇",
 "包待制智勘灰闌記",
 "狄君厚雜劇",
 "晉文公火燒介之推",
 "孔文卿雜劇",
 "秦太師東窗事犯",
 "張壽卿雜劇",
 "謝金蓮詩酒紅棃花",
 "費唐臣雜劇",
 "蘇子瞻風雪貶黃州殘本",
 "宮大用雜劇",
 "死生交范張雞黍",
 "鄭德輝雜劇",
 "醉思鄉王粲登樓",
 "迷青瑣倩女離魂",
 "㑳梅香騙翰林風月",
 "輔成王周公攝政",
 "崔懷寶月夜聞箏殘本",
 "白石樵真稿",
 "豆棚閒話",
 "白蘇齋類集",
 "梅花草堂筆談",
 "唱經堂才子書彙稿十一種",
 "語錄纂",
 "聖人千案",
 "隨手通",
 "沈吟樓借杜詩",
 "左傳釋",
 "古詩解",
 "釋小雅",
 "釋孟子四章",
 "批歐陽永叔詞十二首",
 "易鈔引",
 "通宗易論",
 "石點頭",
 "閒情偶寄",
 "西湖夢尋",
 "翠樓集",
 "媚幽閣文娛",
 "眉公先生晚香堂小品",
 "禪真逸史四十回",
 "王季重十種",
 "雜序",
 "遊喚",
 "歷遊記",
 "遊廬山記",
 "爾爾集",
 "避園擬存",
 "律陶",
 "廬遊雜詠",
 "奕律",
 "吳騷集",
 "鍾伯敬合集（一名隱秀軒集）",
 "西湖二集",
 "附西湖秋色",
 "葉天寥四種",
 "天廖年譜別記",
 "詞林紀事",
 "詞韻考略",
 "賴古堂尺牘新鈔二選",
 "藏弆集",
 "珂雪齋詩集",
 "賴古堂尺牘新鈔三選",
 "結隣集",
 "徐文長逸稿",
 "附自著畸譜",
 "夢遇",
 "古文品外錄",
 "午夢堂全集十二種",
 "午夢堂遺集",
 "疎香閣遺集",
 "小窗幽記",
 "寫心集",
 "晚明百家尺牘",
 "折獄新語",
 "冰雪攜",
 "晚明百家小品",
 "黃山謎",
 "說頤",
 "廣笑府",
 "霓裳續譜",
 "青樓韻語",
 "懷芳記",
 "雪鴻小記",
 "泛湖偶記",
 "珠江奇遇記",
 "帝城花樣",
 "珠江梅柳記",
 "珠江名花小傳",
 "補記",
 "白門衰柳附記",
 "海陬冶遊錄",
 "雪濤小書",
 "金陵瑣事",
 "五雜俎",
 "珂雪齋近集",
 "楚狂之歌",
 "小袁幼稿",
 "近遊草",
 "美人詩",
 "香咳集選存",
 "紫桃軒雜綴",
 "又綴",
 "禮白嶽記",
 "篷櫳夜話",
 "寫心二集",
 "六硯齋筆記",
 "竹嬾畫媵",
 "續畫媵",
 "墨君題語",
 "薊旋錄",
 "璽召錄",
 "羣芳清玩",
 "研史",
 "茗笈",
 "茗笈品藻",
 "香國",
 "采菊雜詠",
 "貫月查",
 "采蓮船",
 "響屧譜",
 "昭陽趣史",
 "天下名山遊記",
 "附春秋年表",
 "春秋公羊傳",
 "四書集注",
 "周易兼義",
 "注疏校勘記",
 "釋文校勘記",
 "附釋音尚書注疏",
 "附釋音毛詩注疏",
 "附釋音周禮注疏",
 "附釋音禮記注疏",
 "附釋音春秋左傳注疏",
 "監本附音春秋公羊注疏",
 "監本附音春秋穀梁注疏",
 "論語注疏解經",
 "孟子注疏解經",
 "周易述補",
 "周禮正義",
 "儀禮正義",
 "禮記訓纂",
 "春秋左傳詁",
 "公羊義疏",
 "穀梁補注",
 "孝經鄭注疏",
 "爾雅義疏",
 "說文解字注",
 "附六書音韻表",
 "說文通檢",
 "廣雅疏證",
 "博雅音",
 "經義述聞",
 "前漢書",
 "北齋書",
 "欽定金國語解",
 "附表",
 "續資治通鑑",
 "明紀",
 "晉略",
 "新編宣和遺事前集",
 "路史前紀",
 "後紀",
 "發揮",
 "國名紀",
 "國朝先正事略",
 "中興將帥別傳",
 "唐陸宣公集（一名翰苑集）",
 "增輯",
 "漢官六種",
 "通志略",
 "吾學錄初編",
 "讀通鑑論",
 "宋論",
 "校讎通義",
 "歷代帝王廟諡年諱譜",
 "歷代統紀表",
 "歷代疆域表",
 "歷代沿革表",
 "歷代地理志韻編今釋",
 "皇朝輿地韻編",
 "商君書",
 "附識誤",
 "附校勘小識",
 "周子通書",
 "榕村通書篇",
 "陸象山先生全集",
 "學則辯",
 "朱子原訂近思錄",
 "五種遺規",
 "養正遺規",
 "訓俗遺規",
 "從政遺規",
 "教女遺規",
 "在官法戒錄",
 "宋元學案",
 "攷略",
 "學案小識",
 "困學紀聞注",
 "十駕齋養新錄",
 "餘錄",
 "補注黃帝內經素問",
 "本艸經",
 "註解傷寒論",
 "金匱玉函要略方論",
 "黃帝內經靈樞",
 "古今推步諸術攷",
 "集注太玄經",
 "皇極經世書緒言",
 "附篇",
 "附注補並重校",
 "周易參周契考異",
 "晉二俊文集",
 "陸士衡集",
 "靖節先生集",
 "附總釋",
 "庾子山年譜",
 "徐孝穆全集",
 "附備考",
 "唐四傑文集",
 "王勃文集",
 "楊炯文集",
 "盧照鄰文集",
 "唐丞相曲江張文獻公集",
 "千秋金鑑錄",
 "李太白文集",
 "昌黎先生集",
 "唐柳河東集",
 "李長吉歌詩",
 "白香山詩長慶集",
 "白香山年譜",
 "年譜舊本",
 "樊川詩集",
 "玉谿生詩箋註",
 "玉谿生年譜",
 "樊南文集詳注",
 "樊南文集補編",
 "附玉谿生年譜訂誤",
 "溫飛卿詩集",
 "林和靖詩集",
 "宛陵先生文集",
 "歐陽文忠全集",
 "奏議集",
 "東坡集",
 "樂語",
 "東坡先生年譜",
 "山谷內集注",
 "重編淮海先生年譜節要",
 "正誤",
 "楊文節公詩集",
 "誠齋詩集",
 "陸放翁全集",
 "附放翁逸稿",
 "水心文集",
 "片玉集",
 "稼軒長短句",
 "附補遺校記",
 "詩詞評論",
 "夢窗詞集",
 "附小箋",
 "山中白雲",
 "元遺山詩集箋注",
 "補載",
 "元遺山年譜",
 "鐵厓樂府注",
 "詠史註",
 "逸編註",
 "宋文憲公全集",
 "青邱高季迪先生詩集",
 "青邱高季迪先生年譜",
 "方正學先生遜志齋集",
 "薑齋文集",
 "吳詩集覽",
 "附談藪",
 "補註",
 "笛漁小稿",
 "漁洋山人精華錄訓纂",
 "漁洋山人自撰年譜",
 "安雅堂詩",
 "未刻稿",
 "入蜀集",
 "飴山詩集",
 "蓮洋集",
 "蓮洋吳徵君年譜",
 "小倉山房詩集",
 "詩集補遺",
 "覆校札記",
 "附春秋述義",
 "卷施閣文甲集",
 "更生齋文甲集",
 "駢儷文",
 "文後集",
 "詩後集",
 "詩外集",
 "法帖題跋",
 "養一齋文集",
 "李養一先生詩集",
 "賦",
 "唐確慎公集",
 "文集補",
 "文集補編",
 "文集增補",
 "定山堂詩餘",
 "湖海樓詞集",
 "彈指詞",
 "靈芬館詞四種",
 "附攷異",
 "古文辭類篹",
 "駢體文鈔",
 "續古文辭類篹",
 "經史百家雜鈔",
 "阮亭選古詩",
 "古詩源",
 "五言今體詩鈔",
 "七言今體詩鈔",
 "十八家詩鈔",
 "續鈔補錄",
 "詞選",
 "續詞選",
 "明詞綜",
 "國朝詞綜",
 "國朝詞綜續編",
 "夢窗甲藳",
 "乙藳",
 "丙藳",
 "丁藳",
 "梅村詞",
 "棠邨詞",
 "二鄉亭詞",
 "南溪詞",
 "炊聞詞",
 "百末詞",
 "含影詞",
 "溪南詞",
 "月湄詞",
 "麗農詞",
 "蓉渡詞",
 "烏絲詞",
 "玉鳧詞",
 "元曲選",
 "破幽夢孤鴈漢宮秋雜劇",
 "李太白匹配金錢記雜劇",
 "包待制陳州糶米雜劇",
 "玉清菴錯送鴛鴦被雜劇",
 "隨何賺風魔蒯通雜劇",
 "溫太真玉鏡臺雜劇",
 "楊氏女殺狗勸夫雜劇",
 "相國寺公孫合汗衫雜劇",
 "錢大尹智寵謝天香雜劇",
 "爭報恩三虎下山雜劇",
 "張天師斷風花雪月雜劇",
 "趙盼兒風月救風塵雜劇",
 "東堂老勸破家子弟雜劇",
 "同樂院燕青博魚雜劇",
 "臨江驛瀟湘秋夜雨雜劇",
 "李亞仙花酒曲江池雜劇",
 "楚昭公疎者下船雜劇",
 "龐居士誤放來生債雜劇",
 "薛仁貴榮歸故里雜劇",
 "裴少俊墻頭馬上雜劇",
 "唐明皇秋夜梧桐雨雜劇",
 "散家財天賜老生兒雜劇",
 "硃砂擔滴水浮漚記雜劇",
 "便宜行事虎頭牌雜劇",
 "包龍圖智賺合同文字雜劇",
 "凍蘇秦衣錦還鄉雜劇",
 "翠紅鄉兒女兩團圓雜劇",
 "李素蘭風月玉壺春雜劇",
 "呂洞賓度鐵拐李岳雜劇",
 "小尉遲將鬬將認父歸朝雜劇",
 "陶學士醉寫風光好雜劇",
 "魯大夫秋胡戲妻雜劇",
 "神奴兒大鬧開封府雜劇",
 "半夜雷轟薦福碑雜劇",
 "謝金吾詐拆清風府雜劇",
 "呂洞賓三醉岳陽樓雜劇",
 "包待制三勘蝴蝶夢雜劇",
 "說鱄諸伍員吹蕭雜劇",
 "河南府張鼎勘頭巾雜劇",
 "黑旋風雙獻功雜劇",
 "迷青瑣倩女離魂雜劇",
 "西華山陳摶高臥雜劇",
 "龐涓夜走馬陵道雜劇",
 "救孝子賢母不認屍雜劇",
 "邯鄲道省悟黃粱夢雜劇",
 "杜牧之詩酒揚州夢雜劇",
 "醉思鄉王粲登樓雜劇",
 "昊天塔孟良盜骨雜劇",
 "包待制智斬魯齋郎雜劇",
 "朱太守風雪漁樵記雜劇",
 "江州司馬青衫泪雜劇",
 "四丞相高會麗春堂雜劇",
 "孟德耀舉案齊眉雜劇",
 "包龍圖智勘後庭花雜劇",
 "死生交范張雞黍雜劇",
 "玉簫女兩世姻緣雜劇",
 "宜秋山趙禮讓肥雜劇",
 "鄭孔目風雪酷寒亭雜劇",
 "桃花女破法嫁周公雜劇",
 "陳季卿悞上竹葉舟雜劇",
 "布袋和尚忍字記雜劇",
 "謝金蓮詩酒紅梨花雜劇",
 "鐵拐李度金童玉女雜劇",
 "包待制智賺灰闌記雜劇",
 "崔府君斷寃家債主雜劇",
 "㑳梅香騙翰林風月雜劇",
 "尉遲恭單鞭奪槊雜劇",
 "呂洞賓三度城南柳雜劇",
 "須賈大夫𧫒范叔雜劇",
 "李雲英風送梧桐葉雜劇",
 "花間四友東坡夢雜劇",
 "杜藥娘智賞金線池雜劇",
 "王月英元夜留鞋記雜劇",
 "漢高皇濯足氣英布雜劇",
 "兩軍師隔江鬬智雜劇",
 "馬丹陽度脫劉行首雜劇",
 "月明和尚度柳翠雜劇",
 "劉晨阮肇悞入桃源雜劇",
 "張孔目智勘魔合羅雜劇",
 "玎玎璫璫盆兒鬼雜劇",
 "荊楚臣重對玉梳記雜劇",
 "逞風流王煥百花亭雜劇",
 "秦脩然竹塢聽琴雜劇",
 "金水橋陳琳抱粧盒雜劇",
 "趙氏孤兒大報讐雜劇",
 "感天動地竇娥寃雜劇",
 "梁山泊李逵負荊雜劇",
 "蕭淑蘭情寄菩薩蠻雜劇",
 "錦雲堂暗定連環計雜劇",
 "羅李郎大鬧相國寺雜劇",
 "看錢奴買冤家債主雜劇",
 "都孔目風雨還牢末雜劇",
 "洞庭湖柳毅傳書雜劇",
 "風雨像生貨郎旦雜劇",
 "望江亭中秋切鱠雜劇",
 "馬丹陽三度任風子雜劇",
 "薩真人夜斷碧桃花雜劇",
 "沙門島張生煮海雜劇",
 "包待制智賺生金閣雜劇",
 "馮玉蘭夜月泣江舟雜劇",
 "漁隱叢話前集",
 "鳴原堂論文",
 "佩文詩韻釋要",
 "周易九經附略例",
 "荀子廿卷附校勘補遺一卷",
 "古文辭類纂",
 "續古文辭類纂",
 "經韻樓集補編",
 "段玉裁先生年譜",
 "王石臞文集補編",
 "王伯申文集補編",
 "高郵王氏父子（念孫、引之）年譜",
 "南越五主傳",
 "南越叢錄",
 "藤花亭鏡譜",
 "藤花亭書畫跋",
 "孫西菴集",
 "皇明九邊考",
 "邊政考",
 "三雲籌俎考",
 "西域番國志",
 "籌遼碩畫",
 "皇明象胥錄",
 "行邊紀聞",
 "安南圖誌",
 "日本考",
 "附夷語夷字",
 "繇己錄",
 "家矩",
 "劉屏山先生聖傳論",
 "孫鍾元先生答問",
 "藥言",
 "賸稿",
 "銅𧲼館𠙆書",
 "老學究語",
 "冰言",
 "十二筆舫雜錄",
 "梅影叢談",
 "春暉餘話",
 "中州觚餘",
 "客牕賸語",
 "掖乘",
 "韻略匯通",
 "兩漢經學彙考",
 "古鏡錄",
 "松石館詩集",
 "西山草堂詞",
 "三出辨誤",
 "錡齊詩集",
 "金湯輯略",
 "志古編",
 "濟生拔粹方",
 "鍼經節要",
 "雲岐子論經絡迎隨補瀉法",
 "竇太師流注指要賦",
 "鍼經摘英集",
 "雲岐子七表八裏九道脉訣論幷治法",
 "潔古老人珍珠襄",
 "醫學發明",
 "潔古家珍",
 "海藏老人此事難知",
 "海藏類編醫壘元戎",
 "雲岐子保命集論類要",
 "海藏癍論萃英",
 "田氏保嬰集",
 "蘭室祕藏",
 "活法機要",
 "衛生寶鑑",
 "雜類名方",
 "今獻彙言",
 "羅山雜言",
 "松窗窹言",
 "詢芻錄",
 "竹下窹言",
 "損齊備忘錄",
 "歷代小史",
 "煬帝海山記",
 "煬帝迷樓記",
 "隨唐嘉話",
 "杜楊雜編",
 "揮塵錄",
 "王氏揮塵錄",
 "晉公談錄",
 "自警篇",
 "韓忠獻遺事",
 "王文正遺事",
 "萊公遺事",
 "廣客談",
 "稗史集傳",
 "清溪暇筆",
 "皇明紀略",
 "謇齊瑣綴錄",
 "兩湖塵談錄",
 "復齊日記",
 "百陵學山",
 "附古本問",
 "古本前引",
 "類慱雜言",
 "凝齊筆語",
 "薜子道論",
 "近峰記略",
 "華川扈辭",
 "古今逸史",
 "續慱物志",
 "六朝事跡編類",
 "晉中乘",
 "劎俠傳",
 "子彙",
 "晏子春秋內篇",
 "陸子",
 "小荀子",
 "鹿門子",
 "玄真子外篇",
 "无能子",
 "齊丘子",
 "兩京遺編",
 "夷門廣牘",
 "錄綺新聲",
 "中峰禪師梅花百詠",
 "羣仙隆乩語",
 "尋芳詠",
 "青蓮觴詠",
 "紀錄彙編",
 "御製周顚仙人傳",
 "青溪暇筆摘抄",
 "餘冬序錄摘鈔",
 "四友齊叢說摘鈔",
 "二西委譚摘錄",
 "江西奧地圖說",
 "鹽邑志林",
 "易解",
 "京氏易傳注",
 "草木蟲魚疏",
 "玉篇直音",
 "海鹽澉水誌",
 "檇李記",
 "奉使錄",
 "徐襄陽西園雜記",
 "測語",
 "貽謀",
 "吾學編餘",
 "今言類編",
 "古言類編",
 "海石子內篇",
 "通史它石",
 "仰崖遺語",
 "潁水遺編",
 "鍾秉六烏槎幕府記",
 "禮記通註",
 "猶及編",
 "摘語",
 "倭變事略",
 "鳴吾紀事",
 "江上雜疏",
 "吳少君遺事",
 "見只編",
 "聖門十志",
 "周愨慎公全集提要",
 "周氏師古堂書目提要",
 "易理匯參臆言",
 "蛻私軒易說",
 "繫辭一得",
 "讀易隨筆",
 "三經誼詁",
 "孝經誼詁",
 "大學誼詁",
 "中庸誼詁",
 "論語分類講誦",
 "經傳簡本",
 "易經音訓",
 "書經音訓",
 "詩義折中",
 "附詩經音註",
 "禮記節本",
 "左傳經世鈔約選",
 "七經精義纂要",
 "韓王二公遺事",
 "王文正公遺事",
 "績編",
 "鏡古錄",
 "經世文粹",
 "醇親王巡閱北洋海防日記",
 "閨範",
 "人極衍義",
 "求志集",
 "古訓粹編",
 "身世金箴",
 "課子隨筆",
 "求闕齋日記",
 "娑羅館清語",
 "陽明理學集",
 "格言聯璧",
 "聖哲微言",
 "歷代聖哲學粹",
 "先正嘉言約鈔",
 "南華經解選讀",
 "性理精言",
 "魯齋遺書約鈔",
 "中學正宗",
 "畜德錄選",
 "讀書樂趣約選",
 "閱微草堂筆記約選",
 "女千字文",
 "淺近錄",
 "童蒙須知",
 "宋五子節要",
 "周濂溪太極圖說",
 "張橫渠文集",
 "觀省錄",
 "李菉猗女史全書",
 "女學言行纂",
 "菽堂分田錄",
 "周中丞集",
 "蛻軒集",
 "古文辭類纂約選",
 "張文端公詩文選",
 "小學弦歌約選",
 "八家閒適詩選",
 "淵明閒適詩選",
 "香山閒適詩選",
 "蘇州閒適詩選",
 "少陵閒適詩選",
 "東坡閒適詩選",
 "劍南閒適詩選",
 "朱子閒適詩選",
 "擊壤集選",
 "唐詩矩",
 "文辭養正舉隅",
 "毛詩詁訓傳",
 "翰苑",
 "王勃集",
 "講周易疏論家義記殘",
 "文選集注",
 "文撰集注",
 "尚書殘卷",
 "毛詩二南殘卷",
 "前漢書藝文志",
 "補三國藝文志",
 "隋書經籍志",
 "舊唐書經籍志",
 "宋史藝文志",
 "補元史藝文志",
 "經義攷補正",
 "尊經閣藏書目",
 "中江尊經閣藏書目第一冊",
 "汲古閣珍藏祕本書目",
 "宋版書目",
 "延令宋皮書目",
 "附續校語",
 "全燬書目",
 "抽燬書目",
 "容齊題跋",
 "羣書拓補",
 "呂氏續詩記補闕",
 "新唐書糾謬校補逸",
 "元徽之文集校補",
 "四庫全書考證",
 "宣和奉使高麗圖經校",
 "荀子校",
 "西陽雜俎校",
 "七經孟子考文並補遺",
 "周禮釋文問答",
 "說文檢字補遺",
 "漢石經殘字考",
 "唐石經攷正",
 "唐虞考信錄",
 "夏考信錄",
 "商考信錄",
 "豐鎬考信錄",
 "豐鎬考信別錄",
 "補上古考信錄",
 "洙泗考信錄",
 "洙泗考信餘錄",
 "考信錄提要",
 "考信附錄",
 "考古續說",
 "史記正譌",
 "補文",
 "詩律武庫",
 "未",
 "塵史",
 "蠡勺編",
 "游戲錄",
 "平書",
 "附四書文",
 "白虎通義一名白虎通德論",
 "攷",
 "鶴山渠陽讀書雜鈔",
 "誰疏纂要",
 "健餘先生讀書筆記",
 "介庵經說",
 "附經說",
 "王氏經說",
 "附續集",
 "夢溪續筆談",
 "考古編",
 "宜齊野乘",
 "辯言",
 "捫蝨新語",
 "寶顏堂訂正鶴山渠陽經外雜抄",
 "庶齊老學叢談",
 "讀書剳記",
 "萟林伐山",
 "餘冬序錄摘抄內外篇",
 "古言類編（一名學古瑣言）言",
 "卮林",
 "呂鍚侯筆記",
 "尗盧札記",
 "卍齋璅錄",
 "炳燭篇",
 "寒秀草堂筆記",
 "劉氏遺著",
 "養龢軒隨筆",
 "困學紀聞參注",
 "卮辭",
 "華川卮辭",
 "錢公良測語",
 "錢子語測",
 "歸有園塵談",
 "鄭敬中摘語",
 "瓊琚佩語",
 "荊園淮語",
 "省心短語",
 "呂語集粹",
 "四鑑錄",
 "君鑑錄",
 "臣鑑錄",
 "士鑑錄",
 "女鑑錄",
 "西巖贅語",
 "箴友言",
 "迂言百則",
 "簡通錄",
 "鄭氏周易注",
 "附後語",
 "易程傳",
 "晦庵先生校正周易繫辭精義",
 "涇野先生周易翼",
 "易領",
 "易經增註",
 "附易考",
 "周易爻物當名",
 "周易本義注",
 "讀易經",
 "虞氏消息圖說初稿",
 "卦本圖考",
 "易象通義",
 "周易集解纂巰",
 "周易略解",
 "易圖存是",
 "周易本義考",
 "大學古本旁釋",
 "古本大學輯解",
 "中庸本解",
 "中庸提要",
 "論語集注考證",
 "論語註參",
 "論語附記",
 "論語孔注辨譌",
 "孟子附記",
 "孟子事實錄",
 "孔子家語疏證",
 "曾子十篇",
 "敘錄",
 "董子文集",
 "韓詩外傳校注",
 "周生烈子",
 "蟾仙解老",
 "老子道德經考異",
 "參同契疏略",
 "箋注集解",
 "沖虛至德真經釋文",
 "金摟子",
 "附行錄解",
 "脫文",
 "龍門子凝道記",
 "思玄庸言　",
 "叔苴子內編",
 "觀心約",
 "宋四子少釋",
 "紫薇雜說",
 "朱子學歸",
 "研幾圖",
 "楓山章先生語錄",
 "適園語錄",
 "毅齋經說",
 "水西會語",
 "水西答問",
 "惜陰書院緒言",
 "白水質問",
 "學蔀通辨",
 "梅峯語錄",
 "拙齋學測",
 "赤山會語",
 "讀書些子會心",
 "潛室劄記",
 "繹志",
 "附剳記",
 "讀書說",
 "胡承諾年譜",
 "問學錄",
 "存學編",
 "存性編",
 "顏習齋先生言行錄",
 "聖經學規纂",
 "論學",
 "健餘劄記",
 "星閣正論",
 "子貫附言",
 "郝雪海先生筆記",
 "論學俚言",
 "宦游日記",
 "南嶽遇師本末",
 "尚書璇璣鈴",
 "論語譔考",
 "潛虛述義",
 "除考異",
 "雲氣占候篇",
 "乾元祕旨",
 "孝經翼",
 "中文孝經",
 "孝經鄭注補證",
 "集事詩鑑",
 "楚中會條",
 "水西會條",
 "稽山會約",
 "赤山會約",
 "校譌",
 "宗禪辯",
 "附遺文",
 "拙齋十議",
 "昭代經濟言",
 "存治編",
 "擬太平策",
 "平書訂",
 "王制管窺",
 "偽學逆黨籍",
 "歷代關市征稅記",
 "浙鹺紀事",
 "刑法敘略",
 "續刑法敘略",
 "棠陰比事續編",
 "漢官舊儀　",
 "闕文補錄",
 "冬官旁求",
 "政學錄",
 "學治續說",
 "學治說贅",
 "西山政訓",
 "續佐治藥言",
 "貢舉敘略",
 "東井誥勑",
 "五城奏疏",
 "毅齋奏疏",
 "郭給諫疏稿",
 "蘭臺奏疏",
 "制府疏草",
 "王少司馬奏疏",
 "玉城奏疏",
 "西臺摘疏",
 "伯仲諫臺疏草",
 "敬修堂釣業",
 "魏文毅公奏議",
 "尹少宰奏議",
 "健餘先生撫豫條教",
 "孫子敘錄",
 "武候八陳兵法輯略",
 "附用陳雜錄",
 "衛公兵法輯本",
 "附舊唐書李靖傳考證",
 "乾坤大略",
 "郥襄賑濟事宜",
 "救荒備覽",
 "注補併重校",
 "壬子年重校記",
 "許雲邨貽謀",
 "訓子言",
 "龐氏家訓",
 "孝友堂家規",
 "孝友堂家訓",
 "小學稽業",
 "辨感編",
 "存人編",
 "顏習齋先生闢異錄",
 "讀書十六觀補",
 "禮記集說辯疑",
 "禮記附記",
 "禮記補注",
 "讀禮記",
 "大戴禮記補注",
 "校正孔氏大戴禮記補注",
 "涇野先生禮問",
 "學禮",
 "公羊逸禮考徵",
 "滇黔士司婚禮記",
 "太常因革禮校識",
 "大金集禮四大卷附校刊識語一卷",
 "郊社禘袷問",
 "急就篇正文",
 "校定皇象本急就章",
 "唐寫本說文解字木部箋異",
 "說文補例",
 "續考",
 "說文聲訂",
 "說文字原韻表",
 "說文引經考",
 "說文部首歌",
 "讀說文雜識",
 "說文疑疑",
 "段氏說文注訂",
 "說文段注撰要",
 "附鈙錄",
 "輶軒使者絕代語譯別國方言",
 "經典釋文考證",
 "羣經昔辨",
 "晏子春秋音義",
 "宋本廣韻校札",
 "切韻指掌圖檢例",
 "重斠唐韵攷",
 "審定風雅遺音",
 "楚辭辨韻",
 "歌麻古韻考",
 "伸顧",
 "附劄記",
 "古今韻考",
 "周髀算經述",
 "詳解九章算法札記",
 "夏候陽算經",
 "數書九章札記",
 "田畝比類乘除捷法",
 "同文算指通編",
 "算迪",
 "算略",
 "楊輝算法札記",
 "測圜密率",
 "橢圜正術",
 "算法通變本末",
 "乘除通變算寶",
 "法算取用本末",
 "王制里畝算法解",
 "王制井田算法解",
 "禮記義疏算法解",
 "中西經同異考",
 "交食經",
 "日食一貫歌",
 "月食一貫歌",
 "戊申立春證",
 "古今律歷考",
 "春秋春王正月考辨疑",
 "恆氣註歷辯",
 "正疏三角疏義",
 "虞書命羲和章解",
 "地球圖說補圖",
 "夏小正考注",
 "夏小正解",
 "附徐本夏小正舉異",
 "唐月令注",
 "蔬疏",
 "水草",
 "王蘂辨證",
 "蠕範",
 "異魚圖補",
 "異魚贊閏集",
 "類證活人書",
 "辨誤",
 "傷寒藥性",
 "內外傷辨",
 "丹溪先生心法",
 "附附錄",
 "祕傳證要訣",
 "傷寒直格論",
 "傷寒醫鑒",
 "傷寒心要",
 "傷寒證脈藥截江網",
 "傷寒一提金",
 "傷寒瑣言",
 "傷寒家祕的本",
 "傷寒明理續論",
 "殺車槌法",
 "素問玄機原病式",
 "素問病機氣宜保命集",
 "陰症略例",
 "尤氏喉科祕本",
 "衛生家寶產科備要",
 "祕製大黃清寧丸方",
 "證治要訣類方",
 "服鹽藥法",
 "宋提刑洗冤集錄",
 "嶺南荔支譜",
 "古經服緯",
 "金粟箋",
 "冬官記事",
 "周泰刻石釋音",
 "金石錄補績跋",
 "鮑臆園手札",
 "陳簠齋筆記",
 "考古圖釋文",
 "周無專鼎銘考",
 "嘉應簃藏器目",
 "雙虞壼齋藏器目",
 "江東藏書目錄小序",
 "琴錄",
 "香錄",
 "遊具箋",
 "韻石齊筆談",
 "前麈夢影錄",
 "後村題跋",
 "好古堂家藏書畫記",
 "附續記",
 "張憶娘簪華圖卷題詠",
 "興地碑記目",
 "附辨譌考異",
 "寰字訪碑錄",
 "葉氏箓竹堂碑目",
 "羣公帖跋",
 "石刻鋪敘",
 "蘇米齋蘭亭攷",
 "國山碑考",
 "古墨齊金石跋",
 "漢射陽石門畫象彙考",
 "寶眞齊法書贊",
 "湛園肖影",
 "天慵庵筆記",
 "古今畫鑒",
 "雜評",
 "賡和錄",
 "燕樂攷原",
 "樂縣攷",
 "香研居詞塵",
 "詩經樂譜",
 "附樂律正俗",
 "學射錄",
 "石洞貽芳集",
 "魯詩傳",
 "詩傳註疏",
 "張氏詩說",
 "詩附記",
 "春秋詩話",
 "讀詩經",
 "讀風偶識",
 "毛詩識小",
 "毛詩通考",
 "王建宮詞",
 "花蕊夫人宮詞",
 "王珪宮詞",
 "風雅毫逸篇",
 "粵詩蒐逸",
 "金唐詩逸",
 "金五代詩",
 "西崑酬倡集",
 "宋舊宮人詩詞",
 "宋徽宗宮詞",
 "清平閣倡和詩",
 "同人唱和詩集",
 "附金陵雜事詩",
 "附補錄",
 "評乙古文",
 "高令公集",
 "魏鄭公文集",
 "李元賓文集",
 "李衞公會昌一品集",
 "附佚存叢書殘本景文宋公集",
 "周溓溪先生全集",
 "忠簡公集",
 "柯山集",
 "續拾遺",
 "北山文集",
 "崔舍人玉堂類藳",
 "崔舍人西垣類藳",
 "仁山先生金文安公文集",
 "章泉稿",
 "崔清獻公集",
 "何北山先生遺集",
 "文文山文集",
 "滹南遺老集四十五卷詩集一卷續編詩集一卷",
 "湛淵遺稿",
 "安默庵先生文集",
 "黃文獻公集",
 "趙待制遺稿",
 "九靈山房遺稿",
 "奏議補缺校勘記",
 "楓山章先生集",
 "東田文集",
 "漁石集",
 "金忠潔集",
 "夏峯先生集",
 "揅經室續集",
 "益齋集",
 "陶靖節詩集",
 "陰常侍詩集",
 "雜詠",
 "附傳序碑銘",
 "黃氏集千家註杜工部詩史補遺",
 "集註草堂杜工部詩外集",
 "閬山詩附集",
 "盧仝集",
 "李尚書詩集",
 "附李氏事蹟",
 "蘇詩補註",
 "山谷內集詩注",
 "外集詩注",
 "別集詩注",
 "外集補",
 "別集補",
 "淳熙稿",
 "乾道稿",
 "翦綃集",
 "揭曼碩詩集",
 "淵潁集",
 "丁孝子集",
 "附題詞",
 "申端愍公詩集",
 "花王閣賸稿",
 "徐元歎先生殘稿浪齋新舊詩",
 "燕巿雜詩",
 "聰山詩選",
 "寒松堂詩集",
 "榆溪詩鈔",
 "柿葉庵詩選",
 "戇叟詩鈔",
 "解舂集詩鈔",
 "積書巖詩集",
 "缾水齋詩集",
 "缾水齋詩別集",
 "鳥魯木齊雜詩",
 "金闕攀松集",
 "拜經樓集外詩",
 "紅蕙山房吟稿",
 "船山詩草撰",
 "纂喜堂詩稿",
 "粵臺徵雅錄",
 "西鳧殘草",
 "愚溪詩稿",
 "位西先生遺稿",
 "漸西邨人初集",
 "玉暉堂詩集",
 "陸宣公文集",
 "道",
 "劉希仁文集",
 "李忠愍公集",
 "呂東萊先生文集",
 "謝疊山集",
 "黃勉齊先生文集",
 "許魯齋集",
 "誠意伯連珠",
 "方正學先生集",
 "羅整庵先生存稿",
 "海剛峯先生文集",
 "味檗齋文集",
 "認真草",
 "范文忠公文集",
 "申端愍公文集",
 "寒松集",
 "聰山集",
 "湯潛庵集",
 "習齋記餘",
 "居業堂文集",
 "忠裕堂集",
 "恕谷後集",
 "陳學士文集",
 "健餘先生文集",
 "笥河文集",
 "知足齋文集",
 "知足齋進呈文稿",
 "童山文集",
 "煙霞萬古樓文集",
 "中衢一勺三附錄",
 "萬善花室文稿",
 "計有餘齋文稿",
 "貞蕤稿略",
 "浩然齊雅談",
 "脩辭鑑衡",
 "玉壺詩話",
 "東萊呂紫薇詩話",
 "白石道人詩說",
 "滄浪吟卷",
 "揮塵詩話",
 "國朝詩評",
 "榆溪詩話",
 "涇川詩話",
 "白石道人詩詞評論",
 "四六談塵",
 "文章綠起註",
 "續文章綠起",
 "蘋州漁笛譜撰",
 "南齋詞",
 "蠢翁詞",
 "二韭室詩餘別集",
 "青芙館詞鈔",
 "憶雲詞甲藳",
 "辭品",
 "吳保安傳",
 "燕丹子傳",
 "烏將軍記",
 "韋自東傳",
 "牛應真傳",
 "搜神秘覽",
 "異聞總錄",
 "周秦行記",
 "震澤龍女傳",
 "張無頗傳",
 "孫內翰北里誌",
 "遼陽海神傳",
 "揮塵錄前錄",
 "可齋筆記",
 "停驂錄摘抄",
 "鄭端簡公今言類編",
 "典故紀聞",
 "蔗山筆塵",
 "治世餘聞",
 "居易續談",
 "荼餘客話",
 "雲杜故事",
 "柱苑叢談",
 "搜採異閒錄",
 "馬氏日鈔",
 "雙槐歲鈔",
 "閒中今古錄摘鈔",
 "懸笥瑣探摘鈔",
 "長水日抄",
 "留青日札摘抄",
 "筆塵",
 "書焦",
 "賢奕編",
 "濟南紀政",
 "崔鳴吾紀事",
 "東皐雜鈔",
 "五山志林",
 "舊遊日記",
 "隻麈譚",
 "健餘先生尺牘",
 "附姓氏考",
 "香嚴尚書壽言",
 "宜州乙西家乘",
 "文房四友授集",
 "漢林四傳",
 "禹貢集解",
 "羅浮志",
 "遊羅浮山記",
 "遊雁蕩山記",
 "泰山道里記",
 "匡廬紀遊",
 "河源記略承修稿",
 "漢志水道巰證",
 "三吳水利附錄",
 "導江三議",
 "滇海虞衡志",
 "涼州異物志",
 "峒溪纖志",
 "楚峒志略",
 "春秋楚地答問",
 "東晉疆域志",
 "十六國疆域志",
 "闕卷逸文一卷",
 "遊歷記存",
 "三省山內風土雜識",
 "萬里行程記",
 "南漢地理志",
 "南中雜說",
 "金陵賦",
 "金陵歷代建置表",
 "潞城攷古錄",
 "海鹽澉水志",
 "嘉禾百昹",
 "硤石山水志",
 "和林詩",
 "西河舊事",
 "西征道里記",
 "唐兩京城坊考",
 "夢梁錄",
 "東三省韓俄交界道里表",
 "鄉約",
 "塞語",
 "蠡測彙抄",
 "輶軒紀事",
 "緬述",
 "安南記遊",
 "日本考略",
 "使德日記",
 "姓觿",
 "劄記",
 "姓觿琹誤",
 "侍兒小名錄拾遺",
 "補侍兒小名錄",
 "續補侍兒小名錄",
 "聖門志",
 "正學續",
 "漢學師承記",
 "附經師經義目錄",
 "學統",
 "宋學淵源記",
 "禪玄顯教編",
 "海陵三仙傳",
 "吳郡二料志",
 "廣州人物傳",
 "三峯傳藳",
 "小隱書",
 "黃崑圃先生（叔琳）年譜",
 "孫夏峯先生（奇逢）年譜",
 "魏真菴先生（裔介）年譜",
 "尹健餘先生（會一）年譜",
 "李清傳",
 "南岳魏夫人傳",
 "紀夢編年",
 "崔清獻公言行錄",
 "鹿忠節公（善繼）年譜",
 "袁督師事蹟",
 "廿二史考異",
 "史見",
 "閱史郄視",
 "史懷",
 "星閣史論",
 "讀史賸言",
 "九畹史論",
 "尚書逸文",
 "尚書古今文注疏",
 "春秋集傳辯疑",
 "春秋啖趙集傳纂例",
 "春秋四傳異同辨",
 "春秋古經說",
 "讀春秋",
 "左氏傳說",
 "晉文春秋",
 "漢書人表考",
 "漢書人表考校補",
 "讀左管窺",
 "東萊先生左氏博議",
 "續後漢書札記",
 "漢皇德傳",
 "三國志考證",
 "九家舊晉書輯本",
 "南北史表",
 "校勘記逸文",
 "寶應錄",
 "讀舊唐書隨筆",
 "附錢校補遺",
 "南漢紀",
 "蘇黃門龍川別志",
 "南渡錄大略",
 "元聖武親征錄",
 "皇朝本紀",
 "明書",
 "蜀難敘略",
 "思陵勸政紀",
 "周端孝先生貼血疏貼黃冊",
 "鍾秉文鳥槎幕府記",
 "平播全書",
 "閩瑣紀",
 "乾嘉全閩詩傳小傳",
 "新刻華夷風土志",
 "樸學齋小記",
 "雜文",
 "三友墓題詠集",
 "居業集",
 "北行吟草",
 "南還吟草",
 "詩經論旨",
 "左傳杜註校勘記",
 "孝經鄭氏註",
 "老子道德經注",
 "恬養齋文鈔",
 "吉雲居書畫錄",
 "潘氏三松堂書畫記",
 "吉雲居書畫續錄",
 "李江州遺墨題跋",
 "朱參軍畫象題詞",
 "餘冬璅錄",
 "鳧舟䛡柄",
 "閩中書畫錄",
 "論語孔注證偽",
 "東吳小稿",
 "歸來草堂尺牘",
 "炳燭齋雜著",
 "舟車聞見錄",
 "雜錄續集",
 "續錄三集",
 "端研記",
 "續南方草木狀",
 "廣南禽蟲述",
 "附獸述",
 "紀古滇說原集",
 "朝鮮雜志",
 "北狄順義王俺答謝表",
 "裔乘",
 "交黎勦平事略",
 "安南來威圖冊",
 "輯略",
 "九邊圖說",
 "宣大山西三鎮圖說",
 "開原圖說",
 "皇輿考",
 "通惠河志",
 "海運新考",
 "諸司職掌",
 "漕船志",
 "福建運司志",
 "舊京詞林志",
 "皇朝馬政記",
 "昭代王章",
 "名例",
 "兵部問寧夏案",
 "刑部問寧王案",
 "神器譜",
 "神器譜或問",
 "明朝小史",
 "皇明帝后紀略",
 "附藩封",
 "高科考",
 "東夷考略",
 "東事答問",
 "都督劉將軍傳",
 "九十九籌",
 "遼籌",
 "遼夷略",
 "陳謠雜詠",
 "東事書",
 "甲申紀事",
 "大廷尉茗柯凌公殉節紀略",
 "工部新刊事例",
 "馘闖小史",
 "皇明本紀",
 "洞庭集",
 "廬江郡何氏家記",
 "懷陵流寇始終錄",
 "甲申剩事",
 "將亡妖孽",
 "延綏鎮志李自成傳",
 "邊事小紀",
 "倭志",
 "虔臺倭纂",
 "倭奴遺事",
 "總督四鎮奏議",
 "大元大一統志",
 "寰宇通志",
 "炎徼瑣言",
 "粵劍編",
 "荒徼通考",
 "四夷廣記",
 "國朝當機錄",
 "嘉隆新例附萬曆",
 "工部廠庫須知",
 "龍江船廠志",
 "延平二王遺集",
 "黃石齋未刻稿",
 "蔡夫人未刻稿",
 "今史",
 "平粵錄",
 "皇明職方地圖表",
 "雪竇寺志略",
 "四譯館增定館則",
 "新增館則",
 "大明律附例",
 "嘉靖新例",
 "算法全能集",
 "蹴踘譜",
 "百寶總珍集",
 "舊編南九宮譜",
 "十三調南曲音節譜",
 "金陵古金石攷目",
 "刻碑姓名錄",
 "官閣消寒集",
 "江淮旅稿",
 "嘉蔭簃集",
 "徐松龕批後漢書殘本",
 "碎海樓自怡草",
 "左盦集箋",
 "彙帖舉要",
 "寶賢堂集古法帖校語",
 "考正",
 "周易繫辭精義",
 "大學纂疏",
 "中庸纂疏",
 "論語纂疏",
 "孟子纂疏",
 "西鉻述解",
 "正蒙注解",
 "聖傳論",
 "慈湖家記",
 "盱壇真詮",
 "周易六龍解",
 "東溟粹言",
 "吹萬集",
 "泰和宜山會語合刻",
 "復性書院講錄",
 "爾雅臺答問",
 "孝經注",
 "春秋縠梁傳集解",
 "帝王略論",
 "老子上篇道經",
 "老子下篇德經",
 "老子開題",
 "舞譜",
 "毛詩音",
 "文選音",
 "殷商貞卜文字考",
 "悉曇字記",
 "新唐書斠議",
 "庚辛壬癸錄",
 "流寇陷巢記（原名沈存仲再生紀異錄）",
 "韌叟自訂年譜",
 "明太學經籍志",
 "雁影齋讀書記",
 "藏書絕句",
 "碑帖紀證",
 "默厂金石三書",
 "愙齋集古錄校勘記",
 "袌殘守缺齋藏器目",
 "漢賈夫人馬姜墓石刻考譯",
 "太極連環刀法",
 "春雨樓雜文",
 "採香詞",
 "初日樓稿",
 "懷賢錄",
 "遯渚唱和集",
 "甕珠室集聯",
 "博古頁子",
 "惜陰日記",
 "筆彄偶述",
 "說經囈語",
 "明景恭王之國事宜",
 "明禦倭軍制",
 "本學指南",
 "附奏摺欵式",
 "英傑歸真",
 "呂用晦先生行略",
 "澗上草堂紀略",
 "附明孝廉李巢二先生圖詠",
 "鑪藏道里新記",
 "四部寓眼錄補遺",
 "傳忠堂書目",
 "自怡悅齋藏書目",
 "碑藪",
 "拳經",
 "奉法備要",
 "畫學心法問答",
 "樹蕙編",
 "端石考",
 "端溪研坑記",
 "柳集點勘",
 "眞山民詩集",
 "南澗遺文",
 "樗寮文續藳",
 "隨園雅集圖題詠",
 "漆書古文尚書逸文考",
 "附杜林訓故逸文",
 "漢桑欽古文尚書說地理志考逸",
 "附中古文尚書",
 "騶氏春秋說",
 "齊論語問王知道逸文補",
 "夏大正逸文考",
 "弟子職古本考注",
 "凡將篇逸文注",
 "附連山易",
 "九家易解",
 "周易章句",
 "周易洞林",
 "尚書注",
 "今文尚書說",
 "古文尚書疏",
 "百兩篇",
 "韓詩內傳",
 "韓詩翼要",
 "鄭氏詩譜",
 "毛詩譜注",
 "毛詩序義",
 "毛詩答雜問",
 "毛詩箋音義證",
 "毛詩義疏",
 "三禮目錄",
 "三禮義宗",
 "五禮駁",
 "周官傳",
 "周官禮注",
 "喪服經傳",
 "喪服變除圖",
 "喪服要記",
 "喪服經傳略注",
 "喪服釋疑",
 "小戴禮記注",
 "禮記音義隱",
 "明堂月令論",
 "魯禮禘祫志",
 "禮統",
 "胡廣漢制度",
 "問禮俗",
 "皇覽逸禮",
 "中霤禮",
 "王度記",
 "三正記",
 "樂經",
 "樂元語",
 "古今樂錄",
 "樂論",
 "鍾律書",
 "琴清英",
 "歌錄",
 "春秋決事",
 "春秋長厤",
 "春秋盟會圖",
 "春秋左氏傳解詁",
 "左氏傳解誼",
 "春秋左氏傳述義",
 "規過",
 "難杜",
 "左氏膏肓",
 "穀梁癈疾",
 "公羊墨守",
 "春秋公羊穀梁傳集解",
 "縠梁傳注",
 "穀梁傳例",
 "答薄氏駮穀梁義",
 "國語註",
 "孔子弟子目錄",
 "論語隱義",
 "逸論語",
 "孝經傳",
 "孝經註",
 "孝經述義",
 "孟子注",
 "孟子章指",
 "五經通論",
 "五經異義",
 "五經然否論",
 "五經鉤沈",
 "五經疑問",
 "七經義綱",
 "七經詩",
 "聖證論",
 "石經",
 "張氏叢書",
 "皇甫司農集",
 "張太常集",
 "段太尉集",
 "十三洲志",
 "涼洲記",
 "涼洲異物志",
 "莊子注",
 "音",
 "逸篇",
 "逸語",
 "逸篇注補遺",
 "音補遺",
 "注又補遺",
 "元中記",
 "連山",
 "諸家論說",
 "周易子夏傳",
 "周易薛氏記",
 "蔡氏易說",
 "周易丁氏傳",
 "周易韓氏傳",
 "周易古五子傳",
 "周易淮南九師道訓",
 "周易施氏章句",
 "周易孟氏章句",
 "周易梁丘氏章句",
 "周易京氏章句",
 "費氏易",
 "費氏易林",
 "周易分野",
 "周易馬氏傳",
 "周易劉氏章句",
 "周易宋氏注",
 "周易荀氏注",
 "周易陸氏述",
 "周易王氏注",
 "周易王氏音",
 "周易何氏解",
 "周易董氏章句",
 "周易姚氏注",
 "周易翟氏義",
 "周易向氏義",
 "周易統略",
 "周易卦序論",
 "周易張氏義",
 "周易張氏集解",
 "周易干氏注",
 "周易蜀才注",
 "周易徐氏音",
 "周易李氏音",
 "易象妙於見形論",
 "周易繫辭桓氏注",
 "周易繫辭荀氏注",
 "周易繫辭明氏注",
 "周易沈氏要略",
 "周易劉氏義疏",
 "周易大義",
 "周易伏氏集解",
 "周易褚氏講疏",
 "周易周氏義疏",
 "周易張氏義疏",
 "周易何氏義疏",
 "周易崔氏注",
 "周易傅氏注",
 "周易盧氏注",
 "周易王氏義",
 "周易朱氏義",
 "周易莊氏義",
 "周易侯氏注",
 "周易探元",
 "周易元義",
 "周易新論傳疏",
 "周易新義",
 "易纂",
 "今文尚書",
 "尚書歐陽章句",
 "尚書大夏侯章句",
 "尚書小夏侯章句",
 "尚書馬氏傳",
 "尚書王氏注",
 "古文尚書音",
 "古文尚書舜典注",
 "尚書劉氏義疏",
 "尚書述義",
 "尚書顧氏疏",
 "魯詩故",
 "齊詩傳",
 "韓詩故",
 "韓詩說",
 "薛君韓詩章句",
 "毛詩馬氏注",
 "毛詩義問",
 "毛詩王氏注",
 "毛詩義駮",
 "毛詩奏事",
 "毛詩問難",
 "毛詩駮",
 "毛詩譜暢",
 "毛詩拾遺",
 "毛詩徐氏音",
 "毛詩序義疏",
 "毛詩周氏注",
 "毛詩十五國風義",
 "毛詩隱義",
 "集注毛詩",
 "毛詩舒氏義疏",
 "毛詩沈氏義疏",
 "毛詩述義",
 "毛詩草蟲經",
 "毛詩題綱",
 "施氏詩說",
 "周禮鄭大夫解詁",
 "周禮鄭司農解詁",
 "周禮杜氏注",
 "周禮賈氏解詁",
 "周禮鄭氏音",
 "周官禮干氏注",
 "周禮徐氏音",
 "周禮李氏音",
 "周禮聶氏音",
 "周官禮義疏",
 "周禮劉氏音",
 "周禮戚氏音",
 "大戴喪服變除",
 "冠禮約制",
 "鄭氏婚禮",
 "喪服經傳馬氏注",
 "鄭氏喪服變除",
 "新定禮",
 "喪服經傳王氏注",
 "王氏喪服要記",
 "喪服要集",
 "喪服經傳袁氏注",
 "集注喪服經傳",
 "喪服經傳陳氏注",
 "蔡氏喪服譜",
 "賀氏喪服譜",
 "葬禮",
 "賀氏喪服要記",
 "喪服要記注",
 "葛氏喪服變除",
 "凶禮",
 "略注喪服經傳",
 "喪服難問",
 "喪服古今集記",
 "禮記馬氏注",
 "禮記廬氏注",
 "禮傳",
 "禮記王氏注",
 "禮記孫氏注",
 "禮記范氏音",
 "禮記徐氏音",
 "禮記劉氏音",
 "禮記略解",
 "禮記隱義",
 "禮記新義疏",
 "禮記皇氏義疏",
 "禮記沈氏義疏",
 "禮記義證",
 "禮記熊氏義疏",
 "禮記外傳",
 "雜祭法",
 "祭典",
 "後養議",
 "禮雜問",
 "雜禮議",
 "禮論答問",
 "禮論",
 "禮論條牒",
 "禮義答問",
 "禮論鈔略",
 "禮疑義",
 "釋疑論",
 "樂社大義",
 "鍾律緯",
 "樂部",
 "琴歷",
 "樂律義",
 "樂譜集解",
 "琴書",
 "春秋大傳",
 "公羊嚴氏春秋",
 "春秋公羊顏氏記",
 "春秋穀梁傳章句",
 "春秋穀梁傳說",
 "春秋左氏傳章句",
 "春秋牒例章句",
 "春秋左氏長經章句",
 "春秋三傳異同說",
 "解疑論",
 "春秋文諡例",
 "春秋左氏傳解誼",
 "春秋成長說",
 "春秋左氏膏肓釋痾",
 "左氏奇說",
 "春秋左傳許氏注",
 "春秋左氏經傳章句",
 "春秋左傳王氏注",
 "春秋左氏傳嵇氏音",
 "春秋穀梁傳糜氏注",
 "春秋公羊穀梁傳解詁",
 "春秋左氏傳義注",
 "春秋公羊穀梁二傳評",
 "春秋穀梁傳徐氏注",
 "春秋穀梁傳注義",
 "春秋徐氏音",
 "春秋左氏函傳義",
 "薄叔元問穀梁義",
 "春秋穀梁傳鄭氏說",
 "春秋左氏經傳義略",
 "續春秋左氏傳義略",
 "春秋傳駮",
 "春秋左傳義疏",
 "春秋規過",
 "春秋攻昧",
 "春秋井田記",
 "春秋闡微纂類義統",
 "春秋通例",
 "春秋折衷論",
 "孝經后氏說",
 "孝經安昌侯說",
 "孝經長孫氏說",
 "孝經王氏解",
 "孝經解讚",
 "孝經殷氏注",
 "集解孝經",
 "齊永明諸王孝經講義",
 "孝經劉氏說",
 "孝經義疏",
 "孝經嚴氏注",
 "孝經皇氏義疏",
 "古文孝經述義",
 "御注孝經疏",
 "孝經訓注",
 "古論語",
 "齊論語",
 "論語孔氏訓解",
 "論語包氏章句",
 "論語周氏章句",
 "論語馬氏訓說",
 "論語陳氏義說",
 "論語王氏說",
 "論語王氏義說",
 "論語周生氏義說",
 "論語釋疑",
 "論語譙氏注",
 "論語衞氏集注",
 "論語旨序",
 "論語繆氏說",
 "論語體略",
 "論語欒氏釋疑",
 "論語虞氏讚注",
 "論語庾氏釋",
 "論語李氏集注",
 "論語范氏注",
 "論語孫氏集解",
 "論語梁氏注解",
 "論語袁氏注",
 "論語江氏集解",
 "論語殷氏解",
 "論語張氏注",
 "論語蔡氏注",
 "論語顏氏說",
 "論語琳公說",
 "論語沈氏訓注",
 "論語顧氏注",
 "論語梁武帝注",
 "論語太史氏集解",
 "論語褚氏義疏",
 "論語沈氏說",
 "論語熊氏說",
 "論語隱義注",
 "篇敘",
 "孟子程氏章句",
 "孟子高氏章句",
 "孟子劉氏注",
 "孟子鄭氏注",
 "孟子綦毋氏注",
 "孟子陸氏注",
 "孟子張氏音義",
 "孟子丁氏手音",
 "爾雅劉氏注",
 "爾雅樊氏注",
 "爾雅李氏注",
 "爾雅孫氏注",
 "爾雅孫氏音",
 "爾雅圖讚",
 "集注爾雅",
 "爾雅施氏音",
 "爾雅謝氏音",
 "爾雅顧氏音",
 "爾雅裴氏音",
 "五經大義",
 "六經略注序",
 "尚書緯璇璣鈐",
 "春秋緯感情符",
 "孝經古祕",
 "論語撰考讖",
 "論語摘衰聖承進讖",
 "論語素王受命讖",
 "論語糾滑讖",
 "論語崇爵讖",
 "史籀篇",
 "訓纂篇",
 "蒼頡訓詁",
 "三蒼",
 "雜字指",
 "埤蒼",
 "異字",
 "始學篇",
 "草書狀",
 "啟蒙記",
 "要用字苑",
 "演說文",
 "庭誥",
 "古今文字表",
 "四聲五音九弄又紐圖",
 "分毫字樣",
 "石經尚書",
 "石經魯詩",
 "石經儀禮",
 "石經公羊",
 "石經論語",
 "三字石經尚書",
 "三字石經春秋",
 "古文瑣語",
 "帝王要略",
 "三五歷記",
 "年歷",
 "汲冢書鈔",
 "聖賢高士傳",
 "鑒戒象讚",
 "七錄別錄",
 "漆雕子",
 "宓子",
 "景子",
 "世子",
 "魏文侯書",
 "李克書",
 "內業",
 "讕言",
 "甯子",
 "王孫子",
 "李氏春秋",
 "董子",
 "徐子",
 "虞氏春秋",
 "平原君書",
 "劉敬書",
 "至言",
 "河間獻王書",
 "兒寬書",
 "公孫弘書",
 "終軍書",
 "吾丘壽王書",
 "正部論",
 "仲長子昌言",
 "魏了",
 "周生子要論",
 "王子正論",
 "去伐論",
 "杜氏體論",
 "王氏新書",
 "周子",
 "顧子新言",
 "通語",
 "譙子法訓",
 "袁子正論",
 "袁子正書",
 "孫氏成敗志",
 "古今通論",
 "化清經",
 "夏候子新論",
 "太元經",
 "華氏新論",
 "梅子新論",
 "志林新書",
 "廣林",
 "釋滯",
 "通疑",
 "干子",
 "顧子義訓",
 "神農書",
 "野老書",
 "尹都尉書",
 "蔡癸書",
 "養羊法",
 "家政法",
 "伊尹書",
 "辛甲書",
 "公子牟子",
 "田子",
 "老萊子",
 "黔婁子",
 "鄭長者書",
 "任子道論",
 "洞極真經",
 "唐子",
 "蘇子",
 "杜氏幽求新書",
 "符子",
 "少子",
 "夷夏論",
 "鼂氏新書",
 "崔氏政論",
 "阮子政論",
 "世要論",
 "陳子要言",
 "惠子",
 "士緯",
 "史佚書",
 "田俅子",
 "隋巢子",
 "胡非子",
 "纏子",
 "闕子",
 "蒯子",
 "鄒陽書",
 "主父偃書",
 "徐樂書",
 "嚴安書",
 "由余書",
 "博物記",
 "篤論",
 "鄒子",
 "諸葛子",
 "裴氏新言",
 "新義",
 "秦子",
 "析言論",
 "古今訓",
 "時務論",
 "陸氏要覽",
 "古今善言",
 "文釋",
 "要雅",
 "俗說",
 "青史子",
 "宋子",
 "裴子語林",
 "笑林",
 "郭子",
 "齊諧記",
 "水飾",
 "泰階六符經",
 "五殘雜變星書",
 "渾儀",
 "昕)論",
 "安天論",
 "穹天論",
 "未央術",
 "宋司星子韋書",
 "太史公素王妙論",
 "瑞應圖",
 "天鏡",
 "地鏡",
 "夢雋",
 "雜五行書",
 "請雨止雨書",
 "投壺變",
 "周易劉氏注",
 "周官禮異同評",
 "周氏喪服注",
 "喪服世行要記",
 "禮論難",
 "逆降義",
 "明堂制度論",
 "梁氏三禮圖",
 "張氏三禮圖",
 "春秋例統",
 "國語章句",
 "國語解詁",
 "春秋外傳國語虞氏注",
 "春秋外傳國語唐氏注",
 "春秋外傳國語孔氏注",
 "國語音",
 "詁幼",
 "嚴助書",
 "厲學",
 "目耕帖",
 "周易史氏義",
 "周易黃氏義",
 "周易呂氏義",
 "易下邳傳甘氏義",
 "周易賈氏義",
 "周易董氏義",
 "周易劉氏義",
 "周易鄭司農注",
 "周易魯恭義",
 "周易趙氏義",
 "周易徐幹義",
 "周易彭氏義",
 "周易班氏義",
 "周易劉晝義",
 "周易師說",
 "書賈氏義",
 "古文尚書訓",
 "書古文訓",
 "尚書古文同異",
 "古文尚書訓旨",
 "書贊",
 "五家要說章句",
 "書王氏注",
 "尚書集注",
 "書范氏集解",
 "魯詩韋氏說",
 "韓詩趙氏學",
 "毛詩賈氏義",
 "毛詩先鄭義",
 "毛詩集注",
 "周禮序",
 "答臨碩周禮難",
 "周禮賈氏注",
 "諡法劉熙注",
 "婚禮謁文",
 "荀氏禮傳",
 "南北郊冕服議",
 "宗議",
 "答庾亮問宗義",
 "出後者為本父母服議",
 "孫曾為後議",
 "魏尚書秦王侯在喪襲爵議",
 "春秋公羊嚴氏義",
 "春秋公羊眭生義",
 "春秋公羊貢氏義",
 "春秋公羊孔氏傳",
 "春秋公羊王門子注",
 "春秋公羊劉氏注",
 "春秋穀梁傳序",
 "春秋穀梁劉更生義",
 "春秋穀梁段氏注",
 "春秋穀梁劉氏注",
 "春秋左氏傳吳氏義",
 "春秋左氏傳延氏前",
 "春秋左氏傳服氏前",
 "春秋左氏傳劉氏前",
 "春秋三家經本訓詁",
 "駮春秋釋痾",
 "春秋漢議",
 "國語賈氏注",
 "國語虞氏注",
 "孝經馬氏注",
 "孝經董氏義",
 "論語孔氏注",
 "論語包氏注",
 "論語何氏注",
 "論語王氏注",
 "論語麻氏注",
 "論語穩義注",
 "孟子劉中壘注",
 "孟子古注",
 "爾雅許君義",
 "爾雅鄭君注",
 "爾雅麻氏注",
 "五經章句後定",
 "易經備",
 "易神靈圖",
 "尚書中侯馬注",
 "尚書中侯鄭注",
 "尚書緯老靈曜",
 "尚書帝命驗宋注",
 "刑德政",
 "河圖說命徵宋注",
 "洛書鄭注",
 "合讖圖",
 "春秋玉版讖",
 "春秋說命徵",
 "孝經中黃讖",
 "用筆法",
 "筆墨法",
 "篆勢",
 "非草書",
 "書論",
 "考聲",
 "漢書舊注",
 "漢書許義",
 "春秋前傳",
 "帝王世家",
 "史說",
 "春秋公子譜",
 "晉公卿禮秩",
 "三輔決錄注",
 "燕太子傳",
 "鄭君別傳",
 "鍾離意別傳",
 "師曠紀",
 "孝德傳序",
 "忠臣傳序",
 "丹陽尹傳序",
 "懷舊志序",
 "職貢圖序",
 "全德志論",
 "錢塘記",
 "別錄補遺",
 "七錄",
 "金樓子著書攷",
 "金樓子藏書攷",
 "崔寔正論",
 "體論",
 "鍾子芻蕘",
 "法訓",
 "蔡氏化清經",
 "夏侯子新論",
 "義記",
 "司馬兵法",
 "黃石公記",
 "三略",
 "兵要",
 "兵書接要",
 "老子鍾氏注",
 "莊子司馬注",
 "典略",
 "幽求子",
 "孫綽了",
 "君臣政理論",
 "反論",
 "蓋天說",
 "難蓋天",
 "宣夜說",
 "渾天象說",
 "論天",
 "渾天論",
 "渾天論答難",
 "鄒子書",
 "京氏易占",
 "郭氏易占",
 "太玄宋氏注",
 "淮南枕中記",
 "求雨法",
 "相笏經",
 "八公相鶴經",
 "相經",
 "相馬經",
 "神農本草",
 "靈寶要略",
 "魏文帝雜事",
 "後漢抄",
 "晉陽抄",
 "魏略",
 "康部抄",
 "吳書抄",
 "晉中興徵祥說",
 "晉抄",
 "晉起居注",
 "宋起居注",
 "梁起居注",
 "梁天監起居注",
 "梁大同起居注",
 "宋紀",
 "前燕錄",
 "南燕錄",
 "北燕錄",
 "後燕錄",
 "蜀錄",
 "後蜀錄",
 "前趙錄",
 "後趙錄",
 "西秦錄",
 "前秦錄",
 "後秦錄",
 "前涼錄",
 "括地圖",
 "地圖",
 "輿地志",
 "太康地志",
 "宋永初山川記",
 "九洲記",
 "湘州記",
 "湘水記",
 "荊州圖經",
 "興國軍圖經",
 "朗州圖經",
 "衡州圖經",
 "漢陽郡圖經",
 "湖南風土記",
 "沅州記",
 "十道記",
 "郡國縣道記",
 "武昌縣記",
 "武陵源記",
 "洞庭記",
 "桂陽記",
 "楚地記",
 "麓山記",
 "山川記",
 "荊南記",
 "宣城記",
 "古傳",
 "傳",
 "衝波傳",
 "晉先賢傳",
 "先賢傳",
 "江表傳",
 "潁川棗氏文士傳",
 "墨子傳",
 "海內先賢傳",
 "青州先賢傳",
 "魯國先賢傳",
 "魯國先賢志",
 "英賢傳",
 "達士傳",
 "逸士傳",
 "列士傳",
 "蔡琰別傳",
 "陶侃別傳",
 "王子晉別傳",
 "羊氏家傳",
 "祖氏家傳",
 "孫氏世錄",
 "百家譜",
 "姓苑",
 "姓書",
 "姓纂",
 "皇甫謐說",
 "何承天說",
 "語林",
 "類林",
 "同賢記",
 "遁甲經",
 "中經簿",
 "女史",
 "山公集",
 "錢神論",
 "兩京記",
 "史系",
 "漢宮香方鄭注",
 "尚書佚文",
 "公羊傳佚文",
 "禮記佚文",
 "月令佚文",
 "爾雅佚文",
 "周書佚交",
 "尚書大傳佚文",
 "易乾鑿度佚文",
 "易緯通赴驗鄭注佚文",
 "韓詩外傳佚文",
 "春秋繁露佚文",
 "小爾雅佚文",
 "方言佚文",
 "廣雅佚文",
 "史記佚文",
 "律曆逸文",
 "漢書佚文",
 "續漢書佚文",
 "三國志佚文",
 "晉書佚文",
 "南史佚文",
 "北史佚文",
 "北齊書佚文",
 "梁書佚文",
 "國語佚文",
 "戰國策佚文",
 "家語佚文",
 "山海經佚文",
 "竹書佚文",
 "晏子佚文",
 "吳越春秋佚文",
 "十六國春秋佚文",
 "越絕書佚文",
 "漢官儀佚文",
 "御史臺記佚文",
 "華陽國志佚文",
 "風俗通佚文",
 "風俗通姓氏篇佚文",
 "孫子佚文",
 "司馬法佚文",
 "六韜佚文",
 "愼子佚文",
 "韓非子佚文",
 "素問佚文",
 "尹文子佚文",
 "墨子佚文",
 "鬼谷子佚文",
 "鶡冠子佚文",
 "呂氏春秋佚文",
 "荀子佚文",
 "老子佚文",
 "莊子佚文",
 "淮南子佚文",
 "獨斷佚文",
 "說苑佚文",
 "新序佚文",
 "中論佚文",
 "列女傳佚文",
 "新論佚文",
 "論衡佚文",
 "元城語錄佚文",
 "氾勝之書佚文",
 "潛夫論佚文",
 "田家五行志佚文",
 "太玄佚文",
 "琴操佚文",
 "要術佚文",
 "農桑衣食撮要佚文",
 "抱朴子佚文",
 "乾𦠆子佚文",
 "高士傳佚文",
 "文士傳佚文",
 "襄陽耆舊記佚文",
 "陳留耆舊傳佚文",
 "博物志佚文",
 "三輔黃圖佚文",
 "水經注佚文",
 "太平寰宇記佚文",
 "三秦記佚文",
 "三齊記佚文",
 "南越志佚文",
 "會稽記佚文",
 "臨海異物志佚文",
 "嶺表錄異記佚文",
 "十道志佚文",
 "九國志佚文",
 "神異經佚文",
 "列仙傳佚文",
 "白澤圖佚文",
 "宣室志佚文",
 "南方草木狀佚文",
 "北夢瑣言佚文",
 "西吳枝乘佚文",
 "南唐近事佚文",
 "異苑佚文",
 "吳地記佚文",
 "桂海虞衡志佚文",
 "玉堂嘉話佚文",
 "玉堂閒話佚文",
 "朝野僉載佚文",
 "豹穩紀談佚文",
 "後山談叢佚文",
 "三水小牘佚文",
 "志林佚文",
 "語林佚文",
 "小說佚文",
 "嘉話錄佚文",
 "雜說佚文",
 "聞奇錄佚文",
 "陸士衡集佚文",
 "述異記佚文",
 "資暇錄佚文",
 "啟顏錄佚文",
 "河東記佚文",
 "嵇中散集佚文",
 "易章句",
 "易注",
 "易述",
 "九家易集注",
 "易義",
 "易集解",
 "蜀才易注",
 "乾坤義",
 "繫辭義疏",
 "周易講疏",
 "易探玄",
 "易音注",
 "尚書章句",
 "尚書義疏",
 "毛詩注",
 "毛詩申鄭議",
 "周官注",
 "儀禮喪服經傳",
 "儀禮喪服注",
 "禮記解詁",
 "春秋左氏解詁",
 "春秋穀梁傳注",
 "新字林",
 "附聲譜",
 "唐韻",
 "韻海鏡源",
 "河圖秘徵",
 "河圖說徵",
 "河圖真鉤",
 "河圖提劉",
 "河圖天靈",
 "河圖要元",
 "河圖叶光紀",
 "河圖皇參持",
 "河圖闓苞授",
 "河圖合古篇",
 "河圖赤伏符",
 "雒書",
 "雒書甄曜度",
 "雒書靈准聽",
 "雒書摘六辟",
 "易乾鑿度鄭氏注",
 "易乾坤鑿度鄭氏注",
 "易是類謀鄭氏注",
 "易坤靈圖鄭氏注",
 "易乾元序制記鄭氏注",
 "樂協圖徵",
 "春秋攷異郵",
 "春秋命麻序",
 "論語摘衷聖",
 "孝經契",
 "孝經內記圖",
 "河圖聖洽符",
 "論語紀滑讖",
 "法經",
 "公羊治獄",
 "乾象術",
 "易元包",
 "淮南王萬畢術",
 "鐘律書",
 "魏皇覽",
 "逸莊子",
 "後漢書注",
 "後漢記",
 "晉安帝紀",
 "眾家晉史",
 "晉要事",
 "晉朝雜事",
 "建武故事",
 "晉世譜",
 "晉官品令",
 "王朝目錄",
 "晉泰始起益注",
 "晉咸寧起居注",
 "晉泰康起居注",
 "晉山凌故事",
 "晉武帝起居注",
 "晉永安起居注",
 "晉建武起居注",
 "晉太興起居注",
 "晉咸和起居注",
 "晉咸康起居注",
 "晉康帝起居注",
 "晉永和起居注",
 "晉孝武帝起居注",
 "晉太元起居注",
 "晉隆安起居注",
 "晉義熙起居注",
 "晉書（三國志注引）",
 "晉書（世說注引）",
 "晉紀（文選注引）",
 "晉紀（北堂書鈔引）",
 "晉紀（初學記引）",
 "晉書（羣書治要所載）",
 "晉紀（白帖引）",
 "晉紀（御覽引）",
 "尚書百兩篇",
 "國語注",
 "楚漢秋春",
 "英雄記",
 "戰略",
 "晉諸公讚",
 "晉後略",
 "晉八王故事",
 "晉四王遺事",
 "唐明皇月令注解",
 "漢官典儀",
 "晉百官名",
 "附晉故事",
 "晉百官表注",
 "高密遺書",
 "鄭司農（玄）年譜",
 "尚書大傳注",
 "毛詩譜",
 "答臨孝存周禮難",
 "魯禮禘給義",
 "孝經解",
 "論語篇目弟子",
 "漢學堂經解",
 "易言",
 "莊氏易義",
 "繫辭疏",
 "盧氏易注",
 "易雜家注",
 "毛詩申鄭義",
 "禮記音義穩",
 "儀禮喪服經傳略注",
 "爾維音注",
 "蒼頡訓纂",
 "廣倉",
 "字畧",
 "通緯",
 "河圖",
 "河帝通紀",
 "河圖眞鉤",
 "河圖降象",
 "河圖合古編",
 "河圖祿運法",
 "河圖玉板",
 "易辨終備鄭氏注",
 "易稽覽圖鄭氏注",
 "易通卦驗鄭氏注",
 "尚書攷靈曜",
 "尚書琁璣鈐",
 "春秋命厤序",
 "子史鉤沈",
 "易雜占條例法",
 "淮南子注",
 "漢後書",
 "徵祥說",
 "晉泰始起居注",
 "晉山陵故事",
 "通德堂經解",
 "尚書古文注",
 "魯禮禘祫義",
 "箴左氏膏肓",
 "釋穀梁廢疾",
 "發公羊墨守",
 "不波山房詩鈔",
 "聽秋山房賸稿",
 "雲史日記",
 "逸珊王公（甲曾）行略",
 "宋史李重進列傳注",
 "懷荃室詩存",
 "晉宮閣銘",
 "述征記",
 "壽陽記",
 "辛氏三秦記",
 "南兗州記",
 "南徐州記",
 "宜都山川記",
 "永初山川古今記",
 "干寶晉紀",
 "何法盛晉中興書",
 "王隱晉書",
 "臧榮緖晉書",
 "劉璠梁典",
 "張揖埤蒼",
 "附淩注校正",
 "附校注拾遺",
 "序錄",
 "閱仙詩附集",
 "李衛公會昌一品集",
 "附行錄",
 "續編詩集",
 "車營百八叩",
 "洨濱語錄",
 "金忠潔年譜",
 "清平閣唱和詩",
 "永年申氏遺書",
 "申鳧盟先生（涵光）年譜",
 "通鑑評語",
 "申氏拾遺集",
 "顏習齋遺書",
 "顏習齋先生年譜",
 "闢異錄",
 "四存編",
 "李恕谷遺書",
 "李恕谷先生年譜",
 "大學辨業",
 "孫夏峰遺書",
 "夏峰先生集",
 "語錄",
 "孫夏峯先生年譜",
 "尹健餘先生全集",
 "崔東壁遺書",
 "五服異同彙考",
 "介菴經說",
 "附釋問",
 "重斠唐韻攷",
 "周泰名字解故附錄",
 "潞城考古錄",
 "歷代諱名考",
 "魏貞庵先生（裔介）年譜",
 "魏敏果公（象樞）年譜",
 "成周徹法演",
 "兼濟堂集",
 "瓊琚珮語",
 "寒松堂集",
 "瓶水齋詩集",
 "進呈文藁",
 "萬善花室文藁",
 "留耕堂詩集",
 "詩禮堂雜纂",
 "介山自定年譜",
 "銅鼓書堂詞話",
 "書法偶集",
 "南宗抉祕",
 "天台雁蕩紀游",
 "慤思錄",
 "竈嫗解",
 "篷窗附錄",
 "吟齋筆存",
 "耄學齋晬語",
 "古泉叢攷",
 "藏雲閣識小錄",
 "金剛愍公表忠錄",
 "周易史證",
 "易傳偶解",
 "論語贅言",
 "四書說",
 "緯攟",
 "易乾鑿度",
 "易是類謀",
 "易天人應",
 "易內傳",
 "易內篇",
 "易傳太初篇",
 "泛引易緯",
 "尚書洪範記",
 "泛引尚書緯",
 "中候我應",
 "中候雒予命",
 "中候雒師謀",
 "中候摘雒貳",
 "中候儀明",
 "中候合符后",
 "中候運衡",
 "中候契握",
 "中候苗興",
 "詩汛歷樞",
 "泛引詩緯",
 "春秋緯雜篇",
 "春秋錄圖",
 "春秋錄運法",
 "春秋孔錄法",
 "春秋璇璣樞",
 "春秋揆命篇",
 "春秋河圖揆命篇",
 "春秋玉版",
 "春秋瑞應傳",
 "泛引春秋緯",
 "泛引禮緯",
 "泛引樂緯",
 "孝經緯雜篇",
 "孝經河圖",
 "孝經中黃",
 "泛引孝經緯",
 "論語比考",
 "論語緯雜篇",
 "泛引論語讖",
 "河圖帝覽禧",
 "河圖握矩起",
 "河圖雜篇",
 "河圖今占篇",
 "河圖闓苞受",
 "河圖抃光篇",
 "河圖龍文",
 "河圖錄運法",
 "河圖考鉤",
 "河圖說徵祥",
 "河圖揆命篇",
 "圖緯絳象",
 "河圖皇參待",
 "河圖帝視萌",
 "泛引河圖",
 "雒書緯",
 "雒書靈準聽",
 "雒書緯雜篇",
 "雒書寶號命",
 "雒書說禾",
 "雒書錄運法",
 "雒書錄運期",
 "泛引雒書",
 "古微書訂誤",
 "古微書存考",
 "萬卷精華樓藏書記",
 "濛池行稿",
 "鶴皋年譜",
 "從戎始末",
 "兵燹瑣記",
 "西陲竹枝詞",
 "綠溪語",
 "聞見瓣香錄",
 "西湖雜咏",
 "蘿藦亭札記",
 "尚書攷辨",
 "㐆齋文集",
 "石州（張穆）年譜",
 "西北之文",
 "續尤西堂擬明史樂府",
 "梅崖文鈔",
 "梅崖詩話",
 "顧齋遺集",
 "顧齋簡譜",
 "洎水齋文鈔",
 "文潞公文集",
 "自課堂文",
 "松龕全集",
 "兩漢幽并涼三州今地考略",
 "漢志沿邊十郡考略",
 "常評事集",
 "常評事寫情集",
 "莊靖先生遺集",
 "王石和文",
 "老生常談",
 "饁𧂬室詩草",
 "讀易旁求",
 "圖南齋著卜",
 "春秋經論摘義",
 "讀史贊要",
 "三立閣史鈔",
 "傅文恪公全集",
 "率真鳴",
 "亦樂亭詩集",
 "梅村文鈔",
 "圖南集",
 "雜文偶存",
 "傲霜園詩鈔",
 "如嬰齋文鈔",
 "鞠笙遺筆",
 "曝犢亭詩鈔",
 "晉昌遺文彙鈔",
 "誡勗淺言",
 "樸齋省愆錄",
 "順甫遺書",
 "鞠笙年譜",
 "遼小史",
 "金小史",
 "遼方鎮年表",
 "金方鎮年表",
 "渤海國記",
 "扈從東迭日錄",
 "鳳城瑣錄",
 "朝鮮軼事",
 "瀋故",
 "灤陽錄",
 "燕臺再游錄",
 "遼東志",
 "附解題",
 "全遼志",
 "遼陽州志",
 "鐵嶺縣志",
 "錦州府志",
 "塔子溝紀略",
 "岫巖志略",
 "瀋陽紀程",
 "東北輿地釋略",
 "黑龍江輿地圖",
 "輿圖說",
 "醫閭先生集",
 "耕煙草堂詩鈔",
 "慶芝堂詩集",
 "愛吟草",
 "前草",
 "附題跋殉節錄詩",
 "解脫紀行錄",
 "行吟雜錄",
 "三槐書屋詩鈔",
 "皇清書史",
 "皇清書人別號錄",
 "畫家知希錄",
 "遼文萃",
 "遼史藝文志補證",
 "黃華集",
 "李鐵君先生文鈔",
 "含中集",
 "附含中睫巢兩集校錄",
 "瑤峯集",
 "白石道人（姜夔）年譜",
 "清真居士（周邦彥）年譜",
 "稼軒先生（辛棄疾）年譜",
 "全遼備考",
 "東三省輿地圖說",
 "西伯利東偏紀要",
 "東北邊防輯要",
 "盛京疆域考",
 "錦縣志",
 "廣寧縣志",
 "寧遠州志",
 "蓋平縣志",
 "開原縣志",
 "布特哈志略",
 "鴨江行部志節本",
 "神宗皇帝即位使遼語錄",
 "嘉慶東巡紀事",
 "遼紀",
 "遼陽聞見錄",
 "耳書",
 "蜀軺紀程",
 "巴林紀程",
 "楝亭書目",
 "四庫全書輯永樂大典本書目",
 "永樂大典書目考",
 "瀋館錄",
 "瀋陽日記",
 "雪屐尋碑錄",
 "夢鶴軒楳澥詩鈔",
 "毛詩多識",
 "慧珠閣詩鈔",
 "毛詩古樂音",
 "夢月軒詩鈔",
 "扶風班氏佚書",
 "叔皮集",
 "蘭臺集",
 "曹大家集",
 "北地傅氏遺書",
 "三傅集",
 "方本傅子校勘記",
 "傅子校補",
 "鶉觚集",
 "中丞集",
 "摯太常遺書",
 "摯太常文集",
 "文章流別志論",
 "馮曲陽集",
 "傅司馬集",
 "趙計吏集",
 "傅太常集",
 "蘭泉老人遺集",
 "楊晦叟遺集",
 "陝西南山谷口考",
 "周禮政要",
 "河套圖考",
 "雞山語要",
 "致曲言",
 "明德集大旨總論",
 "歲寒集",
 "莘野先生遺書",
 "莘野先生（康乃心）年譜",
 "華山經",
 "豐川雜著",
 "區田法",
 "四禮寧儉編",
 "修齊直指評",
 "太華太白紀游略",
 "思菴野錄",
 "新疆建置志",
 "陝境漢江流域貿易稽核表",
 "韓翰林集",
 "華原風土詞",
 "附郃陽雜詠",
 "關中三李年譜",
 "二曲先生（李顒）年譜",
 "雪木先生（李柏）年譜",
 "天生先生（李因篤）年譜",
 "豳風廣義",
 "關中水利議",
 "續漢書郡國志釋略",
 "尚書微",
 "立政臆解",
 "學記臆解",
 "陝甘味經書院志",
 "楚辭新注",
 "河濱遺書鈔",
 "漢詩音註",
 "不二歌集",
 "關中勝蹟圖志",
 "春冰室野乘",
 "涇獻文存",
 "涇獻詩存",
 "王端節公遺集",
 "正學齋文集",
 "艾陵文鈔",
 "荷塘詩集",
 "徐太常公遺集",
 "靜志齋吟草",
 "後涇渠志",
 "牛涇村遺著三種",
 "省克捷訣",
 "訓士瑣言",
 "勇烈節孝彙編",
 "二孔先生文鈔",
 "經之文鈔",
 "繡山文鈔",
 "北史論略",
 "旭齋文鈔",
 "訪碑拓碑筆札",
 "白狼河上集",
 "濰縣竹枝詞自註",
 "濰縣宏福寺造像碑考",
 "客座贅語",
 "晉書地理志證今",
 "職官攷略",
 "地名辨異",
 "人名辨異",
 "顧華玉集",
 "論語說",
 "陶貞白集",
 "澹園集",
 "青溪集",
 "左傳博義拾遺",
 "讀書雜釋",
 "赤山湖志",
 "臺遊日記",
 "補輯風俗通義佚文",
 "天方典禮擇要解",
 "金子有集",
 "金子坤集",
 "石臼前集",
 "曹集考異",
 "昌國典詠",
 "梅村賸稿",
 "心燈錄",
 "嬾真草堂集",
 "何太僕集",
 "顧與治詩集",
 "定山集",
 "雪村編年詩賸",
 "白䓘集",
 "醇雅堂詩略",
 "然松閣賦鈔",
 "存稿",
 "蟻餘偶筆",
 "附筆",
 "讕言瑣記",
 "靜虛堂吹生草",
 "柳門遺稿",
 "荻華堂詩存",
 "子尚詩存",
 "薄游草",
 "西農遺稿",
 "且巢詩存",
 "妙香齋集",
 "柏巖乙稿",
 "在莒集",
 "括囊詩草",
 "詞草",
 "羅氏一家集",
 "顧伯虯遺詩",
 "陔餘雜著",
 "德風亭初集",
 "平叔詩存",
 "張篁村詩",
 "吳下尋山記",
 "王雅宜（寵）年譜",
 "聞見闡幽錄",
 "王巢松年譜",
 "七姬詠林",
 "明周端孝先生@疏題跋",
 "珊瑚舌雕談摘鈔",
 "吳音奇字",
 "十藥神書",
 "石隱山人自訂年譜",
 "寒山留緒",
 "蟋蟀在堂艸",
 "消夏閑記選存",
 "楊大瓢先生雜文殘稿",
 "論古雜識",
 "古玉圖考補正",
 "俞曲園先生日記殘稿",
 "箋經室所見宋元書題跋",
 "借巢筆記",
 "畏壘山人文集",
 "咫進齋詩文稿",
 "紅蘭逸乘",
 "心矩齋尺牘",
 "澤畔吟",
 "蘭舫筆記",
 "虞山畫志",
 "蘼蕪紀聞",
 "眉綠樓詞聯",
 "唯自勉齋長物志",
 "吳下名園記",
 "吾炙集",
 "東山詶和集",
 "和古人詩",
 "和今人詩",
 "和友人詩",
 "野外詩",
 "隱湖題跋",
 "以介編",
 "七峰遺編",
 "海角遺編",
 "海虞被兵記",
 "過墟志感",
 "書老生蒙難事",
 "虞山妖亂志",
 "筆夢",
 "張漢儒疏稿",
 "閣訟記略",
 "牧齋先生（錢謙益）年譜",
 "河東君殉家難事實",
 "虞山勝地紀略",
 "琴川三風十愆記",
 "祝趙始末",
 "邑侯于公政績紀略",
 "恭紀御試",
 "潮災紀略",
 "常熟記變始末",
 "虞山雜志",
 "虞書",
 "後虞書",
 "虞諧志",
 "熙怡錄",
 "鵲南雜錄",
 "𢈪亭雜記",
 "殘簏故事",
 "養疴客談",
 "雲峯偶筆",
 "思庵閒筆",
 "粵西從宦略",
 "懷古錄",
 "踵息廬稿",
 "三近齋語錄",
 "踵息廬粹語",
 "易學贅言",
 "謝氏源流",
 "咏梅軒仰觀錄",
 "十家語錄摘要",
 "咏梅軒劄記",
 "詠梅軒劄記增訂",
 "存要",
 "輿圖總論注釋",
 "宛鄰詩",
 "蓬室偶吟",
 "宛鄰文",
 "澹菊軒詩初稿",
 "澹菊軒詞",
 "明發錄",
 "崇禎朝記事",
 "陳定生先生遺書三種",
 "戒菴老人漫筆",
 "梁昭明太子集",
 "文選攷異",
 "蕭茂挺集",
 "蔣之翰之奇遺稿",
 "毗陵集",
 "鴻慶居士文集",
 "宋孫仲益內簡尺牘",
 "梁谿遺藁",
 "侍郎葛公歸愚集",
 "牆東類藁",
 "清閟閣全集",
 "唐荊川先生文集",
 "從野堂存稿",
 "文貞公（繆昌期）年譜",
 "落落齋遺集",
 "金忠潔公文集",
 "堆山先生前集鈔",
 "留溪外傳",
 "邵青門全集",
 "附邵氏家錄",
 "學文堂文集",
 "鴻慶居士集補遺",
 "三朝野紀",
 "序測",
 "例略",
 "題辭",
 "皇明名臣琬琰錄",
 "恩卹諸公志略",
 "天山自訂年譜",
 "荊溪外紀",
 "雜諍",
 "玄晏齋困思鈔",
 "午風堂叢談",
 "飲淥軒隨筆",
 "炙硯瑣談",
 "暨陽答問",
 "教經堂談藪",
 "龜巢稿",
 "方山先生文錄",
 "張水南文集",
 "賜餘堂集",
 "漱泉閣詩集",
 "正誼堂詩集",
 "文友文選",
 "清芬樓遺稿",
 "宛鄰文集",
 "止庵遺集文",
 "丹稜文鈔",
 "端虛勉一居文集",
 "初月樓古文緖論",
 "竹罏圖詠",
 "愚公谷乘",
 "秋水文集",
 "浦舍人詩集",
 "澹寧居詩集",
 "邵文莊公（寶）年譜",
 "樂阜山堂稿",
 "高子遺書節鈔",
 "高忠憲公（攀龍）年譜",
 "錫山補誌",
 "讀史諍言",
 "未庵初集",
 "奇姓通",
 "二介詩鈔",
 "黃介子詩鈔",
 "李介立詩鈔",
 "己酉避亂錄",
 "京口僨城錄",
 "鎮城竹枝詞",
 "草間日記",
 "從軍紀事",
 "戴叔倫詩集",
 "許丁卯詩真蹟錄",
 "二王帖評釋",
 "芸隱勌游藁",
 "橫舟藁",
 "存悔齋詩",
 "雲山日記",
 "快雪齋集",
 "孤蓬倦客集",
 "京口三山志",
 "陸右丞蹈海錄",
 "開沙志",
 "遭亂紀略",
 "焦東閣日記",
 "億堂文鈔",
 "橫山保石牘存",
 "崇德窰捐牘存",
 "佛地考證三種",
 "晉釋法顯佛國記地理考證",
 "魏宋雲釋惠生西域求經記地理攷證",
 "釋辯機大唐西域記地理攷證",
 "五印度疆域風俗制度攷略",
 "枚叔集",
 "陳孔璋集",
 "渭南詩集",
 "節孝先生集",
 "事實",
 "附載",
 "陸忠烈公遺集",
 "龜城叟集輯",
 "畫鑑",
 "射陽先生文存",
 "濟州學碑釋文",
 "葦間老人題畫集",
 "赤泉元筌",
 "山陽志遺",
 "易蘊",
 "寄生館駢文",
 "永慕廬文集",
 "徐集小箋",
 "徐節孝先生（積）年譜",
 "張力臣先生（弨）年譜",
 "揚州名勝錄",
 "項羽都江都考",
 "揚州輿地沿革表",
 "揚州城守紀略",
 "揚州十日記",
 "杜牧之揚州夢",
 "揚州禦寇錄",
 "揚城殉難續錄",
 "揚州畫苑錄",
 "揚州竹枝詞",
 "望江南百調",
 "廣陵小正",
 "揚州萸灣勝覽",
 "揚州水利論",
 "治下河水論",
 "洩湖水入江議",
 "高家堰記",
 "運河水道編",
 "揚州北湖續志",
 "退庵筆記",
 "附宋石齋筆談",
 "六客之廬筆談",
 "梓里舊聞",
 "退庵錢譜",
 "歷代錢譜考",
 "歷代年號重襲考",
 "林東城文集",
 "小學駢支",
 "運氣辯",
 "依歸草初刻",
 "二刻",
 "春雨草堂別集",
 "庭聞州世說",
 "先進風格",
 "微尚錄存",
 "海安考古錄",
 "陸筦泉醫書",
 "柴墟文集",
 "發幽錄",
 "雙虹堂詩合選",
 "先我集",
 "雪履齌筆記",
 "使緬錄",
 "服食崇儉論",
 "奉常家訓",
 "說文引詩辨證",
 "海運說",
 "補闕疑",
 "築圍說",
 "治病說",
 "救荒定議",
 "蔚村三約",
 "婁江條議",
 "蘇松浮糧攷",
 "桑梓五防",
 "支更說",
 "分野說",
 "省身錄",
 "封建考",
 "水利五論",
 "敬學錄",
 "廣論學三說",
 "吳下喪禮辨",
 "語林考辨",
 "稱謂考辨",
 "八矢注字說",
 "注字圖",
 "課士條言",
 "太倉州名考",
 "太倉風俗記",
 "洗心錄",
 "筮仕金鑑",
 "舊鄉行紀",
 "葬考",
 "立學先基條說",
 "秋樵雜錄",
 "課餘偶筆",
 "寓疁雜詠",
 "過庭記聞",
 "恆星餘論",
 "忍齋雜識",
 "勵學篇",
 "侍疾要語",
 "讀左剩語",
 "閭史瑣言",
 "婁江雜詞",
 "飼鳩記略",
 "思源錄",
 "望益編",
 "斯友堂日記",
 "講義條約",
 "性善圖說",
 "月道疏",
 "避地三策",
 "梅村集外詩",
 "十國雜詠",
 "讀書雜說",
 "百家姓廋辭",
 "迓亭雜說",
 "學易臆說",
 "瑯琊鳳麟兩公（王世貞、王世懋）年譜",
 "內則章句",
 "安道公（陳瑚）年譜",
 "谿山臥游錄",
 "勿憚改齋吟草",
 "清抱居賸稿",
 "覆瓿叢談",
 "卅六芙蓉館詩存",
 "五子緒言",
 "勤齋考道日錄",
 "囈語偶存",
 "養正錄",
 "復性圖",
 "朱柏廬先生大學講義",
 "中庸講義",
 "從先維俗議",
 "吳梅村先生編年詩集",
 "詩詞補鈔",
 "愛蓮居詩鈔",
 "浣花廬詩鈔",
 "禹貢今釋",
 "毛詩異義",
 "五聲反切正均",
 "通鑑注商",
 "漢儒傳經記",
 "附歷朝崇經記",
 "新安學繫錄",
 "畫偈",
 "江注詩集",
 "通藝錄",
 "論學小記",
 "論學外篇",
 "宗法小紀",
 "儀禮喪物文足徵記",
 "釋宮小記",
 "考工創物小記",
 "磬折古義",
 "溝洫疆理小記",
 "禹貢三江考",
 "水地小記",
 "解字小記",
 "聲律小記",
 "單行本琴音記下篇原紀琴音之數",
 "九穀考",
 "釋草小記",
 "讀書求解",
 "數度小記",
 "九勢碎事",
 "釋蟲小紀",
 "修辭餘鈔",
 "讓堂亦政錄",
 "嘉定贈別詩文",
 "樂器三事能言",
 "蓮飲集濠上吟稿",
 "果臝轉語記",
 "儀禮經注疑直",
 "附兄字說",
 "附校正",
 "校刊記",
 "癸巳類稿",
 "附詩文補遺",
 "俞理初先生（正燮）年譜",
 "淩次仲先生遺書",
 "校禮堂詩集",
 "淩次仲先生譜",
 "黃山志定本",
 "黃山志續集",
 "黃山志定本校記",
 "黃山志續集校記",
 "戴東原先生全集",
 "中庸補注",
 "經考附錄",
 "屈原賦戴氏注",
 "屈原賦注初稿",
 "遺墨",
 "戴先生所著書攷",
 "望溪奏議",
 "惜抱軒書錄",
 "田間集",
 "南澗詞選",
 "喪禮或問",
 "心學宗",
 "三傳補注",
 "白白齋貨殖傳評",
 "昌谷集註",
 "空明谷詞",
 "馬太僕奏略",
 "左傳補註",
 "左忠毅公（光斗）年譜",
 "歸雅堂詩集",
 "黃山紀勝",
 "片舫齋詩集",
 "大易旁通",
 "學測",
 "易學管窺",
 "三峯傳藁",
 "史疑",
 "續史疑",
 "三峯史論",
 "太極後圖說",
 "八士辯",
 "水西會約",
 "宦遊日記",
 "東井誥勅",
 "貴池唐人集",
 "費冠卿詩",
 "張處士詩集",
 "周繇詩",
 "顧雲詩",
 "張喬詩",
 "殷文圭詩",
 "伍喬詩",
 "翠微先生北征錄",
 "李行季遺詩",
 "東林本末",
 "啟楨兩朝剝復錄",
 "南都應試記",
 "讀書止觀錄",
 "貴池二妙集",
 "嶧桐集",
 "劉先生（城）年譜",
 "化碧錄",
 "楚漢帝月表",
 "三唐傳國編年",
 "一草亭讀史漫筆",
 "偶存草",
 "雁字和韻詩",
 "杏花村志",
 "幼科鐵鏡",
 "南湖集鈔",
 "秀山志",
 "靜觀書屋詩集",
 "建文遜國之際月表",
 "貴池先哲遺書待訪目",
 "史弋",
 "休庵前集",
 "芸葊詩集",
 "西溪偶錄",
 "錢塘西湖百詠",
 "新刻古杭雜記詩集",
 "西湖韻事",
 "不繫園集",
 "隨喜庵集",
 "流香一覽",
 "武林理安寺志",
 "廣福廟志",
 "重陽庵集",
 "西湖紀述",
 "慧因寺志",
 "杭郡庠得表忠觀碑記事",
 "西湖修禊詩",
 "唐棲志略藁",
 "吳山遺事詩",
 "南屏百詠",
 "崔府君祠錄",
 "御覽孤山志",
 "七述",
 "錢塘湖山勝槩詩文",
 "錢塘湖山勝槩記",
 "湖山百詠",
 "西湖臥遊圖題跋",
 "西谿梵隱志",
 "雲棲紀事",
 "孝義無礙庵錄",
 "南湖倡和集",
 "崇福寺志",
 "續志",
 "湖墅雜詩",
 "遊明聖湖日記",
 "客越志略",
 "大昭慶律寺志",
 "定鄉雜著",
 "金牛湖漁唱",
 "龍井顯應胡公墓錄",
 "西湖八社詩帖",
 "湖山敘遊",
 "養素園詩",
 "武林元妙觀志",
 "西泠仙詠",
 "北隅掌錄",
 "西湖雜詩",
 "揚清祠志",
 "武林西湖高僧事略",
 "西村十記",
 "韜光庵紀遊集",
 "鳳皇山聖果寺志",
 "湖船續錄",
 "武林怡老會詩集",
 "西湖月觀紀",
 "鼇峯倡和詩",
 "橫山遊記",
 "孝慈庵集",
 "武林草",
 "里居雜詩",
 "金鼓洞志",
 "新門散記",
 "城北天后宮志",
 "春草園小記",
 "武林新年雜詠",
 "復園紅板橋詩",
 "東郊土物詩",
 "江鄉節物詩",
 "蘭因集",
 "定鄉小識",
 "紫陽庵集",
 "山游倡和詩",
 "聖宋錢塘賦",
 "西湖雜記",
 "捍海塘志",
 "翠微亭題名攷",
 "西泠閨詠",
 "俞樓詩記",
 "西溪百詠",
 "臨平記",
 "小雲棲放生錄",
 "西湖秋柳詞",
 "臨平記補遺",
 "武林靈隱寺誌",
 "增修雲林寺志",
 "續修雲林寺誌",
 "雪莊西湖漁唱",
 "龍井見聞錄",
 "宋僧元淨外傳",
 "杭府仁錢三學灑埽職",
 "湖山懷古集",
 "武林第宅攷",
 "勅建淨慈寺志",
 "神州古史考",
 "湖山雜詠",
 "西湖雜詠",
 "湖上青山集",
 "四時幽賞錄",
 "西泠懷古集",
 "龍興祥符戒壇寺志",
 "萬歷錢塘縣志",
 "武林遊記",
 "流芳亭記",
 "雲居聖水寺志",
 "西湖詩",
 "嘉靖仁和縣志",
 "西子湖拾翠餘談",
 "杭志三詰三誤辨",
 "東河櫂歌",
 "西湖遊詠",
 "護國寺元人諸天畫像讚",
 "杭城治火議",
 "湖樓集",
 "庚辛泣杭錄",
 "欽定勦平粵匪方略",
 "昭忠祠志",
 "崇義祠志",
 "義烈墓錄",
 "兩浙庚辛紀略",
 "庚申浙變記",
 "轉徙餘生記",
 "杭城再陷紀實",
 "思痛記",
 "難中記",
 "殉烈記",
 "湘軍記",
 "杭城紀難詩",
 "蒿目錄",
 "杭城辛酉紀事詩",
 "杭城紀難詩編",
 "雜考",
 "西湖冶興",
 "鑒公精舍納涼圖題詠",
 "松吹讀書堂題詠",
 "附小松吹讀書堂題詠",
 "桑孝子旌門錄",
 "錢塘懷古詩",
 "褚堂閭史考證",
 "寒山舊廬詩",
 "橫橋吟館圖題詠",
 "瓊英小錄",
 "廣陵曲江復對",
 "孫花翁墓徵",
 "直閣朱公祠墓錄",
 "郭孝童墓記略",
 "西湖游覽志",
 "艮山雜志",
 "西溪雜詠",
 "西溪梅竹山莊圖題詠",
 "錢塘百詠",
 "靈隱書藏紀事",
 "金龍四大王祠墓錄",
 "同仁祠錄",
 "續東河櫂歌",
 "夜山圖題詠",
 "西泠遊記",
 "湖舫詩",
 "迎鑾新曲",
 "西湖遺事詩",
 "清波三志",
 "金氏世德紀",
 "照膽臺志略",
 "陳忠肅公墓錄",
 "西湖水利考",
 "皋亭倡和集",
 "于公祠墓錄",
 "淳祐臨安志輯逸",
 "樊公祠錄",
 "武林藏書錄",
 "風木盦圖題詠",
 "武林雜事詩",
 "杭州上天竺講寺志",
 "西谿聯吟",
 "南宋宮閨雜詠",
 "泰亭山民移居倡和詩",
 "東城記餘",
 "三塘漁唱",
 "文瀾閣志",
 "北隅綴錄",
 "北郭詩帳",
 "褚亮集",
 "褚遂良集",
 "鄭巢詩集",
 "錢唐韋先生文集",
 "新注朱淑真斷腸詩集",
 "芝田小詩",
 "漁溪詩稿",
 "橘潭詩稿",
 "芸居乙稿",
 "雲泉詩稿",
 "湖山類槀",
 "忍經",
 "疇齋二譜",
 "外錄",
 "琴譜",
 "竹素山房集",
 "貞居先生詩集",
 "李草閣詩集",
 "筠谷詩集",
 "松雨軒集",
 "周真人集",
 "節菴集",
 "續藁",
 "集古梅花詩",
 "松窗夢語",
 "奚囊蠹餘",
 "孫夫人集",
 "田叔禾小集",
 "碧筠館詩稿",
 "亶爰子詩集",
 "弘藝錄",
 "藝苑玄幾",
 "西軒效唐集錄",
 "無纇生詩選",
 "龍珠山房詩集",
 "湖上篇",
 "卓光祿集",
 "臥月軒稿",
 "始豐藁",
 "東軒集選",
 "汴都賦",
 "參寥集",
 "太上感應靈篇圖說",
 "少保于公奏議",
 "于肅愍公集",
 "倪文僖公集",
 "青谿漫稿",
 "容菴遺文鈔",
 "存稿鈔",
 "止谿文鈔",
 "詩集鈔",
 "乾初先生文鈔",
 "遺詩鈔",
 "補庵遺稿",
 "敬齋詩鈔",
 "雲怡詩鈔",
 "簡莊文鈔",
 "河莊詩鈔",
 "新坂土風",
 "蠶桑摘要",
 "經驗痒子症良方",
 "又經驗痒子症方",
 "蕉園詩集鈔",
 "月隱遺稿鈔",
 "海粟堂詩鈔",
 "留素堂詩集鈔",
 "逃禪吟鈔",
 "詠年堂詩集鈔",
 "西疇草堂遺詩鈔",
 "蜀中草鈔",
 "耘蓮詩鈔",
 "為可堂詩集鈔",
 "與袁堂詩集鈔",
 "飽墨堂吟草鈔",
 "魯化遺詩鈔",
 "艾軒詩集鈔",
 "出岫集鈔",
 "菊隱吟鈔",
 "敬慎居詩稿",
 "贊雪山房詩存",
 "蟲獲軒詩鈔",
 "留爪集鈔",
 "臆吟集鈔",
 "竹巖詩鈔",
 "巽隱先生文集",
 "幾亭外書",
 "舉業素語",
 "藏密齋書牘",
 "聖雨齋詩集",
 "楊園先生未刻稿",
 "曝書亭集外詩",
 "鴛央湖櫂歌",
 "頛業齋續鴛鴦湖櫂歌",
 "黑蝶齋詞",
 "秋錦山房詞",
 "耒邊詞",
 "柘西精舍詞",
 "漫游小鈔",
 "老老恆言",
 "瓜田畫論",
 "柚堂續筆談",
 "匏廬詩話",
 "拙宜園詞",
 "復小齋賦話",
 "賢己編",
 "薇雲室詩稿",
 "嘉禾徵獻錄",
 "古禾雜識",
 "寒松閣談藝瑣錄",
 "衎石齋晚年詩稿",
 "采山堂遺文",
 "萬松居士詞",
 "茮聲館詞",
 "鍾秉文烏槎幕府記",
 "周官故書攷",
 "論語魯讀攷",
 "儀禮古今文異同",
 "悔菴學文",
 "柯家山館遺詩",
 "秋室集",
 "禮耕堂叢說",
 "吉貝居暇唱",
 "澤雅堂文集",
 "繫辭補注",
 "周易通解",
 "釋義",
 "周易消息",
 "虞氏逸象考正",
 "續纂",
 "九家易象辨證",
 "虞氏易義補注",
 "周易本義辨證補訂",
 "漢儒傳易源流",
 "經典通用考",
 "易書詩禮四經正字考",
 "說文校議",
 "竹書紀年辨證",
 "補遺辨證",
 "臺灣鄭氏始末",
 "吳興志",
 "吳興掌故集",
 "寶前兩溪志略",
 "湖錄經籍考",
 "鄭堂讀書記",
 "溫忠烈公遺稿",
 "爨桐廬算賸",
 "須曼精廬算學",
 "權齋老人筆記",
 "月河所聞集",
 "陵陽先生集",
 "弁山小隱吟稿",
 "水南集",
 "泌園集",
 "董禮部集",
 "靜歗齋遺文",
 "豐草庵詩集",
 "文前集",
 "寶雲詩集",
 "禪樂府",
 "南山堂自訂詩",
 "使交集",
 "吳太史遺稿",
 "慈壽堂文鈔",
 "權齋文稿",
 "山子詩鈔",
 "孔堂初集",
 "私學",
 "胥石詩存（原名南霅草堂詩集）",
 "文存（原名族譜稿存）",
 "冬青館甲集",
 "蛻石文鈔",
 "落帆樓文集",
 "遼宮詞",
 "金宮詞",
 "夢花亭駢體文集",
 "天隱堂文錄",
 "歐餘山房文集",
 "楓江草堂詩集",
 "楓江漁唱",
 "清湘瑤瑟譜",
 "遲鴻軒詩棄",
 "文棄",
 "詩續",
 "文續",
 "𧂀叟年譜",
 "玉鑑堂詩集",
 "葭洲書屋遺稿",
 "同岑集",
 "詩筏",
 "吳興詩話",
 "湖州詞徵",
 "國朝湖州詞錄",
 "南潯鎮志",
 "朱文肅公詩文集",
 "劫餘雜識",
 "山傭遺詩",
 "范氏記私史事",
 "前身散見集編年詩續抄",
 "南潛日記",
 "兼山續草",
 "古壁叢鈔",
 "堅匏盦詩文集",
 "一浮漚齋詩選",
 "平津館金石萃編",
 "蛾子時述小記",
 "讀國語劄記",
 "東遊草",
 "鶴野詞",
 "廣藝舟雙輯評論",
 "乍浦志",
 "龍湫集",
 "九峯文鈔",
 "話桑賦稿",
 "與春賦稿",
 "漢閣賦稿",
 "汾澤賦稿",
 "蟾士賦稿",
 "菊人賦稿",
 "卬浦賦稿",
 "西箖賦稿",
 "潯初賦稿",
 "乳谿賦稿",
 "二如賦稿",
 "桑阿吟屋稿",
 "待廬集",
 "雲屋殘編",
 "任子",
 "虞祕監集",
 "賀祕監集",
 "豐清敏公詩文輯存",
 "奏疏輯存",
 "遺事附錄",
 "遺事新增附錄",
 "遺事續增附錄",
 "遺事校勘記",
 "夢窗甲藁",
 "乙藁",
 "丙藁",
 "丁藁",
 "夢窗詞補遺",
 "文英新詞藁",
 "夢窗詞藁附錄",
 "附夢窗詞校勘記",
 "夢窗詞集小箋",
 "夢窗詞校議",
 "補校夢窗新詞藁",
 "深寧先生文鈔摭餘編",
 "深寧先生（王應麟）年譜",
 "王深寧先生年譜",
 "古今紀要逸編",
 "戊辰修史傳",
 "剡源文鈔",
 "管天筆記外編",
 "春酒堂文存",
 "杲堂詩鈔",
 "樗菴存藁",
 "東井文鈔",
 "詩誦",
 "羣經質",
 "孫拾遺文纂",
 "雪窗先生文集",
 "清溪遺稿一卷不朽錄一卷清溪公題詞一卷",
 "陳忠貞公遺集",
 "過宜言",
 "錢忠介公集",
 "錢忠介公年譜",
 "雪翁詩集",
 "愚囊彙稿",
 "張蒼水集",
 "馮侍郎遺書",
 "簟溪自課",
 "三山吟",
 "簟溪集",
 "王侍郎遺著",
 "馮王兩侍郎墓錄",
 "六經堂遺事",
 "吞月子集",
 "雪交亭正氣錄",
 "宋季忠義錄",
 "現成話",
 "管邨文鈔內編",
 "千之草堂編年文鈔",
 "寸草廬贈言",
 "范文正公（仲淹）年譜",
 "春草齊集",
 "寧波府簡要志",
 "南山箸作考",
 "讀易一鈔易餘",
 "鄞志稿",
 "甬上水利志",
 "舒文靖公類藁",
 "定川遺書",
 "慈湖先生遺書",
 "附新增附錄",
 "慈湖先生（楊簡）年譜",
 "慈湖箸述考",
 "袁正獻公遺文鈔",
 "戴仲培先生詩文",
 "困學記聞補注",
 "白齋詩集",
 "竹里詩集",
 "竹里文略",
 "聞見漫錄",
 "拘虛集",
 "游名山錄",
 "皇極經世觀物外篇釋義",
 "陳后岡詩集",
 "碣石編",
 "銅馬編",
 "夷困文編",
 "囊雲文集",
 "四明山志",
 "深省堂詩集",
 "歷代紀元彙考",
 "附續編",
 "石園文集",
 "分隷偶存",
 "玉几山房吟卷",
 "月船居士詩稿",
 "春雨樓初刪稿",
 "存悔集",
 "四明古蹟",
 "瞻衮堂文集",
 "襄陵詩草",
 "詩草",
 "種玉詞",
 "世本集覽",
 "補園剩藁",
 "古本文派述略",
 "宋元學案補遺",
 "虞徵士遺書",
 "論語虞氏讚註",
 "勸忍百箴考註",
 "貞白五書",
 "三極通",
 "質言",
 "迴瀾正諭",
 "求是編",
 "林衣集",
 "留補堂文集選",
 "小天集",
 "純德彙編",
 "續刻",
 "甬東正氣集",
 "四明詩幹",
 "四明宋僧詩",
 "元僧詩",
 "全校水經酈注水道表",
 "射侯考",
 "明明子論語集解義疏",
 "切音啟蒙",
 "大衍集",
 "附約仙遺稿",
 "四明人鑑",
 "養園賸藁",
 "魏文節遺書",
 "黎齋家塾書鈔",
 "西麓詩稿",
 "西麓繼周集",
 "趙寶峯先生文集",
 "符臺外集",
 "楊文懿公文集",
 "碧川文選",
 "養心亭集",
 "灼艾集",
 "玩鹿亭稿",
 "續騷堂集",
 "補歷代史表",
 "夏小正求是",
 "漢書讀",
 "辨字",
 "見山樓詩集",
 "季仙先生遺稿",
 "寸草廬奏稿",
 "小謨觴館文集注",
 "孔賈經書異同評",
 "鶴巢文存",
 "虞預晉書",
 "舒嬾堂詩文存",
 "石魚偶記",
 "輯補",
 "梅讀先生存稿",
 "徐徐集",
 "攝生眾妙方",
 "白嶽游稿",
 "杲堂文續鈔",
 "甬上高僧詩",
 "四明文徵",
 "徐偃王志",
 "味吾廬詩存",
 "容膝軒文集",
 "峽源集",
 "重訂周易二閭記",
 "重訂周易小義",
 "元史本證",
 "禮記注疏校正",
 "史記惠景閒侯者年表校補",
 "羣書拾補補遺",
 "揚雄太玄經校正",
 "羣書拾補識語",
 "重論文齋筆錄",
 "蠻司合志",
 "澹生堂藏書目",
 "四庫全書提要分纂槀",
 "思復堂文集",
 "漢孳室文鈔",
 "江右紀變",
 "蘇甘室讀說文小識",
 "偁東餓夫傳",
 "憂菴大司馬並夫人合稿",
 "筠菴文選",
 "石家池王氏譜錄",
 "柯山小志",
 "越中園亭記",
 "余忠節公遺文",
 "周節婦志姜詩遺蹟",
 "凌溪丁氏雙烈卷遺蹟一卷",
 "周荊山志雪堂贈言遺蹟",
 "毛西河先生曼殊留視圖冊遺蹟",
 "古永興往哲記",
 "蕭山茂材錄",
 "固陵雜錄",
 "湘湖水利志",
 "金石志存",
 "股堰備攷",
 "明王遂東先生尺牘存本",
 "陳子高遺詩",
 "赤城詞",
 "待清軒遺稿",
 "介石稿",
 "掬清稿",
 "定軒存稿",
 "綠天亭詩集",
 "葵圃存草",
 "地理枝言",
 "小有天園雜著",
 "棣香館詩鈔",
 "廣志繹",
 "見聞隨筆",
 "赤城志",
 "道南書院錄",
 "台學源流",
 "五經論",
 "參易發凡",
 "伊洛淵源續錄",
 "續集別編六卷",
 "赤城新志",
 "赤城後集",
 "古禮樂述",
 "尊鄉錄節要",
 "修復宋理學二徐先生祠墓錄",
 "三國會要",
 "台州藝文略",
 "台州金石略",
 "任蕃小集",
 "項子遷詩",
 "章安集",
 "委羽居士集",
 "丹邱生藁",
 "陳寒山子文",
 "小寒山自序年譜",
 "孤忠遺稿",
 "赤城別集",
 "玉溪吟草",
 "項可立集",
 "兩峰慙草",
 "檜亭稿",
 "楊仲禮集",
 "顧北集",
 "羽庭詩集",
 "東軒集",
 "蒙泉集",
 "一愚集",
 "孫拾遺遺集",
 "一瓢稿賸稿",
 "丹邱生集",
 "圭山近稿",
 "周易傳義存疑",
 "容菴集",
 "寤齋先生遺稿",
 "介山稿略",
 "萬曆仙居縣志",
 "金華叢書書目提要",
 "東萊呂氏古易",
 "周易音訓",
 "書疑",
 "孟子集注考證",
 "青谿寇軌",
 "明朝國初事蹟",
 "旌義編",
 "香谿集",
 "辨譌考異",
 "純白齋類藁",
 "九靈山房遺藁詩",
 "楓山章先生",
 "附實紀",
 "楓山章先生年譜",
 "書集傳或問",
 "義門鄭氏家儀",
 "左氏傳續說",
 "孫威敏征南",
 "金華賢達傳",
 "金華先民傳",
 "義烏人物記",
 "職源撮要",
 "丹溪先生金匱鉤玄",
 "地理葬書集注",
 "野服考",
 "善慧大士傳錄",
 "東萊呂太史文集",
 "金華唐氏遺書",
 "詩解鈔",
 "九經發題",
 "魯軍制九問",
 "愚書",
 "悅齋文鈔",
 "癖齋小集",
 "雲谿稿",
 "敏齋稿",
 "魯齋王文憲公文集",
 "學詩初槀",
 "史詠詩集",
 "存雅堂遺槀",
 "紫巖于先生詩選",
 "竹溪稿",
 "淵穎吳先生集十二卷附錄一卷附考異一卷",
 "吳禮部文集",
 "屏巖小稿",
 "藥房樵唱",
 "樵雲獨唱詩集",
 "白石山房逸稿",
 "瞶齋稿",
 "齊山稿",
 "竹澗先生文集",
 "少室山房類藁",
 "我疑錄",
 "讀古本大學",
 "存悔堂詩草",
 "粲花館詩鈔",
 "詞鈔",
 "集韻考正",
 "劉給諫文集",
 "劉左史文集",
 "艮齋先生薛常州浪語集",
 "水心先生別集",
 "蒙川先生遺稿",
 "開禧德安守城錄",
 "谷艾園文稿",
 "孫太史稿",
 "習學記言序目",
 "芳蘭軒詩集",
 "二薇亭詩集上",
 "二雁山人詩集",
 "諫垣奏議",
 "藕華園詩",
 "六齋卑議",
 "育德堂外制",
 "無冤錄",
 "李詩辨疑",
 "陳文節公（傅良）年譜",
 "紅寇記",
 "墨商",
 "石鼓論語答問",
 "管窺外篇",
 "永嘉先生集",
 "黃文簡公介菴集",
 "泉村詩選",
 "江南徵書文牘",
 "附司鐸箴言",
 "干常侍易注疏證",
 "集證",
 "兩漢博議",
 "畏庵集",
 "章恭毅公集",
 "附詩集目錄",
 "困志集",
 "章恭毅公（綸）年譜",
 "甌濱摘稿",
 "張文忠公集奏疏",
 "半山藏稿",
 "諫垣奏議補遺",
 "珤研齋吟草",
 "敬業堂詩校記",
 "顧亭林詩校記",
 "漱蘭詩葺",
 "鮮庵遺文",
 "莫非師也齋文錄",
 "方國珍寇溫始末",
 "太鶴山人（端木國瑚）年譜",
 "全臺遊記",
 "楊文公逸詩文",
 "忘筌書",
 "詹元善先生遺集",
 "大學集編",
 "中庸集編",
 "論語集編",
 "孟子集編",
 "西山文鈔",
 "謝參軍詩鈔",
 "春秋四傳私考",
 "梅莊遺艸",
 "輶軒博紀續編",
 "豫變紀略",
 "如夢錄",
 "黃谷䜈談",
 "圭塘小藁",
 "孟有涯集",
 "過菴遺稿",
 "李子田詩集",
 "師竹堂集",
 "石魚齋詩選",
 "岳起齋詩存",
 "汴宋竹枝詞",
 "天根文鈔",
 "文法",
 "御定易經通注",
 "周易集解篹疏",
 "易筮遺占",
 "尚書辨解",
 "毛詩原解",
 "春秋非左",
 "名疑集",
 "周易卦圖",
 "周易叢說",
 "易象彙解",
 "春秋榖梁傳",
 "靈臺祕苑",
 "總釋",
 "集千家註杜工部詩集",
 "唐皮日休文藪",
 "鶴年詩集",
 "沔陽州志",
 "內方先生集",
 "巿隱園集",
 "默耕詩選",
 "補希堂文集",
 "玩草園詩鈔",
 "陸文節公奏議",
 "聽春草堂詩鈔",
 "海嶽行吟草",
 "子銘先生遺集",
 "萬里游草殘稿",
 "展碧山房駢體文選",
 "周禮總義",
 "東洲草堂金石跋",
 "隋唐石刻拾遺",
 "北海三攷",
 "敬堂文稿",
 "蠡測彙鈔",
 "唐石經考正",
 "江變紀略",
 "需次燕語",
 "公孫龍子注",
 "十三經拾遺",
 "癸亥紀事",
 "墨楯",
 "尋雲草",
 "元三家易說",
 "校勘續記",
 "周易通略",
 "券易苞",
 "石經考文提要",
 "說文蒙求",
 "宋人小史三種",
 "資治通鑑問疑",
 "明人小史八種",
 "姜氏祕史",
 "明季逸史二種",
 "潯陽紀事",
 "陳節愍公奏稿",
 "咸賓錄",
 "廬山紀事",
 "胡子衡齊",
 "藏一話腴內編",
 "兵跡",
 "喻氏遺書三種",
 "尚論張仲景傷寒論",
 "後篇",
 "寓意草",
 "天仙正理",
 "天問天對解",
 "激書",
 "袁州二唐人集",
 "文標集",
 "四宋人集",
 "九宋人集",
 "飄然集",
 "應齋雜箸",
 "自嗚集",
 "竹林愚隱集",
 "龍雲先生文集",
 "宋宗伯徐清正公存稿",
 "徐清正公年譜",
 "雪坡舍人集",
 "校勘後記",
 "誠齋策問",
 "吉州二義集",
 "梅邊集",
 "澗谷遺集",
 "元二大家集",
 "揭文安公詩集",
 "集文集",
 "四元人集",
 "山窗餘稿",
 "吾吾類稿",
 "張來儀先生集",
 "半廬文稿",
 "明季六遺老集",
 "朱中尉詩集",
 "六松堂詩集",
 "懷葛堂集",
 "外集附錄",
 "髻山文鈔",
 "四照堂文集",
 "校勘記補",
 "溉園詩集",
 "字雲巢文集",
 "耻夫詩鈔",
 "芳洲集",
 "樂庵遺稿",
 "松巢漫稿",
 "寓庵詩集",
 "春雨軒集",
 "僅存集",
 "豫章詩話",
 "舍人集",
 "朝散集",
 "暢谷文存",
 "皇明西江詩選",
 "圖考",
 "宜春張氏所著書二種",
 "芑山文集",
 "綱目續麟彙覽",
 "達觀樓遺箸二種",
 "讀史雜記",
 "自儆錄",
 "萬載李氏遺書四種",
 "禹貢山川考",
 "黑水考證",
 "江源考證",
 "年歷考",
 "四庫著錄江西先哲遺書鈔目",
 "譚襄敏公奏議",
 "譚襄敏公遺集",
 "約書",
 "理學簡言",
 "小學古訓",
 "周易本義註",
 "羣經互解",
 "算畧",
 "重訂三家詩拾遺",
 "楊議郎著書",
 "測天約術",
 "呂氏春秋正誤",
 "楚詞辨韻",
 "端溪硯史",
 "穀梁禮證",
 "附曲江集考證",
 "曲江年譜",
 "附補佚",
 "余襄公奏議",
 "北燕巖集",
 "禮部存稿",
 "蓮鬚閣文鈔",
 "喻園集",
 "翁山文鈔",
 "附佚文輯",
 "皇明四朝成仁錄",
 "附翁山佚文二輯",
 "蒯緱館十一章",
 "太平天囯官書十種",
 "天理要論",
 "太平天囯甲寅四年新曆",
 "太平天囯戊午八年新曆",
 "太平禮制",
 "天父天兄天王太平天囯九年會試題",
 "開國精忠軍師干王洪寶製",
 "資政新編",
 "欽定軍次實錄",
 "誅妖檄文",
 "太平天日",
 "廣州城坊志",
 "六脈渠圖說",
 "瓊臺會稿",
 "備忘錄",
 "海忠介公集",
 "湄丘集",
 "傳芳集",
 "天池草",
 "陳中祕稿",
 "陳檢討集",
 "鍾筠溪集",
 "張事軒集",
 "石湖遺稿",
 "北泉草堂遺稿",
 "梁中丞集",
 "許忠直公遺集",
 "松谿小草",
 "楊齋集",
 "筠心堂文集",
 "闡道堂遺稿",
 "白鶴軒集",
 "志親堂集",
 "抱經閣集",
 "淮海易談",
 "黔遊日記",
 "黔塗略",
 "滇行紀程摘鈔",
 "黔軺紀行集",
 "黔語",
 "雪鴻堂詩蒐逸",
 "敝帚集",
 "桐埜詩集",
 "秋煙草堂詩稿",
 "碧山堂詩鈔",
 "瑟廬詩草",
 "十五弗齋詩存",
 "樹藼背遺詩",
 "春蕪詞",
 "夢硯齋詞",
 "飣餖吟詞",
 "海粟樓詞",
 "影山詞",
 "青田山廬詞",
 "葑煙亭詞",
 "琴洲詞",
 "雪鴻詞",
 "枯桐閣詞",
 "姑聽軒詞",
 "師古堂詞",
 "夢悔樓詞",
 "牟珠詞",
 "弗堂詞",
 "菉猗曲",
 "庚午春詞",
 "黔囊",
 "苗疆聞見錄",
 "都濡備乘",
 "平黔紀略",
 "孫山甫督學文集",
 "補輯雜文",
 "江辰六文集",
 "定齋先生猶存集",
 "汗簡箋正",
 "古音類表",
 "河干問答",
 "定齋河工書牘",
 "塞外紀程",
 "劉貴陽遺稿",
 "黔亂紀實",
 "滌濫軒詩鈔",
 "黔行日記",
 "歸程日記",
 "永城紀略",
 "永牘",
 "訓真書屋詩存",
 "西笑山房詩鈔",
 "黔南集",
 "正安集",
 "西笑山房詩鈔蒐逸",
 "于鍾岳別傳",
 "伯英遺稿",
 "周易標義",
 "觀象反求錄",
 "誦詩小識",
 "詩經原始",
 "齊風說",
 "勿自棄軒遺稿",
 "泰律",
 "韻略易通",
 "等音聲位合彙",
 "切韻正音經緯圖",
 "歌麻古韻攷",
 "滇雲歷年傳",
 "宙載",
 "史筌",
 "武昌紀事",
 "關中奏議全集",
 "滇南山水綱目",
 "滇小紀",
 "滇繫",
 "雲南備徵志",
 "南越遊記",
 "鼎堂金石錄",
 "二艾遺書",
 "艾雲蒼語錄",
 "艾雪蒼語錄",
 "養蒙圖說",
 "鏡譚",
 "道南錄初稿",
 "孝弟錄",
 "續理學正宗",
 "何文貞公千字文",
 "楊劉周三先生語錄合鈔",
 "知陋軒迂談",
 "藏拙居遺文",
 "郁雲語錄",
 "反身要語",
 "存真錄",
 "尚志齋慎思記",
 "訟過記",
 "醫門擥要",
 "滇南本草",
 "信古齋句股一貫述",
 "雜述",
 "籌算法",
 "皇極經世心易發微",
 "澹一齋章譜",
 "介庵印譜",
 "書學印譜",
 "十瓶齋石言",
 "味秋吟館紅書",
 "育書",
 "說緯",
 "增訂發蒙三字經",
 "冷官餘談",
 "滇釋紀",
 "朝天集",
 "聲律發蒙",
 "石淙詩鈔",
 "附諸公詩",
 "楊弘山先生存稿",
 "張愈光詩文選",
 "中谿家傳彙稿",
 "凝翠集",
 "北征集",
 "烟坪詩鈔",
 "居易軒詩遺鈔",
 "文遺鈔",
 "澹生詩鈔",
 "陳翼叔詩集",
 "附石棺集",
 "蒼雪和尚南來堂詩集",
 "擔當遺詩",
 "梅柳詩合刻",
 "呈貢文氏三遺集合鈔",
 "明陽山房遺詩",
 "餘生隨詠",
 "醉禪草",
 "晚春堂詩",
 "讀書堂綵衣全集",
 "釜水吟",
 "賜硯堂詩稿",
 "李中丞遺集",
 "留硯堂詩選",
 "汗漫集",
 "蛻翁詩集",
 "李氏詩存",
 "稜翁詩鈔",
 "鶴峰詩鈔",
 "衣山詩鈔",
 "蘭溪詩鈔",
 "雲華詩鈔",
 "藏密詩鈔",
 "錢南園先生遺集",
 "菉竹堂詩存",
 "拾草堂詩存",
 "芋栗園遺詩",
 "寄庵詩文鈔",
 "西阿先生詩草",
 "附九峯園會詩",
 "漱芳亭詩鈔",
 "師荔扉先生詩集",
 "保山二袁遺詩",
 "陶村詩鈔",
 "時畬堂詩稿",
 "點蒼山人詩鈔",
 "觸懷吟",
 "小清閟閣詩鈔",
 "樂山集",
 "紅茗山房詩存",
 "喜聞過齋文集",
 "程月川先生遺集",
 "藍尾軒詩稿",
 "即園詩鈔",
 "玉案山房詩草",
 "鄧虹橋遺詩",
 "王眉仙遺著",
 "雪樓詩選",
 "朱丹木詩集",
 "晚翠軒詩鈔",
 "三鈔",
 "四鈔",
 "五鈔",
 "漫稿",
 "味雪齋詩鈔",
 "文鈔甲集",
 "抱真書屋詩鈔",
 "賡縵堂集",
 "知蔬味齋詩鈔（一名蜀游草）",
 "何文貞公遺書",
 "補輯朱子大學講義",
 "何文貞公文集",
 "趙文恪公遺集",
 "廿我齋詩稿",
 "呈貢二孫遺詩",
 "抱素堂遺詩",
 "吉人詩鈔",
 "思過齋雜體詩存",
 "一笑先生詩鈔",
 "悔齋詩稿",
 "補過齋遺集",
 "李叔豹遺詩",
 "陶詩彙注",
 "五塘詩草",
 "五塘雜俎",
 "穆清堂詩鈔",
 "天船詩集",
 "香雪館遺詩",
 "思亭詩鈔",
 "選詩補遺",
 "滇南詩畧",
 "滇南文畧",
 "滇詩嗣音集",
 "麗郡詩徵",
 "文徵",
 "滇詩重光集",
 "律髓輯要",
 "滇詩拾遺",
 "滇詩拾遺補",
 "明滇南五名臣遺集",
 "楊文襄公文集",
 "孫清愍公文集",
 "楊文毅公文集",
 "傅忠壯公文集",
 "王忠節公文集",
 "明雷石菴胡二峯遺集合刊",
 "雷石菴尚書遺集",
 "胡二峯侍郎遺集",
 "滇文叢錄",
 "總目",
 "作者小傳",
 "滇詞叢錄",
 "蔭椿書屋詩話",
 "酌雅詩話",
 "藥欄詩話",
 "詩法萃編",
 "詩譜詳說",
 "筱園詩話",
 "太極明辯",
 "卦極圖說",
 "泰律補",
 "六書綱目",
 "切音導原",
 "重葺楊文襄公事畧",
 "趙忠愍公景忠集",
 "尹楚珍年譜",
 "明贈光祿寺卿路南楊公忠節錄",
 "盤龍山紀要",
 "行先遺稿",
 "晚聞齋稿待焚錄",
 "鑑辨小言",
 "楊林兩隱君集",
 "蘭隱君集",
 "賈隱君集",
 "桃川剩集",
 "雪山詩選",
 "大錯和尚遺集",
 "撫松吟集",
 "馬悔齋先生遺集",
 "檢齋遺集",
 "七峯詩選",
 "昭文遺詩",
 "二餘堂文稿",
 "袁陶村文集",
 "五之堂詩鈔",
 "岩泉山人詩四選存稿",
 "次民詩稿",
 "不冷堂遺集",
 "夢亭遺集",
 "彊靜齋詩錄",
 "劍川羅楊二子遺詩合鈔",
 "夢蒼山館遺詩",
 "惜春山房遺詩",
 "向湖村舍詩二集",
 "李太白詩選",
 "楊文憲公寫韻樓遺像題詞彙鈔",
 "錢南園先生守株圖題詞錄",
 "味燈詩話",
 "乾隆宣威州志",
 "咸同宣威大事記",
 "可鑒編稿存",
 "三朝紀略",
 "退思錄",
 "楚辭輯解正編",
 "湘亭詩鈔",
 "書法碎語",
 "清沙吟草",
 "養齋集",
 "丁節母詩存",
 "禮經小識",
 "汶叟詩存",
 "梁溪遺稿",
 "萬柳溪邊近話",
 "述祖詩",
 "錫山尤氏文存",
 "性善繹",
 "東遊紀",
 "寧澹居奏議",
 "寧澹居遺文",
 "寧澹語",
 "職方舊草",
 "撫楚疏稿",
 "撫楚公牘",
 "知生或問",
 "西庫隨筆",
 "芻蕘小言",
 "嚮言",
 "膝寓信筆",
 "稽古堂文集",
 "汗青閣文集",
 "方齋小言",
 "關西講堂客問",
 "方齋補莊七篇",
 "褚堂文集",
 "海若遺稿",
 "向若水公（佳允）年譜",
 "鄉會試策判墨藝",
 "容臺佐議",
 "珵美堂集",
 "沙上集",
 "沙上吟",
 "書牘雜著",
 "向若水公政蹟行述崇祀錄",
 "水氏傳經世系表",
 "續震澤紀聞",
 "郢事紀略",
 "高郵王氏六葉傳狀碑誌集",
 "輶軒使者絕代語釋別國方言疏證補",
 "釋大",
 "古韻譜",
 "王文肅公遺文",
 "王石臞先生遺文",
 "王文簡公文集",
 "周易論語同異辨",
 "青箱餘論",
 "謙齋初集",
 "遺園詩餘",
 "蝨隱庵雜作",
 "澹雅居小草",
 "枚蓀遺草",
 "蒙齋年譜",
 "古歡堂集",
 "水東草堂詩",
 "鬲津草堂詩",
 "有懷堂文集一卷詩集一卷",
 "西圃叢辨",
 "西圃文說",
 "硯思集",
 "安德明詩選遺",
 "二學亭文涘",
 "晚香詞",
 "安孟公手訂文稿",
 "夏時考",
 "眾香閣文稿不分卷詩艸",
 "觀復堂稿略",
 "無欺錄",
 "西亭詩",
 "非庵雜著",
 "閒評",
 "花甲自譜",
 "族譜誌畧",
 "春星堂詩集",
 "隨喜盦集",
 "綺詠",
 "綺詠續集",
 "夢草",
 "聽雪軒集",
 "遊草",
 "閩遊詩紀",
 "松溪集",
 "夢香樓集",
 "延芬堂集",
 "詹詹集",
 "重閬齋集",
 "夕秀齋詩鈔",
 "春星堂續集",
 "水亭詩存",
 "礀村集",
 "樸樹廬剩稿",
 "水葒花館詩鈔",
 "劫餘草",
 "香詞",
 "凭隱詩餘",
 "重閬齋文集",
 "上湖紀歲詩編",
 "上湖分類文編",
 "觀象居易傳箋",
 "孝經約義",
 "孫文志疑",
 "蘇詩選評箋釋",
 "韓門綴學",
 "金絲錄",
 "葉戲原起",
 "詩序辨正",
 "遠春樓讀經筆存",
 "遠春樓四史筆存",
 "徵信錄",
 "容甫先生（汪中）年譜",
 "廣陵通典",
 "先君年表",
 "汪氏學行記",
 "附壽母小記",
 "孤兒編",
 "大戴禮記正誤",
 "喪服答問紀實",
 "讀經心解",
 "兼山堂文集",
 "湘夢詞",
 "鎏山賸稿",
 "借箸雜俎",
 "先祖通奉府君遺槀",
 "東吳名賢記",
 "馬鞍山志",
 "海門先正鄉諡表",
 "冒伯麐先生集",
 "增定存笥小草",
 "簡兮堂文賸",
 "香儷園偶存",
 "寒碧孤吟",
 "泛雪小草",
 "集美人名詩",
 "岕荼彙鈔",
 "樸巢詩選",
 "巢民詩集",
 "鹿樵集葺",
 "鑄錯軒詩葺",
 "寒碧堂詩葺",
 "枕煙亭詩葺",
 "婦人集注",
 "婦人集補",
 "葚原詩說",
 "前後元夕讌集詩",
 "枕干錄",
 "永嘉高僧碑傳集",
 "鉢池山志",
 "疚齋小品",
 "哥窯譜",
 "青田石考",
 "戲言",
 "癸卯大科記",
 "于役東陵記",
 "扈從親耕記",
 "風懷詩案",
 "莽鏡釋文",
 "謝康樂集拾遺",
 "謝康樂集校勘記",
 "和謝康樂詩",
 "如皐冒氏詩畧",
 "詞畧",
 "冒得庵參議（鸞）年譜",
 "冒嵩少憲副（起宗）年譜",
 "冒巢民徵君（襄）年譜",
 "同人集補",
 "小三吾亭文甲集",
 "冠柳詞",
 "五周先生集",
 "蟄室詩錄",
 "訒庵遺稿",
 "鷗堂賸稿",
 "窳櫎詩質",
 "四洪年譜",
 "洪忠宣公（皓）年譜",
 "洪文惠公（适）年譜",
 "洪文安公（遵）年譜",
 "洪文敏公（邁）年譜",
 "豫章三洪集",
 "清非集",
 "空洞詞",
 "杏庭摘稾",
 "易說醒",
 "洪廬江祀典徵實",
 "研六室文鈔",
 "古韻論",
 "詩古音繹",
 "瞻闋集虛",
 "論書絕句",
 "養拙齋詩存",
 "守拙齋詩存",
 "筆耕錄",
 "伯子詩稿",
 "江村集",
 "福履理路詩鈔",
 "上武詩鈔",
 "秋山文存",
 "中庸淺說",
 "老子學辨",
 "老子補註",
 "莊子集解補正",
 "列子張湛註補正",
 "淮南集解補正",
 "惠施詭辯新解",
 "太白國籍問題",
 "王念孫讀書雜誌正誤",
 "札迻正誤",
 "南香詩鈔",
 "南香畫語",
 "隨感錄",
 "丹溪詩鈔",
 "丹溪文鈔",
 "胡氏家乘",
 "巢雲軒詩鈔",
 "附越吟草",
 "函清館詩草",
 "四書述",
 "左類初定",
 "繭屋詩草",
 "退白居士詩草",
 "鄂不詩詞",
 "駢文",
 "銘贊",
 "鄂不齋筆記",
 "臺陽見聞錄",
 "澹吾室詩鈔",
 "誦芬集",
 "陰符經考",
 "荊川公佚文",
 "桃溪札記",
 "皇明輔世編",
 "太常遺著常州府志人物志",
 "太常遺著",
 "唐氏先世遺文",
 "唐氏家乘誌傳擷華",
 "唐荊川公著述考",
 "唐氏先世著述考",
 "荊川弟子考",
 "荊川學脈",
 "清大司馬薊門唐公（執玉）年譜",
 "悔言",
 "悔言辨正",
 "詩序辨",
 "讀禮私記",
 "衰說考誤",
 "寤言質疑",
 "庭聞憶略",
 "附竹坡先生遺文",
 "晁文元公道院集要",
 "具茨晁先生詩集",
 "磧東集錄",
 "白厓集",
 "倚雲樓遺集",
 "談資",
 "白雲山樓集",
 "零芬集",
 "歷代都江堰功小傳",
 "蜀辛",
 "棡蠶通說",
 "四休堂逸稿",
 "野語",
 "端敏公集奏議",
 "函牘",
 "中議公事實紀略",
 "自乂瑣言",
 "文誠公奏議",
 "文稿拾遺",
 "詩稿拾遺",
 "閣學公公牘",
 "書札",
 "書札錄遺",
 "雪鴻吟社詩鐘",
 "聯語錄存",
 "袁氏家書",
 "母德錄",
 "馬文莊公文集選",
 "附敍述",
 "四六雕蟲",
 "燼餘志過錄",
 "卷石齋語錄",
 "南華瀝滴萃",
 "崇祀鄉賢祠錄",
 "勿待軒文集存槀",
 "關西馬氏世行錄",
 "又續錄之餘",
 "南苑一知集論詩",
 "南苑一知集叢談",
 "山對齋文詩存稿",
 "小坡識小錄",
 "護送越南貢使日記",
 "再送越南貢使日記",
 "釋命",
 "奏略",
 "翊翊齋遺書",
 "翊翊齋筆記",
 "翊翊齋文鈔",
 "翊翊齋詩鈔",
 "春秋輯說彙解",
 "淡和堂經說",
 "芝亭舊稿",
 "小亭信口吟",
 "遲悔齋年譜",
 "洛學拾遺補編",
 "遲悔齋經說",
 "遲悔齋文鈔",
 "交遊錄",
 "獵微閣詩集",
 "碧摩亭集",
 "槐墅詩鈔",
 "綠淨軒詩鈔",
 "許文穆公集",
 "復庵先生集",
 "石泉集",
 "天開圖畫樓文稿",
 "變雅斷章衍義",
 "嘐嘐言",
 "說雲樓詩草",
 "惜齋吟草",
 "吟草別存",
 "匏廬詩存",
 "賸草",
 "再愧軒詩草",
 "郭文安公奏疏",
 "樓居偶錄",
 "邴廬日記",
 "屈辭精義",
 "漢詩統箋",
 "漢樂府三歌牋註",
 "急就探奇",
 "協律鉤元",
 "竹書紀年集證",
 "逸周書補注",
 "穆天子傳注補正",
 "讀騷樓詩初集",
 "筠碧山房詩集",
 "求在我齋文集",
 "桃花扇傳奇後序詳註",
 "易義纂釋",
 "易理蒙訓",
 "易說摘存",
 "李氏蒙求詳註",
 "養性齋經說",
 "性理闡說",
 "陳心泉文稿",
 "賜葛堂試帖",
 "左海文集",
 "絳跗草堂詩集",
 "左海文集乙編",
 "五經異義疏證",
 "左海經辨",
 "東越儒林後傳",
 "東越文苑後傳",
 "東觀存稿",
 "三家詩遺說攷",
 "魯詩遺說攷",
 "齊詩遺說攷",
 "韓詩遺說攷",
 "詩經四家異文攷",
 "今文尚書經說攷",
 "禮記鄭讀攷",
 "毛詩鄭箋改字說",
 "齊詩翼氏學疏證",
 "詩緯集證",
 "禮堂經說",
 "禮堂遺集",
 "禦侮備覽",
 "附江海備覽外編",
 "黔滇紀略",
 "倚棹閒吟",
 "拜五經樓詩賦",
 "拜五經樓試帖",
 "拜五經樓試言",
 "半繭集",
 "述楊合刻",
 "吟巢遺稿",
 "香雪山房遺稿",
 "方房詩賸",
 "荻存小詠史",
 "讀史小識",
 "味蓴鱸軒詩鈔",
 "戊庚隨筆",
 "味蓴鱸軒遺文",
 "冷氊漫稾",
 "讀未見書齋文鈔",
 "月圃詩存",
 "月圃偶著",
 "客窗偶吟",
 "淡安遺文",
 "問花樓詩鈔",
 "問花樓詩話",
 "問花樓詞話",
 "陸氏先德錄",
 "傅鶉觚集",
 "傅中丞集",
 "傅蘭臺集",
 "晉諸公敍讚",
 "晉公卿禮秩故事",
 "續文章志",
 "南畇全集",
 "南畇詩稾",
 "文稾",
 "小題文稿",
 "南畇老人自訂年譜",
 "儒門法語輯要",
 "密證錄",
 "姚江釋毀錄",
 "不諼錄",
 "芝庭先生集",
 "蘭臺遺藁",
 "芸暉小閣吟草",
 "秋士先生遺集",
 "測海集",
 "彭文敬公全集",
 "詒穀老人自訂年譜",
 "歸樸龕叢稿",
 "松風閣詩鈔",
 "鶴和樓制義",
 "話陶窗遺稿",
 "板輿迎養圖詩",
 "四書解",
 "書經說",
 "曾氏遺書續錄",
 "樂山堂詩鈔",
 "在山草",
 "出山草",
 "樂山堂文鈔",
 "重訂唐說硯考",
 "樂山堂縹緗新記",
 "蒼源剩草",
 "森齋彙稿",
 "森齋雜葅",
 "史繹",
 "周官序論",
 "古史序論",
 "道學世系",
 "鴻文補擬",
 "惜字三宜",
 "金汀拾遺",
 "允都名教錄",
 "綠野莊詩草",
 "麗亭遺草",
 "營田輯要內篇",
 "崇祀鄉賢錄",
 "黃輔相行狀",
 "循良錄",
 "審巖文集",
 "史漢箋論",
 "翰墨巵言",
 "世恩堂文鈔",
 "介石文集",
 "改定井田溝洫圖說",
 "中峯集",
 "中峯制藝",
 "大易牀頭私錄",
 "大學大意",
 "中庸大意",
 "老子翼評點",
 "莊子翼評點",
 "唐李長吉詩集",
 "天籟集鈔存",
 "獨石軒詩逸存",
 "藝苑古文稿",
 "春秋繁露集註",
 "吳太夫人（董金鑑母）年譜",
 "添丁小酉之廬詩草",
 "附楚生文存",
 "梅山夢草",
 "公文緣起",
 "天涯行乞圖題辭",
 "故城賈氏手澤彙編",
 "孟門草",
 "椿莊文輯",
 "璧雲軒賸稿",
 "退厓日劄",
 "叩槃集",
 "接護越南貢日記",
 "郡齋筆乘",
 "退厓公牘文字",
 "鄉賢公遺著",
 "耕雲別墅詩話",
 "耕雲別墅詩集",
 "達菴隨筆",
 "明珠",
 "吉祥錄",
 "智因閣詩集",
 "立德堂詩話",
 "求可堂家訓",
 "求可堂自記",
 "南雲書屋文鈔",
 "紫陽書院題解",
 "世美堂詩鈔",
 "世美堂文鈔",
 "皇綱錄",
 "建文年譜",
 "甲申秋杪山僧問答",
 "逸史三傳",
 "擴廓帖木兒列傳",
 "北虜三娘子列傳",
 "毛文龍孔有德列傳",
 "萊史",
 "石室談詩",
 "後漢書札記",
 "建譜誌餘",
 "歷代綸音",
 "東萊趙氏先世酬唱集",
 "東萊趙氏先世學行記",
 "天傭館遺稿",
 "抱膝廬文集",
 "中洲道學存真錄",
 "襄城文獻錄",
 "慎獨軒文集",
 "劉嘯林史論",
 "高陽山人文集",
 "金石續錄",
 "七一軒稾卷附圖",
 "藕船題跋",
 "古今孝友傳",
 "學禮闕疑",
 "七一軒詩鈔",
 "續一鄉雅言",
 "江村山人未定稾",
 "稾藁",
 "閏餘稾",
 "尚書辨疑",
 "周禮質疑",
 "史記紀疑",
 "史漢異同是非",
 "古氾城志",
 "擬明代人物志",
 "古今孝友傳補遺",
 "續錦機",
 "江村隨筆",
 "鴻齋文集",
 "雪夜錄",
 "獨學齋詩集",
 "遂初齋文集",
 "漢晉迄明諡彙攷",
 "皇朝諡彙攷",
 "歷代同姓名錄",
 "崇川書香錄",
 "有深致軒集",
 "有深致軒文稿",
 "駢體文稿",
 "詩賸稿",
 "歌謠剩稿",
 "聯語剩稿",
 "試帖剩稿",
 "制藝稿",
 "四書存參",
 "經義存參",
 "高風集",
 "夢園初集",
 "夢園詩集",
 "公牘文集",
 "駢體文集",
 "聯語",
 "夢園制藝",
 "律賦",
 "試帖",
 "經藝",
 "書藝",
 "夢園經解",
 "五經約注",
 "周易約注",
 "尚書約注",
 "毛詩約注",
 "春秋三傳約注",
 "論語約注",
 "論語地考",
 "論語人考",
 "五經讀本",
 "論語分編",
 "孟子可讀",
 "儀禮可讀",
 "周禮可讀",
 "禮記可讀",
 "九經約解",
 "周官約解",
 "儀禮約解",
 "禮記約解",
 "左傳約解",
 "公羊約解",
 "穀梁約解",
 "孝經約解",
 "爾雅約解",
 "孟子約解",
 "孟子人考",
 "夢園史學",
 "戰國策約選",
 "循吏補傳",
 "列女補傳",
 "祥符風土記",
 "祥符耆舊傳",
 "吏視",
 "夢園二集",
 "劉氏家禮",
 "夢園公牘文稾",
 "夢園蒙訓",
 "獻縣劉氏懿行錄",
 "景廉堂（劉廷楠）年譜",
 "景廉堂偶一草拾遺",
 "山外山房詩集",
 "滌濫軒詞殘稿",
 "滌濫軒文殘稿",
 "滌濫軒說經殘稿",
 "滌濫軒雜著",
 "四書集字",
 "江左王謝世系考",
 "黔粵接壤里數考",
 "繡佛齋詩鈔",
 "攖寧齋詩草",
 "古遺詩鈔",
 "古光片羽錄",
 "耕饁倡隨錄",
 "蔭餘齋詩草",
 "古塤攷釋",
 "蘭陔絜養圖詠",
 "家慶圖詠",
 "拙速詩存",
 "使滇日記",
 "丙午使滇日記",
 "竹山堂聯語",
 "碧雲仙館吟草",
 "鄭盦詩存",
 "己丑恩科鄉試監臨紀事",
 "附武鄉試監臨紀事",
 "潘氏一家言",
 "習虛堂草",
 "研香堂遺草",
 "草綠書窗賸稿",
 "二十四琅玕仙館詩鈔",
 "浮白小草",
 "爛存詩鈔",
 "桐西書屋詩鈔",
 "迦蘭陀室詩鈔",
 "澫花香榭吟草",
 "燕庭遺稿",
 "笏盦集詩",
 "養閒草堂圖記",
 "橫塘泛月圖記",
 "霜厓詞錄",
 "霜厓詩錄",
 "雙硯齋詩鈔",
 "詩雙聲叠韻譜",
 "許氏說文雙聲叠韻譜",
 "雙硯齋筆記",
 "空一切盦詞",
 "晴花暖玉詞",
 "津陽門詩",
 "逍遙先生遺詩",
 "虛舟詞餘",
 "忍園先生家訓",
 "省心雜錄",
 "白田鄭氏遺集",
 "寶應鄭氏家譜",
 "寶應鄭氏贈言錄",
 "通甫類藁文",
 "通甫詩存",
 "詩存之餘",
 "右軍（王羲之）年譜",
 "補過軒四書文",
 "仲實類稾",
 "仲實詩存",
 "蘇常日記",
 "天逸道人存稿",
 "使豫日記",
 "超覽樓詩稿",
 "瓊臺紀事錄",
 "求治管見",
 "續增",
 "靈芝唱答集",
 "東牟守城紀略",
 "東牟守城詩",
 "瑞芝山房詩鈔",
 "聽鸝山館文鈔",
 "宋史夏國傳集註",
 "系表",
 "西夏國書略說",
 "西夏文存",
 "遼文續拾",
 "彙目",
 "小學考補目",
 "印譜考",
 "憨山老人年譜自敍實錄",
 "曹溪中興憨山肉祖後事因緣",
 "附東遊集法語",
 "譚子雕蟲",
 "校補闕文",
 "埽庵集",
 "肅松錄",
 "鴛鴦湖櫂歌",
 "康熙弋陽縣志節本",
 "碧漪集",
 "玉笥山房要集",
 "北征日記",
 "灤水聯碒圖題詩彙存",
 "鶴巢詩存",
 "介卿遺艸",
 "鶴巢老人語錄",
 "衍洛圖說",
 "孟晉齋文集",
 "周列士傳",
 "漱塵室集詩",
 "太極圖說發明",
 "太極圖說通書發明",
 "周子遺文併詩",
 "周子遺事",
 "列代褒崇",
 "王安石年譜",
 "附遺事",
 "王安石文集",
 "王安石詩集",
 "考工記解",
 "米襄陽志林",
 "米襄陽遺集",
 "海嶽名言",
 "東銘",
 "經學理窟",
 "語錄抄",
 "文集抄",
 "論語雜解",
 "孟子雜解",
 "中庸義",
 "錄二程先生語",
 "遺文遺詩",
 "中庸輯畧",
 "論語或問",
 "孟子或問",
 "省齋文稾",
 "平園續稾",
 "省齋別稾",
 "詞科舊稾",
 "掖垣類稾",
 "玉堂類稾",
 "政府應制稾",
 "歷官表奏",
 "奉詔錄",
 "承明集",
 "雜著述",
 "辛巳親征錄",
 "壬午龍飛錄",
 "癸未歸廬陵日記",
 "泛舟遊山錄",
 "庚寅奏事錄",
 "壬辰南歸錄",
 "思陵錄",
 "唐昌玉蕊辨證",
 "書稾",
 "放翁逸稾",
 "劍南詩稾",
 "齋居紀事",
 "南軒文集",
 "南軒先生論語解",
 "南軒先生孟子說",
 "北溪先生講義",
 "北溪先生書問",
 "北溪先生答問",
 "北溪先生各體文",
 "北溪先生各體詩",
 "北溪先生外集",
 "北溪先生全集補遺",
 "西山先生眞文忠公讀書記",
 "文章正宗復刻",
 "西山先生眞文忠公文集",
 "眞文忠公心經",
 "眞文忠公政經",
 "西山眞文忠公年譜",
 "諸賢酬贈詩",
 "投贈詩詞補遺",
 "集事補遺",
 "補宋潛溪唐仲友補傳",
 "指南錄",
 "詩史集杜",
 "紀年錄",
 "檀弓解",
 "漢蓺文志攷證",
 "踐阼篇集解",
 "周書王會補注",
 "王深寧（應麟）先生年譜",
 "宋金仁山先生大學疏義",
 "論語集註攷證",
 "孟子集註攷證",
 "資治通鑑前編",
 "宋仁山金先生年譜",
 "金華呂東萊先生正學編",
 "金華何北山先生正學編",
 "金華王魯齋先生傳集",
 "白雲先生許文懿公傳集",
 "金華章楓山先生正學編",
 "金華徵獻畧",
 "元遺山先生集",
 "元遺山先生新樂府",
 "元遺山先生年譜",
 "元遺山先生集考證",
 "小學大義",
 "大學要略",
 "中庸直解",
 "陰陽消長論",
 "揲蓍說",
 "書狀",
 "稽古千文",
 "編年歌括",
 "授時歷經",
 "曹月川先生家規輯畧",
 "曹月川先生錄粹",
 "曹月川先生語錄",
 "曹月川先生（端）年譜",
 "頌言",
 "明儒曹月川先生從祀錄",
 "劉文安公文集",
 "劉文安公詩集",
 "劉文安公呆齋先生策畧",
 "易經圖釋",
 "易傳撮要",
 "宋史論",
 "三朝奏議",
 "陸學訂疑",
 "貞觀小斷",
 "餘冬敍錄內篇",
 "閏",
 "燕泉何先生遺藁",
 "理學集",
 "經濟集",
 "文章集",
 "詩文集",
 "畫譜",
 "制義",
 "墨亭新賦",
 "花隖聯吟",
 "浚川內臺集",
 "慎言",
 "浚川奏議集",
 "浚川公移集",
 "浚川駁稿集",
 "喪禮備纂",
 "程志",
 "大學全文通釋",
 "中庸凡",
 "皇明理學名臣言行錄",
 "聲律啟蒙",
 "新增發蒙古今巧對",
 "聖學格物通",
 "湛甘泉先生文集",
 "河汾燕閒錄",
 "淮封日記",
 "南遷日記",
 "停驂錄",
 "豫章漫抄",
 "中和堂隨筆",
 "史通會要",
 "春雨堂雜抄",
 "書輯",
 "大學指歸",
 "周禮沿革傳",
 "春秋經世",
 "經世策",
 "官職會通",
 "三一測",
 "太極枝辭",
 "宋學商求",
 "景行館論",
 "眞談",
 "一菴語錄",
 "酬物難",
 "轄圜窩雜著",
 "感學篇",
 "積承錄",
 "因領錄",
 "六咨言",
 "疑誼偶述",
 "易修墨守",
 "春秋讀意",
 "嘉禾問錄",
 "證道篇",
 "周禮因論",
 "政問錄",
 "法綴",
 "病榻答言",
 "未學學引",
 "海議",
 "列流測",
 "偶客談",
 "遊錄",
 "激衷小擬",
 "唐一庵先生年譜",
 "梓溪文鈔外集",
 "梓溪文鈔內集",
 "易箋問",
 "太極繹義",
 "通書繹義",
 "東觀錄",
 "周禮定本",
 "鄭端簡公奏議",
 "鄭端簡公文集",
 "徵吾錄",
 "吾學編",
 "大政記",
 "皇明遜國記",
 "同姓諸王表",
 "異姓三王孔氏世家",
 "異姓諸侯表",
 "直文淵閣諸臣表",
 "兩京典詮表",
 "名臣記",
 "遜國臣記",
 "天文述",
 "地理述",
 "三禮述",
 "百官述",
 "北虜考",
 "衡門集",
 "鄭端簡公年譜",
 "訥溪奏疏",
 "訥溪文錄",
 "訥溪詩錄",
 "訥溪尺牘",
 "訥溪雜錄",
 "訥溪年譜",
 "東里高氏世恩錄",
 "獻忱集",
 "程士集",
 "玉堂公草",
 "南宮奏牘",
 "綸扉稿",
 "掌銓題藁",
 "國學訓諸生十二條",
 "適園襍著",
 "陸學士題跋",
 "禪林餘藻",
 "陸氏家訓",
 "善俗裨議",
 "姓匯",
 "古俗字略",
 "漢碑用字",
 "俗用雜字",
 "五經異文",
 "采薇集",
 "邕歈稿",
 "奇游漫記",
 "淮海易譚",
 "四書近語",
 "教秦緒言",
 "幽心瑤草",
 "學孔精舍詩鈔",
 "關洛紀游稿",
 "附歸田倡酬稿",
 "學圃雜疏（花疏）",
 "三郡圖說",
 "王氏父子卻金傳",
 "遠壬文",
 "澹思子",
 "名山游記八種",
 "京口遊山記",
 "游匡廬山記",
 "東游記",
 "游二泉記",
 "游鼓山記",
 "游石竹山記",
 "游九鯉湖記",
 "游溧陽彭氏園記",
 "經子臆解",
 "望崖錄內編",
 "夢蕉存稿",
 "博物志補",
 "思玄堂集",
 "旅燕集",
 "浮淮集",
 "軺中稿",
 "廣陵儲王趙朱景蔣曾桑朱宗列傳",
 "游梁集",
 "南翥集",
 "北轅草",
 "癰館集",
 "西署集",
 "秣陵集",
 "詔歸集",
 "蘧園集",
 "歐虞部文集",
 "都下贈言錄",
 "李英集",
 "李英詩",
 "餐霞集",
 "歷游集",
 "當壚集",
 "朱秉器文集",
 "河上楮談",
 "汾上續談",
 "浣水續談",
 "游宦餘談",
 "文所易說",
 "詩臆",
 "左氏討",
 "左氏論",
 "黔中程式",
 "黔中語錄",
 "續語錄",
 "石湖稿",
 "金閶稿",
 "四禮疑",
 "喪禮餘言",
 "呂新吾先生閨範圖說",
 "演",
 "女小兒語",
 "交泰韻",
 "宗約歌",
 "好人歌",
 "反輓歌",
 "新吾呂君墓誌銘",
 "河工書",
 "省心紀",
 "天日",
 "修城",
 "展城或問",
 "疹科",
 "呂新吾先生去偽齋文集",
 "呂新吾先生實政錄",
 "大學正說",
 "中庸正說",
 "正心會前漢書抄",
 "正心會後漢書抄",
 "上醫本草",
 "離騷經訂註",
 "目前集",
 "夢白先生集",
 "芳茹園樂府",
 "嘉祐集選",
 "教家二書",
 "三字經註",
 "女兒經註",
 "曹大家女誡直解",
 "味檗齋遺筆",
 "趙忠毅公閒居擇言",
 "笑贊",
 "先君趙冢宰忠毅公行述",
 "臺中疏草",
 "廷中疏草",
 "黔中疏草",
 "鎮沅紀畧",
 "撫黔紀畧",
 "家居小適",
 "山居小適",
 "鎮沅懷德錄",
 "撫黔紀別錄",
 "論定錄",
 "小心齋劄記",
 "東林會約",
 "東林商語",
 "虞山商語",
 "仁文商語",
 "南岳商語",
 "經正堂商語",
 "志矩堂商語",
 "當下繹",
 "證性編",
 "還經錄",
 "自反錄",
 "涇皋藏稿",
 "顧端文公年譜",
 "訓兒俗說",
 "靜坐要訣",
 "祈嗣眞銓",
 "袁生懺法",
 "淨行別品",
 "河圖洛書解",
 "勸農書",
 "皇都水利",
 "詩外別傳",
 "曆法新書",
 "寶坻政書",
 "周易孔義",
 "東林書院會語",
 "程子節錄",
 "朱子節要",
 "高子文集",
 "辨學錄",
 "疑思錄",
 "訂士編",
 "關中士夫會約",
 "學會約",
 "士戒",
 "諭俗",
 "寶慶語錄",
 "善利圖說",
 "太華書院會語",
 "池陽語錄",
 "關中書院語錄",
 "馮氏族譜",
 "馮氏家乘",
 "關學編",
 "問易補",
 "學易枝言",
 "毛詩序說",
 "四書攝提",
 "時習新知",
 "閑邪記",
 "諫草",
 "小山草",
 "嘯歌",
 "藝圃傖談",
 "史漢愚按",
 "四書制義",
 "批點左氏新語",
 "批點史記瑣瑣",
 "批點前漢書瑣瑣",
 "批點後漢書瑣瑣",
 "批點三國志瑣瑣",
 "批點晉書瑣瑣",
 "批點南史瑣瑣",
 "批點北史瑣瑣",
 "批點舊唐書瑣瑣",
 "批點杜工部詩",
 "環碧齋詩",
 "祝子小言",
 "環碧齋尺牘",
 "官制備攷",
 "輿圖摘要",
 "姓氏譜纂",
 "時物典彙",
 "四六類編",
 "狂言",
 "敝篋集",
 "破研齋集",
 "桃源詠",
 "華嵩遊草",
 "避園擬存詩集",
 "時文敍",
 "歷游紀",
 "廬游雜詠",
 "游廬山記",
 "中庸外傳",
 "顧氏小史",
 "壺天吷語",
 "遯居士批莊子內篇",
 "遯園漫稿",
 "蟄庵日錄",
 "遯居士戲墨",
 "會語",
 "易衍",
 "證學解",
 "原旨",
 "伊川草",
 "汝海稿",
 "南國講錄",
 "孔邇錄",
 "天津稿",
 "于邁錄",
 "雲萬藥溪談",
 "太紫草",
 "于役錄",
 "太微堂目錄",
 "伏羲圖贊",
 "附雜卦傳古音考",
 "附讀詩拙言",
 "松軒講義",
 "謬言",
 "書札燼存",
 "意言",
 "五嶽遊草",
 "兩粵遊草",
 "寄心集",
 "一齋陳先生考終錄",
 "附雜文",
 "精騎錄",
 "篔窗筆記",
 "賢奕選",
 "文字禪",
 "異史",
 "博識",
 "尊重□",
 "養生醍醐",
 "理譚",
 "騷壇千金訣",
 "說書",
 "焚書",
 "李氏續焚書",
 "李溫陵外紀",
 "燕市集",
 "青雀集",
 "金昌集",
 "晉陵集",
 "青苕集",
 "采真編",
 "梅花什",
 "坐隱先生訂碁譜",
 "題贈",
 "坐隱先生集",
 "坐隱園戲墨",
 "晚香堂集",
 "眉公詩鈔",
 "眉公見聞錄",
 "偃曝餘談",
 "藜編唾餘",
 "宦舄波餘",
 "園居隨抄",
 "存笥蠹餘",
 "兩闈試牘",
 "越屐紀遊",
 "虞屐紀遊",
 "重建羅星亭紀略",
 "里言",
 "安陽張承小說",
 "家塾私言",
 "張石河文稿",
 "別縣思錄",
 "張氏風范",
 "春浮園詩集",
 "春浮園文集",
 "南歸日錄",
 "春浮園偶錄",
 "庚午偶錄",
 "辛未偶錄",
 "深牧菴日涉錄",
 "蕭齋日紀",
 "牘雋",
 "客椒自刪",
 "再刪",
 "山椒戲筆",
 "腐史",
 "青未了",
 "紀遊合刻",
 "客還草",
 "司馬悔",
 "罌存",
 "閉戶吟",
 "客心草",
 "秣陵秋",
 "題紅",
 "年評社集",
 "東園公草",
 "率豆社約",
 "家山遊",
 "結廬草",
 "香奩限韻",
 "刪社和草",
 "史記論略",
 "自監錄",
 "詠史樂府",
 "和陶詩",
 "存誠錄",
 "自怡草",
 "鶴鳴集",
 "拈花錄",
 "玉版錄",
 "學言詳記",
 "因述",
 "陳祠部公家傳",
 "續學言",
 "隨時問學再集",
 "幾亭續文錄",
 "羅紋山文集",
 "京音集",
 "羅紋山詩餘",
 "史旁",
 "侮莊",
 "井福錄",
 "地理微緒",
 "漢上末言",
 "襄邑實錄",
 "寓楚雜著",
 "公羊墨史",
 "南華真經影史",
 "離騷草木史",
 "離騷拾細",
 "聖雨齋詩文集",
 "問魚篇",
 "嚶鳴錄",
 "循吏傳",
 "引年錄",
 "志幻錄",
 "棲山堂集",
 "熹朝忠節死臣列傳",
 "兩朝剝復錄",
 "忠節吳次尾先生年譜",
 "棲山遺事",
 "元音譜",
 "圖書衍",
 "古大學注",
 "葩經旁意",
 "說疇",
 "說易",
 "大易通變",
 "大九數",
 "從祀鄉賢錄",
 "喬還一先生餘稿括抄",
 "軼史隨筆",
 "時事漫紀",
 "軼語考鏡",
 "藝苑閒評",
 "王先生文集",
 "書疏叢鈔",
 "家庭庸言",
 "石雲先生印譜釋考",
 "石雲先生滸迂談",
 "薄游書牘",
 "津門中都啟稿",
 "涉志",
 "詩卷",
 "續詩卷",
 "昭代事始",
 "朝綱變例",
 "叔苴子",
 "叔苴子外篇",
 "莊子達言",
 "古詩獵雋",
 "南華雅言",
 "重言",
 "伐山語",
 "唐詩摘句",
 "韓呂弋腴",
 "二術編",
 "莊氏族譜",
 "水程日記",
 "治家條約",
 "家書",
 "搜微錄",
 "言解",
 "涉古記事",
 "巵言日出",
 "錦盤奇勢",
 "論學須知",
 "行文須知",
 "客談",
 "文訣",
 "陰符經註解",
 "剪綵",
 "東山餘墨",
 "東山論草",
 "家禮摘要",
 "明宗正學",
 "身世要則",
 "史會大綱",
 "友古特評",
 "群古對觀",
 "左國補議",
 "讀餘誌略",
 "玄圃餘珍",
 "韻林隨筆",
 "山野寤言",
 "舜水文集",
 "改定釋奠儀注",
 "陽九述略",
 "安南供役紀事",
 "書經近指",
 "晚年批定四書近指",
 "畿輔人物考",
 "遊譜",
 "孫徵君日譜錄存",
 "理學宗傳",
 "夏峯答問",
 "徵君孫先生年譜",
 "偶諧舊草",
 "西廬詩草",
 "西廬詩餘",
 "奉常公遺訓",
 "減菴公詩存",
 "西田詩集",
 "西廬懷舊集",
 "遡園文集",
 "遡園語商",
 "秋興八首偶論",
 "雜卦圖",
 "諸圖附考",
 "四書翊注",
 "用六集",
 "斯文正統",
 "辰夏雜言",
 "俗誤辨",
 "叢桂堂家約",
 "補新婦譜",
 "先世遺事紀略",
 "瞽言",
 "講義",
 "大學辨",
 "南雷詩歷",
 "賜姓始末",
 "黃棃洲先生年譜",
 "南雷文約",
 "冬青引注",
 "滇攷",
 "鄭成功傳",
 "張元箸先生事略",
 "匡廬遊錄",
 "南雷文定四集",
 "桴亭先生文集",
 "志學錄",
 "虛齋格致傳補註",
 "四書講義輯存",
 "淮雲問答輯存",
 "八陣發明",
 "月行九道圖併解",
 "治鄉三約",
 "制科議",
 "甲申臆議",
 "蘇松浮糧考",
 "常平權法",
 "家祭禮",
 "改折始末論",
 "尊道先生年譜",
 "楊園先生文集",
 "楊園先生備忘",
 "錄遺",
 "楊園先生言行見聞錄",
 "楊園先生近古錄",
 "楊園先生訓子語",
 "補農書",
 "楊園先生喪葬雜錄",
 "葬親社約",
 "楊園先生經正錄",
 "附學規",
 "白鹿洞書院學規",
 "居家雜儀",
 "藍田呂氏鄉約",
 "楊園先生訓門人語",
 "願學記",
 "問目",
 "楊園詩",
 "楊園書",
 "詩文",
 "讀易筆記",
 "讀史",
 "讀史記",
 "讀諸文集偶記",
 "讀許魯齋心法偶記",
 "讀厚語偶記",
 "言行見聞錄",
 "經正錄一卷附學規",
 "近古錄",
 "喪葬雜錄",
 "訓門人語",
 "張楊園先生年譜",
 "夏為堂別集文",
 "夏為堂別集詩",
 "夏為堂人天樂傳奇",
 "試官述懷",
 "惜花報",
 "散曲",
 "復姓紀事",
 "百家姓新箋",
 "一家言文集",
 "笠翁詞韻",
 "耐歌詞韻",
 "圖象",
 "莊屈合詁",
 "昌平山水記",
 "譎觚十事",
 "顧氏譜系考",
 "山東攷古錄",
 "京東攷古錄",
 "五經同異",
 "亭林雜錄",
 "聖安紀事",
 "同志贈言",
 "亭林軼詩",
 "沚亭刪定文集",
 "沚亭自刪詩",
 "琴譜指法省文",
 "漢史億",
 "南征紀略",
 "溤氏小集",
 "鈍吟別集",
 "鈍吟餘集",
 "鈍吟老人集外詩",
 "鈍吟樂府",
 "鈍吟老人文稿",
 "鈍吟老人雜錄",
 "安雅堂文集",
 "重刻文集",
 "安雅堂書啟",
 "安雅堂末刻稿",
 "祭皐陶",
 "謝程山集",
 "程山謝明學先生年譜",
 "學庸切己錄",
 "風雅論音",
 "左傳濟變錄",
 "養正篇",
 "初學先言",
 "程門主散錄",
 "大臣法則",
 "兵法類案",
 "大學稽中傳",
 "大學澹言",
 "中庸澹言",
 "大學學思錄",
 "中庸學思錄",
 "儒者十知略",
 "致知階略",
 "三訓俚說",
 "仰思記",
 "天德王道說",
 "辯陸書",
 "朱陸異同書",
 "䣊冰壑先生雜著",
 "論性書",
 "樗林偶筆",
 "閒筆",
 "西堂文集",
 "西堂雜俎一集",
 "西堂雜俎二集",
 "西堂雜俎三集",
 "西堂詩集",
 "西堂剩稿",
 "西堂秋夢錄",
 "西堂小草",
 "右北平集",
 "看雲草八堂集",
 "于京集",
 "哀絃集",
 "擬明史樂府",
 "詞餘",
 "西堂樂府",
 "讀離騷",
 "弔琵琶",
 "桃花源",
 "黑白衛",
 "李白登科記",
 "清平調",
 "鈞天樂",
 "西堂餘集",
 "年譜圖詩",
 "小影圖贊",
 "悔庵（尤侗）年譜",
 "性理吟",
 "後性理吟",
 "續論語詩",
 "艮齋倦稿詩集",
 "艮齋雜說",
 "看鑑偶評",
 "明史擬稿",
 "外國傳",
 "藝文志",
 "宮閨小名錄",
 "湘中草",
 "施愚山先生學餘文集",
 "學餘詩集",
 "施愚山先生別集",
 "施愚山先生年譜",
 "施氏家風述略",
 "施愚山先生外集",
 "試院冰淵",
 "隨村先生遺集",
 "周易內傳",
 "周易內傳發例",
 "周易大象解",
 "周易考異",
 "周易外傳",
 "尚書引義",
 "詩經攷異",
 "詩經叶韻辨",
 "詩廣傳",
 "詩記章句",
 "春秋家說",
 "春秋世論",
 "續春秋左氏傳博議",
 "四書訓義",
 "讀四書大全說",
 "四書稗疏",
 "說文廣義",
 "永曆實錄",
 "蓮峯志",
 "張子正蒙注",
 "思問錄內篇",
 "俟解",
 "搔首問",
 "龍源夜話",
 "老子衍",
 "莊子通",
 "愚鼓詞",
 "相宗絡索",
 "楚辭通釋",
 "五十自定稿",
 "六十自定稿",
 "七十自定稿",
 "柳岸吟",
 "薑齋詩分體稿",
 "薑齋詩編年稿",
 "落花詩",
 "遣興詩",
 "和梅花百詠",
 "洞庭秋詩",
 "雁字詩",
 "倣體詩",
 "嶽餘集",
 "薑齋詩賸稿",
 "憶得",
 "鼓棹初集",
 "瀟湘怨詞",
 "詩譯",
 "夕堂永日緒論內編",
 "南窗漫記",
 "龍舟會雜劇",
 "經義",
 "古詩評選",
 "唐詩評選",
 "明詩評選",
 "石崖遺書",
 "王船山叢書校勘記",
 "聰山文集",
 "申鳧盟先生年譜略",
 "思古堂集",
 "匡林",
 "潠書",
 "小匡文鈔",
 "螺峰說錄",
 "附稚黃子文洴",
 "聖學真語",
 "格物問答",
 "東苑文鈔",
 "東苑詩鈔",
 "蕊雲集",
 "晚唱",
 "詩辯坻",
 "韻學通指",
 "韻白",
 "附鸞情集選",
 "易觸",
 "詩觸",
 "水田居文集",
 "水田居激書",
 "騷筏",
 "水田居存詩",
 "眠雲館詩集",
 "聖歎外書",
 "聖歎內書",
 "聖歎雜篇",
 "玉山遺響",
 "唾居隨錄",
 "崇祀錄",
 "幾何易簡集",
 "律呂心法全書",
 "書學慎餘",
 "玉磑集",
 "紀城文藁",
 "紀城詩藁",
 "𧓷音",
 "吳江旅嘯",
 "綺樹閣詩藁",
 "賦藁",
 "華笑廎雜筆",
 "淮鹺本論",
 "李贅",
 "河圖洛書原舛編",
 "太極圖說遺議",
 "古文尚書冤詞",
 "國風省篇",
 "廟制折衷",
 "北郊配位尊西向議",
 "喪禮吾說篇",
 "曾子問講錄",
 "春秋條貫篇",
 "大學知本圖說",
 "四書賸言補",
 "聖門釋非錄",
 "逸講箋",
 "古學復興錄",
 "周禮問",
 "大學問",
 "誥詞",
 "頌",
 "主客辭",
 "議",
 "揭子",
 "劄子",
 "史館擬判",
 "書",
 "牘札",
 "箋",
 "引弁首",
 "題題詞題端",
 "跋",
 "書後緣起",
 "碑記",
 "王文成傳本",
 "墓碑銘",
 "墓表",
 "墓誌銘",
 "神道碑銘",
 "塔誌銘",
 "事狀",
 "易齋馮公（溥）年譜",
 "記事",
 "集課記",
 "錄",
 "越語肯綮錄",
 "何御史孝子祠主復位錄",
 "蕭山縣志刊誤",
 "天問補注",
 "館課擬文",
 "折客辨學文",
 "答三辨文",
 "釋二辨文",
 "辨聖學非道學文",
 "辨忠臣不徒死文",
 "古禮今律無繼嗣文",
 "古今無慶生日文",
 "禁室女守志殉死文",
 "後鑒錄",
 "蠻司合誌",
 "韻學要指",
 "古今通韻括略",
 "九懷詞",
 "誄文",
 "填詞",
 "擬連廂詞",
 "二韻詩",
 "七言絕句",
 "排律",
 "七言古詩",
 "五言律詩",
 "七言律詩",
 "七言排律",
 "五言格詩",
 "雜體詩",
 "五言三韻律",
 "七言三韻律",
 "六言詩",
 "徐都講詩",
 "中山文鈔",
 "中山史論",
 "中山奏議",
 "讀書蕞",
 "粵遊日記",
 "星餘筆記",
 "暑窓臆說",
 "朱子語類纂",
 "世德堂文集",
 "竹中記",
 "酉除集",
 "軒渠詩稿",
 "軒渠詩餘稿",
 "校定前漢書自序",
 "軒渠集",
 "鈍翁類藁",
 "詩藁",
 "外藁",
 "古今五服考異",
 "東都事略跋",
 "歸詩考異",
 "鈍翁續藁",
 "別藁",
 "擬明史列傳",
 "蘇州汪氏族譜",
 "先府君事略",
 "寸碧堂詩集",
 "汪伯子箐菴遺藁",
 "姑蘇楊柳枝詞",
 "陸舫詩草",
 "椒丘詩",
 "丁野鶴先生遺稿",
 "江干草",
 "歸山草",
 "聽山亭草",
 "化人遊",
 "赤松遊",
 "表忠記",
 "家政須知",
 "柴村文集",
 "蝶庵自藥",
 "柴村詩鈔",
 "柴村賦集",
 "德滋堂歌詩附鈔",
 "粵槎日記",
 "瘞鶴銘辨",
 "唐昭陵六駿贊辨",
 "棧行圖詩",
 "漢隸字原校本",
 "潛痷先生擬明史稿",
 "潛痷先生遺稿",
 "潛痷先生疏稿",
 "洛學編",
 "潛痷先生志學會約",
 "乾坤兩卦解",
 "二曲全集",
 "二曲歷年紀略",
 "潛確錄",
 "四書反身錄",
 "湛園未定稿",
 "西溟文鈔",
 "真意堂佚稿",
 "湛園藏稿",
 "葦間詩集",
 "湛園詩稿",
 "詩詞拾遺",
 "萬青閣自訂文集",
 "萬青閣自訂詩",
 "萬青閣勘河詩記",
 "哭臨紀事",
 "寄園集字詩",
 "萬青閣歸隱詩",
 "夏日吟",
 "丹陽舟次唱和",
 "問天旅嘯",
 "羾青閣秋集",
 "燕山秋吟",
 "林臥遙集",
 "萬青閣詩餘",
 "採朮雜詠",
 "萬青閣自訂制藝",
 "萬青閣文訓",
 "交山平寇詳文",
 "交山平寇書牘",
 "文山平寇本末",
 "附交山平寇詩",
 "萬青閣自訂詳案",
 "滇行日記",
 "臥象山房詩正集",
 "白雲村文集",
 "滇南集",
 "三魚堂外集",
 "三魚堂四書講義",
 "古文尚書攷",
 "呻吟語質疑",
 "戰國策去毒",
 "禮經會元疏釋",
 "治嘉格言",
 "莅嘉遺蹟",
 "霧堂經訓",
 "霧堂詹言",
 "霧堂雜著",
 "岸翁散筆",
 "飛翰叢語",
 "楚騷偶擬",
 "儒經撮要",
 "道統中一經",
 "四子丹元",
 "學鏡約",
 "心聖直指",
 "嘉言存略",
 "公餘證可",
 "麈譚摘",
 "東谷集詩",
 "歸庸齋詩",
 "桑榆集詩",
 "漁洋山人詩集",
 "蠶尾集",
 "南海集",
 "雍益集",
 "漁洋山人文略",
 "蜀道驛程記",
 "皇華紀聞",
 "粵行三志",
 "南來志",
 "北歸志",
 "廣州游覽小志",
 "池兆偶談",
 "諡法攷",
 "秦蜀驛程後記",
 "古懽錄",
 "浯溪考",
 "載書圖詩",
 "阮亭選古詩五言詩",
 "七言詩",
 "十種唐詩選",
 "蕭亭詩選",
 "徐詩",
 "考功集選",
 "古鉢集選",
 "迪功集選",
 "蘇門集選",
 "華泉先生集選",
 "睡足軒詩選",
 "抱山集選",
 "歷仕錄",
 "隴首集",
 "清寤齋心賞編",
 "剪桐載筆",
 "西湖和蘇詩",
 "閩行日記",
 "閩中吟",
 "石屋初集",
 "孤子唫",
 "連珠",
 "寓言",
 "看花述異記",
 "行役日記",
 "禽言",
 "武林北墅竹枝詞",
 "中山沿革志",
 "使琉球雜錄",
 "冊封琉球疏鈔",
 "悔齋詩",
 "山聞詩",
 "京華詩",
 "觀海集",
 "存誠堂應制詩",
 "存誠堂詩集",
 "篤素堂詩集",
 "離騷經",
 "附九歌",
 "參同契註",
 "榕村全集",
 "榕村別集",
 "離騷經解",
 "九歌注",
 "陰符經注",
 "參同契注",
 "孝經全注",
 "洪範說",
 "榕村制義初集",
 "尚書七篇解義",
 "淛㖟存愚",
 "太極圖解",
 "論定性書",
 "顏子所好何學論",
 "經書源流歌訣",
 "三禮儀制歌訣",
 "歷代姓系歌訣",
 "榕村字畫辨訛",
 "正蒙注",
 "二程子遺書纂",
 "外書纂",
 "古文精藻",
 "韓子粹言",
 "榕村講授",
 "朱子語類四纂",
 "四書解義",
 "四記",
 "春秋燬餘",
 "孝經全註",
 "歷象本要",
 "握奇經註",
 "正蒙註",
 "性理",
 "榕村韻書",
 "榕村詩選",
 "程墨前選",
 "名文前選",
 "易義前選",
 "周禮纂訓",
 "文貞公年譜",
 "儀禮纂錄",
 "榕村譜錄合考",
 "道南講授",
 "律詩四辨",
 "譯史",
 "纖志志餘",
 "澄江集",
 "北墅緒言",
 "玉山詞",
 "尋樂堂日錄",
 "事親庸言",
 "尋樂堂劄記",
 "悲飢詩",
 "勸善歌",
 "尋樂堂家規",
 "告先師文",
 "泌陽學條規",
 "尋樂堂學規",
 "嵩陽酬和集",
 "崇祀鄉賢名宦錄",
 "禮山園文集",
 "文集後編",
 "嵩少遊草",
 "新城王氏西城別墅十三詠",
 "鎖闈雜詠",
 "達天錄",
 "聖人家門喻",
 "書紳語略",
 "衾影錄",
 "南陽書院學規",
 "學要八箴",
 "紫雲書院讀史偶譚",
 "敕賜紫雲書院志",
 "連山書院志",
 "連陽八排風土記",
 "嶺海拾遺",
 "京華見聞錄",
 "隨筆錄",
 "聖諭圖象衍義",
 "聖諭宣講鄉保條約",
 "儀注",
 "聖諭衍義三字歌俗解",
 "御製訓飭士子文淺解",
 "宣講儀注",
 "宣講條約",
 "此木軒讀四書注疏",
 "此木軒木食",
 "此木軒贅語",
 "此木軒雜著",
 "此木軒枝葉錄",
 "此木軒尚志錄",
 "此木軒泉下錄",
 "此木軒雜錄彙編",
 "此木軒詩",
 "此木軒論詩",
 "此木軒論制義彙編",
 "此木軒自訂義存",
 "此木軒五言七言律詩選讀本",
 "此木軒昌黎文選",
 "此木軒柳州文選",
 "此木軒廬陵文選",
 "此木軒選四六文",
 "此木軒歷科程墨（殘）",
 "此木軒歷科詩經文（殘）",
 "懷舊吟",
 "唱莊",
 "淮遊紀略",
 "皇極書",
 "皇極外書",
 "尚書外傳",
 "疑團",
 "皇明詩話",
 "空明子文集",
 "空明子雜錄",
 "空明子茸城賦注",
 "空明子崇川節婦傳",
 "空明子崇川獨行傳",
 "空明子崇川贈言",
 "苧菴遺集",
 "苧菴二集",
 "豫章遊稿",
 "華苹山人詩集",
 "華平近律",
 "華平戲作",
 "苧菴壽言",
 "滬上秋懷倡和集",
 "梅花書屋倡和詩",
 "易經劄記",
 "大學講義",
 "程功錄",
 "崧臺學製書",
 "附攝篆半月錄",
 "薦後錄",
 "崧臺最錄",
 "崧臺隨筆",
 "皇朝冠服志",
 "治平要術",
 "放言",
 "衡言",
 "江州筆談",
 "白岩文存",
 "白岩詩存",
 "春秋鈔",
 "附孝經三本管窺",
 "儀禮節略",
 "呂氏四禮翼",
 "歷代名儒傳",
 "歷代名臣傳",
 "歷代循吏傳",
 "天下山河兩戒考",
 "竹書紀年統箋",
 "志寧堂稿",
 "經言拾遺",
 "周易拾遺",
 "周官析疑",
 "考工記析疑",
 "周官辨",
 "離騷經正義",
 "春秋直解",
 "春秋比事目錄",
 "刪定管子",
 "刪定荀子",
 "望溪先生文",
 "望溪先生文外集",
 "南中集",
 "採蓴集",
 "紅豆齋時術錄",
 "尚書章句內篇",
 "朝廟宮室考",
 "田賦考",
 "天子肆獻祼饋食禮纂",
 "禮記章句",
 "四書約旨",
 "沈德潛自訂年譜",
 "歸愚文鈔",
 "歸愚詩鈔",
 "矢音集",
 "歸田集",
 "八秩壽序壽詩",
 "九秩壽序壽詩",
 "歸愚詩鈔餘集",
 "黃山遊草",
 "台山遊草",
 "南巡詩",
 "歸愚詩餘",
 "浙江通省志圖說",
 "澄懷園文存",
 "澄懷園載賡集",
 "澄懷老人自訂年譜",
 "明史經籍志",
 "明史傳總論",
 "讀史自娛",
 "各體自著",
 "焚黃祝文",
 "江都鄉賢錄",
 "蘭亭集詩",
 "長崎紀聞",
 "銅政條議",
 "赤城詩鈔",
 "駱駝經",
 "九家窰屯工記",
 "工上雜成",
 "鹿洲公案",
 "脩史試筆",
 "棉陽學準",
 "鹿洲奏疏",
 "春明叢說",
 "鄉曲枝詞",
 "遊踪選勝",
 "讀書閒評",
 "齊東妄言",
 "潮嘉風月",
 "夏雲存稿",
 "左傳拾遺",
 "詩學金丹",
 "助語小品",
 "以學集",
 "纂言內篇",
 "離騷解",
 "史評",
 "一臠集",
 "經義質疑",
 "四書質疑",
 "刪後文集",
 "刪後詩存",
 "一齋雜著",
 "秋水堂文集",
 "曆法問答",
 "儀禮鄭注監本刊誤",
 "尚書小疏",
 "春秋左氏小疏",
 "考定竹書",
 "二申野錄",
 "枝語",
 "樊紹述集註",
 "玉川子詩註",
 "晴川蟹錄",
 "道腴堂詩編",
 "道腴堂雜編",
 "道腴堂脞錄",
 "道腴堂雜著",
 "俊逸亭新編",
 "小簇園新編",
 "雪泥鴻爪錄",
 "亞谷叢書",
 "潭西詩集",
 "五代史志疑",
 "易互",
 "禹貢臆參",
 "經學臆參",
 "殷頑錄",
 "周易詮義",
 "易經如話",
 "書經詮義",
 "詩經詮義",
 "禮記或問",
 "六禮或問",
 "四書詮義",
 "樂經或問",
 "山海經存",
 "理學逢源",
 "戊笈談兵",
 "補校錄",
 "四翼附編",
 "奇門遁甲啟悟",
 "策略",
 "醫林纂要探源",
 "雙池文集",
 "浙刻雙池遺書十二種",
 "讀近思錄",
 "讀讀書錄",
 "讀困知記",
 "讀問學錄",
 "讀陰符經",
 "讀參同契",
 "儒先晤語",
 "詩韻析",
 "立雪齋琴譜",
 "大風集",
 "物詮",
 "雙池先生年譜",
 "小獨秀齋詩",
 "窺園吟稿",
 "附江上吟",
 "三晉遊草",
 "夕秀軒遺草",
 "附惜餘存稿",
 "劍溪文略",
 "附燕石碎編",
 "劍溪外集",
 "杜詩義法",
 "劍溪說詩",
 "又編",
 "大歷詩略",
 "楚蒙山房詩",
 "楚蒙山房文集",
 "學易初津",
 "易翼宗",
 "易翼說",
 "易經碎言",
 "詩經旁參",
 "春秋剩義",
 "渠亭文稾",
 "或語",
 "潛州集",
 "娛老集不分卷遺稾一卷",
 "古今詩",
 "停驂隨筆",
 "春帆紀程",
 "充射堂詩集",
 "五集",
 "充射堂文鈔",
 "充射堂大易餘論",
 "充射堂春秋餘論",
 "板橋詩鈔",
 "板橋詞鈔",
 "板橋家書",
 "鴻詞所業",
 "經進講義",
 "三國志補註",
 "經筵講義",
 "續漢書蒙拾",
 "培遠堂偶存稿（文檄）",
 "大學衍義輯要",
 "大學衍義補輯要",
 "司馬文正公傳家集",
 "司馬文正公（光）年譜",
 "補篇",
 "學仕遺規",
 "手札節要",
 "三通序目",
 "先文恭公年譜",
 "培遠堂偶存稿",
 "甲子紀元",
 "綱鑑正史約",
 "培遠堂文集",
 "培遠堂手札節要",
 "培遠堂文檄",
 "陳榕門先生遺書補遺",
 "陳榕門先生年譜",
 "如話齋詩存",
 "洄溪道情",
 "懷舫詩集",
 "懷舫詞",
 "恭紀聖恩詩",
 "懷舫集",
 "偶遂草",
 "續廿二史彈詞",
 "懷舫自述",
 "懷舫別集",
 "南莊類稿",
 "白雲詩鈔",
 "匡遊草",
 "奉使集",
 "靜子日記",
 "待庵日札",
 "西歸日札",
 "北行日札",
 "王貞文先生遺事",
 "春和堂紀恩詩",
 "恩旨彙紀",
 "奉使紀行詩",
 "奉使行紀",
 "靜遠齋詩集",
 "自得園文鈔",
 "春和堂詩集",
 "詩志",
 "周易解",
 "論語隨筆",
 "孟子論文",
 "空山堂史記評注",
 "讀史糾謬",
 "空山堂文集",
 "上湖詩紀續編",
 "噉蔗文集",
 "喪禮詳考",
 "周官隨筆",
 "岣嶁刪餘文草",
 "岣嶁刪餘詩草",
 "岣嶁文草雜著",
 "岣嶁韻語",
 "岣嶁仿古",
 "岣嶁韵牋",
 "岣嶁時藝",
 "岣嶁鑑撮",
 "聲韻訂訛",
 "思誠錄",
 "鑒古錄",
 "論古錄",
 "經學八書",
 "周易尊翼",
 "尚書可解輯粹",
 "毛詩古音參義",
 "春秋尊孟",
 "春秋比事參義",
 "春秋應舉輯要",
 "禮記釐編",
 "澧志舉要",
 "事友錄",
 "吾學錄",
 "琉球入學見聞錄",
 "曫文書屋集略",
 "尺牘略",
 "約六齋制藝",
 "鯨滸課藝",
 "俎豆集",
 "周易講義",
 "論語講義",
 "孟子講義",
 "漢書正譌",
 "祭法記疑",
 "惺齋論文",
 "惺齋文鈔",
 "周易剩義",
 "樂律古義",
 "理學疑問",
 "子朱子為學次第考",
 "冠豸山堂文集",
 "留村禮意",
 "昭代舊聞",
 "萬花擷繡",
 "梧牕夜話",
 "隨園圖",
 "小倉山房文集",
 "小倉山房外集",
 "袁太史時文",
 "小倉山房尺牘",
 "隨園詩話",
 "隨園隨筆",
 "新齊諧（一名子不語）",
 "隨園食單",
 "續同人集",
 "隨園八十壽言",
 "紅豆村人詩稿",
 "碧腴齋詩存",
 "南園詩選",
 "筱雲詩集",
 "粲花軒詩稿",
 "湄君詩集",
 "袁家三妹合稿",
 "繡餘吟稿",
 "盈書閣遺稿",
 "樓居小草",
 "素文女子遺稿",
 "閩南雜詠",
 "湘痕閣詩稿",
 "詞稿",
 "瑤華閣詩草",
 "隨園女弟子詩選",
 "飲水詞鈔",
 "七家詞鈔",
 "箏船詞",
 "捧月樓詞",
 "綠秋草堂詞",
 "玉山堂詞",
 "崇睦山房詞",
 "過雲精舍詞",
 "碧梧山館詞",
 "涉洋管見",
 "談瀛錄",
 "紅豆村人續稿",
 "諸子詹詹錄",
 "事物原會",
 "十三經紀字",
 "字典紀字",
 "韻府紀字",
 "壘字編",
 "詞名集解",
 "宋樂類編",
 "南北詞名宮調彙錄",
 "院本名目",
 "雜劇待考",
 "琴曲萃覽",
 "樂府標源",
 "樂府遺聲",
 "漱經齋座右銘類編",
 "解毒編",
 "怪疾奇方",
 "彙集經驗方",
 "篆印心法",
 "隸法瑣言",
 "寫照瑣言",
 "撰杖瑣言",
 "輯硯瑣言",
 "解畫瑣言",
 "燼餘志略",
 "侑觴瑣言",
 "畫石瑣言",
 "夕照回光",
 "大樂元音",
 "洪範注補",
 "學庸一得",
 "曆算合要",
 "集杜",
 "人表考",
 "元號略",
 "蛻稿",
 "庭立記聞",
 "夏小正輯註",
 "西澗草堂集",
 "困勉齋私記",
 "尚書讀記",
 "春秋一得",
 "鈍齋詩集",
 "忠雅堂文集",
 "銅絃詞",
 "忠雅堂評選四六法海",
 "蔣鉛山九種曲",
 "清容外集",
 "空谷香",
 "香祖樓",
 "冬青樹",
 "臨川夢",
 "一片石",
 "桂林霜",
 "第二碑",
 "雪中人",
 "四絃秋",
 "汪子文錄",
 "二錄",
 "錄後",
 "讀佛祖四十偈私記",
 "春融堂集",
 "述庵先生（王昶）年譜",
 "尚書質疑",
 "尚書異讀考",
 "草木疏校正",
 "春秋三傳雜案",
 "讀春秋存稿",
 "詩細",
 "四書溫故錄",
 "陔餘叢考",
 "簷曝雜記",
 "甌北詩鈔",
 "甌北詩話",
 "甌北集",
 "春陵襃貞錄",
 "善俗書",
 "越女表徵錄",
 "病榻夢痕錄",
 "雙節堂庸訓",
 "小學餘論",
 "考亭遺矩",
 "朱子師友傳",
 "事賢錄",
 "友仁錄",
 "河東先儒遺訓",
 "河東先儒醒世文",
 "河汾淵源",
 "善教名臣言行錄",
 "左陶右邵",
 "臥雲草",
 "八物昹",
 "北窗草",
 "司鐸草",
 "國朝詩話",
 "在淵草",
 "儆嬉草",
 "醉月草",
 "碧梧草",
 "北海草",
 "夢魔草",
 "蘭室叢談",
 "北田文略",
 "叢殘小語",
 "北田詩臆",
 "江湖客詞",
 "懷古堂偶存文稿",
 "懷古堂偶存詩稿",
 "見聞瑣錄",
 "說孟",
 "說左",
 "讀詩遵朱近思錄",
 "憶往編",
 "樸廬詩稿",
 "毛孺人詩",
 "林屋詩餘",
 "題畫詩鈔",
 "論畫正則",
 "綠溪初稿",
 "綠溪詩",
 "詠史偶稿",
 "綠溪詞",
 "三史拾遺",
 "諸史拾遺",
 "元史藝文志",
 "通鑑注辯正",
 "陸放翁先生（游）年譜",
 "弇州山人（王世貞）年譜",
 "潛研堂金石文跋尾",
 "潛研堂金石文字目錄",
 "三統術衍",
 "紟",
 "風俗通逸文",
 "惜抱軒法帖題跋",
 "惜抱軒筆記",
 "惜抱軒九經說",
 "莊子章義",
 "惜抱先生尺牘補編",
 "孟氏八錄",
 "焚香錄",
 "求復錄",
 "晚聞錄",
 "廣愛錄",
 "家誡錄",
 "瓜棚避暑錄",
 "誠是錄",
 "喪禮輯要",
 "使粵日記",
 "缾菴居士詩鈔",
 "缾菴居士文鈔",
 "審題要旨",
 "制義準繩",
 "詩學源流考",
 "兩漢金石記",
 "五言詩",
 "七言詩歌行",
 "七言律詩鈔",
 "粵東金石略",
 "九曜石考",
 "焦山鼎銘考",
 "十三經注疏姓氏",
 "春秋分年系傳表",
 "詠物七言律詩偶記",
 "栖霞小稿",
 "嵐漪小艸",
 "青原小艸",
 "復初齋詩集",
 "翁氏家事略記",
 "金剛般若波羅蜜經附注",
 "雨峰詩鈔",
 "杜詩本義",
 "三晉見聞錄",
 "思補齋日錄",
 "周易篇第",
 "易考",
 "尚書篇第",
 "書經補篇",
 "尚書考",
 "四書解細論",
 "厚岡詩集",
 "經韻樓集",
 "儀禮漢讀考",
 "附覆校札記",
 "古文尚書撰異",
 "毛詩故訓傳定本小箋",
 "周禮漢讀考",
 "介亭文集",
 "介亭外集",
 "介亭筆記",
 "居暇邇言",
 "北上偶錄",
 "臨安府志序言",
 "于役迤南記",
 "介亭詩鈔",
 "獨秀山房四書文",
 "樹經堂詩初集",
 "樹經堂文集",
 "深衣釋例",
 "列子釋文",
 "列子釋文考異",
 "釋繒",
 "方志略例",
 "湖北通志檢存稿",
 "湖北通志未成稿",
 "閱書隨劄",
 "永清縣志",
 "永清文徵",
 "和州志",
 "章氏遺書補遺",
 "章氏遺書校記",
 "考信錄",
 "王政三大典考",
 "三代正朔通考",
 "經傳禘祀通考",
 "三代經界通考",
 "古文尚書辨偽",
 "論語餘說",
 "易卦圖說",
 "無聞集",
 "遺經樓文稿",
 "崔東璧遺書引得",
 "崔東壁先生佚文",
 "知非集",
 "二餘集",
 "針餘吟稿",
 "荍田賸筆殘稿",
 "崔德皋先生遺書",
 "訥庵筆談",
 "尚友堂文集",
 "尚友堂說詩",
 "寸心知詩集",
 "崔東璧先生親友事文彙輯",
 "評論",
 "續輯",
 "初刻本校勘記",
 "左傳鈔",
 "公羊傳鈔",
 "縠梁傳鈔",
 "國語鈔",
 "國策鈔",
 "史記鈔",
 "前漢書鈔",
 "後漢書鈔",
 "唐宋八家鈔",
 "歸餘鈔",
 "嘉懿集初鈔",
 "夢航雜綴",
 "萬曆丁酉同年攷",
 "牧翁先生（錢謙益）年譜",
 "三袁先生（宗道、宏道、中道）年表",
 "句圖",
 "鈔詩姓氏",
 "志料",
 "夢航雜說",
 "梅谷文藁",
 "梅谷行卷",
 "耕餘小藁",
 "吳興遊草",
 "梅谷續藁",
 "夢影詞",
 "隴頭芻語",
 "春草遺句",
 "二蠶詞",
 "夏小正補注",
 "石鼓文集釋",
 "襄陽耆舊記",
 "文章始",
 "壽者傳",
 "心齋集詩藁",
 "弦哥古樂譜",
 "綱目通論",
 "林屋詩藁",
 "心齋文藁",
 "聲音表",
 "鶴關詩初集",
 "黃山紀日",
 "鶴關文賸",
 "白門集",
 "海右集",
 "濟南竹枝詞",
 "十二河山集",
 "巏堥山人詞集",
 "杯湖欸乃",
 "杏花村琴趣",
 "齊魯韓詩譜",
 "柳絮集",
 "選聲集",
 "南野堂詩集",
 "南野堂筆記",
 "南野堂續筆記五種",
 "慎餘編",
 "少見錄",
 "師貞備覽",
 "苗疆指掌",
 "漢唐石刻目錄",
 "永報堂詩集",
 "艾堂樂府",
 "傳奇二種",
 "奇酸記傳奇",
 "歲星記傳奇",
 "秋心集",
 "南征集",
 "驂鸞集",
 "婺舲餘稿",
 "香詞百選",
 "遊山日記",
 "古南餘話",
 "湘舟漫錄",
 "花仙小志",
 "雙丰公輓詩",
 "聯璧詩鈔",
 "午風堂詩集",
 "方音",
 "諧聲補證",
 "說文補攷",
 "古人言",
 "口頭語",
 "客寓雜錄",
 "台事隨筆",
 "毛詩證讀",
 "讀詩或問",
 "四書偶談內編",
 "鶴泉文鈔",
 "續選",
 "集李三百篇",
 "鶴泉集唐",
 "初編",
 "台州外書",
 "賜書堂集鈔",
 "楚辭音義",
 "新論正誤",
 "經典釋文附錄",
 "臨池瑣語",
 "淮南子正誤",
 "經讀考異",
 "句讀敘述",
 "附翟晴江四書考異內句讀",
 "三禮義證",
 "金石一跋",
 "二跋",
 "三跋",
 "授堂金石文字續跋",
 "讀畫山房文鈔",
 "授堂詩鈔",
 "雙桂堂易說二種",
 "觀易外編",
 "易問",
 "古律經傳附考",
 "老子約說",
 "雙桂堂稿",
 "敬義堂家訓",
 "枕上銘",
 "紀氏敬義堂家訓述錄",
 "書紳錄",
 "雙桂堂時文稿",
 "課子遺編",
 "地理末學",
 "筆算便覽",
 "紀慎齋先生崇祀錄",
 "讀書續錄鈔",
 "甑峰先生遺稿",
 "周易參同契集韻",
 "悟真篇",
 "俞氏參同契發揮五言註摘錄",
 "仕學備餘",
 "六壬類聚",
 "地理水法要訣",
 "考訂河洛理數便覽",
 "乾隆府廳州縣圖志",
 "漢魏音",
 "附鮚軒詩",
 "曉讀書齋初錄",
 "四錄",
 "遣戍伊犁日記",
 "天山客話",
 "擬兩晉南北史樂府",
 "附鮚軒外集唐宋小樂府",
 "史目表",
 "更生齋詩餘",
 "弟子職箋釋",
 "遺戍伊犁日記",
 "澹靜齋文鈔",
 "文鈔外篇",
 "壺山書屋詩略",
 "聽雨山房詩存",
 "詩存外篇",
 "祭儀攷",
 "澹靜齋說祼",
 "邶風說",
 "四寸學",
 "蠟味小稾",
 "復丁老人草",
 "簡松草堂文集",
 "三影閣箏語",
 "知還草",
 "壹齋集",
 "奏御集",
 "兩朝恩賚記",
 "壹齋集賦",
 "畫友錄",
 "壹齋集游記",
 "泛漿錄",
 "蕭湯二老遺詩合編",
 "黃勤敏公年譜",
 "明堂陰陽夏小正經傳考釋",
 "夏時明堂陰陽經",
 "夏時說義",
 "夏小正等例文句音義",
 "夏小正等例",
 "尚書今古文考證",
 "毛詩考證",
 "毛詩周頌口義",
 "五經小學述",
 "漢鼓吹鐃歌曲句解",
 "說文古籀疏證目",
 "古文甲乙篇",
 "珍埶宧文鈔",
 "尚書周誥考辨",
 "鄭風考辨",
 "春秋比辨",
 "強恕齋雜著",
 "強恕齋文賸",
 "使足編（原名備荒通論）",
 "校補叢",
 "籌賬事略",
 "學律初步",
 "笙雅堂文集",
 "竹書紀年考證",
 "竹南賦略",
 "五研齋詩鈔",
 "寄傲軒讀書隨筆",
 "公羊穀梁異同合評",
 "兩世鄉賢錄",
 "崇祀名宦錄",
 "荀子補註",
 "劉端臨先生文集",
 "鹽法隅說",
 "延釐堂文集",
 "延釐堂詩集",
 "自記年譜",
 "春秋公羊經傳通義",
 "敍",
 "詩聲類",
 "聲類分例",
 "禮學卮言",
 "經學卮言",
 "雅歌堂文集",
 "雅歌堂外集",
 "左傳兵法",
 "左傳兵訣",
 "孫吳兵訣",
 "春秋禮經",
 "春秋書法凡例附胡氏釋例",
 "左傳歌謠",
 "左傳精語",
 "外傳精語",
 "公穀精語",
 "國策精語",
 "讀左存愚",
 "詩說匯訂",
 "朱子事彙纂略",
 "朱梅崖文譜",
 "雅歌堂慎陟集詩鈔",
 "雅歌堂賦",
 "雅歌堂甃坪詩話",
 "犢山文稿",
 "課易存商",
 "隨筆雜記",
 "犢山詩藁",
 "淩次仲先生年譜",
 "律呂考",
 "九歌解",
 "周禮釋文答問",
 "獨學廬初稿詩",
 "讀左卮言",
 "漢書刊誤",
 "獨學廬二稿詩",
 "花韻庵詩餘",
 "花間樂府",
 "獨學廬三稿文",
 "詩晚香樓集",
 "獨學廬四稿文",
 "詩池上集",
 "獨學廬五稿詩燕居集",
 "秦漢瓦圖記",
 "排山小集",
 "青岑遺稿",
 "排山後集",
 "柚堂文存",
 "皆山樓吟稿",
 "柚堂筆談",
 "教稼書",
 "沈氏羣峯集",
 "便錄",
 "汲冢周書輯要",
 "逸書",
 "禮記箋",
 "春秋說略",
 "春秋比",
 "爾雅郭注義疏",
 "竹書紀年校正",
 "通考",
 "宋瑣語",
 "寶訓",
 "蜂衙小記",
 "燕子春秋",
 "記海錯",
 "詩經拾遺",
 "曬書堂文集",
 "曬書堂閨中文存",
 "曬書堂筆記",
 "曬書堂時文",
 "曬書堂筆錄",
 "曬書堂詩鈔",
 "和鳴集",
 "梅叟閒評",
 "唐石經校文",
 "邃雅堂集",
 "文集續編",
 "邃雅堂學古錄",
 "學易討原",
 "顓頊厤術",
 "夏殷厤章蔀合表",
 "周初年月日歲星考",
 "春秋經傳朔閏表",
 "漢初年月日表",
 "四書瑣語",
 "古音諧",
 "廣陵事略",
 "繆篆分韻",
 "四聲易知錄",
 "藥洲花農詩略",
 "文略續",
 "拄楣蕝記",
 "春秋咫聞鈔",
 "四書紀疑錄",
 "國朝嶺海詩鈔",
 "禹貢讀",
 "說劉昫書隨筆",
 "都門文鈔",
 "閩南文鈔",
 "味蕉試帖",
 "深省堂閒吟集",
 "保陽吟草",
 "深省堂隨筆",
 "深省堂自箴錄",
 "深省堂文集",
 "培蔭軒文集",
 "培蔭軒詩集",
 "扈從木蘭行程日記",
 "培蔭軒雜記",
 "扁舟載酒詞",
 "臆說",
 "中庸私解",
 "逍遙遊釋",
 "雜篇",
 "雕菰樓易學三書",
 "易圖略",
 "易通釋",
 "易話",
 "易廣記",
 "六經補疏",
 "論語補疏",
 "周易補疏",
 "尚書補疏",
 "毛詩補疏",
 "春秋左傳補疏",
 "禮記補疏",
 "羣經宮室圖",
 "禹貢鄭注釋",
 "里堂學算記",
 "加減乘除釋",
 "天元一釋",
 "釋弧",
 "釋輪",
 "釋橢",
 "北湖小志",
 "周程張子合鈔",
 "朱子節要鈔",
 "得心編",
 "高子講義",
 "薛子讀書錄鈔",
 "一得錄",
 "素問釋義",
 "宛鄰書屋古詩錄",
 "禮經宮室答問",
 "夏小正疏義",
 "異字記",
 "雪𧅁老人詩稿",
 "地齋詩鈔",
 "檆堂詩鈔",
 "筠軒六鈔",
 "國朝名人詞翰",
 "台州札記",
 "春秋經傳合編",
 "書法彙表",
 "朱子四書纂要",
 "輿地沿革表",
 "雲巖小志",
 "靈岩小志",
 "琴劍集",
 "鶴心偶寄",
 "鴻爪留餘",
 "律杜",
 "律李",
 "律選",
 "賦草",
 "壽蘐詞",
 "斑菊",
 "黔風",
 "律唐",
 "墨莊雜著",
 "荊南小志",
 "荊南石刻錄",
 "九子山行記",
 "百四十齋記",
 "墨莊書跋",
 "墨莊文鈔",
 "味根山房詩鈔",
 "輪臺雜記",
 "東還紀略",
 "趨庭瑣語",
 "退思軒詩存",
 "小學或問",
 "一齋家規",
 "退聞錄",
 "郝正陽語錄家傳",
 "一齋劄記",
 "一齋詩",
 "綱鑑紀年",
 "一齋書繹說",
 "勸學淺說",
 "西齋詩輯遺",
 "海喇行",
 "涑水鈔",
 "從心錄",
 "西泠舊事百詠",
 "小滄桑",
 "烏蘭誓",
 "無譜曲",
 "擬摘入藏南華經",
 "老子附證",
 "古三疾齋雜著",
 "古三疾齋論語直旨",
 "巢雲閣詩鈔",
 "字原徵古",
 "音義辨同",
 "樂府津逮",
 "稧帖緒餘",
 "西江詩話",
 "游戲三昧",
 "古諺閒譚",
 "駮毛西河四書改錯",
 "補餘堂四書問答",
 "補餘堂文集",
 "補餘堂詩鈔",
 "琴音標準",
 "湘涵試帖",
 "太虛齋賦稿",
 "勾留集",
 "蘭江負米集",
 "趨庭集",
 "荷鋤草",
 "缾罄微吟",
 "丙舍集",
 "于役集",
 "浪遊草",
 "周甲集",
 "林下草",
 "鮚𩸞小詠",
 "秋窗病餘錄",
 "琴硯錄",
 "還雲草",
 "花影集",
 "酒痕錄",
 "百四十軒吟",
 "太虛齋課兒試帖",
 "金線集",
 "草窗隨筆錄",
 "二續",
 "晉春秋傳奇",
 "儒門語要",
 "箴銘錄要",
 "儒學入門",
 "湯文正公志學會規",
 "家規",
 "二曲集錄要",
 "老子參註",
 "志樂輯略",
 "畬香草存",
 "詩傳題辭故",
 "春秋經異",
 "論語異文集覽",
 "時藝",
 "雜著絕筆",
 "香蘇山館古體詩集",
 "今體詩集",
 "石溪舫詩話",
 "聽香館叢錄",
 "增修鵞湖書田志",
 "東鄉風土記",
 "粵游日記",
 "新田十憶圖詠",
 "香蘇草堂圖詠",
 "秦淮春泛圖詠",
 "拜梅圖詠",
 "廬山紀游圖詠",
 "武夷紀游圖詠",
 "蓮花博士圖詠",
 "鶴聽詩圖詠",
 "靈芬館詩初集",
 "江行日記",
 "樗園銷夏錄",
 "靈芬館詩話",
 "爨餘集",
 "爨餘叢話",
 "四書恆解",
 "詩經恆解",
 "書經恆解",
 "書序辨正",
 "易經恆解",
 "周官恆解",
 "禮記恆解",
 "儀禮恆解",
 "春秋恆解",
 "附錄餘傳",
 "史存",
 "孝經直解",
 "明良志略",
 "大學古本質言",
 "正譌",
 "子問",
 "又問",
 "拾餘四種",
 "恆言",
 "賸言",
 "家言",
 "雜問",
 "槐軒雜著",
 "槐軒約言",
 "槐軒俗言",
 "槐軒蒙訓",
 "下學梯航",
 "尋常語",
 "莊子約解",
 "外附",
 "遺訓存略",
 "感應篇韻語",
 "續性理吟",
 "村學究語",
 "醒迷錄",
 "戒淫寶訓",
 "感應篇註釋",
 "易知錄",
 "小謨觴館詩集",
 "竹田樂府",
 "竹里畫者詩",
 "竹里耆舊詩",
 "感逝詩",
 "順安詩草",
 "稻香樓詩稾",
 "蘭心閣詩稾",
 "竹岡小草",
 "字書三辨",
 "四書圖表就正",
 "端溪書院志",
 "端溪課藝",
 "竹岡雜綴",
 "竹岡詩草",
 "竹岡鴻爪錄",
 "竹岡同學錄",
 "竹屋寒衾圖",
 "逸草",
 "蘭山詩草",
 "律古",
 "律古續藁",
 "集唐",
 "雜藁",
 "四書六韻",
 "沅州雜詠",
 "瀟湘八景集句",
 "八病說",
 "文藁次編",
 "書農府君（胡敬）年譜",
 "崇雅堂文鈔",
 "應制存稿",
 "刪餘詩",
 "國朝院畫錄",
 "南薰殿圖像考",
 "時齋四書簡題",
 "簡題補",
 "桐窗課解偶編",
 "初學四書文法述聞",
 "諸經緒說",
 "諸史簡論",
 "桐窗雜著十種",
 "桐窗囈說",
 "閣居鏡語",
 "教家約言",
 "授徒閒筆",
 "潼川書院志",
 "華原書院志",
 "芻蕘私語",
 "病壯日札",
 "夕照編",
 "桐窗餘著三書",
 "羣書摘旨",
 "諸子雜斷",
 "諸集揀批",
 "桐窗殘筆",
 "桐窗餘藁",
 "桐窗散存",
 "時齋文集初刻",
 "時齋詩集初刻",
 "桐閣拾遺",
 "關中道脈四種書",
 "馮少墟關學編",
 "張子釋要",
 "馮少墟關中四先生要語錄",
 "桐閣關中三先生語要",
 "關中兩朝文鈔",
 "關中兩朝賦鈔",
 "關中兩朝詩鈔",
 "又補",
 "兩朝文選要",
 "經世文選要",
 "經義文選要",
 "正學文要",
 "西河古文錄",
 "花筆草",
 "諸史孝友傳",
 "毛詩紬義",
 "著花庵集",
 "吳門集",
 "南歸集",
 "柴辟亭詩二集",
 "十經齋文二集",
 "九曲漁莊詞",
 "柴辟亭讀書記",
 "易音補遺",
 "絳雲樓印拓本題辭",
 "論語經解",
 "鉏經堂文鈔",
 "漢書地理志考證",
 "禹頁孔正義引地理志考證",
 "漢書引經劄記",
 "朱茮堂經進文",
 "朱茮堂奏稿",
 "平湖朱氏家譜錄要",
 "西巡舊典等劄記",
 "四書文殘稿",
 "試帖詩殘稿",
 "集篆隸屏聯稿",
 "詠梅軒思忠錄",
 "軍興紀略",
 "詠梅軒雜記",
 "姚公遺蹟詩鈔",
 "夢陔堂詩集",
 "夢陔堂文說",
 "夢陔堂文集",
 "方植之先生年譜",
 "待廬遺集文",
 "攷槃集文錄",
 "半字集",
 "考槃集",
 "王餘集",
 "儀衛軒遺詩",
 "陶詩附考",
 "解招魂",
 "山天衣聞",
 "進修譜",
 "未能錄",
 "大意尊聞",
 "向果微言",
 "述恉",
 "昭昧詹言",
 "話山草堂詩鈔",
 "話山草堂雜著",
 "六義郛郭",
 "八法筌蹄",
 "六書穅秕",
 "論語比",
 "操縵易知",
 "共城從政錄",
 "海陵從政錄",
 "廣陵從政錄",
 "感深知己錄",
 "一瞚錄",
 "家蔭堂詩鈔",
 "家蔭堂尺牘",
 "渭川劄存",
 "鵠山小隱詩集",
 "鵠山小隱文集",
 "東坡詩集",
 "東坡文集",
 "壯遊草",
 "天門書院雜著",
 "耄學詩集",
 "耄學交集",
 "桐芭雜著",
 "吾同山館改課",
 "吾同山館試帖",
 "荊湖知舊詩鈔",
 "竟陵詩選",
 "竟陵詩話",
 "竟陵文選",
 "開闢傳疑",
 "古史紀年",
 "古史考年異同表",
 "後說",
 "武王克殷日記",
 "滅國五十考",
 "春秋經傳比事",
 "戰國紀年",
 "地輿",
 "竹書紀年補證",
 "本未",
 "後案",
 "孔門師弟年表",
 "孟子時事年表",
 "孔子世家補訂",
 "孟子列傳纂",
 "孟子外書補證",
 "四書拾遺",
 "古書拾遺",
 "開卷偶得",
 "宜略識字",
 "識字續編",
 "論世約編",
 "閒居雜錄",
 "明詩綜采輯書目",
 "兩淮鹽筴書引證羣書目錄",
 "宋金交聘表",
 "風懷詩補註",
 "酌史岩摭譚",
 "石經閣日抄",
 "孟子外書集證",
 "海運芻言",
 "推春秋日食法",
 "春秋朔閏表發覆",
 "求己堂詩集",
 "求己堂文集",
 "歷代編年大事表",
 "毛詩通攷",
 "冠昏喪祭儀考",
 "品官家儀考",
 "士人家儀考",
 "人家冠昏喪祭考",
 "史記蠡測",
 "脩本堂稿",
 "月亭詩鈔",
 "古諺箋",
 "學海堂志",
 "公車見聞錄",
 "今白華堂詩錄",
 "今白華堂文集",
 "今白華堂時文",
 "今白華堂試帖",
 "過庭筆記",
 "關中書院試帖",
 "萼君府君年譜",
 "管情三義賦",
 "濁泉編",
 "齊民四術農",
 "禮",
 "刑",
 "兵",
 "退菴自訂年譜",
 "退菴隨筆",
 "南省公餘錄",
 "古格言",
 "閩川閨秀詩話",
 "農候襍占",
 "四書釋地辨證",
 "答雷竹卿書",
 "漢甘露石渠禮議",
 "樸學齋文錄",
 "憶山堂詩錄",
 "洞簫樓詩紀",
 "洞簫樓詞鈔",
 "求是堂文集",
 "駢體文",
 "求是堂詩集",
 "稼墨軒易學",
 "有不為齋隨筆",
 "稼墨軒詩集",
 "梅花書屋文",
 "求己筆記",
 "宋湘颿先生行述",
 "松心文鈔",
 "松心詩集",
 "國朝詩人徵略初稿",
 "聽松廬詩鈔",
 "松心詩錄",
 "松心雜詩",
 "聽松廬駢體文鈔",
 "聽松廬詩話",
 "藝談錄",
 "花甲閒談",
 "桂遊日記",
 "春遊唱和詩",
 "琴士詩鈔",
 "消暑錄",
 "金石文鈔",
 "竹書紀年校補",
 "趙氏淵源集",
 "蘭言集",
 "金仁山論孟考證輯要",
 "四書集注管窺",
 "有深致軒駢體文稿",
 "有深致軒詩賸稿",
 "有深致軒制藝",
 "味雋齋史義",
 "介存齋文稿",
 "淮鹺問畣",
 "介存齋詩",
 "存審軒詞",
 "折肱錄",
 "儲素樓詞",
 "春明雜著",
 "上谷存牘",
 "中州存牘",
 "里居雜著",
 "虔南存牘",
 "黔臬存牘",
 "黔藩存牘",
 "雙圃氏同館賦鈔",
 "周夢巖同館賦鈔",
 "惇裕堂文集",
 "養浩齋詩稿",
 "養浩齋詩續稿",
 "宦遊紀略",
 "續宦遊紀錄",
 "禹貢正字",
 "四書說略",
 "說文繫傳校錄",
 "毛詩雙聲叠韻說",
 "菉友蛾術編",
 "春草堂駢體文",
 "古近體詩",
 "詞錄",
 "春草堂詩話",
 "黃河遠",
 "十二金錢",
 "繡帕記",
 "血梅記",
 "錢式圖",
 "花木小志",
 "雨窗記所記",
 "雨窗隨筆",
 "恩怨錄",
 "伯山文集",
 "伯山日記",
 "易錄",
 "秋芸館詩稿",
 "素書輯註",
 "秋芸館古文稿",
 "秋芸館駢體文稿",
 "方輿纂要",
 "輿圖論略",
 "讀史樂府",
 "十二樹梅花書屋古文",
 "時文",
 "培根堂詩鈔",
 "海天琴趣詞",
 "養淵堂古文",
 "養淵堂駢體文",
 "味經齋制藝",
 "鑄鐵硯齋詩",
 "蜨階外史",
 "翠微軒詩稿",
 "林文忠公政書三集",
 "蒐遺",
 "滇軺紀程",
 "荷戈紀程",
 "存素堂詩稾",
 "頤壽老人年譜",
 "存素堂文稾",
 "壬癸志稾",
 "東溟文集",
 "文外集",
 "後湘詩集",
 "東溟奏稿",
 "寸陰叢錄",
 "康輶紀行",
 "姚氏先德傳",
 "中復堂遺稿",
 "中復堂年譜",
 "惕園中初稾",
 "惕園外稿",
 "惕園詩稾",
 "書札僅存",
 "莊嶽談",
 "童子摭談",
 "謬言意言附識",
 "日記僅存",
 "故紙隨筆",
 "約語追記",
 "約語補錄",
 "拳石山房遺集",
 "東山酬唱",
 "濟北頌言",
 "馮春暉年譜",
 "旭林府君行述",
 "養餘齋初集",
 "勝溪竹枝詞",
 "分湖小識",
 "分湖柳氏重修家譜",
 "雪牀遺詩",
 "浙東紀遊草",
 "秋樹讀書樓遺集",
 "啖蔗軒詩存",
 "啖蔗軒自訂年譜",
 "蔗餘偶筆",
 "鮑覺生先生未刻詩",
 "梁聞山先生評書帖",
 "邵邡詩稿",
 "制藝",
 "藥言賸稿",
 "𠙆書補",
 "說文通訓定聲補遺",
 "夏小正補傳",
 "儀禮經注一隅",
 "春秋左傳識小錄",
 "小爾雅約注",
 "離騷賦補注",
 "易圖正旨",
 "從學劄記",
 "五子見心錄",
 "慎甫文存",
 "時學正衡",
 "經義正衡敍錄",
 "尚書啟幪",
 "春秋釋",
 "論語後案",
 "周季編略",
 "儆居集",
 "讀通考",
 "讀子集",
 "音均部略",
 "炳燭錄",
 "黃氏塾課",
 "經外緒言",
 "鄭君粹言",
 "朱呂問答",
 "斯未信齋文編",
 "官牘",
 "軍書",
 "藝文",
 "斯未信齋雜錄",
 "檀弓辨誣",
 "述朱質疑",
 "釋字",
 "三綱制服尊尊述義",
 "學禮管釋",
 "讀詩劄記",
 "詩章句攷",
 "詩樂存亡譜",
 "詩經集傳校勘記",
 "詩古韻表二十二部集說",
 "學制統述",
 "六書轉注說",
 "養痾三編",
 "漢唐諸儒與聞錄",
 "訏謨成竹",
 "息游詠歌",
 "漢賈誼政事疏攷補",
 "明翰林學士當塗陶主敬先生（安）年譜",
 "景紫堂文集",
 "一經廬琴學",
 "琴操題解",
 "書學拾遺",
 "一經廬文鈔",
 "生齋讀易日識",
 "生齋自知錄",
 "生齋日識",
 "生齋文稾",
 "寅甫日記",
 "寅甫小稾",
 "生齋詩稾",
 "覆校穆天子傳",
 "校正古今人表",
 "焦氏易林校略",
 "答疑孟",
 "駁正朔考",
 "辯宜齋野乘",
 "懷小編",
 "蓮溪吟稾",
 "蓮溪試帖",
 "蓮溪文稿不分卷續刻",
 "桂馨書屋遺文",
 "桂馨塾課",
 "周易述傳",
 "周易訟卦淺說",
 "禹貢集釋",
 "禹貢蔡傳正誤",
 "禹貢錐指正誤",
 "毛鄭詩釋",
 "毛詩草木鳥獸蟲魚疏正",
 "儀禮釋注",
 "周禮釋注",
 "北宋汴學二體石經記",
 "淮安北門城樓金天德年大鐘款識",
 "子史粹言",
 "諸子粹言",
 "讀史粹言",
 "頤志齋四譜",
 "漢鄭君（玄）年譜",
 "魏陳思王（曹植）年譜",
 "晉陶靖節（潛）年譜",
 "唐陸宣公（贄）年譜",
 "石亭記事",
 "百家姓三編",
 "讀經說",
 "榕園文鈔",
 "榕園詩鈔",
 "潤經堂自治官書",
 "江南催耕課稻編",
 "榕園識字編",
 "國語校注本三種",
 "國語明道本考異",
 "國語三君注輯存",
 "國語發正",
 "漢書地理志校本",
 "借閒生詩",
 "東華錄綴言",
 "清語人名譯漢",
 "歌章祝辭輯錄",
 "諡法續考",
 "本朝王公封號",
 "封諡繙清",
 "侍衛瑣言",
 "管見所及",
 "寄楮備談",
 "煨柮閒談",
 "括談",
 "松龕先生奏疏",
 "松龕先生文集",
 "徐氏本支敍傳",
 "論語古解",
 "南漢書",
 "南漢書考異",
 "南漢叢錄",
 "南漢文字略",
 "續金石稱例",
 "碑文摘奇",
 "書餘",
 "東坡事類",
 "江梅夢雜劇",
 "圓香夢雜劇",
 "曇花夢雜劇",
 "斷緣夢雜劇",
 "仰止編",
 "說性",
 "考禮",
 "可也簡廬筆記",
 "養恬齋筆記",
 "孟子外書",
 "津河客集",
 "呂子校補獻疑",
 "元號略補遺",
 "續人表考校補",
 "續呂子校補獻疑",
 "讀瞥記校補",
 "補校庭立紀聞",
 "元號略續校補",
 "卦氣表",
 "卦氣證",
 "廬山紀遊",
 "西征述",
 "後西征述",
 "游藝錄",
 "李文恭公奏議",
 "李文恭公詩集",
 "李文恭公行述",
 "學詩詳說",
 "學詩正詁",
 "悔過齋文集",
 "悔過齋續集",
 "經遺說",
 "周禮車服志",
 "考工記異字訓正",
 "考工記異讀訓正",
 "考工記鳥獸蟲魚釋",
 "丁戊筆記",
 "養志居文稿彙存",
 "詩殘稿",
 "四書約解",
 "志節編",
 "袖海樓文錄",
 "古今歲實考校補",
 "古今朔實考校補",
 "日知錄栞誤合刻",
 "六秝通考",
 "九執秝解",
 "回回秝解",
 "算賸初編",
 "餘稾",
 "周髀算經校勘記",
 "傷寒雜病論補注",
 "吳越春秋校勘記",
 "華陽國志校勘記",
 "七國地理考",
 "國策紀年",
 "皇清經解淵源錄",
 "皇清經解提要",
 "羣書提要",
 "讀經如面",
 "讀易寡過",
 "周官識小",
 "左官異禮畧",
 "羣書雜義",
 "袁浦札記",
 "秋陰雜記",
 "仿今言",
 "芙村學吟",
 "求志居集",
 "求志居書經說",
 "求志居詩經說",
 "求志居禮說",
 "求志居春秋說",
 "大學俟",
 "中庸俟",
 "論語俟",
 "孟子俟",
 "求志居時文",
 "陳徵君（世鎔）行述",
 "歷下偶談",
 "歷下偶談續編",
 "匡山叢話",
 "史記辨證",
 "持雅堂文鈔",
 "三家詩話",
 "清鑑錄",
 "讀書雜志",
 "蒔古齋隨筆",
 "蒔古齋吟稿",
 "一栗廬詩一稿",
 "二稿",
 "鐙窗瑣話",
 "柳隱叢譚",
 "外丁卯橋居士初藁",
 "東洋小艸",
 "附斫劍詞",
 "鶴場漫志",
 "潔華錄",
 "徵麟錄",
 "脩省格言",
 "經驗良方",
 "集古詩附存",
 "玉函山房詩鈔",
 "百八唱和集",
 "種玉山房詩草",
 "玉函山房試帖",
 "月令七十二候詩",
 "夏小正詩",
 "治家格言詩",
 "文選擬題詩",
 "玉函山房制義",
 "農諺",
 "竹如意",
 "買春詩話",
 "伯山文鈔",
 "伯山詩鈔",
 "癸巳集",
 "由庚集",
 "愛日集",
 "小海山房詩集",
 "三國志補義",
 "伯山詩話後集",
 "三續集",
 "四續集",
 "白雲山房詩集",
 "考工釋車",
 "離騷經章句義疏",
 "等韻簡明指掌圖",
 "論",
 "我師錄",
 "固圉錄",
 "除氛錄",
 "學治錄初編",
 "後漢公卿表",
 "後漢書注刊誤",
 "西秦百官表",
 "北周公卿表",
 "五代地理攷",
 "明諡法攷",
 "伯穎雜文",
 "天文祛異",
 "地理徵今",
 "井田計畝",
 "漢上叢談",
 "夢竹軒筆記",
 "江陵縣志刊誤",
 "孤蓬聽雨錄",
 "盂蘭夢傳奇",
 "附曲譜",
 "來𡕨堂講義",
 "小學補",
 "大學古本釋",
 "來𡕨堂學內篇",
 "來𡕨堂海防私籌",
 "來𡕨堂私說",
 "來𡕨堂家禮",
 "來𡕨堂家規",
 "安東改河議",
 "馬棚灣漫工始末",
 "佐治芻言",
 "清道光二十八年（1848）二樂堂墊刊本首",
 "四書題說",
 "正念齋語",
 "近思齋答問",
 "近思齋書牘",
 "近思齋雜著",
 "閩中錄異",
 "讀說文記",
 "古均閣文",
 "讀書偶識",
 "五韵論",
 "顓頊厤攷",
 "紅崖刻石釋文",
 "石泉書屋類稿",
 "館課詩",
 "制藝補編",
 "古泉匯首集",
 "元集",
 "亨集",
 "利集",
 "貞集",
 "書畫鑑影",
 "武定詩續鈔",
 "吾廬筆談",
 "坦室遺文",
 "依隱齋詩鈔",
 "鴻爪詞",
 "哀絃豪竹詞",
 "菊花詞",
 "集牡丹亭詞",
 "香草詞補遺",
 "曲",
 "夏雨軒雜文",
 "岷江紀程",
 "楹帖偶存",
 "復莊詩問",
 "疎影樓詞",
 "復莊駢儷文榷",
 "緬甸風土詩",
 "雲南風土紀事詩",
 "漁舟紀談",
 "漁舟續談",
 "山中懷往詩",
 "養親須知",
 "溫清錄",
 "倚晴樓詩集",
 "倚晴樓七種曲",
 "茂陵絃",
 "帝女花",
 "脊令原",
 "鴛鴦鏡",
 "淩波影",
 "桃谿雪",
 "居官鑑",
 "七經樓文鈔",
 "春暉閣詩選",
 "華獄圖經",
 "江西水道攷",
 "鄭學錄",
 "巢經巢集經說",
 "巢經巢詩鈔",
 "巢經巢詩集",
 "巢經巢遺詩",
 "鄭子尹（珍）先生年譜",
 "巢經巢經說",
 "巢經巢文鈔",
 "詩鈔前集",
 "母教錄",
 "鳧氏圖說",
 "樗繭譜",
 "播雅",
 "漱芳齋文鈔",
 "六書淺說",
 "羅忠節公遺集",
 "周易附說",
 "羅忠節公年譜",
 "春秋左傳校勘記補正",
 "宋余仁仲本公羊經傳解詁校記",
 "公羊注疏校勘記補正",
 "急就章跋",
 "吳音奇字跋",
 "孟子音義校記初稿",
 "孟子音義校記",
 "切韻指掌圖校記",
 "文村雜稿",
 "文村書跋",
 "播琴山館雜錄",
 "文村筆記",
 "春秋四傳詁經",
 "尉山堂稿",
 "通鑑綱目前編辨誤",
 "資治通鑑綱目正編正誤補",
 "萬青軒先生年譜",
 "舒蓺室隨筆",
 "舒蓺室雜著甲編",
 "舒蓺室詩存",
 "索笑詞",
 "鼠壤餘蔬",
 "舒蓺室詩續存",
 "舒蓺室尺牘偶存",
 "湖樓校書記",
 "餘記",
 "西泠續記",
 "蓮龕尋夢記",
 "夢因錄",
 "撰聯記偶",
 "懷舊襍記",
 "舒蓺室雜存",
 "牧篴餘聲",
 "廋辭偶存",
 "俗語集對",
 "記夢四則",
 "周禮職官分屬歌",
 "山海經表目",
 "記過齋贈言",
 "附言行畧",
 "記過齋文稿",
 "貞壽堂贈言",
 "師友札記",
 "大學臆說",
 "記過齋叢書",
 "強恕堂傳家集",
 "儒門法語",
 "辨心性書",
 "心述",
 "性述",
 "觀玩隨筆",
 "讀書經筆記",
 "詩經序傳擇參",
 "讀詩經筆記",
 "春秋初讀",
 "周子書注劄記",
 "正蒙分目解按",
 "膠西講義",
 "數往錄",
 "立本趣時說",
 "顧庸集",
 "求矢集",
 "膠西課存",
 "包軒遺編",
 "漢儒通義",
 "聲律通考",
 "切韻考",
 "漢書理志水道圖說",
 "考正德清胡氏禹貢圖",
 "曾文正公奏稿",
 "曾文正公書札",
 "曾文正公批牘",
 "曾文正公雜箸",
 "求闕齋讀書錄",
 "求闕齋日記類鈔",
 "曾文正公年譜",
 "曾文正公家書",
 "曾文正公手札",
 "曾文正公雜著",
 "曾文正公日記",
 "敝帚齋主人年譜",
 "未灰齋文集",
 "小腆紀年附攷",
 "尚書傳授同異考",
 "尚書通義",
 "禮經通論",
 "李氏孝經注輯本",
 "曾子大孝編注",
 "四庫簡明目錄標注",
 "半巖廬遺文",
 "明季國初進士履歷跋後",
 "半巖廬日記",
 "觀古閣泉說",
 "續泉說",
 "觀古閣叢稿",
 "大錢圖錄",
 "虞夏贖金釋文",
 "喜蔭簃論泉截句",
 "海東金石苑",
 "青龍山集",
 "紙園筆記經餘",
 "紙園筆記史略",
 "紙園筆記皇朝故事",
 "讀左劄記",
 "一粟齋試帖",
 "一蠡詩存",
 "運詩",
 "倒字詩",
 "易解囈通",
 "罧盦先生籌蜀記",
 "罧盦先生惠蜀書",
 "漢安徵信錄",
 "前漢書注考證",
 "後漢書注考證",
 "海陀華館文集",
 "隙亭賸草",
 "襍言",
 "先世事略",
 "養性齋經訓",
 "諫垣存稿",
 "求在我齋制藝",
 "韻學源流",
 "郘亭外集",
 "影山草堂詩鈔",
 "宋元舊本書經眼錄",
 "郘亭詩鈔",
 "郘亭遺詩",
 "郘亭遺文",
 "貞定先生遺集",
 "左文襄公奏稿",
 "左文襄公書牘",
 "說帖",
 "左文襄公批札",
 "左文襄公咨札",
 "告示",
 "左文襄公謝摺",
 "左文襄公文集",
 "張大司馬奏稿",
 "駱文忠公奏稿",
 "息柯白箋",
 "息柯雜著",
 "歸石軒畫談",
 "夢綠亭會合詩",
 "先德錄",
 "浯溪紀遊詩",
 "集浯溪碑字聯語",
 "三十樹梅花書屋詩鈔",
 "胡林翼年譜",
 "胡林翼奏議",
 "胡林翼書牘",
 "胡林翼批札",
 "胡林翼語錄",
 "通論",
 "讀史兵畧",
 "四音定切",
 "說文雙聲",
 "昨非集",
 "持志塾言",
 "藝槩",
 "古桐書屋劄記",
 "游藝約言",
 "制藝書存",
 "說文引經例辨",
 "說文外篇",
 "韵府鉤沈",
 "睡餘偶筆",
 "道福堂詩集",
 "乃有廬雜著",
 "劉氏碎金",
 "豫章語錄",
 "琴韵居詩存",
 "煙嶼樓文集",
 "重刻遊杭合集",
 "尚書逸湯誓考",
 "校勘",
 "山中學詩記",
 "補瘗鶴銘考",
 "十二硯齋隨錄",
 "清湘老人題記",
 "論語淺解",
 "中候曲興",
 "河圖帝通記",
 "喬勤恪公奏議",
 "通齋詩集",
 "垂金蔭綠軒詩鈔",
 "圃珖巖館詩鈔",
 "通齋文集",
 "曉瀛遺稿",
 "文苑珠林",
 "榕堂續錄",
 "窺豹集",
 "南行紀程",
 "南漘楛語",
 "悔餘菴文稿",
 "餘辛集",
 "悔餘菴尺牘",
 "衲蘇集",
 "悔餘菴集句楹聯",
 "岳麓文集",
 "十室遺語",
 "類藻引注",
 "養正編",
 "問梅軒文稿偶存",
 "教士彙編",
 "問梅軒詩草偶存",
 "空青水碧齋文集",
 "白華之什",
 "先德小識",
 "湌芍華館隨筆",
 "湌芍華館遺文",
 "訓蒙千字文",
 "何文貞公遺集",
 "體微齋日記錄存",
 "體微齋遺編語錄",
 "附詩",
 "柏堂經說",
 "書傳補義",
 "詩傳補義",
 "禮記集說補義",
 "春秋傳正誼",
 "孝經章義",
 "讀學庸筆記",
 "讀論孟筆記",
 "柏堂讀書筆記",
 "讀文雜記",
 "說詩章義",
 "陶詩真詮",
 "讀宋鑑論",
 "讀諸子諸儒書雜記",
 "輔仁錄",
 "周子通書講義",
 "俟命錄",
 "吳竹如先生（廷棟）年譜",
 "柏堂集前編",
 "次編",
 "餘編",
 "補存",
 "毅齋遺集",
 "劉武慎公奏稿",
 "劉武慎公稟牘",
 "劉武慎公尺牘",
 "劉武慎公官書",
 "劉武慎公遺文詩存雜記",
 "劉武慎公行狀",
 "劉果敏公奏稿",
 "劉果敏公批牘",
 "昇嘮敏公書劄",
 "劉果敏公文集",
 "劉果敏公從戎識實",
 "學計一得",
 "補小爾雅釋度量衡",
 "格術補",
 "對數尺記",
 "乘方捷算",
 "鄒徵君存稿",
 "輿地全圖",
 "赤道南北恆星圖",
 "夏氏算學四種",
 "少廣縋鑿",
 "洞方術圖解",
 "致曲圖解",
 "徐氏算學三種",
 "橢圓求周術",
 "畚塘芻論",
 "河防紀略",
 "蒼莨初集詩集",
 "寤言",
 "附質疑",
 "周易臆解",
 "初學入門",
 "許松濱先生條答",
 "許松濱先生詩集",
 "侍疾日記",
 "丁文誠公奏稿",
 "𨚲䣕山房詩存",
 "𨚲䣕山房文略",
 "𨚲䣕山房疏艸",
 "𨚲䣕山房駢文",
 "甕天瑣錄",
 "蓮溪吟草",
 "北上吟草",
 "庚寅北上吟草",
 "史外韻語書後",
 "宦遊吟草",
 "仕餘吟草",
 "舟行吟草",
 "六十壽言",
 "惠民頌言",
 "宰惠紀略",
 "災賑日記",
 "牧東紀略",
 "東平教案記",
 "宰德小記",
 "書札記事",
 "周甲錄",
 "蒙難追筆",
 "大衍筮法直解",
 "仙源礪士參語",
 "夏小正箋疏",
 "淡園文集",
 "大學古本參誼",
 "儀禮先簿",
 "毛詩鄭譜疏證",
 "四詩世次通譜",
 "尚書篇誼正蒙",
 "周易正蒙",
 "讀易綱領",
 "毛詩七聲四音譜",
 "官制沿革表",
 "選舉沿革表",
 "食貨書",
 "羣經平議",
 "周易平議",
 "尚書平議",
 "周書平議",
 "毛詩平議",
 "周禮平議",
 "考工記世室重屋明堂考",
 "儀禮平議",
 "大戴禮記平議",
 "小戴禮記平議",
 "春秋公羊傳平議",
 "春秋穀梁傳平議",
 "春秋左傳平議",
 "春秋外傳國語平議",
 "論語平議",
 "孟子平議",
 "爾雅平議",
 "諸子平議",
 "管子平議",
 "晏子春秋平議",
 "老子平議",
 "墨子平議",
 "荀子平議",
 "列子平議",
 "莊子平議",
 "商子平議",
 "韓非子平議",
 "呂氏春秋平議",
 "春秋繁露平議",
 "賈子平議",
 "淮南內篇平議",
 "揚子太玄平議",
 "揚子法言平議",
 "第一樓叢書",
 "易貫",
 "玩易篇",
 "論語小言",
 "春秋名字解詁補義",
 "兒笘錄",
 "讀書餘錄",
 "詁經精舍自課文",
 "湖樓筆談",
 "曲園雜纂",
 "艮宧易說",
 "達齋書說",
 "達齋詩說",
 "達齋春秋論",
 "達齋叢說",
 "荀子詩說",
 "何劭公論語義",
 "士昏禮對席圖",
 "樂記異文考",
 "春秋歲星考",
 "卦氣直日考",
 "左傳古本分年考",
 "春秋人地名對",
 "邵易補原",
 "讀韓詩外傳",
 "讀吳越春秋",
 "讀越絕書",
 "讀鶡冠子",
 "讀鹽鐵論",
 "讀潛夫論",
 "讀論衡",
 "讀中論",
 "讀抱朴子",
 "讀文中子",
 "改吳",
 "說項",
 "正毛",
 "評袁",
 "通李",
 "議郎",
 "訂胡",
 "日知錄小箋",
 "苓子",
 "小繁露",
 "韵雅",
 "小浮梅閒話",
 "續五九枝譚",
 "吳中唱和詩",
 "梵珠",
 "百空曲",
 "十二月花神議",
 "吳絳雪（宗愛）年譜",
 "五行占",
 "集千字文詩",
 "隱書",
 "老圓",
 "俞樓雜纂",
 "易窮通變化論",
 "周易互體徵",
 "八卦方位說",
 "卦氣續考",
 "詩名物證古",
 "禮記鄭讀考",
 "禮記異文箋",
 "鄭君駁正三禮考",
 "九族考",
 "玉佩考",
 "喪服私論",
 "左傳連珠",
 "論語鄭義",
 "續論語駢枝",
 "論語古注擇從",
 "孟子古注擇從",
 "孟子高氏學",
 "孟子纘義內外篇",
 "四書辨疑辨",
 "讀文子",
 "讀公孫龍子",
 "讀山海經",
 "讀楚辭",
 "讀漢碑",
 "讀昌黎先生集",
 "讀王觀國學林",
 "讀王氏稗疏",
 "莊子人名考",
 "楚辭人名考",
 "駢隸",
 "讀隸輯詞",
 "廣雅釋詁疏證拾遺",
 "著書餘料",
 "佚詩",
 "銘篇",
 "玉堂舊課",
 "廣楊園近鑑",
 "壼東漫錄",
 "百哀篇",
 "詠物二十一首",
 "枕上三字訣",
 "廢醫論",
 "九宮衍數",
 "金剛經訂義",
 "一笑",
 "說俞",
 "俞樓經始",
 "賓萌集",
 "春在堂雜文",
 "五編",
 "六編",
 "春在堂詩編",
 "春在堂隨筆",
 "春在堂尺牘",
 "楹聯錄存",
 "右台仙館筆記",
 "茶香室叢鈔",
 "荼香室經說",
 "經課續編",
 "九九銷夏錄",
 "金剛般若波羅蜜經注",
 "太上感應篇纘義",
 "小蓬萊謠",
 "袖中書",
 "東瀛詩記",
 "東海投桃集",
 "慧福樓幸草",
 "曲園自述",
 "曲園墨戲",
 "曲園三耍",
 "八卦葉子格",
 "三才中和牌譜",
 "勝遊圖",
 "春在堂全書錄要",
 "春在堂全書校勘記",
 "春在堂傳奇二種",
 "驪山傳",
 "梓潼傳",
 "新定牙牌數",
 "春在堂輓言",
 "漁浦草堂文集",
 "漁浦草堂詩（一名張伯幾詩）",
 "舊唐書勘同",
 "唐浙中長官考",
 "臨安旬制記",
 "字典翼",
 "雪煩叢識",
 "鷗巢閒筆",
 "雪煩廬記異",
 "蘇亭詩話",
 "漚巢詩話",
 "鶴背生詞",
 "梅花夢",
 "張少南先生喬梓著述目錄",
 "爾爾書屋詩草",
 "家藏書畫記",
 "全史宮詞",
 "疊雅",
 "異號類編",
 "古今風謠拾遺",
 "古今諺拾遺",
 "燕說",
 "雙名錄",
 "止園筆談",
 "放言百首",
 "永平三子遺書",
 "佘潛滄四書解",
 "復葊遺書",
 "損齋遺書",
 "永平詩存",
 "樂亭四書文鈔",
 "硯農制義",
 "梧風竹月書巢試帖",
 "藼庭壽言",
 "樗壽贈言",
 "春煦軒文集",
 "味古齋詩存",
 "小滄嶼山房詩存",
 "孝經章句一卷刊誤辯說一卷",
 "庭訓筆記",
 "前型紀畧",
 "說夢錄",
 "驂鸞小說",
 "磨盾集",
 "河壖贅筆",
 "黃忠端公孝經辯義",
 "孝經述",
 "孔庭學裔",
 "澹勤室詩",
 "紫泥日記",
 "明范文忠公畫像宦蹟圖題詞",
 "明五忠手蹟攷存",
 "黃忠端公明誠堂十四札疏證",
 "曾忠襄公文集",
 "曾忠襄公奏議",
 "曾忠襄公書札",
 "曾忠襄公批牘",
 "曾忠襄公年譜",
 "曾忠襄公榮哀錄",
 "求益齋讀書記",
 "求益齋隨筆",
 "漢州邵縣吏制考",
 "金壇見聞記",
 "求益齋文集",
 "周易屬辭",
 "通例",
 "通說",
 "漢書彙鈔",
 "鹿山雜著",
 "癸甲試賦",
 "介堂經解",
 "介堂詩詞",
 "介堂文筆",
 "東牟紀事",
 "白溝草",
 "蓼六唫",
 "慈竹軒制藝",
 "宦豫草",
 "錦城吟",
 "宦蜀紀程",
 "宦蜀草",
 "棧雲小藁",
 "驛鐙小藁",
 "筍輿吟",
 "潼江草",
 "密厓文鈔",
 "聽鶯池館閒詠",
 "楚遊小草",
 "燕遊小草",
 "篷背吟",
 "教學編",
 "北遊草",
 "北遊續詠",
 "耕邨姑留稿",
 "困學邇言初編",
 "居官臆測",
 "勸學芻言",
 "詩經口義",
 "屺雲樓詩話",
 "屺雲樓詩選初集",
 "通介堂經說",
 "樂律攷",
 "靈州山人詩錄",
 "孝經質疑",
 "後漢書朔閏攷",
 "三國志質疑",
 "句股通義",
 "學一齋算課草",
 "學一齋句股代數草",
 "學一齋算學問答",
 "算學報",
 "借箸錄",
 "汲古錄",
 "剪燭錄",
 "壓線錄",
 "陳炯齋遺詩",
 "姚正甫文集",
 "杭湖防堵記略",
 "牛營奕營記略",
 "赴營記略",
 "勝營記略",
 "和營記略",
 "校校正",
 "詩地理攷略",
 "詩管見",
 "黃縣志稿",
 "鼎吉堂詩鈔",
 "鼎吉堂文鈔",
 "蠡書",
 "閩遊記略",
 "樸學廬文初鈔",
 "樸學廬文鈔",
 "樸學廬外集鈔",
 "周易卦變圖說",
 "詩經異文補釋",
 "續方言新校補",
 "方言別錄",
 "蜀方言",
 "廣釋親",
 "𡳅叜摭筆",
 "今悔庵詩",
 "耶律楚材西遊錄今釋",
 "湛然居士（耶律楚材）年譜",
 "成吉思汗陵寢辨證書",
 "南園遊記",
 "韓邊外志",
 "南園詩存",
 "南園文存",
 "沌谷筆談",
 "帝賊譜",
 "中國地理沿革史",
 "佛學地理志",
 "萬法精理",
 "泗陽張沌谷居士（相文）年譜",
 "榮哀錄",
 "種樹軒文集",
 "竹閒道人自述年譜",
 "黎文肅公奏議",
 "黎文肅公公牘",
 "黎文肅公書札",
 "黔軺紀程",
 "黎文肅公雜著",
 "求補拙齋文畧",
 "詩畧",
 "養雲山莊文集",
 "劉中丞奏稿",
 "西軺紀略",
 "瀛海採問紀實",
 "西俗雜誌",
 "出洋須知",
 "海外吟",
 "海上吟",
 "官書",
 "甲癸夢痕記",
 "明論",
 "賓退紀談",
 "六一山房詩集",
 "吳平贅言",
 "汝東判語",
 "晦闇齋筆語",
 "南屏贅語",
 "湖塘林館駢體文鈔（一名越縵堂類稾）",
 "蘿菴日鈔",
 "越縵堂詩文集",
 "越中先賢祠目序例",
 "柯山漫錄",
 "窮愁錄",
 "蘿菴游賞小志",
 "越縵叢稾棄餘",
 "越縵山房叢稾",
 "寒松閣詩",
 "寒松閣駢體文",
 "寒松閣詞",
 "說文佚字攷",
 "疑年賡錄",
 "滂喜齋學錄",
 "詩經異文",
 "韓詩輯",
 "論語集解校補",
 "國語賈景伯注",
 "離騷釋韻",
 "許叔重淮南子注",
 "兩漢傳經表",
 "問奇室詩集",
 "秋雅",
 "績語堂碑錄",
 "績語堂題跋",
 "績語堂詩存",
 "讀經拾瀋",
 "讀史拾瀋",
 "霞外攟屑",
 "樵隱昔寱",
 "春秋日食攷",
 "音學雜述",
 "讀志隨筆",
 "潔園詩稿",
 "潔園綺語",
 "紫薇花館小學編",
 "說文佚字輯說",
 "字義鏡新",
 "紫薇花館經說",
 "月令動植小箋",
 "尚書職官考略",
 "讀左璅錄",
 "退學述存",
 "紫薇花館雜纂",
 "杖扇新錄",
 "南浦駐雲錄",
 "彪蒙語錄",
 "花信平章",
 "紫薇花館詞稿",
 "春光百一詞",
 "紫薇花館詩稿",
 "紫薇花館文稿",
 "裕德堂一家言",
 "殞淑集",
 "府君（王源通）年譜",
 "榮蘐集",
 "補勤詩存",
 "勤餘文牘",
 "學廬自鏡語",
 "補勤幼學錄",
 "東溟校伍錄",
 "醪河陳氏誦芬錄",
 "綠雲山房詩草",
 "終",
 "大箎吟草",
 "藻川堂詩集選",
 "藻川堂文內集",
 "雲山讀書記內學",
 "外治",
 "藻川堂譚藝",
 "宋史翼",
 "元祐黨人傳",
 "皕宋樓藏書志",
 "吳興金石記",
 "金石學錄補",
 "千甓亭磚錄",
 "三續疑年錄",
 "補疑年錄",
 "唐文拾遺",
 "續拾",
 "儀顧堂集",
 "歸安縣志",
 "羣書校補",
 "李氏易傳校",
 "詩說補",
 "周禮集說補",
 "春秋集傳纂例校",
 "春秋辨疑校",
 "春秋讞義補",
 "羣經音辨校",
 "集韻校",
 "朝野雜記校",
 "國朝名臣事略校",
 "齊民要術校",
 "神仙遺論補",
 "巢氏諸病源候論校",
 "外臺秘要校",
 "敬齋古今黈補",
 "東觀餘論校",
 "論衡校",
 "折獄龜鑑補",
 "西溪叢語校",
 "硯箋校",
 "封氏聞見記校",
 "唐語林補",
 "初學記校",
 "稽神錄校補",
 "集異記校補",
 "道德真經指歸校補",
 "陸士衡集校",
 "陸士龍集校",
 "王黃州小畜集校",
 "錢塘集補",
 "臨川集補",
 "元豐類藁補",
 "曲阜集補",
 "柯山集補",
 "徐照集補",
 "徐璣集補",
 "會稽掇英總集校",
 "續會稽掇英集校補",
 "尤本文選考異補",
 "儀顧堂題跋",
 "吳興詩存初集",
 "千甓亭古塼圖釋",
 "穰梨館過眼錄",
 "宋詩紀事補遺",
 "小傳補正",
 "彊識編",
 "宜祿堂收藏金石記",
 "讀書解義",
 "吉金樂石山房文集",
 "棗花書屋詩集",
 "于埜左傳錄",
 "國風錄",
 "論語聞",
 "象居錄",
 "蠶墨",
 "復初堂文集",
 "論語贅解",
 "易象致用說",
 "四書述義前集",
 "大學述義",
 "中庸述義",
 "論語述義",
 "孟子述義",
 "四書述義後集",
 "大學述義續",
 "中庸述義續",
 "論語述義續",
 "孟子述義續",
 "四書鄉音辨譌",
 "讀經劄記",
 "奉萱草堂文鈔",
 "廉泉先生字學一得",
 "奉萱草堂詩集",
 "春秋鑽燧",
 "古文原始",
 "籀書文集內篇",
 "籀書詩集",
 "蟬蛻集",
 "籀書詞集",
 "無盡鐙詞",
 "東道集",
 "玉犧館詩集",
 "紫薇閣詩集",
 "綸音堂詩集",
 "闕里述聞",
 "皇朝聖師考",
 "毛詩集解訓蒙",
 "夏時考訓蒙",
 "翻切簡可篇",
 "翻切入門簡易篇",
 "音鑑節要",
 "咫商瑣言",
 "杜詩百篇",
 "小滄浪詩話",
 "相在爾室邇言",
 "蠶桑說畧",
 "蘇臺攬勝詞",
 "虎邱雜事詩",
 "姑蘇竹枝詞",
 "田家四時詩",
 "吳俗諷喻詩",
 "西泠遊草",
 "金陵遊草",
 "春歸詞",
 "海昌觀潮集",
 "柘湖道情",
 "吳都新年雜詠",
 "吳門歲暮雜詠",
 "春秋樂府",
 "有恆心齋前集",
 "夏小正集說",
 "難澤脞錄",
 "迎靄筆記",
 "先德記",
 "贈言錄",
 "周易古本撰",
 "詩經思無邪序傅",
 "春秋傳義",
 "大學古本述註",
 "中庸古本述註",
 "癸甲乙記",
 "丙申續記",
 "丁酉續記",
 "天道問",
 "蜀記",
 "賾說",
 "補說",
 "尹人尺牘存",
 "尹人文存",
 "詩存附賦話對聯不分卷制藝存一卷",
 "脈經真本",
 "傷寒方經解",
 "醫學六種",
 "內經脈學部位考",
 "目方",
 "嬰兒",
 "實風虛風圖",
 "經驗方",
 "大戴禮記正本",
 "靜菴文集",
 "蔡傳正訛",
 "妄談錄",
 "消閒戲墨",
 "退室詩稾",
 "經解籌世",
 "紙上談",
 "西征籌筆",
 "公餘手存",
 "不自是齋詩草",
 "野鶴山房文鈔",
 "青山風月詩存",
 "訓蒙條要",
 "北游日錄",
 "下學錄",
 "自驗錄",
 "芙城錄",
 "憂患日錄",
 "陶堂志微錄",
 "陶堂遺文",
 "恤誦",
 "形景盦三漢碑㐜",
 "得一山房詩集",
 "請纓日記",
 "詩畸",
 "謎拾",
 "謎學",
 "壬子秋試行記",
 "趙園觀梅記",
 "辨字通俗編",
 "三橋春游曲唱和集",
 "寓崇雜記",
 "古今論詩絕句",
 "選例彙鈔",
 "刻和字石印記",
 "趨庭聞見述",
 "資政公遺訓",
 "家塾瑣語",
 "秦議",
 "電奏",
 "電牘",
 "讀經札記",
 "古文",
 "抱冰堂弟子記",
 "廣雅堂駢體文",
 "廣雅堂散體文",
 "廣雅堂雜著",
 "廣雅堂論金石札",
 "羣經說",
 "史說略",
 "子敍",
 "儆季文鈔",
 "嬩藝軒雜著",
 "賭棋山莊集文",
 "文又續",
 "賭棋山莊餘集文",
 "說文閩音通",
 "賭棋山莊集詞話",
 "賭棋山莊筆記",
 "圍爐瑣憶",
 "籐陰客贅",
 "稗販雜錄",
 "課餘偶錄",
 "東嵐謝氏明詩畧",
 "勸學淺語",
 "賭棋山莊八十壽言",
 "庸庵文編",
 "文續編",
 "文外編",
 "海外文編",
 "浙東籌防錄",
 "出使奏疏",
 "出使公牘",
 "出使英法義比四國日記",
 "出使日記續刻",
 "許文肅公遺稿",
 "許文肅公外集",
 "許文肅公書札",
 "許文肅公日記",
 "悚齋奏議",
 "悚齋家傳",
 "悚齋日記",
 "南陽商學偶存",
 "曾惠敏公奏疏",
 "曾惠敏公文集",
 "歸樸齋詩鈔戊集",
 "己集",
 "曾惠敏公使西日記",
 "誦芬詩略",
 "附八旬自述百韻詩",
 "黃忠端公（尊素）年譜",
 "黃梨洲先生（宗羲）年譜",
 "交食捷算",
 "五緯捷算",
 "麐史厤準",
 "測地志要",
 "黃氏世德傳贊",
 "附竹橋黃氏誥敕",
 "新建竹橋黃氏忠獻義塾記",
 "崇蘭堂詩初存",
 "虞菴詞",
 "崇蘭堂文存外集",
 "崇蘭堂日記",
 "北行紀程",
 "赴津日識",
 "尚書故",
 "夏小正私箋",
 "桐城吳先生文集",
 "桐城吳先生尺牘",
 "諭兒書",
 "漢人經解輯存序目",
 "差次吟草",
 "竹窗筆記",
 "郵程日記",
 "蘭陽隨筆",
 "史記太史公自序注",
 "前漢書食貨志注",
 "前漢書藝文志注",
 "古詩十九首注",
 "陶淵明閒情賦注",
 "改設學堂私議",
 "附勸設學綴言",
 "大學古義",
 "論語時習錄",
 "孟子性善備萬物圖說",
 "管子小匡篇節評",
 "荀子議兵篇節評",
 "史記貨殖列傳注",
 "濠塹私議",
 "團練私議",
 "附藏書目錄",
 "養蠶歌括",
 "煙霞草堂從學記",
 "論語述註",
 "性學圖說",
 "困學瑣言",
 "牧民贅語",
 "伊園文鈔",
 "荔隱山房詩草",
 "荔隱山房文略",
 "進奉文",
 "荔隱居楹聯偶存",
 "國朝耆老錄",
 "荔隱居日記偶存",
 "荔隱居衞生集語",
 "徐勇烈公（豐玉）行狀",
 "善思齋文鈔",
 "善思齋詩鈔",
 "歸廬談往錄",
 "鄭易小學",
 "鄭易京氏學",
 "韓詩遺說補",
 "爾雅古注斠補",
 "字林補逸",
 "孝子傳輯本",
 "坦園文錄",
 "賦錄",
 "偶錄",
 "坦園傳奇六種",
 "理靈坡",
 "再來人",
 "麻灘驛",
 "桂枝香",
 "詞餘叢話",
 "眼福編初集",
 "燈社嬉春集",
 "坦園四書對聯",
 "坦園叢稿",
 "詩序韻語",
 "雉舟酬唱集",
 "蘭芷零香錄",
 "仙心閣詩鈔",
 "紀時略",
 "省身雜錄",
 "仙心閣文鈔",
 "四書理話",
 "羣經理話",
 "小學近思理話",
 "性理理話",
 "史鑑理話",
 "管見理話",
 "四書理畫",
 "羣群經理畫",
 "小學近思理畫",
 "性理理畫",
 "史鑑理畫",
 "管見理畫",
 "理畫括例",
 "算學瑣解",
 "算學演圖",
 "易圖瑣解",
 "易演圖",
 "字學韻學",
 "五行雜說",
 "禹貢章句",
 "附圖說",
 "春秋日月考",
 "孟子辨證",
 "國語釋地",
 "古今冬至表",
 "畊南詩鈔",
 "附補鈔",
 "論孟詩",
 "宮閨詞",
 "秋花四十詠",
 "板橋道情",
 "綏陽鴻印",
 "民天敬述",
 "遯齋偶筆",
 "畫溪詩集",
 "小有齋自娛集",
 "歸程紀略",
 "西征詩錄",
 "西征文存",
 "補蕉山館詩",
 "鄂跗草堂詩",
 "三峯草廬詩",
 "沁泉山館詩",
 "柳湄小榭詩",
 "葭柎草堂集",
 "竹閒十日話",
 "海錯百一錄",
 "閩產錄異",
 "七月漫錄",
 "左傳臆說十九條",
 "閩中郭氏支派大畧",
 "我私錄",
 "重文",
 "城北夭后宮志",
 "湖般續錄",
 "試帖存稿",
 "詞賦",
 "丁頤生時文",
 "還硯齋周易述",
 "還硯齋易漢學擬旨",
 "還硯齋大學題解參略",
 "中庸題解參略",
 "續琉球國志略",
 "還硯齋雜著",
 "古近體詩略",
 "賦稿",
 "大題文稿不分卷試帖",
 "蓮絜詩翰釋文",
 "蓮絜詩存",
 "南征日記",
 "篋外錄",
 "白華山人詩集",
 "白華山人詩說",
 "最樂亭詩草",
 "駌湖求舊錄",
 "求舊續錄",
 "武備圖繪",
 "武備固圉錄",
 "臺防學治錄",
 "泉務學治錄",
 "平臺除氛錄",
 "沈氏遺書",
 "蠡測集",
 "坐言集",
 "讀史尚論",
 "豹隱堂文集",
 "豹隱堂近作雜稿",
 "附書跋",
 "豹隱堂近作詩稿附楹聯",
 "京師坊巷志稿",
 "漢書管見",
 "佩弦齋文存",
 "駢文存",
 "佩弦齋試帖存",
 "律賦存",
 "雜存",
 "三州學錄",
 "漢易十三家",
 "霜菉亭易說",
 "詩緯含神霧訓纂",
 "詩緯氾歷樞訓纂",
 "詩緯推度災訓纂",
 "公灋導源",
 "道德經達詁",
 "湖上草堂詩",
 "壺庵五種曲",
 "鵲華秋",
 "青霞夢",
 "樊川夢",
 "繙書圖",
 "壺中樂",
 "夢痕館詩話",
 "歲寒居詞話",
 "味退居文集",
 "味退居文外集",
 "書牘存稿",
 "蝯叟詩存",
 "爾雅釋言集解後案",
 "嘉定物產表",
 "治療偶記",
 "味退居隨筆",
 "寫禮廎文集",
 "寫禮廎詩集",
 "古書經眼錄",
 "寫禮廎讀碑記",
 "經學通論",
 "經學歷史",
 "尚書大傳疏證",
 "今文尚書攷證",
 "尚書中候疏證",
 "古文尚書冤詞平議",
 "鄭志疏證",
 "鄭記攷證",
 "聖證論補評",
 "六藝論疏證",
 "魯禮禘祫義疏證",
 "王制箋",
 "漢碑引經攷",
 "漢碑引緯攷",
 "經訓書院自課文",
 "師伏堂詠史",
 "駢文二種",
 "十三經舊學加商",
 "蘟蒔山莊駢散芟存",
 "轅下吟編",
 "吳趨詞鈔",
 "述聞瑣記約鈔",
 "隨山館猥稾",
 "續稾",
 "隨山館詞稾",
 "隨山館叢稾",
 "無聞子",
 "松煙小錄",
 "旅譚",
 "隨山館尺牘",
 "經義縣解",
 "春秋釋地韻編",
 "甲子紀年表",
 "續廣博物志",
 "酌雅堂駢體文集",
 "曠論",
 "品芳錄",
 "周易經典證略",
 "說文字原引",
 "別雅類",
 "讀選集箴",
 "山邑先後加復學額志",
 "淮邵文渠志",
 "龍城書院課藝",
 "山鹽阜安四院課藝",
 "鳳鳴書院課藝",
 "籌筆津粱",
 "天文管窺",
 "六壬摘要",
 "擬罪言",
 "人學",
 "兼山堂六集",
 "兼山堂詩集",
 "長安看花記",
 "辛王癸甲錄",
 "丁年玉筍志",
 "㝱華瑣簿",
 "緒餘錄",
 "武備編",
 "樂器編",
 "會稽山齋文",
 "會稽山齋經義",
 "會稽山齋文續",
 "蒙泉子",
 "易一貫",
 "六書十二聲傳",
 "解字贅言",
 "志學編八種",
 "大學節訓",
 "中庸節訓",
 "洪範原數",
 "重訂談天正議",
 "三代紀年考",
 "周官司徒類攷",
 "考工記考",
 "釋地三種",
 "羣經釋地",
 "古史釋地",
 "諸子釋地",
 "詩序議",
 "史表號名通釋",
 "古律呂考",
 "曰若編",
 "五藏山經傳",
 "海內經附傳",
 "漢地理志詳釋",
 "穆天子傳釋",
 "逸經釋",
 "論孟疑義",
 "弧角拾遺",
 "下學菴勾股六術",
 "商周彝器釋銘",
 "重訂越南圖說",
 "輿地今古圖考",
 "涌翠山房文集",
 "老子證義",
 "中庸釋",
 "學庸識小",
 "周易漢讀攷",
 "讀史提要錄評",
 "天均巵言",
 "老子識小",
 "莊子識小",
 "芹曝錄內篇",
 "集選詩",
 "遲雲閣詩稿",
 "吉雨山房遺集",
 "吉雨山房文集",
 "吉雨山房詩集",
 "北山樵唱",
 "周易從周",
 "增默菴詩遺集",
 "漢音鉤沉",
 "敍例",
 "鄭許字義異同評",
 "駮春秋名字解詁",
 "雅學攷",
 "璧沼集",
 "授經簃集",
 "東山書院課集",
 "研經書院課集",
 "周易學",
 "周禮學",
 "孟子學",
 "五省滿洫圖說",
 "水北家訓",
 "言易錄",
 "學庸註釋",
 "道學內篇注釋",
 "論學諸篇",
 "言學書",
 "言官錄",
 "當差紀略",
 "牧沔紀略",
 "損齋語錄鈔",
 "損齋全書附錄",
 "西埜楊氏壬申譜",
 "東安日程",
 "姚氏家俗記",
 "經義積微記",
 "讀詩瑣言",
 "澹園讀禮畢記",
 "澹園學禮畢記",
 "四書瑣言",
 "說文瑣言",
 "睡餘錄",
 "澹園隨筆",
 "野錄",
 "悔廬文鈔",
 "文補",
 "古文尚書私議",
 "中聲集",
 "粗才集",
 "夢溪櫂謳",
 "讀易一斑",
 "寥天一閣文",
 "莽蒼蒼齋詩",
 "遠遺堂集外文初編",
 "石菊影廬筆識",
 "附詞聯",
 "仁學",
 "筆識",
 "流離雜記",
 "宦游偶錄",
 "雜文僅存",
 "開封府君年譜",
 "大戴禮記審議",
 "禮記審議",
 "喪服經傳補疏",
 "退學錄",
 "偕寒堂校書記",
 "寫經齋初稿",
 "寫經齋續稿",
 "淞水集",
 "嶧陽集",
 "寫經齋文稿",
 "小玲瓏閣詞",
 "尚書小札",
 "午窗隨筆",
 "漢書古字類",
 "愚慮錄",
 "誨爾錄",
 "食古錄",
 "待質錄",
 "居求錄",
 "石船居雜箸賸稿",
 "石船居公牘賸稿",
 "石船居古今體詩賸稿",
 "藤軒筆錄",
 "柜軒筆錄",
 "溝洫私議",
 "貢愚錄",
 "問青園課程",
 "雜儀學規條規",
 "問青園語",
 "問青園詩草",
 "問青園文草",
 "問青園題跋",
 "問青園尺牘",
 "問青園手帖",
 "問青園家書",
 "問青園遺囑",
 "鴻鷗瑣錄",
 "燕趙同軌",
 "秦晉連程",
 "蠶叢計陸",
 "晉哲會歸",
 "讀漢摘腴",
 "讀唐論略",
 "堪輿譜槩",
 "讀書記疑",
 "敬齋存稿",
 "陶淵明述酒詩解",
 "東明紀行",
 "晚學齋詩初集",
 "蓮漪詞",
 "暗香樂府",
 "木樨香",
 "霧中人",
 "雁鳴霜",
 "晚學齋外集",
 "觀所養齋詩稾",
 "漢東集詩",
 "北樓集詩",
 "困知長語",
 "代耕堂雜著",
 "潞河漁者纂",
 "五萬卷閣書目記",
 "雙桐書屋賸稾",
 "乘崖集存",
 "桐華閣文集",
 "栩栩日記",
 "栩緣隨筆",
 "周禮地官冬官徵",
 "列史外夷傳徵",
 "譯雅",
 "附泰西君臣名號歸一圖",
 "元穆日記",
 "元穆文鈔",
 "黃陵詩鈔",
 "河北致用精舍學規",
 "普法兵事記",
 "江口巡船章程",
 "水師說略四條",
 "彭剛直公長江百條",
 "苦口藥",
 "黃陵書牘",
 "采菽堂筆記",
 "吳船日記",
 "采菽堂書牘",
 "玩石齋文集",
 "玩石齋詩集",
 "玩石齋筆記",
 "詩外餘言",
 "權制",
 "江表忠畧",
 "歷代國號總括歌",
 "直省府名歌訣",
 "聖門諸賢述略",
 "十三經源流口訣",
 "廿三史評口評",
 "古歡室詩集",
 "浣月詞",
 "女學篇",
 "醫學篇",
 "太極衍義",
 "必自錄",
 "庸德錄",
 "心巢困勉記",
 "論語論仁釋",
 "明明德解義",
 "校經堂學程",
 "附勸約",
 "學議",
 "東山政教錄",
 "國朝師儒論略",
 "尚書厤譜",
 "春秋日南至譜",
 "大初厤譜",
 "切韵表",
 "經史駢枝",
 "寶應儒林事略",
 "寶應文苑事略",
 "成氏先德傳",
 "春秋世譜拾遺",
 "詩聲類表",
 "尊孔大義",
 "孔孟圖歌",
 "孔孟重行周流議",
 "尊宗贅議",
 "庶人禮畧類編",
 "興學創聞",
 "御書徵言",
 "奉思錄",
 "庚申噩夢記",
 "蘇臺糜鹿記",
 "逆黨姓名紀略",
 "香禪精舍游記",
 "鄂行日記",
 "歙行日記",
 "虎阜石刻僅存錄",
 "附舊佚錄",
 "舊存今佚錄",
 "紀游草",
 "香禪詞",
 "貞烈編",
 "息影廬殘稾",
 "學為福齋詩鈔",
 "吟碧山館詞",
 "香隱盦詞",
 "小隱園初集詩",
 "文集雜俎",
 "小隱園二集詩",
 "待園瑣語",
 "題畫雜言",
 "螙仙詩集",
 "螙仙泉譜",
 "螙仙石品",
 "石交錄",
 "山水同名錄",
 "楹聯遊戲",
 "楹聯續刻",
 "楹聯聚寶",
 "螙仙文集",
 "金陵百四十八景",
 "落葉相思小草",
 "螙仙小品",
 "乘化遺安",
 "螙仙雜俎",
 "螙仙尺牘",
 "小隱園尺牘",
 "畫畫筆談",
 "螙仙絕句",
 "消夏雜記",
 "栩栩園翔陽集",
 "栩栩園詞鈔",
 "栩栩園題畫",
 "牂柯客談",
 "禹貢九州今地攷",
 "元史攷訂",
 "紀略摘鈔",
 "籌世芻議",
 "蘋香書屋文鈔",
 "怡雲堂內集",
 "怡雲堂戊子集",
 "怡雲堂雜文",
 "怡雲堂詩集",
 "讀孟集說",
 "韓非子錄要",
 "匋雅（一名瓷學）",
 "孤圓山莊詩賸十種",
 "菰村集",
 "香影廊集",
 "橫江集",
 "思樓集",
 "振雅堂集",
 "茶半軒集",
 "二山唱和集",
 "雄樹堂集",
 "鬬杯堂詩集",
 "杯隱堂詩集",
 "杯史",
 "寂園說印",
 "大山詩集",
 "睇海樓詩",
 "繡詩樓詩",
 "問字樓詩",
 "浦鐸",
 "閩鹽正告書",
 "福建鹽務公牘",
 "春秋烈女圖考",
 "漢元后本紀補",
 "晉八王易知畧",
 "大學原本讀法",
 "大學原本說略",
 "中庸讀法",
 "中庸總說",
 "孟子讀法",
 "史記讀法",
 "詩禮堂古文",
 "詩禮堂雜詠",
 "春秋繁露求雨止雨考定",
 "泰州縴堤說略",
 "介山時文",
 "介山自訂年譜",
 "繼配馮恭人實錄",
 "鄉會試硃卷",
 "聖諭廣訓衍",
 "論語廣義",
 "叢稿",
 "晉巂",
 "日知小錄",
 "讀管子",
 "讀水經注",
 "讀漢書",
 "校讀漢書札記",
 "讀文選",
 "讀書日記",
 "燈味軒詩稿",
 "古今體詩稿",
 "汾祠記",
 "青溪載酒記",
 "燈味軒文稿",
 "試帖詩",
 "國朝政令紀要",
 "四明摭餘錄",
 "四明餘話",
 "明州札記",
 "台州詩話",
 "梓里遺聞",
 "龍江精舍詩集",
 "湖山唱和集",
 "東華庽盧集",
 "日湖集",
 "冰廬集",
 "刼後集",
 "呂氏春秋補注",
 "說文難檢字錄",
 "古今韻略注訂",
 "淨樂宧談藝",
 "淨樂宧論畫",
 "淨樂宧雜存",
 "淨樂宧文存",
 "淨樂宧詩存",
 "淨樂宧詩存（丙戍集）",
 "淨樂宧簡畢",
 "漢書箋遺",
 "羣經咫聞錄",
 "退息編",
 "說文詹詹",
 "呂盦稽古彙編",
 "四子鷇音初編",
 "連語",
 "逸書徵",
 "逸詩徵",
 "孟子集語",
 "左傳賦詩義證",
 "墨子引書說",
 "四書古語錄證",
 "孟子弟子門人攷",
 "史記弟子傳名字齒居攷",
 "漢書人表略校",
 "各史地志同名錄",
 "禮記月令攷異",
 "月令輯佚",
 "醫醇賸義",
 "醫方論",
 "留雲山館文鈔",
 "留雲山館詩鈔",
 "詩醇",
 "樸麗子",
 "求心錄",
 "馬氏心書",
 "風燭學鈔",
 "來學纂言",
 "黃池隨筆",
 "芝田隨筆",
 "垂香樓詩稿",
 "挑燈詩話",
 "風楹待月",
 "柳溪碎語",
 "寒夜集",
 "松軒九圖",
 "圖銘合看",
 "偶筆",
 "竹廬家聒",
 "女閑",
 "友義",
 "偶爾吟",
 "柳溪倩書",
 "孫淮浦先生語類",
 "易經徵實解",
 "易象授蒙",
 "冷紅館賸稿",
 "冷紅館詩補鈔",
 "修修利齋偶存",
 "冷紅詞",
 "增輯易象圖說",
 "易經卦變解八宮說",
 "昱青堂雜集",
 "鳳笯雉噫吟草",
 "螢蟬叢考",
 "三影低思吟草",
 "東白日鈔",
 "二可又銘書屋稿存",
 "寄窩鈔存",
 "二不草堂詩鈔",
 "辨惑適願自惜齋摘錄",
 "養園漫稿",
 "湫龍檻虎答慰",
 "我存稿",
 "八一問答",
 "食硯漱經唾餘錄",
 "文斤山民集",
 "泳經堂叢書",
 "復初文錄",
 "金谿題跋",
 "金谿詞",
 "讀春秋劄記",
 "左傳杜注摘謬",
 "讀莊劄記",
 "無夢軒文集",
 "論文蒭說",
 "無夢軒詩",
 "刼餘小紀",
 "說書偶筆",
 "韻法本俗",
 "西海徵",
 "治河要語",
 "煙波釣叟歌直解",
 "奇門占驗",
 "十八活盤詳註",
 "賈先生古詞論述",
 "古文集",
 "四書制藝文",
 "讀易臆說",
 "紅蔷薇館未刪吟草",
 "集四書對",
 "西湖記游草",
 "秦鏡漢硯齋詩餘",
 "綱目隨筆",
 "各種聯語",
 "三國志偶辨",
 "夏小正管窺",
 "志乘刪補",
 "紺珠記事錄",
 "敝帚享金編",
 "干支春帖子",
 "袁文箋正補正",
 "聞見偶記",
 "軼典僻事便覽",
 "危太僕（素）年譜",
 "宋文清公（褧）年譜",
 "楊文節公（萬里）年譜",
 "藹青編年詩草",
 "公車前草",
 "後草",
 "傳魯堂文集",
 "傳魯堂駢文",
 "傳魯堂詩初集",
 "傳魯堂詩二集",
 "使陝記",
 "觀二生齋隨筆",
 "楹聯附錄",
 "遺像遺墨",
 "香草校書",
 "周易讀異",
 "尚書讀異",
 "儀禮讀異",
 "四禮補注",
 "爾雅釋親宗族考",
 "殤服",
 "殤服發揮",
 "附兼祧議",
 "新定魯論語述",
 "鄉黨補義",
 "孟子分章考",
 "說文平段",
 "夏小正家塾本",
 "香草談文",
 "史記散筆",
 "古女考",
 "補考",
 "花燭閒談",
 "澧溪文集",
 "新方言眉語",
 "閒書四種",
 "香草尺牘",
 "留香閣詩問",
 "漢碑徵經補",
 "希麟音義引說文攷",
 "釋名集校",
 "漢書藝文志攷證校補",
 "補宋書藝文志",
 "補梁書藝文志",
 "金石萃編統補藁",
 "碑版叢錄",
 "積古齋鐘鼎彝器欵識補遺",
 "籀鄦誃賦筌",
 "周易說",
 "尚書箋",
 "尚書大傳補注",
 "詩經補箋",
 "春秋公羊傳箋",
 "周官箋",
 "禮經箋",
 "論語訓",
 "爾雅集解",
 "湘軍志",
 "王志",
 "楚辭釋",
 "墨子注",
 "唐詩選",
 "湘綺樓文集",
 "周慤慎公奏稿",
 "電稿",
 "周慤慎公公牘",
 "玉山文集",
 "易理匯參",
 "治水述要",
 "河防雜著",
 "黃河源流考",
 "水府諸神祀典記",
 "黃河工段文武兵夫記略",
 "國朝河臣記",
 "負暄閒語",
 "周慤慎公自著年譜",
 "歷代刑法考",
 "刑制總考",
 "刑制分考",
 "赦考",
 "律令",
 "獄考",
 "刑具考",
 "行刑之制考",
 "死刑之數",
 "唐死罪總類",
 "充軍考",
 "鹽法私礬私茶同居酒禁丁年考合",
 "律目考",
 "漢律摭遺",
 "明律目箋",
 "明大誥峻令考",
 "歷代刑官考",
 "寄簃文存",
 "諸史瑣言",
 "史記瑣言",
 "漢書瑣言",
 "後漢書瑣言",
 "續漢書志瑣言",
 "三國志瑣言",
 "古書目四種",
 "文選李善注書目",
 "三國志注所引書目",
 "世說注所引書目",
 "續漢書志注所引書目",
 "日南隨筆",
 "沈碧樓偶存稿",
 "王先謙自定年譜",
 "虛受堂書札",
 "虛受堂詩存",
 "虛受堂文集",
 "王文貞先生文集",
 "溪山詩存",
 "禮記經注校證",
 "讀孟隨筆",
 "王文貞先生學案",
 "桐鄉勞先生遺稿",
 "新刑律修正案匯錄",
 "拳案三種",
 "義和拳教門源流考",
 "庚子奉禁義和拳彙錄",
 "拳案雜存",
 "宋校勘五經正義奏請雕版表",
 "華陽國志巴郡士女逸文",
 "建炎以來朝野雜記逸文",
 "九國志校",
 "九國志逸文",
 "郯源集校",
 "郯源集逸文",
 "阮盦筆記五種",
 "選菴叢談",
 "卤底叢談",
 "蘭雲菱㝱樓筆記",
 "蕙風簃隨筆",
 "蕙風簃二筆",
 "香東漫筆",
 "萬邑西南山石刻記",
 "附南浦郡報善寺兩唐碑釋文",
 "薇省詞鈔",
 "粵西詞見",
 "附玉楳後詞",
 "香海棠館詞話",
 "弟一生修梅花館詞",
 "澹如軒詩",
 "程中丞奏稿",
 "兩淮案牘鈔存",
 "庚子交涉隅錄",
 "撫東政略",
 "賜福樓筆記",
 "賜福樓啟事",
 "雲門初集",
 "北游集",
 "東歸集",
 "涉江集",
 "淡吟集",
 "水浙集",
 "西征集",
 "關中集",
 "還山集",
 "轉蓬集",
 "紫泥酬唱集",
 "京輦題襟集",
 "西山集",
 "後西征集",
 "紫蘭堂集",
 "染香集",
 "東溪草堂詞",
 "樊山文甲",
 "乙",
 "鏡煙堂集",
 "東園集",
 "身雲閣集",
 "二家詠古詩",
 "二家試帖",
 "廣雅堂試帖",
 "畫妃亭試帖",
 "二家詞鈔",
 "霞川花隱詞",
 "五十麝齋詞賡",
 "身雲閣後集",
 "青門消夏集",
 "晚晴軒集",
 "柳下集",
 "赴召集",
 "北臺集",
 "執殳集",
 "西京酬唱集",
 "掌綸集",
 "洛花集",
 "西京酬唱後集",
 "音聲樹集",
 "煎茶集",
 "鰈舫集",
 "兩艖䒀齋集",
 "紫薇集",
 "雙紅豆館詞賡",
 "紫薇二集",
 "沆瀣集",
 "十憶集",
 "二家詞賡",
 "蘭當詞",
 "弄珠詞",
 "樊山公牘",
 "樊山批判時文",
 "無益有益齋讀畫詩",
 "海王村所見書畫錄",
 "津步聯吟集",
 "紅螺山館詩鈔",
 "紅蠃山館遺詩",
 "舊學盦筆記",
 "三邕翠墨簃題跋",
 "潛廬文鈔",
 "痰氣集",
 "潛書",
 "衍微",
 "訓俗常談",
 "淨土義證",
 "朗吟詩草",
 "南音",
 "明夷詩鈔",
 "南幽百絕句",
 "太一詩存",
 "明夷詞鈔",
 "太乙文存",
 "太乙箋啟",
 "莊子補釋",
 "讀漢書劄記",
 "太乙叢話",
 "南幽雜俎",
 "南幽筆記",
 "箋啟補遺",
 "庭訓錄",
 "光緒大事彙鑑",
 "宣統大事鑑",
 "彙呈朱子論治本各疏",
 "興亡彙鑑",
 "諫院奏事錄",
 "柏巖文存",
 "潛并廬雜存",
 "柏巖詩存",
 "柏巖聯語偶存",
 "潛并廬詩存",
 "柏巖感舊詩話",
 "潛并廬詩存初續",
 "尚書源流考",
 "毛詩札記",
 "禮經舊說",
 "逸禮考",
 "西漢周官師說考",
 "周禮古注集疏",
 "春秋古經箋",
 "附春秋古經舊注疏證零稿",
 "春秋左氏傳時月日古例考",
 "春秋左氏傳答問",
 "春秋左氏傳古例詮微",
 "春秋左氏傳傳例解略",
 "春秋左氏傳傳注例略",
 "春秋左氏傳例略",
 "羣經大義相通論",
 "毛詩詞例舉要",
 "荀子詞例舉要",
 "古書疑義舉例補",
 "小學發微補",
 "爾雅蟲名今釋",
 "理學字義通釋",
 "國學發微",
 "周末學術史序",
 "兩漢學術發微論",
 "漢宋學術異同論",
 "南北學派不同論",
 "中國民約精義",
 "中國民族志",
 "攘書",
 "古政原論",
 "古政原始論",
 "古曆管窺",
 "論文雜記",
 "周書補正",
 "周書略說",
 "管子斠補",
 "晏子春秋斠補定本",
 "晏子春秋斠補",
 "附佚文輯補",
 "黃之寀本校記",
 "晏子春秋補釋",
 "老子斠補",
 "莊子斠補",
 "墨子拾補",
 "荀子斠補",
 "荀子補釋",
 "賈子新書斠補",
 "羣書治要引賈子新書校文",
 "春秋繁露斠補",
 "附佚輯補",
 "揚子法言斠補",
 "附佚文",
 "法言補釋",
 "白虎通義斠補",
 "附闕文補訂",
 "白虎通義定本",
 "白虎通義源流考",
 "白虎通德論補釋",
 "楚辭考異",
 "周書王會篇補釋",
 "穆天子傳補釋",
 "韓非子斠補",
 "琴操補釋",
 "左盦集",
 "讀書隨筆",
 "左盦題跋",
 "讀道藏記",
 "敦煌新出唐寫本提要",
 "倫理教科書",
 "經學教科書",
 "中國文學教科書",
 "中國歷史教科書",
 "中國地理教科書",
 "中國中古文學史講義",
 "左盦（劉師培）年表",
 "著述繫年",
 "劉申叔先生遺書校勘記",
 "藏天室詩",
 "臥廬詞話",
 "春秋穀梁傳補注",
 "新元史考證",
 "譯史補",
 "易通卦驗節候校文",
 "淮南鴻烈閒詰",
 "晉司隸校尉傅玄集",
 "覺迷要錄",
 "觀堂集林",
 "觀堂別集",
 "觀堂外集",
 "觀堂古金文考釋五種",
 "散氏盤考釋",
 "不⿰其⿱目女敦蓋銘考釋",
 "盂鼎銘考釋",
 "克鼎銘考釋",
 "校松江本急就篇",
 "唐韻佚文",
 "唐寫本唐韻殘卷校勘記",
 "殷禮徵文",
 "聯綿字譜",
 "補高郵王氏說文諧聲譜",
 "簡牘檢署考",
 "魏正始石經殘石考",
 "隸釋所錄魏石經碑圖",
 "漢魏博士題名考",
 "耶律文正公（楚材）年譜",
 "五代兩宋監本考",
 "兩浙古刊本考",
 "古行記校錄",
 "經行記",
 "使高昌記",
 "北使記",
 "蒙韃備錄箋證",
 "黑韃事略箋證",
 "聖武親征錄校注",
 "長春真人西遊記注",
 "乾隆浙江通志考異殘稿",
 "觀堂譯稿",
 "唐五代二十一家詞輯",
 "金荃詞",
 "檀欒子詞",
 "香奩詞",
 "紅葉稿",
 "薛侍郎詞",
 "牛給事詞",
 "牛中丞詞",
 "毛司徒詞",
 "魏太尉詞",
 "尹参卿詞",
 "瓊瑤集",
 "顧太尉詞",
 "鹿太保詞",
 "歐陽平章詞",
 "毛祕書詞",
 "閻處士詞",
 "張舍人詞",
 "孫中丞詞",
 "後村別調補遺",
 "人間詞話",
 "新編錄鬼簿注",
 "宋元戲曲考",
 "唐宋大曲考",
 "戲曲考原",
 "古劇脚色考",
 "優語錄",
 "錄曲餘談",
 "庚辛之間讀書記",
 "苕華詞",
 "靜安文集",
 "附詩稿",
 "觀堂古金文考釋",
 "重輯蒼頡篇",
 "清眞先生遺事",
 "戲曲考源",
 "詩攷補訂",
 "敦書咫聞",
 "瀛洲咫聞",
 "崇雅堂詩稿",
 "湖墅倡和集",
 "生辰倡和集",
 "河西楊氏家譜",
 "三國志札記",
 "路橋志略",
 "二徐祠墓錄",
 "尚書商誼",
 "費氏古易訂文",
 "爾雅郭注佚存補訂",
 "廣雅補疏",
 "學記箋證",
 "墨子斠注補正",
 "歐洲列國戰事本末",
 "歐洲族類源流略",
 "彼得興俄記",
 "武漢戰紀",
 "蟄𡨼七篇",
 "天元草",
 "離騷注",
 "閑閑老人詩集",
 "閑閑老人年譜",
 "陶廬箋牘",
 "陶廬文集",
 "陶廬外篇",
 "文莫室駢文",
 "文莫室詩集",
 "陶廬詩續集",
 "希臘學案",
 "六書舊義",
 "今古學攷",
 "古學攷",
 "經諙甲編",
 "乙編",
 "經學初程",
 "四益館經學四變記",
 "五變記",
 "孝經學凡例",
 "坊記新解",
 "家學樹坊",
 "倫理約編",
 "王制學凡例",
 "王制訂",
 "王制集說",
 "春秋圖表",
 "穀梁春秋經傳古義凡例",
 "穀梁春秋經學外篇凡例",
 "公羊春秋補證凡例",
 "公羊春秋經傳驗推補證",
 "擬大統春秋條例",
 "皇帝大同學革弊興利百目",
 "何氏公羊春秋十論",
 "春秋左傳古義凡例五十則",
 "春秋左氏傳漢義補證簡明凡例二十則",
 "春秋古經左氏說後義補證凡例",
 "附左氏春秋學外編凡例",
 "左氏春秋古經說",
 "春秋三傳折中",
 "禮經凡例",
 "附容經學凡例",
 "附兩戴記分僎凡例",
 "禮記識",
 "今文尚書要義凡例",
 "書經大統凡例",
 "尚書今文新義",
 "書經周禮皇帝疆域圖表",
 "書尚書弘道編",
 "書中侯弘道篇",
 "周官攷徵凡例",
 "周禮新義凡例",
 "周禮訂本略注",
 "周禮鄭注商榷",
 "光緒會典",
 "周禮今證",
 "會典學十要",
 "內閣要義",
 "六部總義",
 "欽定職官總目",
 "職官增減裁併及堂屬簡明表",
 "今文詩古義證疏凡例",
 "四益詩說",
 "詩緯新解",
 "大學中庸演義",
 "楚詞講義",
 "離騷釋例",
 "高唐賦新釋",
 "經傳九州通解",
 "樂經凡例",
 "易經新義疏證凡例",
 "易經古本",
 "四益易說",
 "墨辯解故序",
 "易生行譜例言",
 "論語彙解凡例",
 "尊孔篇",
 "知聖篇",
 "羣經大義",
 "補題",
 "世界哲理進化退化演說",
 "莊子新解",
 "莊子經說叙意",
 "靈樞隋楊氏太素注本目錄",
 "素問隋楊氏太素注本目錄",
 "黃帝內經太素篇目",
 "黃帝內經明堂叙",
 "舊鈔太素經校本叙",
 "黃帝內經",
 "集注叙",
 "黃帝內經素問重校正叙",
 "平脈攷",
 "內經平脈攷",
 "黃帝內經太素診皮篇補證",
 "古經診皮名詞",
 "診筋篇補證",
 "附十二筋病表",
 "診骨篇補證",
 "中西骨格辯正",
 "楊氏太素診絡篇補證",
 "病表",
 "名詞",
 "黃帝太素人迎脈口診補證",
 "人寸診補證",
 "楊氏太素三部診法補證",
 "九候篇診法補證",
 "附十二經動脈表",
 "營衛運行楊注補證",
 "分方治宜篇",
 "靈素五解篇",
 "附素問靈臺秘典論篇新解",
 "瘧解補證",
 "脈學輯要評",
 "脈經考證",
 "傷寒總論",
 "太素內經傷寒總論補證",
 "太素四時病補證",
 "傷寒雜病論古本",
 "傷寒古本攷",
 "補傷寒古本",
 "傷寒平議不分卷附瘟疫平議一卷",
 "傷寒講義",
 "附桂枝湯講義",
 "撼龍經傳訂本注",
 "地理辨正補正",
 "都天寶照經",
 "地學答問",
 "漢志三統曆表",
 "命理支中藏干釋例",
 "六譯館雜著（原名四益館雜著）",
 "哲學思想論",
 "災異論",
 "佛學考",
 "左氏傳長編目錄",
 "隸釋碑目表",
 "公羊春秋傳例序",
 "六譯館外編",
 "與廖季平書",
 "廖氏學案序",
 "四譯宬書目",
 "中國文字問題",
 "四益館文鈔",
 "中外比較改良編序",
 "孔教祆教之比較",
 "文學處士嚴君家傳",
 "何君俶尹六十壽序",
 "五行論",
 "雲南勘界籌邊記",
 "偵探記",
 "集思廣益編",
 "天南同人集",
 "愼所立齋文集",
 "愼所立齋詩集",
 "孔學發微",
 "詩經四家異文考補",
 "石翁山房札記",
 "周易觀我",
 "論語傳",
 "古今體詩",
 "三經合說",
 "奏章",
 "說文引羣說故",
 "揚雄說故",
 "揚雄訓纂篇考",
 "高麗國永樂好大王碑釋文纂攷",
 "醫故",
 "詞源斠律",
 "樵風樂府",
 "比竹餘音",
 "苕雅餘集",
 "絕妙好詞校錄",
 "瘦碧詞",
 "雲謠集雜曲子",
 "詞莂",
 "滄海遺音集",
 "曼陀羅寱詞",
 "香草亭詞",
 "郢雲詞",
 "蟄庵詞",
 "悔龕詞",
 "凌波詞",
 "遯盦樂府",
 "觀堂長短句",
 "海綃詞",
 "海綃說詞",
 "回風堂詞",
 "舊月簃詞",
 "疆邨語業",
 "疆邨棄槀",
 "疆邨詞賸稿",
 "疆邨校詞圖題詠",
 "經義莛撞",
 "讀經⿱小貝記",
 "讀老札記",
 "淮南許註鉤沈",
 "楚頌亭詞第四集",
 "出都詩錄",
 "吳篷詩錄",
 "樊山沌水詩錄",
 "蜀船詩錄",
 "巴山詩錄",
 "錦里詩錄",
 "峩眉詩錄",
 "青城詩錄",
 "林屋詩錄",
 "游梁詩賸",
 "游梁詩賸賸",
 "鬘天影事譜",
 "紅蕉夢語",
 "紅橋笛語",
 "懺紅碎語",
 "檃括古人詩文詞",
 "琹臺夢語",
 "摩圍閣詩",
 "丁戊之間行卷",
 "盾墨拾餘",
 "雜稿",
 "電信",
 "魂北魂東雜記",
 "魂南記",
 "四魂集",
 "魂北集",
 "魂東集",
 "魂南集",
 "歸魂集",
 "四魂外集",
 "魂海集",
 "魂天集",
 "燕榻集",
 "國朝文苑傳",
 "國朝孝子小傳",
 "國朝學案目錄",
 "孔門詩集",
 "大學私訂本",
 "易音補顧",
 "容園詞綜",
 "水葓國櫂歌",
 "金剛經易氏本",
 "心經易氏本",
 "慕皋廬雜稿",
 "鄂湘酬唱集",
 "玉虛齋唱和詩",
 "倚霞宮筆錄",
 "廬山詩錄",
 "琴志樓遊山詩",
 "吳社集",
 "玉虛齋集",
 "琴志樓編年詩集",
 "晦堂文鑰",
 "文憲例言",
 "古棠塾言",
 "禮器釋名",
 "許鄭經文異同詁",
 "補周易口訣義闕卦",
 "磨盦雜存",
 "綿蕞餘紀",
 "八識規矩頌詮解",
 "成唯識論詮",
 "天台四教儀節要",
 "彌陀經集解",
 "圓音",
 "心經懸解",
 "法海諦塵",
 "蘊入處界諦緣義",
 "義學刪稿",
 "大乘起信論詮",
 "佛乘階位",
 "法海衍派",
 "大乘起信論綱要",
 "法界觀",
 "法海溯源",
 "楞嚴集解",
 "陰陽五行古義鉤沉",
 "經穴釋名",
 "藏象篇",
 "藏象通論",
 "至真要大論闡義",
 "五運六氣圖表詮註",
 "經絡總說",
 "六氣病考",
 "宗營衛貫解",
 "脈法考",
 "經脈陰陽原理考",
 "釋人",
 "脈訣𠫵同契",
 "醫學雜編",
 "函雅廬詩稿",
 "刪稿",
 "函雅廬碑跋",
 "楹聯拾存",
 "遯廬日記",
 "遯廬雜鈔",
 "五穀考",
 "東北閩遊記",
 "遯廬古今註",
 "備忘",
 "遯行小稿",
 "讀曲小識",
 "奉天清宮書畫錄",
 "遯廬叢說",
 "遯廬叢鈔",
 "漢魏六朝文擷",
 "唐人詩鈔",
 "遯廬選曲",
 "遯廬詞選",
 "經學略說",
 "雜鈔",
 "遯廬叢書刊誤表",
 "遯廬駢文",
 "遯廬文稿",
 "騷旨詩詮",
 "嵊縣志序",
 "樂平械鬥記",
 "大乘起信論表",
 "原書",
 "未園集選",
 "未園集略",
 "寶書堂詩集",
 "冷雅",
 "老劍文稿",
 "遊薩克遜日記",
 "香海集",
 "游樵漫草",
 "悼亡百韻",
 "論粵東詞絕句",
 "柏林竹枝詞",
 "海上秋吟",
 "海山詞",
 "花語詞",
 "珠江低唱",
 "長相思詞",
 "悔晦堂詩集",
 "悔晦堂尺牘",
 "悔晦堂日記",
 "悔晦堂對聯",
 "悔晦堂雜詩",
 "悔晦堂文集",
 "莘廬遺詩",
 "浮梅日記",
 "第六水村居稿",
 "小茗柯館詩詞稿",
 "宦游偶記",
 "著述偶存",
 "壽考附錄",
 "聖學淵源詮證",
 "止園文集",
 "易鉥",
 "止園詩鈔",
 "止心篇",
 "止園原性論三篇",
 "止園自記",
 "止園經術訐時",
 "王道法言",
 "念蘐池館文存",
 "泰西人物志",
 "小辟疆園詩存",
 "武陵著作譚",
 "西吳類牘摘要",
 "勤補拙齋漫錄",
 "養閒草堂隨筆",
 "蝸巢聯語",
 "儀禮奭固",
 "儀禮奭固禮器圖",
 "儀禮奭固禮事圖",
 "漢師傳經表",
 "天文圖攷",
 "經脈分圖",
 "壽櫟廬文集",
 "壽櫟廬巵言和天",
 "蕉心閣詞",
 "幽夢影續評",
 "文燼",
 "詩賸",
 "空言",
 "畣問",
 "松俗處喪非禮辨",
 "喪禮通俗編",
 "讀書錄記疑",
 "拙修集記疑",
 "問道錄",
 "謹擬籌設全國國稅局條議",
 "閱裴副總稅務司和議草約第十一款致江海關道節略一卷附加贅言",
 "南館文鈔",
 "粵牘偶存",
 "入蜀日記",
 "審安齋詩集",
 "香石齋吟草",
 "研花館吟草",
 "退補齋隨筆",
 "傳經堂家規",
 "鹿川文集",
 "鹿川詩集",
 "楚望閣詩集",
 "石巢詩集",
 "定巢詞集",
 "美人長壽盦詞集",
 "湘社集",
 "漢堂文鈔",
 "漢堂詩鈔",
 "濯纓室詩鈔",
 "問月詞",
 "三國志平議",
 "魏書平議",
 "北齊書平議",
 "呂氏春秋高注補正",
 "甓湖草堂筆記",
 "甓湖草堂詩",
 "甓湖草堂文鈔",
 "甓湖草堂楹聯彙存",
 "春明夢錄",
 "郡齋影事",
 "西江贅語",
 "繼述堂三刻詩鈔",
 "文鈔附錄",
 "繼述堂中西教育合纂",
 "繼述堂讀孟芻言",
 "繼述堂社會談約編",
 "樵隱詩存",
 "墾餘讀書錄",
 "墾餘閒話",
 "毛詩草名今釋",
 "毛詩魚名今考",
 "嘉魚考",
 "孔子藝事考",
 "種薯經證",
 "銀幣考",
 "靈庵先生遺詩",
 "甘氏家訓",
 "陳子文藪",
 "小言",
 "詞林拾遺",
 "茶餘酒後錄",
 "芸窗課藝",
 "詩文評註",
 "涉趣園集",
 "來南雜俎",
 "涉趣園詩集",
 "交通芻議",
 "任盦文存",
 "後漢郡國令長考補",
 "山東縣名溯原",
 "韓理堂先生（夢周）年譜",
 "荀子非十二子篇釋",
 "淮南子要略篇釋",
 "史公論六家要指篇釋",
 "野棠軒文集",
 "史亭識小錄",
 "野棠軒摭言",
 "野棠軒獻酬集",
 "野棠軒游戲集",
 "歷史人名對",
 "歷史地名對附物名對",
 "蓬萊箋啟",
 "三省從政錄",
 "翹懃軒文集",
 "讀書識餘",
 "翹懃軒文集續編",
 "翹懃軒集聯",
 "翹懃軒謎語",
 "棄書",
 "豔體集聯",
 "新疆志稿",
 "愻盦文集",
 "代言錄",
 "愻盦四六文",
 "愻盦詩集",
 "寄寄山房叢鈔",
 "等韻切音指南",
 "寄寄山房塞愚詩話",
 "寄寄山房叢鈔續集",
 "寄寄山房叢鈔又集",
 "寄寄山房公牘錄遺",
 "寄寄山房鼠疫雜誌",
 "庸菴遺集",
 "病亡始末紀",
 "天籟閣詩存",
 "天籟閣詩話",
 "天籟閣諧鈔",
 "清寧館古泉叢話",
 "清寧館治印雜說",
 "天籟閣談小說",
 "天籟閣雜著",
 "趨庭隨錄",
 "趨庭別錄",
 "讀春秋國語四史蠡述",
 "讀春秋蠡述",
 "讀國語蠡述",
 "讀史記蠡述",
 "讀漢書蠡述",
 "讀後漢書蠡述",
 "讀三國志蠡述",
 "未晚樓文存",
 "別卷",
 "未晚樓文續存",
 "未晚樓書牘",
 "續存",
 "未晚樓聯稿",
 "山廬文鈔",
 "亞洲史",
 "寧東羅譜禮俗譜",
 "興民學校小史",
 "先考幼山府君（羅師揚）年譜",
 "論語徵知錄",
 "禮書通故識語",
 "周書後案",
 "佚文考",
 "後漢書補表校錄",
 "遼史索隱",
 "集古錄補目補",
 "崇文總目輯釋補正",
 "風俗通姓氏篇校補",
 "南田志略",
 "蘇詩注補",
 "菽園贅談",
 "答粵督書",
 "庚寅偶存",
 "壬辰冬興",
 "揮麈拾遺",
 "致用書院文集",
 "秉鐸公牘存稿",
 "夜雨燈前錄",
 "漢儒趙氏從祀始末記",
 "讀趙注隨筆",
 "文廟圖像檢校",
 "無暇逸齋說文學四種",
 "證墨篇",
 "訂鈕篇",
 "匡徐篇",
 "補俞篇",
 "說算",
 "算學四種",
 "方程演代",
 "衰分演代",
 "讀左隨筆",
 "讀五代史隨筆",
 "作嫁集",
 "借箸集",
 "續公羊墨守",
 "續穀梁廢疾",
 "續左氏膏肓",
 "公羊何注攷訂",
 "箴箴何篇",
 "續公羊墨守附篇",
 "讀左持平",
 "湖州十家詩選",
 "柘湖宦游錄",
 "月河草堂叢鈔",
 "察邇言錄",
 "五五語",
 "擬言",
 "圭窗集",
 "詩詞",
 "默嗇泊虛孤徂齋游記",
 "還桂日記",
 "遺筆彙存",
 "感劬山房日記節鈔",
 "辛壬類稾",
 "伏卵錄",
 "別竹辭花記",
 "續後漢儒林傳補逸",
 "皖詞紀勝",
 "疢存齋文存",
 "大理縣鄉土志",
 "蒙學韻語",
 "自訂年譜",
 "疢存齋隨筆",
 "孔門學說",
 "事物溯源",
 "物猶如此錄",
 "拉雜叢談",
 "奇聞錄",
 "聯語彙錄",
 "諧聯漫錄",
 "古今趣談",
 "疢存齋文存三編",
 "疢存齋詩存續編",
 "疢存齋隨筆續編",
 "石民府君（豐玉）行狀",
 "尚書舉要",
 "考工記辨證",
 "考工記補疏",
 "說文重文管見",
 "說文解字辨證",
 "說文舉例",
 "列女傳集注",
 "平安室雜記",
 "閩詩錄甲集",
 "感舊集小傳拾遺",
 "石遺室文集",
 "木庵文稾",
 "木庵居士詩",
 "石遺室詩集",
 "道安室雜文",
 "蕭閒堂遺詩",
 "戴花平安室詞",
 "朱絲詞",
 "穀梁釋經重辭說",
 "揚雄方言存沒考",
 "漢畫偶譚",
 "六藝通誼",
 "六藝通誼初稿",
 "六藝偶見",
 "元史札記",
 "元史講義",
 "上古史",
 "中國通史",
 "孔子世家箋注",
 "秦敦考釋",
 "浙江四川直隸造象目蕞錄",
 "常山貞石志造象目",
 "河南陝西省造象蕞錄",
 "龍門有年月造象錄",
 "龍門象種略考",
 "龍門有年月造象錄初稿",
 "塑壁殘影改定稿",
 "湖北沔陽陸氏舊藏北齊造象攷",
 "四川摩崖像",
 "浙江杭州西湖石屋洞摩崖像",
 "碑石像目",
 "晚學廬藏碑象目存",
 "中國學術史長編",
 "中國學術史",
 "中國學術史定稿",
 "國學通論",
 "國學研究",
 "國學研究法",
 "國學研究法初稿",
 "老子學派考",
 "墨經詁義",
 "墨經詁義初稿",
 "墨學派衍攷證",
 "墨說要指",
 "墨辯釋要札記",
 "墨辯釋詞擬目",
 "墨守要義",
 "墨辨斠注",
 "墨辨斠注初稿",
 "墨辨斠注殘稿",
 "靈樞解剖學述大旨",
 "靈素解剖學初稿",
 "靈素解剖學",
 "本草綱目輯注札記",
 "十二經脈考",
 "中國美術史",
 "中國美術史二編",
 "中國美術史定稿",
 "唐陶史札記",
 "瓷史札記",
 "織繡史札記",
 "角工雕刻札記",
 "晚學廬札記",
 "文心雕龍私記",
 "晚學廬文稿",
 "晚學廬詩文稿",
 "附尺牘稿",
 "樂章集選",
 "雲窗漫稿",
 "雪堂校刊羣書叙錄",
 "雪堂金石文字跋尾",
 "雪堂書畫跋尾",
 "補唐書張義潮傳",
 "萬年少先生（壽祺）年譜",
 "徐俟齋先生（枋）年譜",
 "海外吉金錄",
 "宋元釋藏刊本考",
 "補宋書宗室世系表",
 "道德經考異",
 "南華真經殘卷校記一卷",
 "抱朴子校記",
 "劉子校記",
 "王子安集佚文",
 "古寫經尾題錄存",
 "漢熹平石經殘字集錄",
 "遼居稾",
 "遼居雜箸",
 "矢彝考釋",
 "璽印姓氏徵補正",
 "漢兩京以來鏡銘集錄",
 "鏡話",
 "蒿里遺文目錄續編",
 "敦煌古寫本毛詩校記",
 "帝範校補",
 "宋槧文苑英華殘本校記",
 "漢熹平石經集錄續補",
 "高昌專錄",
 "遼帝后哀冊丈錄",
 "雪堂所藏古器物圖說",
 "上虞羅氏枝分譜",
 "本朝學術源流概略",
 "松翁未焚稾",
 "金州講習會論語講義",
 "漢熹平石經集錄又續編",
 "唐折衝府補拾遺",
 "古器物識小錄",
 "車塵稿",
 "唐書宰相世系表補正",
 "姚秦寫本僧肇維摩詰經解殘卷校記一卷",
 "經義考目錄",
 "貞松堂唐宋以來官印集存",
 "俑廬日札",
 "國朝文範",
 "後丁戊稿",
 "遼海吟",
 "續吟",
 "干祿字書箋證",
 "廬山記校勘記",
 "集蓼編",
 "墓誌徵存目錄",
 "大雲書庫藏書題識",
 "貞松老人外集",
 "松翁賸稿",
 "宸翰樓所藏書畫目錄",
 "司馬法古注",
 "樂府補亡",
 "中書",
 "左書",
 "右書",
 "內書",
 "外書",
 "子疏",
 "學變圖贊",
 "續校讐通義",
 "史學述林",
 "校讐述林",
 "文學述林",
 "治記緒論",
 "治史緒論",
 "晚菘齋遺著",
 "西溪秋雪庵志",
 "莫干山志",
 "之江濤聲",
 "東華塵夢",
 "海岸梵音",
 "天目游記",
 "旬日紀游",
 "湯山修禊日記",
 "潯溪文徵",
 "壬癸消寒集",
 "甲乙消夏集",
 "晨風廬唱和存",
 "淞濱吟社集",
 "經塔題詠",
 "靈夆貝葉經題詠",
 "百和香集",
 "邵村學易",
 "洪範微",
 "左傳禮說",
 "明代千遺民詩詠初編",
 "松柏山房駢體文鈔",
 "邵村詠史詩鈔",
 "邵村壽言二集",
 "莊子音義摘錄",
 "道德經箋釋",
 "雪泥留痕",
 "蟄窟吟",
 "潛園正集",
 "中憲詩鈔",
 "潛園詩集",
 "潛園詞",
 "潛園文集",
 "潛園詩續鈔",
 "潛園詞續鈔",
 "潛園文續鈔",
 "述古錄",
 "易獨斷",
 "春秋通議",
 "離騷逆志",
 "史記達旨",
 "酌酌古論",
 "潛園讀書法",
 "潛園學說",
 "潛園或問",
 "潛園書牘",
 "三臣傳",
 "匪目記",
 "黨目記",
 "南宮舊事",
 "西曹舊事",
 "都門懷舊記",
 "都門瑣記",
 "居東記",
 "蕉盦隨筆",
 "蕉盦詩話",
 "詩話後編",
 "審判稿",
 "西山志略",
 "匡山避暑錄",
 "昭疑錄",
 "禮訓纂",
 "易言隨錄",
 "周書雜論",
 "大學古本訓",
 "喪服彙識",
 "阮南自述",
 "從政瑣記",
 "杭居雜憶",
 "鄉人社會談",
 "仁安詩稿",
 "仁安文稿",
 "文乙稿",
 "仁安筆記",
 "杭州雜著",
 "仁安自述",
 "說詩求己",
 "清芬錄",
 "桐城文學淵源考．",
 "引用書目",
 "名氏目錄",
 "桐城文學撰述考",
 "續補彙刻書目",
 "再續補",
 "三續補",
 "續補寰宇訪碑錄．",
 "寰宇訪碑錄校勘記",
 "補寰宇訪碑錄校勘記",
 "再續寰宇訪碑錄校勘記",
 "萇楚齋隨筆",
 "望溪文集再續補遺",
 "三續補遺",
 "御批通鑑輯覽五季紀事本末．",
 "萇楚齋書目",
 "直介堂徵訪書目",
 "萇楚齋四筆",
 "附引用書目",
 "曾文正公集外文",
 "鼻烟叢刻",
 "勇盧閒詰摘錄",
 "士那補釋",
 "奏銷案",
 "朱方旦案",
 "科場案",
 "順天闈",
 "大獄記略綴餘",
 "江南闈",
 "河南山東山西闈",
 "西樓記傳奇考",
 "王紫稼考",
 "橫波夫人考",
 "孔四貞事考",
 "金聖歎考",
 "附羅隱秀才",
 "袁了凡斬蛟記考",
 "董小宛考",
 "小說題跋",
 "跋聊齋誌異顛道人",
 "紀文襄公見鬼事",
 "文藝談",
 "心史筆粹",
 "丁香花",
 "字貫案",
 "閒閒錄案",
 "春秋左傳讀叙錄",
 "鎦子政左氏說",
 "文始",
 "新方言",
 "嶺外三州語",
 "小斅答問",
 "說文部首均語",
 "莊子解故",
 "管子餘義",
 "齊物論釋",
 "重定本",
 "國故論衡",
 "檢論",
 "太炎文錄初編",
 "菿漢微言",
 "廣論語駢枝",
 "體撰錄",
 "太史公古文尚書說",
 "古文尚書拾遺",
 "春秋左氏疑義答問",
 "新出三體石經考",
 "菿漢昌言",
 "範園客話",
 "呻餘放言",
 "松陰暇筆",
 "仲可筆記",
 "天蘇閣筆談",
 "云爾編",
 "聞見日抄",
 "夢湘囈語",
 "知足語",
 "梅西日錄",
 "雪窗閒筆",
 "雪窗零話",
 "雪窗雜話",
 "強恕齋本樊紹述遺文",
 "李文誠公遺詩",
 "譚仲修先生復堂詞話",
 "先公徐印香（恩綬）先生先妣陸太淑人傳志",
 "大受堂札記",
 "太史公書義法",
 "劉向校讎學纂微",
 "漢書藝文志舉例",
 "六朝麗指",
 "退廬文集",
 "退廬箋牘",
 "丙午釐定官制芻論",
 "審國病書",
 "戊戌履霜錄",
 "大盜竊國記",
 "國聞備乘",
 "九朝新語",
 "十朝新語外編",
 "鹽乘",
 "嵩洛游記",
 "盤山遊記",
 "恆代遊記",
 "小航文存",
 "增訂三體石經時代辨誤",
 "表章先正正論",
 "方家園雜詠紀事",
 "疑年錄彙編",
 "附分韻人表",
 "歷代帝王疑年錄",
 "名人生日表",
 "名人忌日表",
 "太史公疑年考",
 "明清巍科姓氏錄",
 "疑年錄彙編補遺",
 "清代毘陵名人小傳",
 "清代毘陵書目",
 "歷代諱字譜",
 "家諱考",
 "清代名人小名錄",
 "續名人生日表",
 "疑年錄外編",
 "毘陵名人疑年錄",
 "清代名人同姓名略",
 "重訂名人生日表",
 "小雙寂庵瑣談",
 "小雙寂庵文稿",
 "包慎伯先生（世臣）年譜",
 "周秦諸子學略",
 "周秦諸子書目",
 "紙說",
 "奇石記",
 "律數說",
 "讀漢文記",
 "歷代文章論略",
 "餘墨",
 "名山集",
 "名山續集",
 "語類",
 "名山小言",
 "名山叢書",
 "名山書論",
 "辛亥道情",
 "名山聯語",
 "祥桂堂詩草",
 "名山三集",
 "名山四集",
 "名山五集",
 "名山六集",
 "名山七集文",
 "詞續",
 "名山錄",
 "錢氏家語",
 "謫星筆談",
 "良心書",
 "課徒草口卷續草一卷",
 "三刻",
 "四刻",
 "文省",
 "名山文約",
 "晚邨集偶證",
 "名山詩話",
 "謫星說詩",
 "謫星詞",
 "名山詞",
 "江陰節義略",
 "梅泉詩選",
 "衛衷賸稿",
 "肯哉文鈔",
 "棲香閣藏稿",
 "自述錄",
 "京遊雜記",
 "附記宦跡",
 "解餉隨筆",
 "家信",
 "識略",
 "和欽文初編",
 "性理說",
 "文辭我見",
 "秦事通徵",
 "史瞰",
 "城西日札",
 "海東日劄",
 "白門日札",
 "井里日札",
 "近百年來先人詩彙",
 "天行草堂詩",
 "天行草堂文稿",
 "對螺山館印存",
 "天行草堂主人自訂年譜",
 "新政遺文",
 "華僑革命史",
 "新政先生哀思錄",
 "鈍安詩",
 "鈍安詞",
 "鈍安文",
 "鈍盦脞錄",
 "鈍安雜著",
 "管子弟子職說例",
 "許氏說文解字說例",
 "夏小正說例",
 "詩經說例",
 "大學修身章說例",
 "修身齊家章注",
 "論語學而里仁說例",
 "論語新注",
 "禮記曲禮上下內則說例",
 "學記補注",
 "國語敬姜論勞逸說例",
 "孟子說例",
 "孟子許行畢戰北宮錡問章注",
 "太誓決疑",
 "齊詩鈐",
 "地冪古義",
 "書目二編",
 "壯學堂文",
 "次公詩集",
 "次公詞稿",
 "詞書記要",
 "天部全表",
 "日食表",
 "卦合表",
 "三統曆置閏表",
 "三統超辰表",
 "三統中小餘表",
 "三統曆簡表",
 "曆法表",
 "古曆表",
 "周殷曆表",
 "古曆鉤沈",
 "曆算雜記",
 "吳越春秋札記",
 "榆廬數典",
 "大歲異聞證",
 "推策備檢",
 "梧丘雜札",
 "莨菪渠小記",
 "謏聞錄",
 "牟子校補",
 "蜎子考",
 "一切經音義校勘記",
 "次室讀書記",
 "管子隱義",
 "諸子雜記",
 "瀛壺文鈔",
 "閒閒錄",
 "瀛壺詩鈔",
 "侍齋文鈔",
 "侍齋古今詩鈔",
 "寄樓鱗爪集",
 "麈影",
 "瀛壺聯鈔",
 "花拾遺",
 "鶄夢影",
 "一家言（瀛壺文鈔補）",
 "焦學三種",
 "焦里堂先生（循）年譜",
 "里堂思想與戴東原",
 "附雕菰樓集選錄",
 "里堂易學",
 "船山學譜",
 "春暉樓四書說略",
 "春暉樓論語說遺",
 "春暉樓讀易日記",
 "春暉樓禹貢地理舉要",
 "京氏易傳箋",
 "釋鄭氏爻辰補",
 "周易虞氏學",
 "周易對象通釋",
 "河洛數釋",
 "經傳詁易",
 "爻辰表",
 "詩經形釋",
 "詩經今古文篇旨異同",
 "詩經聲韻譜",
 "說文音釋",
 "聲紐通轉",
 "等韻通轉圖證",
 "釋小",
 "音說",
 "聲韻學撮要",
 "律呂納音指法",
 "演玄",
 "遁甲釋要",
 "六壬卦課",
 "國學商榷記",
 "課兒讀書錄",
 "三教探原",
 "道德經儒詮",
 "佛學筆記",
 "楞嚴咒校勘記",
 "普庵釋談章音釋",
 "讀新約全書",
 "馬氏文通訂誤",
 "詩詞一得",
 "英文不規則動字分類表",
 "休復齋雜志",
 "易林勘複",
 "歙潭渡黃氏先德錄",
 "任耕感言",
 "仁德莊義田舊聞",
 "元西域人華化考",
 "元典章校補",
 "元典章校補釋例",
 "史諱舉例",
 "舊五代史輯本發覆",
 "薛史輯本避諱例",
 "吳漁山先生（歷）年譜",
 "墨井集源流考",
 "釋氏疑年錄",
 "通檢",
 "清初僧諍記",
 "莊子年表",
 "鄧析子校錄",
 "列子偽書考",
 "修辭九論",
 "天馬山房文存",
 "陶靖節詩箋",
 "陶靖節年譜",
 "黃公度先生詩箋",
 "詩品箋",
 "東林遊草",
 "陶靖節年歲考證",
 "曹子建詩箋",
 "曹子建（植）年譜",
 "汪容甫文箋",
 "諸葛忠武侯（亮）年譜",
 "漢詩辨證",
 "隅樓雜記",
 "鍾季子文錄",
 "曹子建詩箋定本",
 "阮嗣宗詠懷詩箋定本",
 "陶靖節詩箋定本",
 "層冰文略",
 "遼漢臣世系表",
 "明宰相世臣傳",
 "李蜃園先生（天植）年譜",
 "蜃園集拾遺",
 "程易疇先生（瑤田）年譜",
 "朱笥河先生（筠）年譜",
 "段懋堂先生（玉裁）年譜",
 "書經",
 "易經白文",
 "詩經白文",
 "書經白文",
 "禮記白文",
 "春秋白文",
 "春秋左傳",
 "十三經索引",
 "易京氏章句",
 "易彭氏義",
 "易賈氏義",
 "易劉氏義",
 "易王氏義",
 "易魯氏義",
 "易賈氏注",
 "易鄭司農注",
 "書古文同異",
 "書古文訓旨",
 "魯詩韋氏義",
 "韓詩趙氏義",
 "周禮班氏義",
 "儀禮班氏義",
 "月令蔡氏章句",
 "春秋釋痾駮",
 "春秋公羊眭氏義",
 "春秋公羊鄭氏義",
 "春秋穀梁劉氏義",
 "左傳延氏注",
 "春秋左傳許氏義",
 "春秋左傳鄭氏義",
 "論語包注",
 "爾雅舍人注",
 "爾雅許氏義",
 "爾雅鄭氏義",
 "毛詩註",
 "春秋左傳註",
 "春秋公羊傳不分卷附攷一卷",
 "春秋穀梁傳不分卷附攷一卷",
 "毛詩註疏",
 "周禮註疏",
 "禮記註疏",
 "春秋左傳註疏",
 "春秋公羊註疏",
 "春秋穀梁註疏",
 "論語註疏解經",
 "孟子註疏解經",
 "儀禮註疏",
 "孝經註疏",
 "春秋左傳注疏",
 "春秋公羊注疏",
 "春秋穀梁注疏",
 "監本附釋音春秋公羊注疏",
 "監本附釋音春秋穀梁注疏",
 "十三經注疏校勘記識語",
 "周易注疏校勘",
 "略例校勘記",
 "附釋文校勘記",
 "尚書注疏校勘記",
 "毛詩注疏校勘記",
 "周禮注疏校勘記",
 "儀禮注疏校勘記",
 "禮記注疏校勘記",
 "春秋左氏傳注疏校勘記",
 "春秋公羊傳注疏校勘記",
 "春秋穀梁傳注疏校勘記",
 "論語注疏校勘記",
 "孝經注疏校勘記",
 "爾雅注疏校勘記",
 "孟子注疏校勘記",
 "音義校勘記",
 "春秋傳說薈要",
 "附陸氏三傳釋文音義",
 "易經精華",
 "書經精華",
 "詩經精華",
 "周禮精華",
 "易經",
 "石本誤字",
 "春秋左傳杜注補輯",
 "附重刊宋紹熙公羊傳注附音本校記",
 "監本正誤",
 "石本正誤",
 "欽定春秋左傳讀本",
 "十三經提綱",
 "周易讀本",
 "周易故訓訂",
 "周易注疏賸本",
 "尚書讀本",
 "洪範大義",
 "詩經讀本",
 "周禮讀本",
 "儀禮讀本",
 "禮記讀本",
 "撫本禮記鄭注考異",
 "大學大義",
 "中庸大義",
 "春秋左傳讀本",
 "春秋公羊傳讀本",
 "重刊宋紹熙公羊傳注附音本校記",
 "春秋穀梁傳讀本",
 "余仁仲萬卷堂穀梁傳考異",
 "論語讀本",
 "論語大義定本",
 "孝經讀本",
 "爾雅讀本",
 "孟子讀本",
 "孟子大義",
 "十三經讀本評點劄記",
 "毛詩要義",
 "春秋解",
 "文集補遺",
 "文集附錄",
 "周易正解",
 "尚書別解",
 "禮記通解",
 "儀禮節解",
 "周禮完解",
 "論語詳解",
 "孟子說解",
 "讀大學",
 "讀中庸",
 "讀論語",
 "讀孟子",
 "讀詩",
 "東坡先生易傳",
 "東坡先生書傳",
 "潁濱先生詩集傳",
 "潁濱先生春秋集解",
 "潁濱先生道德經解",
 "四書漢詁纂",
 "談經菀",
 "引經釋",
 "四書人物概",
 "四書名物考",
 "易經繹",
 "書經繹",
 "詩經繹",
 "三禮編繹",
 "春秋通",
 "元韵譜",
 "初",
 "宓圖經緯",
 "文圖經緯",
 "孔圖經緯",
 "雜圖經緯",
 "餘圖總經餘圖總緯",
 "貞圖經緯",
 "春秋表記問業",
 "春秋坊記問業",
 "易圖親見",
 "卦義一得",
 "讀易隅通",
 "四傳權衡",
 "周易疏略",
 "書經疏略",
 "詩經疏略",
 "禮記疏略",
 "春秋疏略",
 "大學疏略",
 "中庸疏略",
 "論語疏略",
 "孟子疏略",
 "學春秋隨筆",
 "欽定三禮義疏",
 "橫渠先生易說",
 "紫巖居士易傳",
 "童溪王先生易傳",
 "東谷鄭先生易翼傳",
 "水村易鏡",
 "晦菴先生朱文公易說",
 "大易緝說",
 "易雅",
 "俞氏易集說",
 "周易本義附錄纂注",
 "周易發明啟蒙翼傳",
 "輯錄雲峯文集易義",
 "周易經傳集程朱解附錄纂注（一名周易會通）",
 "三山拙齋林先生尚書全解",
 "程尚書禹項論",
 "杏溪傅氏禹貢集解",
 "書蔡氏傳輯錄纂注",
 "書蔡氏傳旁通",
 "王耕野先生讀書管見",
 "定正洪範集說",
 "李迃仲黃實夫毛詩集解",
 "逸齋詩補傳",
 "篇目",
 "劉氏春秋意林",
 "春秋臣傳",
 "西疇居士春秋本例",
 "木訥先生春秋經筌",
 "石林先生春秋傳",
 "止齋先生春秋後傳",
 "春秋五論",
 "則堂先生春秋集傳詳說",
 "春秋類對賦",
 "清全齋讀春秋編",
 "新定三禮圖",
 "東巖周禮訂義",
 "旁通圖",
 "附儀禮本經",
 "禮記陳氏集說補正",
 "孝經注解",
 "晦菴先生所定古文孝經句解",
 "大學通",
 "中庸通",
 "論語通",
 "孟子通",
 "大學章句或問通證",
 "中庸章句或問通證",
 "論語集註通證",
 "孟子集註通證",
 "大學章句纂箋",
 "大學或問纂箋",
 "中庸章句纂箋",
 "中庸或問纂箋",
 "論語集註纂箋",
 "孟子集註纂箋",
 "大學集說啟蒙",
 "中庸集說啟蒙",
 "熊先生經說",
 "陸堂易學",
 "陸堂詩學",
 "戴禮緒言",
 "春秋義存錄",
 "半農先生春秋說",
 "大學說",
 "疑辯錄",
 "章水經流考",
 "相臺書墊刊正九經三傳沿革例",
 "道德真經集注釋文",
 "春秋疑義",
 "懶庵先生經史論存",
 "有竹石軒經句說",
 "毛詩說",
 "三禮鄭註考",
 "儀禮古文今文考",
 "禮記古訓考",
 "說文古語考",
 "續方言補",
 "古韻異同摘要",
 "五經讀",
 "四書讀",
 "三禮類綜",
 "畏齋周易客難",
 "畏齋書經客難",
 "畏齋詩經客難",
 "畏齋春秋客難",
 "畏齋禮記客難",
 "畏齋周禮客難",
 "畏齋儀禮客難",
 "畏齋四書客難",
 "畏齋爾雅客難",
 "黃淮安瀾編",
 "經學策",
 "史學策",
 "畏齋文集",
 "周易說研錄",
 "詩說活參",
 "禮經酌古",
 "春秋求中錄",
 "讀經",
 "讀子史",
 "職官器物宮室",
 "大學札記",
 "中庸札記",
 "論語札記",
 "孟子札記",
 "大易札記",
 "易輪",
 "易卦考",
 "尚書札記",
 "春秋札記",
 "禮記札記",
 "周禮札記",
 "樂律考",
 "琴律考",
 "明儒考",
 "易學圖說會通",
 "圖說續聞",
 "正蒙集說",
 "周易輯說存正",
 "易說通旨略",
 "尚書約旨",
 "尚書通典略",
 "春秋義補註",
 "周易證籤",
 "讀易日札",
 "易講會籤",
 "兩孚益記",
 "八卦方位守傳",
 "大衍守傳",
 "大衍一說",
 "周易象考",
 "辭考",
 "占考",
 "周易小義",
 "尚書未定稿",
 "竹香齋古文",
 "爾雅註疏參義",
 "春秋胡傳參義",
 "禮記章義",
 "書經蔡傳參義",
 "儀禮經傳註疏參義內編",
 "春秋公羊穀梁諸傳彙義",
 "周禮輯義",
 "彖傳論",
 "彖象論",
 "繫辭傳論",
 "八卦觀象解",
 "附卦氣解",
 "尚書既見",
 "周官記",
 "周官說",
 "春秋正辭",
 "附春秋舉例",
 "春秋要指",
 "樂說",
 "宗法小記",
 "儀禮喪服文足徵記",
 "釋蟲小記",
 "拜經日記",
 "經義雜記",
 "詩經小學",
 "孟子生卒年月考",
 "例畧圖",
 "解舂集",
 "白田草堂存稿",
 "群經補義",
 "觀象授時",
 "注疏考證",
 "尚書注疏考證",
 "禮記注疏考證",
 "春秋左傳注疏考證",
 "春秋公羊傳注疏考證",
 "春秋穀梁傳注疏考證",
 "春秋左傳小疏",
 "春秋舉例",
 "尚書集注音疏",
 "尚書經師系表",
 "尚書後案",
 "周禮軍賦說",
 "四書考異",
 "尚書釋天",
 "弁服釋例",
 "釋繪",
 "爾雅正義",
 "禮箋",
 "某溪詩經補注",
 "毛詩故訓傳",
 "六書音均表",
 "春秋公羊通義",
 "敘",
 "羣經識小",
 "儀禮釋官",
 "校禮堂文集",
 "十三經注疏校勘記",
 "周易校勘記",
 "尚書校勘記",
 "毛詩校勘記",
 "周禮校勘記",
 "儀禮校勘記",
 "禮記校勘記",
 "春秋左傳校勘記",
 "春秋公羊傳校勘記",
 "春秋穀梁傳校勘記",
 "釋文校勱記",
 "論語校勘記",
 "孝經校勘記",
 "爾雅校勘記",
 "孟子校勘記",
 "考工記車制圖解",
 "積古齋鐘鼎彝器欵識",
 "揅經室集",
 "拜經文集",
 "周易虞氏義",
 "周易虞氏消息",
 "周易鄭氏義",
 "周易荀氏九家義",
 "易義別錄",
 "鑑止水齋集",
 "春秋左傳補注",
 "春秋公羊經何氏釋例",
 "公羊春秋何氏解詁箋",
 "發墨守評",
 "穀梁廢疾申何",
 "左氏春秋考證",
 "箴膏肓評",
 "研六室雜著",
 "春秋異文箋",
 "寶甓齋札記",
 "寶甓齋文集",
 "夏小正疏義附釋音異字記",
 "秋槎雜記",
 "吾亦廬稿",
 "論語偶記",
 "公羊禮說",
 "經傳攷證",
 "甓齋遺稿",
 "經義叢鈔",
 "國朝石經攷異",
 "漢石經攷異",
 "魏石經攷異",
 "唐石經攷異",
 "蜀石經攷異",
 "北宋石經攷異",
 "三家詩異文疏證",
 "尚書古文疏證",
 "朝廟宮室考竝圖",
 "周官說補",
 "鄭氏儀禮目錄校證",
 "詩聲分例",
 "逸周書雜志",
 "爾雅釋地四篇注",
 "釋服",
 "孟子四攷",
 "孟子逸文考",
 "孟子異文考",
 "孟子古注考",
 "孟子出處時地考",
 "毛詩攷證",
 "左通補釋",
 "易圖條辨",
 "虞氏易言",
 "虞氏易候",
 "讀儀禮記",
 "書序述聞",
 "尚書含古文集解",
 "尚書大傳輯校",
 "聲類出入表",
 "周易攷異",
 "尚書略說",
 "尚書譜",
 "大學古義說",
 "論語說義",
 "儀禮今古文異同疏證",
 "頑石廬經說",
 "儀禮學",
 "易經異文釋",
 "詩經異文釋",
 "春秋天傳異文釋",
 "夏小正異義",
 "儀禮經注疏正譌",
 "說文諧聲譜",
 "求古錄禮說",
 "鄉黨正義",
 "說文解字音均表",
 "實事求是齋經義",
 "春秋左傳賈服注輯述",
 "詩毛氏傳疏",
 "釋毛詩音",
 "毛詩傳義類",
 "鄭氏箋攷徵",
 "大戴禮注補",
 "詩譜攷正",
 "齊詩翼氏學",
 "公羊禮疏",
 "春秋繁露注",
 "春秋公羊傳曆譜",
 "論語古注集箋",
 "虞氏易消息圖說",
 "春秋決事比",
 "禹貢圖",
 "開有益齋經說",
 "攷工記攷辨",
 "逸周書集訓校釋",
 "詩地理徵",
 "喪服會通說",
 "讀儀禮錄",
 "尚書歐陽夏侯遺說攷",
 "爾雅經注集證",
 "白虎通疏證",
 "周易爻辰申鄭義",
 "禹貢鄭氏略例",
 "書古微",
 "詩古微",
 "劉貴陽經說",
 "周易舊疏考正",
 "尚書舊疏考正",
 "孟子音義攷證",
 "鄭君駮正三禮考",
 "禹貢說",
 "周易釋爻例",
 "尚書曆譜",
 "先聖生卒年月日考",
 "禮說略",
 "經說略",
 "昏禮重別論對駁義",
 "隸經賸義",
 "經述",
 "傳經表補正",
 "經傳建立博士表",
 "十三經遺文",
 "易經札記",
 "詩經札記",
 "儀禮札記",
 "左傳札記",
 "公穀札記",
 "孝經札記",
 "爾雅札記",
 "群書札記",
 "詩音表",
 "車制考",
 "論語後錄",
 "周官肊測",
 "儀禮肊測",
 "吉凶服名用篇",
 "禘祫觿解篇",
 "明堂億",
 "儀禮士冠禮箋",
 "周易偶記",
 "周易雜卦反對互圖",
 "讀易義例",
 "尚書偶記",
 "毛詩偶記",
 "周官偶記",
 "禮經偶記",
 "春秋偶記",
 "論語大學偶記",
 "四書典故攷辨",
 "群經釋地",
 "書經釋地",
 "詩經釋地",
 "周禮釋地",
 "禮記釋地",
 "春秋三傳釋地",
 "周易精義",
 "書經精義",
 "詩經精義",
 "周禮精義",
 "儀禮精義不分卷補編一卷",
 "禮記精義",
 "春秋精義",
 "四書典故覈",
 "禮論略鈔",
 "尚書中候注",
 "尚書五行傳注",
 "尚書略說注",
 "答臨碩難禮",
 "釋廢疾",
 "春秋傳服氏注",
 "鄭記",
 "鄭君紀年",
 "答周禮難",
 "易經旁訓",
 "書經旁訓",
 "詩經旁訓",
 "禮記旁訓",
 "春秋旁訓",
 "易經旁訓增訂精義",
 "詩經旁訓增訂精義",
 "書經旁訓增訂精義",
 "春秋旁訓增訂精義",
 "禮記旁訓增訂精義",
 "荀子詩說箋",
 "何劭公論語義賸義",
 "詩書古訓補遺",
 "廣春秋人地名對",
 "易經衷要",
 "書經衷要",
 "詩經衷要",
 "春秋衷要",
 "禮記衷要",
 "誠齋先生易傳",
 "儀禮集釋宮",
 "孝經或問",
 "陸氏周易述",
 "易緯八種",
 "春秋啖趙二先生集傳辯疑",
 "小學彙函",
 "五經文子",
 "大宋重修廣韻",
 "周易本義辯證",
 "易五贊",
 "朱子說書綱領",
 "書序說",
 "書序註",
 "詩綱領",
 "春秋綱領",
 "春秋左氏經傳集解後序",
 "禮記集說凡例",
 "讀易略記",
 "讀尚書略記",
 "讀周禮略記",
 "讀儀禮略記",
 "讀禮記略記",
 "鄭氏詩箋禮注異義攷",
 "孝經集解",
 "潛心堂集",
 "弟子職解詁",
 "先考皓庭府君（桂文燦）事略",
 "讀朱就錄正錄",
 "讀朱就正錄續編",
 "孝經問答",
 "易經本意",
 "釋詩",
 "釋書",
 "釋禮",
 "春秋大傳補說",
 "易經備旨",
 "書經備旨",
 "詩經備旨",
 "春秋備旨",
 "禮記全文備旨",
 "易經詳說",
 "書經詳說",
 "詩經詳說",
 "禮記詳說",
 "四書玩注詳說",
 "孝經詳說",
 "詩經音訓",
 "周禮音訓",
 "儀禮音訓",
 "禮記音訓",
 "春秋左傳音訓",
 "春秋公羊傳音訓",
 "春秋穀梁傳音訓",
 "孝經音訓",
 "爾雅音訓",
 "詩攷補遺",
 "周易虞氏義箋",
 "詩毛鄭異同辨",
 "篤志齋周易解",
 "篤志齋春秋解",
 "說文粹言疏證",
 "博約齋經說",
 "孝經鄭注攷證",
 "雙桂軒答問",
 "希鄭堂經義",
 "尚書繹聞",
 "讀左評錄",
 "㪙經筆記",
 "朱子儀禮釋宮",
 "儀禮宮室圖",
 "冕弁冠服圖",
 "冕弁冠服表",
 "春秋列國卿大夫世系表",
 "周易本義拾遺",
 "附周易序例",
 "恆齋文集",
 "周禮集傳",
 "家禮拾遺",
 "夏小正小箋",
 "小爾雅補義",
 "弟子職詁",
 "讀易會通",
 "詩經解",
 "小戴禮記解",
 "春秋左傳解",
 "說文辨通刊俗",
 "古文尚書寃詞平議",
 "尚書中侯疏證",
 "鄭記考證",
 "答臨孝存周禮難疏證",
 "魯禮禘祫義疏",
 "何氏公羊解詁三十論",
 "附答問",
 "論語集注補正述疏",
 "孝經集注述疏",
 "禮記子思子言鄭注補正",
 "周易憂患九卦大義",
 "禮記曲禮篇",
 "禮記內則篇",
 "禮記祭義篇",
 "禮記儒行篇",
 "禮記冠義篇",
 "大戴禮記曾子疾病篇講義",
 "周易傳",
 "周易義",
 "蜀才周易注",
 "九家周易集注",
 "周易義疏",
 "象數述",
 "內經述",
 "算術述",
 "等子述",
 "周易鄭氏注",
 "周易荀氏九家",
 "周易鄭荀義",
 "擬名家制藝",
 "周易半古本義",
 "周易象纂",
 "周易圖賸",
 "周易辯占",
 "周易校字",
 "需時眇言",
 "報恩論",
 "經正民興說",
 "論餘適濟編",
 "易學精義",
 "占法訂誤",
 "干氏易傳",
 "吳國周易解",
 "學易筆談初集",
 "易楔",
 "易數偶得",
 "讀易雜識",
 "愚一錄易說訂",
 "沈氏改正揲著法",
 "易學演講錄第一編",
 "太極圖說考原篇",
 "太極粹言",
 "太極圖攷",
 "太極圖象作法之研究",
 "古文尚書辨惑",
 "古文尚書釋難",
 "古文尚書析疑",
 "古文尚書商是",
 "小序",
 "新刻詩傳",
 "新刻詩說",
 "新刻詩譜",
 "新刻詩傳綱領",
 "新刻讀詩一得",
 "新刻印古詩語",
 "新刻玉海紀詩",
 "新刻困學紀詩",
 "新刻詩考",
 "新刻詩地理考",
 "新刻山堂詩考",
 "新刻文獻詩考",
 "新刻胡氏詩識",
 "新刻讀詩錄",
 "新刻逸詩",
 "新刻韓詩外傳",
 "詩經解注",
 "詩通",
 "毛詩物名考",
 "毛詩古韻雜論",
 "毛詩古韻",
 "毛詩奇句韻攷",
 "韻譜",
 "喪祭雜說",
 "喪禮雜說",
 "家禮喪祭拾遺",
 "經咫摘錄",
 "讀禮小事記",
 "喪服今制表",
 "喪服雜說",
 "制服表",
 "制服成誦篇",
 "喪服通釋",
 "周禮故書疏證",
 "儀禮古今文疏證",
 "檀弓通",
 "考工記通",
 "黃先生洪範明義",
 "黃先生儒行集傳",
 "黃先生月令明義",
 "黃先生緇衣集傳",
 "春秋啖趙二先生集傳纂例",
 "春秋列國論",
 "春秋四傳斷",
 "春秋書法解",
 "春秋歲星行表",
 "春秋日食星度表",
 "春秋經傳日表",
 "春秋三子傳",
 "春秋諸家解",
 "春秋三傳駁語",
 "公穀駁語",
 "左氏駁語",
 "春秋朔閏至日考",
 "春秋日食辨正",
 "春秋朔至表",
 "列國年表",
 "箋經瑣說",
 "經文辨異",
 "讀左別解",
 "論古撮要",
 "世族譜系",
 "公羊臆",
 "讀公羊注紀疑",
 "律學新說",
 "樂學新說",
 "算學新說",
 "律呂精義內編",
 "律呂精義外篇",
 "操縵古樂譜",
 "旋宮合樂譜",
 "鄉飲詩樂譜",
 "六代小舞譜",
 "小舞鄉樂譜",
 "二佾綴兆圖",
 "靈星小舞譜",
 "萬年曆備攷",
 "律曆融通",
 "樂記補說",
 "皇明青宮樂調",
 "律呂新書補注",
 "興樂要論",
 "大學遵古編",
 "中庸發覆編",
 "四書答問",
 "近溪子大學答問集",
 "近溪子中庸答問集",
 "近溪子論語答問集",
 "近溪子孟子答問集",
 "貞復楊先生學解",
 "楊先生冬日記",
 "白沙先生語錄",
 "南中論學存笥稿",
 "歸善楊先生證學編",
 "大學章句大全",
 "中庸章句大全",
 "論語集註大全",
 "孟子集註大全",
 "中庸集註章句大全",
 "大學大全",
 "中庸大全",
 "孟子異本考",
 "四書章句集注附考",
 "四書章句集注定本辨",
 "四書家塾讀本句讀",
 "四書改錯",
 "增補四書經史摘證",
 "孝經考",
 "宗傳圖考",
 "全考圖說",
 "傳經始末",
 "全經綱目",
 "孝字釋",
 "全考心法",
 "誦經威儀",
 "今文孝經直解",
 "進石臺孝經表",
 "石臺孝經",
 "朱文公定古文孝經",
 "朱文公刊誤古文孝經",
 "吳文正公較定今文孝經",
 "孝經彙註",
 "孝經會通",
 "孝經疏鈔",
 "五經孝語",
 "四書孝語",
 "曾子孝實附錄集",
 "孝經彙目",
 "孝經釋疑",
 "朱文公刊誤孝經旨意",
 "古文孝經說",
 "從今文孝經說",
 "孝經集文",
 "孝經指解",
 "朱子孝經刊誤",
 "孝經三本管窺",
 "孝經解紛",
 "畧例",
 "唐石經誤字辨",
 "南宋石經攷異",
 "遺字",
 "後蜀毛詩石經殘本",
 "石經補攷",
 "中候儀明篇",
 "易統驗𢆯圖",
 "孝經鉤命訣",
 "河圖帝系譜",
 "河圖握矩紀",
 "河圖緯象",
 "河圖八丈",
 "河圖叶光篇",
 "河圖令占篇",
 "河圖秘徵篇",
 "河圖聖洽",
 "河圖甄曜度",
 "雒書寶予命",
 "洛書說河",
 "雒書兵鈐",
 "易緯筮謀類",
 "易緯辯終備",
 "易緯萌氣樞",
 "易緯天人應",
 "尚書帝命期又名尚書帝驗期又名尚書帝命驗期又名尚書令命驗",
 "詩緯紀歷樞",
 "詩緯汎歷樞又名詩緯氾歷樞又名詩緯記歷樞",
 "詩緯含文候",
 "禮緯元命包",
 "易乾坤鏧度",
 "易乾鏧度",
 "易乾元序制記",
 "尚書琁機鈐",
 "尚書運期授附補遺",
 "尚書緯附錄附補遺",
 "詩含神霧附補遺",
 "詩緯附錄附補遺",
 "禮斗威儀附補遺",
 "禮緯附錄附補遺",
 "樂叶圖徵附補遺",
 "樂緯附錄附補遺",
 "春秋說題辭附補遺",
 "春秋緯附錄附補遺",
 "孝經鉤命決附補遺",
 "孝經緯附錄附補遺",
 "敘錄敘目",
 "古文官書附古文奇字郭訓古文字",
 "文字集畧",
 "韻畧",
 "三蒼攷逸補正",
 "三倉解詰",
 "古文奇字",
 "韵集",
 "陸詞切韻",
 "東宮切韻",
 "釋氏切韻",
 "凡將",
 "單行字",
 "字訓",
 "誥幼",
 "文字釋訓",
 "文字志",
 "古今正字",
 "集訓",
 "文字典說",
 "文字釋要",
 "說文字樣",
 "正字辨惑",
 "集類",
 "新字解訓",
 "字鏡",
 "字典",
 "字譜",
 "字誥",
 "羣書字要",
 "衞宏",
 "訓文",
 "文字音義",
 "音隱",
 "纂韻",
 "開元音義",
 "韻詮",
 "韻林",
 "韻圃",
 "字書音義",
 "音訓",
 "五經音義",
 "韻會",
 "劉兆注公羊",
 "劉兆注穀梁",
 "鄭玄注公羊",
 "孔注論語",
 "鄭注論語",
 "馬融注論語",
 "包咸注論語",
 "王肅注論語",
 "何注論語",
 "說文形聲後案",
 "說文辨異",
 "肄許外篇",
 "古韻證",
 "六書例說",
 "說文解字部首訂",
 "承吉兄字說",
 "逸雅",
 "說聲訂",
 "說文建首字讀",
 "毛詩呁訂",
 "說文答問",
 "說文經字考",
 "說文舊音",
 "爾雅古注斠",
 "蘭如詩鈔",
 "許君年表攷",
 "許君年表",
 "唐寫本說文解木部箋異",
 "續攷",
 "說文說",
 "說文訂訂",
 "說文蠡箋",
 "王氏讀說文記",
 "讀說文證疑",
 "說文新附攷校正",
 "說文經斠",
 "說文正俗",
 "說文外編",
 "說文提要校訂",
 "說文提要增附",
 "說文解字部敘",
 "說文字原表字原表說",
 "說文部首表",
 "說文約言",
 "許君（愼）疑年錄",
 "說文測義",
 "說文又考",
 "說文引經異字",
 "同聲假借字考",
 "說籀",
 "說文疑",
 "漢書古字",
 "音義異同",
 "說文段注簽記",
 "說文注鈔",
 "小學識餘",
 "說文段注拈誤",
 "象形文釋",
 "說文大小徐本錄異",
 "字義補",
 "唐韻餘論",
 "唐韻綜",
 "改併五音集韻",
 "改併五音類聚四聲篇",
 "新編篇韻貫珠集",
 "附直指玉鑰匙門法",
 "韻母",
 "同文鐸",
 "韻鑰",
 "詩經韵讀",
 "群經韵讀",
 "楚辭韵讀",
 "宋賦韵讀",
 "先秦韵讀",
 "唐韵四聲正",
 "等韵叢說",
 "律呂通今圖說",
 "律易",
 "原音瑣辨",
 "律呂名義算數辨",
 "音調定程",
 "絃徽宣秘",
 "同治甲子未上書",
 "形聲輯略",
 "備考",
 "唐韻輯略",
 "古音輯略",
 "等韻輯略",
 "十三經諸家引書異字同聲考",
 "韻學蠡言舉要",
 "丁氏聲鑑",
 "諧聲譜",
 "音韻指迷",
 "雙聲詩選",
 "韻學叢書三十四種題跋",
 "聲說",
 "毛詩古音述",
 "聲韻轉迻略",
 "許氏說音",
 "說文部首音釋",
 "聲韻補遺",
 "音學五書",
 "古今韻攷",
 "古韵標準",
 "詩韵舉例",
 "四聲切韵表",
 "聲韵攷",
 "古韵譜",
 "江氏音學十書（原缺三種）",
 "羣經韵讀",
 "楚辭經韵讀",
 "等韻叢說",
 "詩古韵表二十二部集說",
 "說文聲類示出入表",
 "切韵考",
 "明末羅字注音文章（原名明季之歐化美術及羅馬字音注）",
 "西儒耳目資",
 "譯引首譜",
 "列音韻譜",
 "列邊正譜",
 "劉獻廷",
 "一目了然初階",
 "盛世元音",
 "拼音字譜",
 "拼漢合璧五洲歌略　北京二十四號官話字母義塾頭拼譯",
 "官話合聲字母（原名官話合聲字母序例及關係論說）",
 "官話字母讀物八種",
 "拼音對文三字經",
 "拼音對文百家姓",
 "對兵說話",
 "地文學",
 "植物學",
 "動物學",
 "家政學",
 "人人能看書",
 "數目代字訣（原名代字訣）",
 "甌文音彙附補遺",
 "新字甌文七音鐸附甌諺略",
 "形聲通",
 "中國字母北京切音合訂",
 "中國切音字母",
 "官話切音字母",
 "福州切音字母",
 "泉州切音字母",
 "漳州切音字母",
 "廈門切音字母",
 "廣東切音字母",
 "製字畧解列表",
 "江蘇新字母",
 "拼音代字訣",
 "新編簡字特別課本",
 "簡字譜錄",
 "增訂合聲簡字譜",
 "重訂合聲簡字譜",
 "簡字叢錄",
 "京音簡字述略",
 "簡字全譜",
 "中國音標字書",
 "音韵記號",
 "切音字說明書（原名切音字教科書）",
 "駁中國用萬國新語說",
 "1913年讀音統一會資料匯編",
 "五代史記",
 "索隱",
 "遼史紀年表",
 "西遼紀年表",
 "附欽定國語解",
 "明史考證攟逸",
 "新元史",
 "史記三書釋疑",
 "漢將相大臣年表",
 "續校補",
 "漢書律曆志正譌",
 "漢書地理志補校",
 "漢書地理志校注",
 "漢書地理志補注",
 "新斠注地里志集釋",
 "漢書地理志詳釋",
 "漢志釋地略",
 "漢志志疑",
 "漢書地理志水道圖說",
 "漢書藝文志拾補",
 "漢書藝文志條理",
 "新莽大臣年表",
 "新莽職方考",
 "熊氏後漢書年表校補",
 "東漢諸帝統系圖",
 "東漢諸王世表",
 "東漢皇子王世系表",
 "東漢外戚侯表",
 "東漢宦者侯表",
 "東漢雲臺功臣侯表",
 "東漢中興功臣侯世系表",
 "東漢將相大臣年表",
 "東漢三公年表",
 "東漢九卿年表",
 "後漢書朔閏考",
 "漢志郡國沿革攷",
 "後漢縣邑省併表",
 "後漢郡國令長考",
 "續漢書志注補",
 "三國大事年表",
 "三國大事表",
 "三國漢季方鎮年表",
 "三國諸王世表",
 "魏國將相大臣年表",
 "魏將相大臣年表",
 "魏方鎮年表",
 "吳將相大臣年表",
 "三國志三公宰輔年表",
 "三國志世系表",
 "三國志世系表補遺附訂譌",
 "三國郡縣表附考證",
 "三國疆域表",
 "補三國疆域志補注",
 "三國疆域志疑",
 "兩晉諸帝統系圖",
 "晉諸王世表",
 "補晉宗室王侯表",
 "晉功臣世表",
 "晉將相大臣年表",
 "東晉將相大臣年表",
 "補晉異姓封爵表",
 "補晉執政表",
 "晉方鎮年表",
 "補晉方鎮表",
 "東晉方鎮年表",
 "晉書天文志校正",
 "晉書禮志校正",
 "補晉書經籍志",
 "晉僭偽諸國世表",
 "晉僭偽諸國年表",
 "補晉僭國年表",
 "偽漢將相大臣年表",
 "偽成將相大臣年表",
 "偽趙將相大臣年表",
 "偽燕將相大臣年表",
 "偽秦將相大臣年表",
 "偽後秦將相大臣年表",
 "偽後燕將相大臣年表",
 "偽南燕將相大臣年表",
 "後涼百官表",
 "南涼百官表",
 "西涼百官表",
 "北涼百官表",
 "夏百官表",
 "北燕百官表",
 "宋書補表",
 "宋諸王世表",
 "宋將相大臣世表",
 "宋方鎮年表",
 "齊諸王世表",
 "齊將相大臣年表",
 "齊方鎮年表",
 "補南齊書藝文志",
 "梁諸王世表",
 "梁將相大臣年表",
 "陳諸王世表",
 "陳將相大臣年表",
 "補陳疆域志",
 "魏諸帝統系圖",
 "魏諸王世表",
 "魏異姓諸王世表",
 "魏外戚諸王世表",
 "西魏將相大臣年表",
 "東魏將相大臣年表",
 "元魏方鎮年表",
 "魏書禮志校補",
 "魏書官氏志疏證",
 "補魏書兵志",
 "北齊諸王世表",
 "北齊異姓諸王世表",
 "北齊將相大臣年表",
 "周諸王世表",
 "周公卿年表",
 "隋諸王世表",
 "隋將相大臣年表",
 "隋唐之際月表",
 "隋書地理志考證",
 "隋書經籍志補",
 "隋書經籍志考證",
 "南北史補志",
 "南北史補志未刊稿",
 "補南北史藝文志",
 "唐將相大臣年表",
 "唐功臣世表",
 "唐鎮十道節度使表",
 "唐邊鎮年表",
 "唐藩鎮年表",
 "唐方鎮年表",
 "唐宦官封爵表",
 "武氏諸王表",
 "唐書宰相世系表訂譌",
 "唐折衝府考補拾遺",
 "唐折衝府考校補",
 "唐諸蕃君長世表",
 "五代諸王世表",
 "五代諸國世表",
 "五代將相大臣年表",
 "五代諸國年表",
 "五代諸鎮年表",
 "南唐將相大臣年表",
 "蜀將相大臣年表",
 "後蜀將相大臣年表",
 "南漢將相大臣年表",
 "北漢將相大臣年表",
 "吳越將相大臣年表",
 "吳越將相州鎮臣年表",
 "五代地理考",
 "宋中興三公年表",
 "宋大臣年表",
 "北宋經撫年表",
 "南宋制撫年表",
 "宋史地理志考異",
 "西夏藝文志",
 "遼諸帝統系圖",
 "遼大臣年表",
 "遼史地理志考",
 "遼藝文志",
 "補遼史藝文志",
 "金諸帝統系圖",
 "金將相大臣年表",
 "金宰輔年表",
 "金衍慶宮功臣錄",
 "金史禮志補脫",
 "元分藩諸王世表",
 "元西域三藩年表",
 "元行省丞相平章政事年表",
 "明宰輔考略",
 "明七卿考略",
 "明督撫年表",
 "殘明宰輔年表",
 "殘明大統曆",
 "增補史目表",
 "史記評林",
 "漢書評林",
 "史論",
 "說史雋言",
 "支雜漫語",
 "史記勦說",
 "漢書勦說",
 "後漢書勦說",
 "三國志勦說",
 "欽定遼史語解",
 "欽定金史語解",
 "欽定元史語解",
 "後漢書年表",
 "新疆賦",
 "西域水道記",
 "歷代統計表",
 "漢書疑年錄",
 "後漢書疑年錄",
 "三國魏志疑年錄",
 "蜀志疑年錄",
 "吳志疑年錄",
 "晉書疑年錄",
 "皇清開國方畧書成聯句",
 "御製嗣統述聖詩",
 "讀史論畧",
 "史鑑撮要",
 "歷代通論",
 "前漢書細讀",
 "後漢書贅語",
 "讀三國志書後",
 "讀明史雜著",
 "補尚史論贊",
 "史功表比說",
 "三國志職官表",
 "宋州郡志校勤記",
 "梁書斠議",
 "陳書斠議",
 "北齊書斠議",
 "周書斠議",
 "隋書斠議",
 "史記札記",
 "漢書札記",
 "晉書札記",
 "宋書札記",
 "梁書札記",
 "魏書札記",
 "隋書札記",
 "南史札記",
 "北史札記",
 "晉書校文",
 "史記評議",
 "漢書評議",
 "後漢書評議",
 "三國志評議",
 "遼痕五種",
 "遼代年表",
 "補遼史蓺文志",
 "遼代文學考",
 "遼代金石錄",
 "遼文補錄",
 "古譜纂例",
 "古孝彙傳",
 "桂考",
 "十七史說",
 "通鑑劄記",
 "續歷代紀事年表",
 "異辭錄",
 "兩漢紀校記",
 "資治通鑑綱目前編",
 "資治通鑑綱目前編外紀",
 "續資治通鑑綱目",
 "資治通鑑綱目前",
 "資治通鑑綱目校勘記",
 "續資治通鑑綱目校勘記",
 "御撰資治通鑑綱目三編",
 "資治通鑑釋例圖譜",
 "甲子會紀",
 "通鑑釋文辯誤",
 "宋元資治通鑑",
 "資治通鑑釋文辯誤",
 "通鑑目錄",
 "通鑑宋本校勘記",
 "元本校勘記",
 "明通鑑",
 "新校資治通鑑敘錄",
 "資治通鑑釋例",
 "大清太祖承天廣運聖德神功肇紀立極仁孝睿武弘文定業高皇帝實錄殘卷",
 "通鑑長編紀事本末",
 "遼史紀事本末",
 "金史紀事本末",
 "開天傳信錄",
 "王氏揮麈錄",
 "謇齋瑣綴錄",
 "兩湖麈談錄",
 "續漢書",
 "失氏名後漢書",
 "南宋書",
 "元史類編",
 "揚州十日屠殺記",
 "嘉定屠城慘史",
 "乙酉海虞被兵記",
 "中東戰紀輯要",
 "宣和乙巳奉使金國行程錄",
 "韃靼考",
 "遼金時蒙古考",
 "皇明大政記",
 "皇明大訓記",
 "皇明大事記",
 "皇明開國臣傳",
 "皇明遜國臣傳",
 "拊膝錄",
 "黃陳報冤錄",
 "明初禮賢錄",
 "宣爐注",
 "聖駕臨雍錄",
 "三朝聖諭錄",
 "留青日札",
 "鳳洲筆記",
 "奇聞類記",
 "幸存錄",
 "彤史拾遺記",
 "流賊傳",
 "流寇瑣記",
 "綏史",
 "愍忠錄",
 "忠貞軼記",
 "啟禎兩朝剝復錄",
 "聖安本紀",
 "所知錄",
 "懿安事略",
 "恩恤諸公志略",
 "東林本末（石印本題東林事畧）",
 "念陽徐公定蜀記",
 "平蜀記事",
 "攻渝紀事",
 "全吳紀略",
 "袁督師計斬毛文龍始末",
 "孫高陽前後督師略跋",
 "孫愷陽先生殉城論",
 "荊溪盧司馬殉忠錄（石印本題荊溪盧司馬殉忠實錄）",
 "汴圍濕襟錄",
 "崇禎癸未榆林城守紀畧",
 "崇禎甲申保定城守紀畧",
 "甲申忠佞記事",
 "甲申紀變錄（石印本題甲申紀變實錄）",
 "遇變紀略",
 "滄洲紀事",
 "偽官據城記",
 "歷年城守記",
 "北使紀略",
 "弘光朝偽東宮偽后及黨禍紀略",
 "弘光乙酉揚州城守紀略",
 "江陰城守紀",
 "江陰守城記",
 "平吳事畧（石印本題開國吳事畧）",
 "倣指南錄",
 "閩游月記",
 "劉公旦先生死義記",
 "航澥遺聞",
 "風倒梧桐記",
 "江變紀畧",
 "兩粵夢遊記",
 "粵中偶記",
 "庚寅十一月初五日始安事畧",
 "入長沙記",
 "錢氏家變錄",
 "平定耿逆記",
 "四王合傳",
 "明亡述畧",
 "李仲達被逮紀畧",
 "東陽兵變",
 "平回紀略",
 "人變述略",
 "江陵紀事",
 "永歷紀事",
 "烈皇小識",
 "聖安皇帝本紀",
 "嘉定屠城紀略",
 "行在陽秋",
 "續幸存錄",
 "求野錄",
 "也是錄",
 "江南聞見錄",
 "粵游見聞",
 "兩廣紀畧",
 "東明聞見錄",
 "青燐屑",
 "吳耿尚孔四王合傳",
 "明紀編年",
 "崇禎閣臣年表",
 "崇禎內閣行畧",
 "甲申以後亡臣表",
 "東林籍貫錄",
 "天啟宮中詞",
 "挺擊始末",
 "七太子傳",
 "廟祔十五王傳",
 "廣陸儲王趙朱景蔣曾桑朱宗列傳",
 "前明忠義別傳",
 "附宰相年表",
 "崇禎朝紀畧",
 "嘉定屠城紀畧",
 "續明季遺聞",
 "癸巳小春入長沙記",
 "永曆紀事",
 "荊溪盧司馬九台公殉忠寔錄",
 "兩粵新書",
 "江陰城守紀事",
 "東林事略",
 "東林紀事本末論",
 "孫高陽先生前後督師略跋",
 "督師袁崇煥計斬毛文龍始末",
 "崇禎甲申燕京紀變實錄",
 "甲申三月忠逆諸臣紀事",
 "清流摘鏡",
 "明季殉國諸臣錄",
 "平寇志",
 "流寇瑣聞",
 "攻口紀略",
 "大梁城守記",
 "瑣聞錄",
 "輶軒記事",
 "宮庭睹記",
 "丙申日記",
 "繡江集",
 "難遊錄",
 "東村記事",
 "永曆帝入緬本末",
 "福王登極實錄",
 "過江七事",
 "金陵紀略",
 "附南征記",
 "哭廟紀略",
 "丁酉北闈大獄記略",
 "莊氏史案",
 "秋思草堂遺集",
 "思文大紀",
 "弘光實錄鈔",
 "淮城紀事",
 "揚州變略",
 "京口變略",
 "崇禎長編",
 "浙東紀略",
 "嘉定縣乙酉紀事",
 "啟禎記聞錄",
 "孤忠後錄",
 "海上見聞錄",
 "鹿樵紀聞",
 "隆武遺事",
 "客滇述",
 "守鄖記略",
 "大梁守城記",
 "國變難臣鈔",
 "崇禎甲申燕都紀變實錄",
 "紀錢牧齋遺事",
 "陶元暉中丞遺集",
 "畢少保公傳",
 "海運摘鈔",
 "東江遺事",
 "小腆紀敘",
 "爝火錄",
 "荊溪盧司馬九台公殉忠實錄",
 "野獲",
 "定思小記",
 "蘇城記變",
 "監國紀年",
 "舟山紀略",
 "劫灰錄",
 "桂林田海記",
 "庚寅十一月初五日始安事略",
 "滇南外史",
 "交山平寇始末",
 "三朝野記",
 "保定城守紀畧",
 "榆林城守紀畧",
 "乙酉揚州城守紀畧",
 "江陰城守後紀",
 "揚州變畧",
 "三湘從事錄",
 "東行初錄",
 "甲午戰爭電報錄",
 "馬關議和中日談話錄",
 "庚子國變記",
 "拳變餘聞",
 "西巡回鑾始末記",
 "明武宗外紀",
 "天水冰山錄",
 "殛坤誌畧",
 "查抄和珅家產清單",
 "全吳紀畧",
 "北使紀畧",
 "浙東紀畧",
 "庚寅始安事畧",
 "永歷紀年",
 "奉使俄羅斯日記",
 "與俄羅斯國定界之碑",
 "尼布楚城考",
 "俄羅斯佐領考",
 "俄羅斯進呈書籍記附目錄",
 "伊犁定約中俄談話錄",
 "信及錄",
 "雅片事畧",
 "熹朝忠節死臣傳",
 "復社紀略",
 "汰存錄紀辨",
 "守鄖紀略",
 "虎口餘生紀",
 "平吳事畧",
 "定蜀記",
 "平蜀紀事",
 "嘉靖東南平倭通錄",
 "倭變事畧",
 "靖海紀畧",
 "金山倭變小志",
 "紀剿除徐海本末",
 "日本犯華考",
 "中東古今和戰端委考",
 "研堂見聞雜錄",
 "建州私志",
 "清開國史料考敘論訂補篇",
 "太宗文皇帝日錄",
 "太宗文皇帝致朝鮮國王書",
 "太宗文皇帝招撫皮島諸將諭帖",
 "天聰朝臣工奏議",
 "聖祖仁皇帝起居注",
 "欽定服色肩輿永例",
 "禮曹章奏日錄",
 "工曹章奏",
 "洪文襄公呈報吳勝兆叛案揭帖",
 "投順提督張天祿呈報功績冊",
 "北直河南山東山西職官名籍",
 "蘇松常鎮總兵將領清冊",
 "徽寧池太安慶廣德總兵將領清冊",
 "內翰林弘文院職官錄",
 "內弘文院職官錄",
 "豫通親王事實冊",
 "平南敬親王尚可喜事實冊",
 "奮威將軍左都督王忠勇公事實",
 "振武將軍陝甘提督孫公思克行述",
 "廣西巡撫諡文毅馬雄鎮事實冊",
 "果毅親王恩榮錄",
 "東瀛紀事",
 "聖祖仁皇帝起居注殘稿",
 "聖祖親征朔漠日錄",
 "聖祖西征日錄",
 "雍正朝上諭檔",
 "高宗純皇帝起居注殘稿",
 "吏曹章奏",
 "江南額解舊南京民糧屯糧本色數目冊",
 "乾隆三年在京文職漢官俸米及職名黃冊",
 "奉天等省民數穀數彙總黃冊",
 "江南按察司審土國寶招擬文冊",
 "江南總督洪承疇詳查舊額解南本折錢糧及酌定支用起解事宜冊",
 "光祿寺進康熙六十一年四月分內用豬鴨果品等項錢糧數目黃冊",
 "工部進乾隆三十年六月分用過銀錢數目黃冊",
 "工部進乾隆四十三年七月分用過雜項銀錢數目黃冊",
 "工部進乾隆四十九年用過緞匹顏料數目黃冊",
 "內閣典籍廳關支康熙廿八年秋冬二季俸米黃冊",
 "吏部進道光廿三年春夏二季在京文職漢官領過俸米及職名黃冊",
 "吏部進道光廿三年秋冬二季在景文職漢官領過俸米及職名黃冊",
 "三朝實錄館館員功過等第冊",
 "田文端公（從典）行述",
 "國初成案",
 "道咸成案",
 "和約彙編",
 "善後襍鈔",
 "中外紀事本末",
 "備錄",
 "殛珅誌略",
 "守撫紀略",
 "庚辛記事",
 "太平條規",
 "行營規矩",
 "旨准頒行詔書總目",
 "太天國辛酉十一年新歷封面式樣並造歷人銜名",
 "請頒新歷奏",
 "天王詔旨一",
 "天王詔旨二",
 "辛酉十一年正月分歷書",
 "庚申十年正月萌芽月令",
 "忠王致護王書",
 "忠王致潮王書",
 "干王書福字碑拓本",
 "干王印",
 "俚歌一首",
 "和碩親王致戈登劄",
 "張遇春致戈登書",
 "天父下凡詔書〔一〕",
 "天父下凡詔書〔二〕",
 "天命詔旨書",
 "頒行詔書",
 "天朝田畝制度",
 "建天京於金陵論",
 "貶妖穴為罪隸論",
 "原道救世歌",
 "百正歌",
 "原道醒世訓",
 "原道覺世訓",
 "天父上帝言題皇詔",
 "舊新遺詔聖書樣本",
 "天條書一卷附改正本天條書序言",
 "太平詔書",
 "原道救世詔",
 "原道醒世詔",
 "原道覺世詔",
 "太平軍目",
 "太平天國癸好三年新曆",
 "太平天國辛酉十一年新曆",
 "幼學詩",
 "太平救世歌",
 "詔書蓋𨮪頒行論",
 "天情道理書",
 "御製千字詔",
 "行軍總要",
 "天父詩",
 "醒世文",
 "王長次兄親目親耳共證福音書",
 "欽定士階條例",
 "幼主詔書",
 "欽定英傑歸真",
 "太平天國論文題跋",
 "洪楊遺聞",
 "金陵癸甲紀略",
 "粵逆名目略",
 "粵逆陷寧始末記",
 "癸丑中州罹兵紀略",
 "庚申避亂實錄",
 "庚申日記",
 "金陵癸甲摭談補",
 "儉德齋隨筆",
 "干王洪仁玕等口供",
 "太平詩史",
 "武川寇難詩草",
 "金壇圍城紀事詩",
 "三字經",
 "起事來歷真傳",
 "滿清興亡史",
 "滿清外史",
 "貪官污吏傳",
 "奴才小史",
 "中國革命日記",
 "各省獨立史別裁",
 "清末實錄",
 "戊壬錄",
 "南北春秋",
 "當代名人事略",
 "黃花岡十傑紀實",
 "三江筆記",
 "湘漢百事",
 "所聞錄",
 "新燕語",
 "變異錄",
 "暗殺史",
 "清華集",
 "中法兵事本末",
 "中日兵事本末",
 "割臺記",
 "胤禎外傳",
 "髮史",
 "多鐸妃劉氏外傳",
 "漢人不服滿人表",
 "都門識小錄",
 "述庵祕錄",
 "故宮漫載",
 "慶親王外傳",
 "德宗承統私記",
 "清代割地談",
 "第一次中俄密約",
 "中俄伊犁交涉始末",
 "滿清紀事",
 "蜀亂述聞",
 "西藏風俗記",
 "清宮瑣聞",
 "記朱一貴之亂",
 "葉名琛廣州之變",
 "張汶祥記",
 "董妃行狀",
 "奉天行宮游記",
 "清宮詞",
 "咸同將相瑣聞",
 "清宮禁二年記",
 "康雍乾間文字之獄",
 "清朝前紀",
 "清光緒帝外傳（原名崇陵傳信錄）",
 "慈禧及光緒賓天厄",
 "董小宛別傳",
 "圓明園總管世家",
 "戊戌政變始末",
 "景善日記",
 "庚子拳變始末記",
 "歸廬譚往錄",
 "骨董禍",
 "蘭陵女俠",
 "洪福異聞",
 "海花嶺遺事",
 "金川妖姬志",
 "烏蒙祕聞",
 "陸麗京雪罪雲游記",
 "桂藩事略",
 "指嚴筆記",
 "庸庵文九則",
 "李文忠公（鴻章）事略",
 "張文襄公（之洞）事略",
 "太平天國戰紀",
 "洪楊軼聞",
 "都門紀變百詠",
 "鐵路國有案",
 "辛亥四川路事紀略",
 "名人軼事",
 "檮杌近志",
 "外交小史",
 "蕉窗雨話九則",
 "清代名人趣史",
 "北京遊記彙鈔",
 "棲霞閣野乘",
 "悔逸齋筆乘",
 "庸閒齋筆記摘鈔",
 "慧因室雜綴",
 "秦鬟樓談錄",
 "陽秋賸筆",
 "知過軒隨錄",
 "啁啾漫記",
 "小奢摩館脞錄",
 "清代之竹頭木屑",
 "清稗瑣綴",
 "滿清入關暴政之",
 "弢園筆乘",
 "蜀燹死事者畧傳",
 "鵝山文摘鈔",
 "長安宮詞",
 "丘逢甲傳",
 "祺祥故事",
 "東陵道",
 "護國軍紀實",
 "張文襄公治鄂記",
 "辛亥武昌首義紀",
 "安南軍營紀略",
 "湖南軍營紀略",
 "黔粵軍營紀略",
 "宋朱晦菴先生名臣言行錄前集",
 "宋朱晦菴先生名臣言行錄後集",
 "宋名臣言行錄續集",
 "皇朝名臣言行續錄",
 "宋名臣言行錄別集（一名四朝名臣言行錄）",
 "宋名臣言行錄別集",
 "皇朝道學名臣言行外錄",
 "宋丞相韓忠獻公家傳",
 "宋忠獻韓魏王君臣相遇傳",
 "宋忠獻韓魏王君臣相遇別錄",
 "宋忠獻韓魏王君臣相遇遺事",
 "宋丞相李忠定公別集",
 "宋丞相文山先生別集",
 "文山先生紀年錄",
 "文山先生指南錄",
 "文山先生吟嘯集",
 "文山先生集杜詩",
 "文丞相督府忠義傳",
 "忠列編",
 "蓮花山紀略",
 "林文忠公（則徐）傳略",
 "周文忠公（天爵）傳略",
 "胡文忠公（林翼）傳略",
 "孔子年譜輯注",
 "孟子編年",
 "漢徐徵士（穉）年譜",
 "漢諸葛忠武侯（亮）年譜",
 "晉陶徵士（潛）年譜",
 "唐李鄴侯（泌）年譜",
 "歐陽文忠公（修）年譜",
 "宋韓忠獻公（琦）年譜",
 "王文公（安石）年譜考略節要",
 "曾文定公（鞏）年譜",
 "黃文節公（庭堅）年譜",
 "李忠定公（綱）年譜",
 "陸文安公（九淵）年譜",
 "吳聘君（與弼）年譜",
 "胡文敬公（居仁）年譜",
 "明王文成公（守仁）年譜節鈔",
 "曾子固（鞏）年譜稿",
 "曾子宣（布）年譜稿",
 "曾子開（肇）年譜稿",
 "明道先生（程顥）年譜",
 "伊川先生（程頤）年譜",
 "宋儒龜山楊先生（時）年譜",
 "豫章羅先生（從彥）年譜",
 "延平李先生（侗）年譜",
 "紫陽朱先生（熹）年譜",
 "文山傳信錄",
 "文文山（天祥）年譜",
 "鄭延平（成功）年譜",
 "歸震川先生（有光）年譜",
 "朱柏廬先生編年毋欺錄",
 "雙槐公（黃瑜）年譜",
 "粵洲公（黃畿）年譜",
 "文裕公（黃佐）年譜",
 "寧海將軍固山貝子功績",
 "寧海將軍固山貝子撫嵊績",
 "平閩功績見聞錄",
 "甲寅遇難錄",
 "貞文先生（林紓）年譜",
 "春覺齋箸述記",
 "貞文先生學行記",
 "林氏弟子表",
 "星周紀事",
 "難情雜記",
 "兵災紀略",
 "白雲儔侶傳",
 "東南諸山記",
 "附存疑",
 "會稽後賢傳記",
 "會稽先賢像讚",
 "會稽土地記",
 "會稽地志",
 "元統元年進士錄",
 "清代宰輔年表",
 "清代八卿年表",
 "清代總督年表",
 "清代巡撫年表",
 "清代館選分韻彙編",
 "歷代地圖",
 "歷代竊據圖",
 "歷代地理直音",
 "歷代事變圖譜",
 "古今官制沿革圖",
 "古語訓略",
 "碧漸堂詩草",
 "大衍十二次分野圖",
 "丹壺名山記",
 "古岳瀆經",
 "張子房赤霆經",
 "禹受地記",
 "禹貢九州制地圖論",
 "十二州箴",
 "尚書地說",
 "四方令",
 "畿服經",
 "周譜",
 "周公城名錄",
 "奏上論",
 "古今地名",
 "張氏土地記",
 "帝王經界紀",
 "秦地圖",
 "漢輿地圖",
 "地理風俗記",
 "郡國志",
 "九州要記",
 "十四州記",
 "吳地理志",
 "晉地道記",
 "永初山順記",
 "大魏諸州記",
 "周地圖記",
 "地理書抄",
 "職貢圖",
 "隋區宇圖志",
 "隋州郡圖經",
 "魏王泰括地志",
 "周官總義職方氏注",
 "歷朝傳記九種",
 "武陵先賢傳",
 "武陵十仙傳",
 "桂陽先賢傳",
 "桂陽列仙傳",
 "桓階別傳",
 "羅含別傳",
 "荊湘地記二十九種",
 "荊州圖記",
 "荊州圖副",
 "荊州土地記",
 "荊南地志",
 "湘州滎陽郡記",
 "沅陵記",
 "衡山記",
 "沅川記",
 "五溪記",
 "荊湖圖經三十六種",
 "長沙圖經",
 "衡山圖經",
 "道州圖經",
 "澧州圖經",
 "紹熙長沙志",
 "祥符茶陵圖經",
 "乾道茶陵圖經",
 "祥符衡州圖經",
 "衡陽志",
 "永州圖經",
 "零陵志",
 "永州風土記",
 "舂陵舊圖經",
 "舂陵志",
 "道州風俗記",
 "邵州圖經",
 "邵陽志",
 "都梁志",
 "武岡志",
 "郴州圖經",
 "郴江志",
 "桂陽圖經",
 "桂陽志",
 "岳州圖經",
 "岳陽甲志",
 "岳陽乙志",
 "常德圖經",
 "澧州續圖經",
 "辰州圖經",
 "辰州風土記",
 "沅州圖經",
 "靖州圖經",
 "太平寰宇記拾遺",
 "太平寰宇記辨偽",
 "湘中名賢遺集五種",
 "蔣恭侯集",
 "劉令君集",
 "桓令君集",
 "車太常集",
 "谷儉集",
 "陶閣史詩集",
 "後漢書大秦國傳補注",
 "古海國遺書鈔",
 "南州異物志",
 "扶南異物志",
 "吳時外國傳",
 "交州以南外國傳",
 "外國圖",
 "外國事",
 "西域諸國志",
 "扶南土俗傳",
 "扶南記",
 "古海國沿革攷",
 "沿革表",
 "大清一統輿圖海道集釋",
 "亞歐兩洲沿岸海道紀要",
 "漢書匈奴傳地理攷證",
 "西南夷兩粵朝鮮傳地理攷證",
 "西域傳地理攷證",
 "後漢書東夷列傳地理攷證",
 "南蠻西南夷列傳地理攷證",
 "西羌傳地理攷證",
 "南匈奴傳地理攷證",
 "烏桓鮮卑傳地理攷證",
 "三國志烏丸鮮卑東夷傳附魚豢魏略西戎傳地理攷證",
 "晉書四夷傳地理攷證",
 "宋書夷貊傳地理攷證",
 "南齊書夷貊傳地理攷證",
 "梁書夷貊傳地理攷證",
 "魏書外國傳地攷證",
 "外國傳補地理攷證",
 "周書異域傳地理攷證",
 "隋書四夷傳地理攷證",
 "新唐書突厥傳地理攷證",
 "吐蕃傳地理攷證",
 "回紇等國傳地理攷證",
 "沙陀傳地理攷證",
 "北狄列傳地理攷證",
 "東夷列傳地理攷證",
 "南蠻列傳地理攷證",
 "新舊唐書西域傳地理攷證",
 "新五代史四夷附錄地理攷證",
 "宋史外國傳地理攷證",
 "遼史各外國地理攷證",
 "金史外國傳地理攷證",
 "元史外夷傳地理攷證",
 "明史外國傳地理攷證",
 "穆天子傳地理攷證",
 "中國人種所從來攷",
 "穆天子傳紀日干支表",
 "晉釋法顯佛國記地理攷證",
 "後魏宋雲西域求經記地理攷證",
 "大唐西域記地理攷證",
 "印度風俗總記",
 "唐杜環經行記地理攷證",
 "元耶律楚材西游錄地理攷證",
 "元祕史地理攷證",
 "元祕史作者人名攷",
 "元太祖成吉思汗編年大事記",
 "元初漠北大勢論",
 "元史特薛禪曷思麥里速不台郭寶玉傳地理攷",
 "郭侃傳辨",
 "元聖武親征錄地理攷證",
 "元經世大典圖地理攷證",
 "附元史地理志西北地",
 "元張參議耀卿紀行地理攷證",
 "元長春真人西游記地理攷證",
 "元劉郁西使記地理攷證",
 "圖理琛異域錄地理攷證",
 "漢書地理志",
 "新斠注地里志",
 "後漢書郡國志",
 "續漢志補注",
 "晉書地理志",
 "宋書州郡志",
 "南齊書州郡志",
 "魏書地形志",
 "隋書地理志",
 "舊唐書地理志",
 "唐書地理志",
 "舊五代史郡縣志",
 "五代史職方考",
 "宋史地理志",
 "遼史地理志",
 "金史地理志",
 "元史地理志",
 "明史地理志",
 "歷代地理沿革圖",
 "皇朝一統輿圖",
 "西藏圖考",
 "西招圖略",
 "西遊記金山以東釋",
 "蒙古游牧記",
 "新疆要略",
 "漢西域圖攷",
 "滇緬劃界圖說",
 "元祕史山川地名攷",
 "雲緬山川志",
 "長河志籍攷",
 "東三省輿圖說",
 "地球總論",
 "地理記略",
 "地理淺說",
 "地球誌略",
 "括地略",
 "輿地略",
 "輿地全覽",
 "各省水道圖說",
 "迎駕記",
 "隨鑾紀恩",
 "開國龍興記",
 "奉天形勢論",
 "曼陀羅館紀程",
 "熱河小記",
 "綏服內蒙古記",
 "綏服外蒙古記",
 "喀爾喀風土記",
 "綏服厄魯特蒙古記",
 "蒙古五十一旗考",
 "蒙古邊防議",
 "蒙古水道略",
 "蒙古臺卡志略",
 "河套志略",
 "外藩疆理考",
 "征準噶爾記",
 "塞北紀程",
 "兩征厄魯特記",
 "蕩平準部記",
 "勘定回疆記",
 "新疆後事記",
 "新疆紀略",
 "回疆風土記",
 "西域置行省議",
 "烏魯木齊雜記",
 "伊犁日記",
 "蓋地論",
 "地理說略",
 "地球形勢說",
 "地理形勢考",
 "五州方域考",
 "國地異名錄",
 "五大洲輿地戶口物產表",
 "天下形勢考",
 "府州廳縣異名錄",
 "中國方域考",
 "中國形勢考略",
 "中國歷代都邑考",
 "中國物產考略",
 "輿覽",
 "方輿紀要簡覽",
 "滿洲考略",
 "盛京考略",
 "直隸考略",
 "江蘇考略",
 "安徽考略",
 "江西考略",
 "浙江考略",
 "福建考略",
 "湖北考略",
 "湖南考略",
 "河南考略",
 "山東考略",
 "山西考略",
 "陝西考略",
 "甘肅考略",
 "四川考略",
 "廣東考略",
 "廣西考略",
 "雲南考略",
 "貴州考略",
 "驛站路程",
 "輿地經緯度里表",
 "扈從東巡日錄",
 "扈從紀程",
 "迎駕紀恩",
 "迎駕紀",
 "迎駕始末",
 "扈從賜遊記",
 "鳳臺祗謁筆記",
 "永寧祗謁筆記",
 "南巡名勝圖說",
 "奉天形勢",
 "出邊紀程",
 "遊寧古塔記",
 "庫葉附近諸島考",
 "吉林勘界記",
 "黑龍江外紀",
 "卜魁風土記",
 "卜魁紀略",
 "雅克薩考",
 "尼布楚考",
 "艮維窩集考",
 "東三省邊防議",
 "東北邊防論",
 "東陲道里形勢",
 "蒙古吉林土風記",
 "塞上雜記",
 "東蒙古形勢考",
 "庫倫記",
 "蒙古考略",
 "河套略",
 "青海考略",
 "青海事宜論",
 "蒙古沿革考",
 "卡倫形勢記",
 "從軍雜記",
 "高平行紀",
 "回疆雜記",
 "天山南北路考略",
 "回部政俗論",
 "喀什噶爾略論",
 "軍臺道里表",
 "新疆設行省議",
 "西域設行省議",
 "莎車行紀",
 "衛藏識略",
 "烏斯藏考",
 "前後藏考",
 "西藏紀略",
 "撫綏西藏記",
 "西藏後記",
 "藏鑪總記",
 "藏鑪述異記",
 "西藏巡邊記",
 "寧藏七十九族番民考",
 "入藏程站",
 "藏寧路程",
 "由藏歸程記",
 "旃林記略",
 "前藏三十一城考",
 "察木多西諸部考",
 "乍ㄚ圖說",
 "墨竹工卡記",
 "得慶記",
 "錫金考略",
 "西招審隘篇",
 "西藏要隘考",
 "西藏改省會論",
 "西藏建行省議",
 "征廓爾喀記",
 "廓爾喀不丹合考",
 "征烏梁海述略",
 "哈薩克述略",
 "西北邊域考",
 "綏服西屬國記",
 "外藩列傳",
 "北徼形勢考",
 "俄羅斯形勢考",
 "俄羅斯源流考",
 "俄羅斯諸路疆域考",
 "俄羅斯分部說",
 "俄羅斯疆域編",
 "俄羅斯互巿始末",
 "俄羅斯叢記",
 "北徼城邑考",
 "北徼方物考",
 "北徼喀倫考",
 "俄羅斯戶口略",
 "俄羅斯盟聘記",
 "俄羅斯附記",
 "聘盟日記",
 "綏服紀略",
 "海隅從事錄",
 "使俄日記",
 "俄遊日記",
 "亞洲俄屬考略",
 "取中亞細亞始末記",
 "西伯利記",
 "取悉畢爾始末記",
 "俄屬海口記",
 "海參崴埠通商論",
 "琿春瑣記",
 "北遊紀略",
 "伯利探路記",
 "蝦夷紀略",
 "俄羅斯疆界碑記",
 "中俄交界記",
 "通俄道里表",
 "五嶽說",
 "五嶽約",
 "泰山脈絡紀",
 "登岱記",
 "登泰山記",
 "遊泰山記",
 "遊南嶽記",
 "登南嶽記",
 "重遊嶽麓記",
 "嵩嶽考",
 "嵩山說",
 "遊中嶽記",
 "遊太室記",
 "華山志概",
 "登華山記",
 "登太華山記",
 "太華紀遊略",
 "恆山記",
 "恆嶽記",
 "北嶽辨",
 "北嶽中嶽論",
 "長白山記",
 "遊千頂山記",
 "遊西山記",
 "西山遊記",
 "遊翠微山記",
 "翠微山記",
 "天壽山說",
 "游上方山記",
 "𢘿題上方二山紀游",
 "遊盤山記",
 "游盤山記",
 "石門諸山記",
 "遊鍾山記",
 "遊清涼山記",
 "遊攝山記",
 "攝山紀遊",
 "棲霞山攬勝記",
 "遊幕府山泛舟江口記",
 "花山遊記",
 "遊寶華山記",
 "茅山記",
 "遊瓜步山記",
 "遊吳山記",
 "遊虎邱記",
 "虎邱往還記",
 "遊靈巖山記",
 "遊靈巖記",
 "靈巖懷舊記",
 "遊寒山記",
 "遊茶山記",
 "遊馬駕山記",
 "彈山吾家山遊記",
 "遊洞庭西山記",
 "登洞庭兩山記",
 "遊西洞庭記",
 "遊洞庭兩山記",
 "西洞庭誌",
 "遊包山記",
 "遊石公山記",
 "遊漁洋山記",
 "遊虞山記",
 "遊馬鞍山記",
 "玉峰遊記",
 "遊細林山記",
 "遊橫雲山記",
 "毘陵諸山記",
 "遊蜀山記",
 "遊龍池山記",
 "遊橫山記",
 "遊焦山記",
 "遊蒜山記",
 "象山記",
 "遊北固山記",
 "遊金焦北固山記",
 "遊京口南山記",
 "登燕山記",
 "方山記",
 "遊江上諸山記",
 "五山志略",
 "五狼山記",
 "遊象山麓記",
 "遊軍山記",
 "紫琅遊記",
 "遊雲龍山記",
 "遊睢寧諸山記",
 "雲臺山記",
 "遊雲臺山記",
 "遊雲臺山北記",
 "遊浮山記",
 "黃山史概",
 "白嶽遊記",
 "披雲山記",
 "遊靈山記",
 "績溪山水記",
 "黟縣山水記",
 "遊石柱山記",
 "遊敬亭山記",
 "遊九華記",
 "遊九華山記",
 "梅村山水記",
 "遊青山記",
 "過關山記",
 "旴江諸山遊記",
 "從姑山記",
 "遊罏山記",
 "遊懷玉山記",
 "遊龜峰山記",
 "軍陽山記",
 "遊鵝湖山記",
 "遊廬山後記",
 "遊廬山天池記",
 "遊大孤山記",
 "登小孤山記",
 "遊石鐘山記",
 "軍峯山小記",
 "遊福山記",
 "遊麻姑山記",
 "軍峯記",
 "鳳凰山記",
 "鄧公嶺經行記",
 "黃皮山遊紀略",
 "大陽山遊紀略",
 "大圍山遊紀略",
 "遊西陽山記",
 "遊青原山記",
 "翠微峯記",
 "遊翠微峯記",
 "吳山紀遊",
 "遊孤山記",
 "遊硤石兩山記",
 "遊天目山記",
 "遊兩尖山記",
 "雲岫山遊記",
 "遊鷹窠頂記",
 "遊陳山記",
 "蠡山記",
 "遊白鵲山記",
 "道場山遊記",
 "登道場山記",
 "遊道場白雀諸山記",
 "遊大小玲瓏山記",
 "普陀紀勝",
 "遊柯山記",
 "遊吼山記",
 "遊天台山記",
 "天台遊記",
 "遊仙居諸山記",
 "橫山記",
 "禹山記",
 "鴈山雜記",
 "遊鴈蕩山記",
 "遊鴈蕩記",
 "遊鴈蕩日記",
 "北鴈蕩紀遊",
 "鴈山便覽記",
 "遊南鴈蕩記",
 "南鴈蕩紀遊",
 "中鴈蕩紀遊",
 "桃花隘諸山記",
 "芙蓉嶂諸山記",
 "小仙都諸山記",
 "黃龍山記",
 "遊黃龍山記",
 "遊鼓山記",
 "武夷紀勝",
 "武夷山遊記",
 "武夷遊記",
 "武夷導遊記",
 "遊武夷山記",
 "九曲遊記",
 "黃鵠山記",
 "遊襄城山水記",
 "武當山記",
 "遊五腦山記",
 "遊龍山記",
 "遊石門記",
 "羅山記",
 "登君山記",
 "遊連雲山記",
 "登天嶽山記",
 "遊大雲山記",
 "遊金牛山記",
 "遊桃源山記",
 "前遊桃花源記",
 "後遊桃花源記",
 "遊永州近治山水記",
 "遊林慮山記",
 "遊天平山記",
 "遊唐王山記",
 "遊桐柏山記",
 "遊豐山記",
 "誥屏山記",
 "遊歷山記",
 "遊華不注記",
 "登千佛山記",
 "遊龍洞山記",
 "遊徂徠記",
 "敖山記",
 "登嶧山記",
 "遊蒙山記",
 "遊仰天記",
 "遊五蓮記",
 "遊九仙記",
 "遊岠崛院諸山記",
 "遊方山記",
 "遊程符山記",
 "遊卦山記",
 "五臺山記",
 "老姥掌遊記",
 "遊龍門記",
 "嵯峨山記",
 "遊牛頭山記",
 "太白紀遊略",
 "陝甘諸山考",
 "首陽山記",
 "遊章山記",
 "竇圌山記",
 "萃龍山記",
 "蟇頤山記",
 "青城山行記",
 "遊峨眉山記",
 "遊淩雲記",
 "木耳占記",
 "遊白雲山記",
 "遊欖山記",
 "浮山紀勝",
 "遊爛柯山記",
 "遊丹霞記",
 "經丹霞山記",
 "棲霞山遊記",
 "遊隱山記",
 "遊隱山六洞記",
 "遊桂林諸山記",
 "桂林諸山別記",
 "遊鷄足山記",
 "昆侖異同考",
 "岡底斯山考",
 "蔥嶺三幹考",
 "北幹考",
 "北徼山脈考",
 "俄羅斯山形志",
 "遊滴水巖記",
 "登燕子磯記",
 "遊燕子磯沿山諸洞記",
 "遊小盤谷記",
 "遊牛頭隖記",
 "遊支硎中峯記",
 "遊鵓鴿峯記",
 "遊劍門記",
 "遊善卷洞記",
 "遊張公洞記",
 "山門遊記",
 "遊白鶴峯記",
 "東山巖記",
 "葛壇遊記",
 "遊梅田洞記",
 "遊通天巖記",
 "遊羅漢巖記",
 "飛來峯記",
 "煙霞嶺遊記",
 "遊雲巖記",
 "遊碧巖記",
 "遊天窗巖記",
 "香罏峯紀遊",
 "遊金華洞記",
 "遊玉甑峰記",
 "遊仙巖記",
 "三巖洞記",
 "遊仙都峯記",
 "遊水尾巖記",
 "重遊靈應峯記",
 "登大王峯記",
 "遊普陀峯記",
 "遊赤壁記",
 "遊三遊洞記",
 "卯峒記",
 "遊麻姑洞記",
 "遊天井峯記",
 "遊靜谷衝記",
 "遊永州三巖記",
 "乾溪洞記",
 "桂陽石洞記",
 "伏牛洞記",
 "遊佛峪龍洞記",
 "遊黃紅峪記",
 "遊煙霞洞記",
 "遊乾陽洞紀略",
 "洪花洞記",
 "龍母洞記",
 "探靈巖記",
 "黃婆洞記",
 "遊碧落洞記",
 "遊潮水巖記",
 "遊楊歷巖記",
 "遊七星巖記",
 "七星巖記",
 "遊伏波巖記",
 "遊鐵城記",
 "遊白龍洞記",
 "遊丹霞巖九龍洞記",
 "遊燕子洞記",
 "牟珠洞記",
 "飛雲洞記",
 "少寨洞記",
 "獅子崖記",
 "遊龍巖記",
 "方輿諸山考",
 "水道總考",
 "水經要覽",
 "江道編",
 "江源考",
 "防江形勢考",
 "入江巨川編",
 "長江津要",
 "淮水編",
 "淮水考",
 "淮水說",
 "尋淮源記",
 "入淮巨川編",
 "黃河編",
 "黃河說",
 "河源圖說",
 "河源異同辨",
 "全河備考",
 "入河巨川編",
 "東西二漢水辨",
 "漢水發源考",
 "濟瀆考",
 "黑龍江水道編",
 "東北海諸水編",
 "十三道嘎牙河紀略",
 "盛京諸水編",
 "熱河源記",
 "京畿諸水編",
 "畿南河渠通論",
 "畿東河渠通論",
 "永定河源考",
 "水利雜記",
 "大陸澤圖說",
 "漳河源流考",
 "汝水說",
 "山東諸水編",
 "會通河水道記",
 "濬小清河議",
 "東湖記",
 "賈魯河說",
 "太湖源流編",
 "中江考",
 "南江考",
 "濬吳淞江議",
 "毘陵諸水記",
 "治下河論",
 "洩湖入江議",
 "淮北水利說",
 "江西水道考",
 "浙江諸水編",
 "兩浙水利詳考",
 "浦陽江記",
 "閩江諸水編",
 "九江考",
 "五谿考",
 "灕湘二水記",
 "甘肅諸水編",
 "粵江諸水編",
 "西江源流說",
 "廣西三江源流考",
 "雲南諸水編",
 "雲南三江水道考",
 "黔中水道記",
 "苗疆水道考",
 "三黑水考",
 "黑水考",
 "大金沙江考",
 "開金沙江議",
 "富良江源流考",
 "塞北漠南諸水彙編",
 "西北諸水編",
 "西域諸水編",
 "西藏諸水編",
 "北徼水道考",
 "色楞格河源流考",
 "額爾齊斯河源流考",
 "俄羅斯水道記",
 "山水考",
 "天下高山大川考",
 "宇內高山大河考",
 "泛大通橋記",
 "泛通河記",
 "浴溫泉記",
 "遊後湖記",
 "遊消夏灣記",
 "遊黃公澗記",
 "觀水雜記",
 "遊萬柳池記",
 "遊三龍潭記",
 "遊雙谿記",
 "遊媚筆泉記",
 "遊南湖記",
 "泛潁記",
 "遊玉簾泉記",
 "湖山便覽",
 "西湖考",
 "龍井遊記",
 "小港記",
 "遊鴛鴦湖記",
 "黯淡灘記",
 "湘行記",
 "泛瀟湘記",
 "三灘記",
 "遊浯溪記",
 "浯溪記",
 "泛百門泉記",
 "遊百門泉記",
 "遊珍珠泉記",
 "遊南池記",
 "遊大明湖記",
 "遊趵突泉記",
 "冶源紀遊",
 "遊五姓湖記",
 "天池記",
 "猩猩灘記",
 "遊磻溪記",
 "遊釣臺記",
 "出峽記",
 "遊惠州西湖記",
 "湞水紀行",
 "遊金粟泉記",
 "訪蘇泉記",
 "象州沸泉記",
 "遊龍泉記",
 "淨海記",
 "遊雨花臺記",
 "遊觀音門譙樓記",
 "遊滄浪亭記",
 "遊獅子林記",
 "遊姑蘇臺記",
 "彌羅閣望山記",
 "遊虎山橋記",
 "遊秦園記",
 "平山堂記",
 "劉伶臺記",
 "韓侯釣臺記",
 "遊愛蓮亭記",
 "遊周橋記",
 "遊龍亭記",
 "遊平波臺記",
 "遊瀨鄉記",
 "遊喜雨亭記",
 "遊潭柘寺記",
 "遊寶藏寺記",
 "龍泉寺記",
 "遊鷄鳴寺記",
 "遊金陵城南諸剎記",
 "遊湖心寺記",
 "遊海嶽庵記",
 "遊禪窟寺記",
 "遊石崆庵記",
 "遊智門寺記",
 "遊少林寺記",
 "遊晉祠記",
 "遊峽山寺記",
 "遊太華寺記",
 "遊銅瓦寺記",
 "還京日記",
 "南歸記",
 "舟行日記",
 "轉漕日記",
 "舟行記",
 "省闈日記",
 "東路記",
 "鄉程日記",
 "南遊筆記",
 "泛槳錄",
 "入都日記",
 "北行日記",
 "南遊日記",
 "遊蹤選勝",
 "名勝雜記",
 "鴻雪因緣圖記",
 "浪遊記快",
 "風土雜錄",
 "觀光紀遊",
 "京師偶記",
 "昌平州說",
 "居庸關說",
 "金陵志地錄",
 "吳趨風土錄",
 "姑蘇采風類記",
 "寶山記遊",
 "真州風土記",
 "山陽風俗物產志",
 "清河風俗物產志",
 "徐州輿地考",
 "海曲方域小志",
 "龍眠遊記",
 "西干記",
 "懷遠偶記",
 "樅江遊記",
 "雩都行記",
 "南豐風俗物產志",
 "杭州遊記",
 "杭州城南古蹟記",
 "湯陰風俗志",
 "天台風俗志",
 "寧化風俗志",
 "楚遊紀略",
 "監利風土志",
 "容美紀遊",
 "桂陽風俗記",
 "郴東桂陽小記",
 "永州紀勝",
 "永順小志",
 "奉使紀勝",
 "齊魯遊紀略",
 "行山路記",
 "三省邊防形勢錄",
 "老林說",
 "河南關塞形勝說",
 "共城遊記",
 "保德風土記",
 "歸化行程記",
 "遊秦偶記",
 "皋蘭載筆",
 "賀蘭山口記",
 "蘭州風土記",
 "度隴記",
 "西行瑣錄",
 "邊防三事",
 "西番各寺記",
 "蜀遊紀略",
 "秦蜀驛程記",
 "益州于役記",
 "蜀輶日記",
 "蜀遊日記",
 "雅州道中小記",
 "夔行紀程",
 "北遊紀程",
 "巴船紀程",
 "東歸錄",
 "遊蜀日記",
 "遊蜀後記",
 "川中雜識",
 "滇南通考",
 "滇南雜志",
 "全滇形勢論",
 "入滇陸程考",
 "入滇江路考",
 "滇南雜記",
 "使滇紀程",
 "雲南風土記",
 "探路日記",
 "滇遊日記",
 "順寧雜著",
 "黔西古蹟考",
 "黔中紀聞",
 "貴州道中記",
 "粵滇雜記",
 "平定兩金川述略",
 "八排風土記",
 "金廠行記",
 "永昌土司論",
 "黔苗蠻記",
 "猺獞傳",
 "苗民考",
 "苗疆城堡考",
 "苗疆村寨考",
 "苗疆險要考",
 "苗疆道路考",
 "苗疆風俗考",
 "苗疆師旅考",
 "平苗記",
 "苗防論",
 "西南夷改流記",
 "邊省苗蠻事宜論",
 "改土歸流說",
 "海道編",
 "海防篇",
 "沿海形勢錄",
 "沿海形勢論",
 "防海形勢考",
 "江防海防策",
 "航海圖說",
 "營口雜誌",
 "津門雜記",
 "黑水洋考",
 "瀛壖雜誌",
 "滬游雜記",
 "淞南夢影錄",
 "海塘說",
 "閩遊紀略",
 "閩小記",
 "平定臺灣述略",
 "臺灣小志",
 "臺灣使槎錄",
 "浮海前記",
 "渡海後記",
 "東征雜記",
 "臺遊筆記",
 "平臺灣生番論",
 "臺灣番社考",
 "埔裏社紀略",
 "東西勢社番記",
 "臺北道里記",
 "噶瑪蘭紀略",
 "澎湖紀略",
 "亞哥書馬島記",
 "粵囊",
 "途中記",
 "粵遊錄",
 "入廣記",
 "粵遊小志",
 "澳門圖說",
 "澳門記",
 "澳門形勢篇",
 "澳門形勢論",
 "澳蕃篇",
 "制馭澳夷論",
 "虎門記",
 "潮州海防記",
 "瓊州記",
 "中國海島考略",
 "中外述遊",
 "東南三國記",
 "高麗論略",
 "朝鮮考略",
 "征撫朝鮮記",
 "朝鮮小記",
 "高麗形勢",
 "鮮朝風土略述",
 "高麗風俗記",
 "朝鮮風俗記",
 "朝鮮八道紀要",
 "朝鮮風土記",
 "高麗瑣記",
 "朝鮮輿地說",
 "朝鮮疆域紀略",
 "朝鮮會通條例",
 "東遊記",
 "遊高麗王城記",
 "朝鮮雜述",
 "東國名勝記",
 "入高紀程",
 "巨文島形勢",
 "朝鮮諸水編",
 "高麗水道考",
 "越南志",
 "安南小志",
 "越南考略",
 "越南世系沿革略",
 "越南疆域考",
 "越南地輿圖說",
 "越南遊記",
 "征撫安南記",
 "征安南紀略",
 "從征安南記",
 "越南山川略",
 "越南道路略",
 "中外交界各隘卡略",
 "黑河紀略",
 "金邊國記",
 "中山紀略",
 "中山傳信錄",
 "中山見聞辨異",
 "琉球實錄",
 "琉球說略",
 "琉球形勢略",
 "琉球朝貢考",
 "琉球向歸日本辨",
 "緬甸志",
 "緬甸考略",
 "征緬甸記",
 "緬事述略",
 "緬甸瑣記",
 "入緬路程",
 "緬藩新紀",
 "暹羅考",
 "暹羅志",
 "暹羅考略",
 "暹羅別記",
 "東洋記",
 "日本疆域險要",
 "日本沿革",
 "日本載筆",
 "日本近事記",
 "日本通中國考",
 "使東雜記",
 "日本雜事",
 "東遊日記",
 "東遊紀盛",
 "日本瑣誌",
 "扶桑遊記",
 "東洋瑣記",
 "日本紀遊",
 "日本雜記",
 "豈止快錄",
 "禺于日錄",
 "熱海遊記",
 "使會津記",
 "東槎雜著",
 "東槎聞見錄",
 "遊日光山記",
 "登富嶽記",
 "登富士山記",
 "鹿門宕嶽諸遊記",
 "遊嵐峽記",
 "遊石山記",
 "登金華山記",
 "遊松連高雄二山記",
 "霧島山記",
 "遊天王山記",
 "日本山表說",
 "瀧溪紀遊",
 "遊綿溪記",
 "遊保津川記",
 "日本河渠志",
 "中亞細亞圖說略",
 "印度考略",
 "印度志略",
 "五印度論",
 "印度風俗記",
 "印度紀遊",
 "鹹海紀略",
 "波斯考略",
 "阿剌伯考略",
 "俾路芝考略",
 "阿富汗考略",
 "東土耳其考略",
 "英屬地志",
 "俄西亞尼嘎洲志略",
 "阿塞亞尼亞羣島記",
 "東南洋記",
 "東南洋鍼路",
 "東南洋島紀略",
 "呂宋紀略",
 "南洋記",
 "崑崙記",
 "南澳氣記",
 "柔佛略述",
 "檳榔嶼遊記",
 "般鳥紀略",
 "遊婆羅洲記",
 "白蠟遊記",
 "海島逸志",
 "葛剌巴傳",
 "南洋述遇",
 "南洋事宜論",
 "南洋各島國論",
 "三得惟枝島紀略",
 "海外羣島記",
 "新金山記",
 "澳洲紀遊",
 "他士文尼亞島考略",
 "牛西蘭島紀略",
 "南極新地辨",
 "大西洋記",
 "通商諸國記",
 "英吉利地圖說",
 "歐洲總論",
 "中西關繫略論",
 "初使泰西記",
 "使西事略",
 "使法事略",
 "英軺日記",
 "隨使日記",
 "使英雜記",
 "使法雜記",
 "使還日記",
 "出使英法日記",
 "歐遊隨筆",
 "歐遊雜錄",
 "西征紀程",
 "出使須知",
 "歸國日記",
 "瀛海論",
 "蠡測巵言",
 "瀛海巵言",
 "西事蠡測",
 "漫遊隨錄",
 "遊英京記",
 "遊歷筆記",
 "泰西城鎮記",
 "彈丸小記",
 "土國戰事述略",
 "冰洋事蹟述略",
 "小西洋記",
 "阿利未加洲各國志",
 "亞非理駕諸國記",
 "地蘭士華路考",
 "埃及紀略",
 "埃及國記",
 "新開地中河記",
 "阿比西尼亞國述略",
 "探地記",
 "黑蠻風土記",
 "亞美理駕諸國記",
 "墨洲雜記",
 "美國記",
 "紅苗紀略",
 "舊金山紀",
 "墨西哥記",
 "古巴雜記",
 "祕魯形勢錄",
 "使美紀略",
 "美會紀略",
 "東行日記",
 "舟行紀略",
 "三洲遊記",
 "墨龍江述略",
 "新疆疆域總敘",
 "後出塞錄",
 "庫爾喀喇烏蘇沿革攷",
 "塔爾巴哈臺沿革考",
 "巴馬紀略",
 "帕米爾分界私議",
 "漁通問俗",
 "俄羅斯國志略",
 "中俄交界續記",
 "中俄界線簡明說",
 "遊中岳記",
 "遊北岳記",
 "翠微山說",
 "穿山小識",
 "穿山記",
 "天柱刊崖記",
 "遊林慮記",
 "崑崙說",
 "三省黃河圖說",
 "浙遊日記",
 "百色志略",
 "閩遊偶記",
 "臺灣地輿圖說",
 "奉使朝鮮日記",
 "暹羅政要",
 "亞剌伯沿革考",
 "俾路芝沿革考",
 "英政概",
 "英吉利國志略",
 "英藩政概",
 "法政概",
 "法蘭西國志略",
 "德意志國志略",
 "奈搭勒政要",
 "摩洛哥政要",
 "喀納塔政要",
 "美國地理兵要",
 "古巴節略",
 "中亞美利加五國政要",
 "委內瑞辣政要",
 "科侖比亞政要",
 "巴西地理兵要",
 "巴西政治攷",
 "唵蒯道政要",
 "玻利非亞政要",
 "巴來蒯政要",
 "烏拉乖政要",
 "阿根廷政要",
 "智利政要",
 "海帶政要",
 "山度明哥政要",
 "地圖說",
 "地球推方圖說",
 "地圖經緯說",
 "地橢圖說",
 "地球寒熱各帶論",
 "亞歐兩洲熱度論",
 "地輿總說",
 "五大洲釋",
 "大九州說",
 "六大州說",
 "地球方域考略",
 "奉天地略",
 "牧廠地略",
 "吉林地略",
 "黑龍江地略",
 "順天地略",
 "直隸地略",
 "江蘇地略",
 "安徽地略",
 "江西地略",
 "浙江地略",
 "福建地略",
 "湖北地略",
 "湖南地略",
 "河南地略",
 "山東地略",
 "山西地略",
 "陝西地略",
 "甘肅地略",
 "四川地略",
 "廣東地略",
 "廣西地略",
 "雲南地略",
 "貴州地略",
 "勘旅順記",
 "吉林形勢",
 "通肯河一帶開民屯議",
 "東省與韓俄交界道里表",
 "防邊危言",
 "籌邊議",
 "蒙古地略",
 "察哈爾地略",
 "喀爾喀地略",
 "西套厄魯特地略",
 "青海地略",
 "經營外蒙古議",
 "西域南八城紀要",
 "新疆地略",
 "帕米爾屬中國考",
 "坎巨提帕米爾疏片略",
 "西域帕米爾輿地考",
 "西域帕米爾輿地攷",
 "藏俗記",
 "西招紀行",
 "招西秋閱紀",
 "西藏置行省論",
 "游歷西藏紀",
 "亞東論略",
 "使俄草",
 "俄疆客述",
 "五嶽考",
 "恆山蹟志記",
 "兔兒山記",
 "遊太行山記",
 "塗山紀遊",
 "遊荊山記",
 "爛柯山記",
 "遊大伾山記",
 "遊風穴山記",
 "昆侖釋",
 "雲山洞紀遊",
 "籌運篇",
 "治河議",
 "郭家池記",
 "蕭湖遊覽記",
 "過蜀峽記",
 "遊韜光庵記",
 "度嶺日記",
 "猛烏烏得記",
 "滇緬邊界記略",
 "滇緬分界疏略",
 "西南邊防議",
 "荊南苗俗記",
 "蜀九種夷記",
 "兩粵猺俗記",
 "粵西種人圖說",
 "大洋海大西洋海印度海北冰海南冰海攷",
 "防海危言",
 "北洋海防津要表",
 "臺灣近事末議",
 "粵東巿舶論",
 "朝俄交界考",
 "鎮南浦開埠記",
 "遊越南記",
 "安南論",
 "遊山南記",
 "緬甸圖說",
 "緬甸論",
 "暹羅近事末議",
 "日本風俗",
 "日本風土記",
 "遊鹽原記",
 "訪徐福墓記",
 "遊扶桑本牧記",
 "對馬島考",
 "南行記",
 "義火可握國記",
 "北印度以外疆域考",
 "呂宋備考",
 "呂宋記畧",
 "南洋蠡測",
 "蘇祿考",
 "蘇祿記畧",
 "澳大利亞可自強說",
 "薄海番域錄",
 "歐羅巴各國總敘",
 "華事夷言",
 "英夷說",
 "英國論畧",
 "英吉利記",
 "英吉利國夷情紀畧",
 "英吉利小記",
 "奉使倫敦記",
 "卜來敦記",
 "白雷登避暑記",
 "巴黎賽會紀略",
 "遊歷意大利聞見錄",
 "遊歷瑞典那威聞見錄",
 "遊歷西班牙聞見錄",
 "遊歷葡萄牙聞見錄",
 "遊歷聞見總略",
 "遊歷聞見拾遺",
 "博子墩遊記",
 "使西日記",
 "倫敦風土記",
 "泰西各國采風記",
 "海防餘論",
 "天下大勢通論",
 "塞爾維羅馬尼蒲加利三國合考",
 "過波蘭記",
 "革雷得志略",
 "歐洲各國開闢非洲考",
 "庚哥國略記",
 "美理哥國志略",
 "古巴述略",
 "出使美日祕國日記",
 "每月統紀傳",
 "貿易通志",
 "萬國地理全圖集",
 "四洲志",
 "外國史略",
 "地理志略",
 "地理全志",
 "三十一國志要",
 "萬國風俗考略",
 "瀛環志略訂誤",
 "和林詩并注",
 "正德金山衛志",
 "嘉靖上海縣志",
 "天啟本東安縣志",
 "康熙本東安縣志",
 "乾隆本東安縣志",
 "民國三年本安次縣志",
 "藁城縣嘉靖志",
 "藁城縣康熙志",
 "藁城縣光緒志",
 "續修藁城縣志",
 "保定府祁州束鹿縣志",
 "乾隆束鹿縣志",
 "嘉慶束鹿縣志",
 "同治束鹿縣志",
 "光緒束鹿鄉土志",
 "華州志",
 "續華州志",
 "再續華州志",
 "三續華州志",
 "武威縣誌",
 "鎮番縣誌",
 "永昌縣誌",
 "古浪縣誌",
 "平番縣誌",
 "天山學道編",
 "重刊宜興縣舊志",
 "重刊宜興縣志",
 "重刊荊溪縣志",
 "重刊續纂宜荊縣志",
 "宜興荊溪縣新志",
 "太倉州志",
 "乾道四明圖經",
 "寶慶四明志",
 "開慶四明續志",
 "至正四明續志",
 "宋元四明六志校勘記",
 "常棠澉水誌",
 "續澉水誌",
 "澉水新誌",
 "澉誌補錄",
 "康熙會稽縣志",
 "嘉慶山陰縣志",
 "道光會稽縣志槀",
 "紹興縣志資料第一輯",
 "遼海書徵",
 "補遼史交聘表",
 "東北文獻零拾",
 "東北古印鉤沈",
 "盛京崇謨閣滿文老檔譯本",
 "遼會要作法",
 "第",
 "口北三廳志",
 "佩蘅詩鈔",
 "盛京通鑑",
 "盛京典制備考",
 "東三省蒙務公牘彙編",
 "庫倫蒙俄卡倫對照表",
 "卜魁城賦",
 "籌蒙芻議",
 "歷代舊聞",
 "熙朝嘉話",
 "都城瑣記",
 "日下尊聞錄",
 "藤陰雜記",
 "北京建置談薈",
 "帝京歲時紀勝",
 "北京形勢大略",
 "燕都名勝志稿",
 "舊京遺事",
 "燕京訪古錄",
 "琉璃廠書肆記",
 "北京崇效寺訓雞圖志",
 "大興歲時志稿",
 "宛平歲時志稿",
 "春明歲時瑣記",
 "燕巿貨聲",
 "燕巿負販瑣記",
 "燕巿百怪歌",
 "津門百詠",
 "天津楊柳青小志",
 "東莞袁督師後裔考",
 "興化李審言先生與東莞張次溪論文書",
 "燕居修史圖志",
 "燕京記",
 "燕都雜詠",
 "舊京秋詞",
 "東莞袁督師遺事",
 "北京庚戌橋史考",
 "北京天橋志",
 "北京廟宇徵存錄",
 "燕城勝蹟志",
 "燕城花木志",
 "北京歲時志",
 "北京禮俗小志",
 "燕巿商標孴錄",
 "燕巿賈販瑣錄",
 "津門小令",
 "雨花石子記",
 "江南好詞",
 "金陵山水街道叢考",
 "鄠縣鄉土志",
 "甘泉縣鄉土志",
 "宜川鄉土志",
 "岐山縣鄉土志",
 "城固縣鄉土志",
 "寧羌州鄉土志",
 "神木鄉土志",
 "朝邑縣鄉土志",
 "華州鄉土志",
 "中部縣鄉土志",
 "吳淞甲乙倭變志",
 "閱世編",
 "滬城備考",
 "水蜜桃譜",
 "滬城歲事衢歌",
 "夷患備嘗記",
 "事略附記",
 "紅亂紀事草",
 "覺夢錄",
 "上海曹氏書存目錄",
 "運瀆橋道小志",
 "鳳麓小志",
 "東城志略",
 "金陸物產風土志",
 "南朝梵剎志",
 "鍾南淮北區域志",
 "石城山志",
 "古越書",
 "紹興考",
 "武備志",
 "武林失守雜感詩",
 "申江避寇雜感詩",
 "臺灣雜詠",
 "臺陽雜興",
 "臺陽雜詠",
 "樊子",
 "樊紹述集",
 "樊集句讀合刻三種",
 "樊宗師集",
 "絳守居園池記句讀",
 "伊犁府鄉土志",
 "焉耆府鄉土志",
 "溫宿府鄉土志",
 "疏勒府鄉土志",
 "莎車府鄉土志",
 "昌吉縣呼圖壁鄉土志",
 "阜康縣鄉土志",
 "孚遠縣鄉土志",
 "鄯善縣鄉土志",
 "寧遠縣鄉土志",
 "綏定縣鄉土志",
 "精河廳鄉土志",
 "哈密直隸廳鄉土志",
 "婼羌縣鄉土志圖",
 "婼羌縣鄉土志",
 "輪臺縣鄉土志",
 "和闐直隸州鄉土志",
 "皮山縣鄉土志",
 "洛浦縣鄉土志",
 "伽師縣鄉土志",
 "巴楚州鄉土志",
 "英吉沙爾廳鄉土志",
 "蒲犁廳鄉土志",
 "溫宿縣鄉土志",
 "拜城縣鄉土志",
 "庫車州鄉土志",
 "沙雅縣鄉土志",
 "溫宿縣分防柯坪鄉土志",
 "烏什直隸廳鄉土志",
 "鄧尉探梅詩",
 "五畝園小志",
 "桃隖百詠",
 "五畝園懷古",
 "襄陽金石略",
 "襄陽兵事略",
 "襄陽萟文略",
 "襄陽沿革略",
 "海運圖說",
 "黃河圖議",
 "蘇松浮賦議",
 "朝鮮圖說",
 "琉球圖說",
 "安南圖說",
 "日本圖纂",
 "江防圖考",
 "萬里海防",
 "西陲紀事本末",
 "喀什噶爾赴墨克道里記",
 "帕米爾山水形勢風土人情說",
 "新疆勘界公牘彙鈔",
 "海島逸誌摘略",
 "高厚蒙求摘略",
 "番社采風圖考摘略",
 "紅毛番𠸄咭唎考略",
 "三寶壠",
 "崑崙",
 "爪亞風土拾遺",
 "西陲總統事略",
 "綏服紀略圖詩",
 "塞北紀聞",
 "西域舊聞",
 "金川舊事",
 "維西見聞",
 "西藏紀聞",
 "容美紀游",
 "海國聞見",
 "採硫日記",
 "一斑錄",
 "皇朝文獻通考四裔考",
 "鄂羅斯傳",
 "俄羅斯事輯",
 "俄羅斯長編稿跋",
 "俄羅斯事補輯",
 "㐆齋籤記",
 "俄羅斯國總記",
 "康熙乾隆俄羅斯盟聘記",
 "俄羅斯六域",
 "記英俄二夷搆兵",
 "漁舟記談",
 "黔史",
 "粵游紀程",
 "西江軺程記",
 "澳門紀略",
 "連山綏猺廳志",
 "虔鎮圖",
 "治黎輯要",
 "塔爾巴哈台事宜",
 "伊犁事宜",
 "烏嚕木齊事宜",
 "科布多政務總冊",
 "西招紀行詩",
 "丁巳秋閱吟",
 "西藏圖說",
 "附自成都府至後藏路程",
 "耶穌教難入中國說",
 "合省國說",
 "蘭崙偶說",
 "粵道貢國說",
 "西域遺聞",
 "哈密志",
 "西藏日記",
 "敦煌雜鈔",
 "敦煌隨筆",
 "巴勒布紀略",
 "塔爾巴哈臺宜",
 "新疆回部志",
 "烏魯木齊事宜",
 "三番志畧",
 "烏里雅蘇臺志畧",
 "和林格爾廳志畧",
 "聖駕親征噶爾旦方畧",
 "俄羅斯國紀要",
 "俄羅斯方域",
 "幻影集",
 "珠璧集",
 "鸞嘯集",
 "默音集",
 "黃海山花圖詠",
 "卉箋",
 "黃山賦",
 "焦山志",
 "焦山續志",
 "北固山志",
 "泰山圖說",
 "岱宗大觀",
 "錢唐西湖百咏",
 "附楊公濟原唱",
 "錢唐湖山勝概詩文",
 "錢唐湖山勝概記",
 "西湖月觀記",
 "游明聖湖日記",
 "西湖修禊",
 "西湖一月記",
 "癸亥續遊記",
 "西湖新舊夢",
 "客杭詩帳",
 "陳學士文鈔",
 "怡賢親王疏鈔",
 "水利營田圖說",
 "畿輔水利輯覽",
 "澤農要錄",
 "畿輔水道管見",
 "畿輔水利私議",
 "婁江志",
 "新劉河志正集",
 "治水要法",
 "灌江備考",
 "彙集實錄",
 "灌江定考",
 "川主五神合傳",
 "修防事宜",
 "水道參攷",
 "至正河防記",
 "黃河圖說",
 "河渠紀聞",
 "清史河渠志",
 "復淮故道圖說",
 "附請復河運芻言",
 "清代河臣傳",
 "修防瑣志",
 "河務所聞集",
 "靳文襄公治河方略",
 "游歷芻言",
 "籌邊記",
 "英人楊哈思班游記",
 "甫斯基游記",
 "英人戈登游記",
 "邗江遊記",
 "遊雁蕩山日記",
 "遊黃嶽記",
 "遊奉天行宮記",
 "冬集紀程",
 "新疆旅行記",
 "南還記",
 "直隸口外遊記",
 "蜀游紀略",
 "蒙古郭爾羅斯後旗旅行記",
 "金陵紀遊",
 "皇朝通典",
 "皇朝通志",
 "皇朝文獻通考",
 "皇朝續文獻通考",
 "十通索引",
 "大明令",
 "禮儀定式",
 "洪武禮制",
 "教民榜文",
 "孝慈錄",
 "大誥武臣",
 "滿洲祭天祭神儀注",
 "滿洲婚禮儀注",
 "慎始集",
 "追遠論四十則",
 "滿洲家祠祭祀儀注",
 "秦書疏",
 "西漢書疏",
 "東漢書疏",
 "西漢詔令",
 "東漢詔令",
 "孫莘老先生奏議事略",
 "奏議補遺",
 "孫傅師先生奏議事略",
 "孫君孚先生奏議事略",
 "林文忠公政書",
 "駱文忠公奏議",
 "曾文正公奏議",
 "奏摺譜",
 "林文忠公奏議",
 "胡文忠公奏議",
 "嘉定先生奏議",
 "長白先生奏議",
 "先考侍郎公（寶廷）年譜",
 "治蝗書",
 "重刊紀慎齋先生祈雨全書",
 "區種五種",
 "氾勝之遺書",
 "區田編",
 "加庶編",
 "豐豫莊本書",
 "國脈民天",
 "樹桑養蠶要略",
 "附樹藝要略",
 "廣惠編",
 "粥賑說",
 "義賑芻言",
 "辦賑芻言",
 "救荒一得錄",
 "慈幼編",
 "西陂類稿",
 "正誼堂集",
 "張清恪公（伯行）年譜",
 "牧令書輯要",
 "保甲書輯要",
 "劉簾舫先生吏治三書",
 "庸吏庸言",
 "蜀僚問答",
 "欽頒州縣事宜",
 "杭嘉湖三府減漕紀略",
 "奏稿",
 "嚴陵紀略",
 "裁嚴郡九姓漁課錄",
 "東甌紀略",
 "東甌留別和章",
 "桐溪紀略",
 "平平言",
 "宦游紀略",
 "守邊輯要",
 "牧令要訣",
 "兵武聞見錄",
 "州縣須知",
 "折獄便覽",
 "幕學舉要",
 "辦案要略",
 "刑幕要略",
 "贅言十則",
 "七略別錄佚文",
 "七略佚文",
 "漢書萟文志條理",
 "漢書萟文志拾補",
 "後漢萟文志",
 "三國萟文志",
 "姚海槎先生（振宗）年譜",
 "求古居宋本書",
 "元集目錄",
 "明吳興閔板書目",
 "明毛氏汲古閣刻書目錄",
 "明代內府經廠本書目",
 "清代殿板書始末記",
 "清代殿板書目",
 "武英殿聚珍板書目",
 "武英殿袖珍板書目",
 "欽定校正補刻通志堂經解目錄",
 "欽定石經目錄",
 "昭仁殿天祿琳瑯前編目錄",
 "續編目錄",
 "五經萃室藏宋版五經目錄",
 "欽定文淵閣四庫全書目錄",
 "摛藻堂四庫全書薈要目錄",
 "內府寫本書目",
 "武英殿造辦處寫刻刷印工價併顏料紙張定例",
 "傳是樓書目不分卷附馬氏玉堂鈔藏傳是樓足本書目殘卷",
 "培林堂書目",
 "鐵琴銅劍樓宋元本書目",
 "豐順丁氏持靜齋書目",
 "海源閣藏書目",
 "蕘圃藏書題識續錄",
 "蕘圃雜著",
 "蕘圃藏書題識再續錄",
 "思適齋集補遺",
 "思適齋書跋",
 "說文書目",
 "附說文統系圖題跋",
 "傳古別錄",
 "金石書目",
 "印譜目",
 "賞溥傑書畫目",
 "收到書畫目錄",
 "諸位大人借去書籍字畫玩物等糙賬",
 "外借字畫浮記簿",
 "亦政堂重修考古圖",
 "亦政堂重修古玉圖",
 "亦政堂重修宣和博古圖",
 "刊謬",
 "失編附刊誤",
 "碑版文廣例",
 "金石略",
 "元豐金石跋尾",
 "王復齋鐘鼎款識",
 "浣花拜石軒鏡銘集錄",
 "集古虎符魚符考",
 "漢熹平石經殘字",
 "蜀石經殘字",
 "孔子廟堂碑唐本存字",
 "臨汀蒼玉洞宋人題名",
 "鐵雲藏龜之餘",
 "殷虛書契待間編",
 "齊魯封泥集存",
 "歷代符牌圖錄",
 "歷代符牌圖錄後編",
 "古兵符考略殘稿",
 "赫連泉館古印存",
 "赫連泉館古印續存",
 "續百家姓印譜",
 "漢晉石刻墨影",
 "殷文存",
 "石鼓文考釋",
 "金泥石屑",
 "古器物笵圖錄",
 "古鏡圖錄",
 "隋唐以來官印集存",
 "昭代分隸名人小傳",
 "昭代分隸名人小傳清本",
 "羣碑舊拓本辨",
 "古碑孤本錄",
 "偽刻重撫碑記",
 "書畫家齋名錄",
 "龍淵爐齋金石書目",
 "古碑證文選本",
 "漢墓闕神道攷",
 "石門碑刻見存目攷",
 "江寧蕭梁石刻見存目",
 "龍門山魏刻目",
 "鄒縣四山摩厓目",
 "遜國遺文攷",
 "續隸篇所據碑目",
 "石經傳本彙攷",
 "復初齋文集補遺",
 "孫趙寰宇訪碑錄刊誤補遺",
 "三續疑年錄補正",
 "蘇齋金石題跋",
 "漢石經殘字攷",
 "岱巖訪古日記",
 "淳化閣法帖釋文",
 "東洲艸堂金石詩",
 "籀經堂鐘鼎文釋題跋尾",
 "山樵書外紀",
 "枕經堂金石跋",
 "有萬憙齋石刻跋",
 "上善堂宋元板精鈔舊鈔書目",
 "鐵華館藏集部善本書目",
 "函青閣金石記",
 "日照丁氏藏器目",
 "泥封印古錄",
 "長安獲古編",
 "附編目",
 "癖𡥆堂收藏金石書目",
 "奕載堂古玉圖錄",
 "石鼓文考證",
 "舊館壇碑考",
 "藝術類徵",
 "雙玉鉥齋金石圖錄",
 "寒雲書景",
 "殷墟書契後編",
 "周金文存",
 "蒿里遺珍拾補",
 "殷虛古器物圖錄",
 "古明器圖錄",
 "古石抱守錄",
 "戩壽堂所藏殷墟文字",
 "附考釋",
 "專門名家一集",
 "十友名言",
 "洛陽存古錄",
 "蒐古彙編",
 "昭陸復古錄",
 "鼓山題名",
 "漢隸辨體",
 "說文部首讀補註",
 "國朝治說文家書目",
 "石鼓文匯",
 "恒農專錄",
 "楚州城磚錄",
 "循園金石文字跋尾",
 "綴學堂河朔碑刻跋尾",
 "循園古冢遺文跋尾",
 "元氏誌錄",
 "補遺目錄",
 "天下金石志",
 "中州金石攷",
 "山右金石錄",
 "山右訪碑記",
 "山左訪碑錄",
 "湘城訪古錄",
 "江西金石目",
 "汧陽述古編金石編",
 "漢劉熊碑攷",
 "河朔訪古新錄",
 "河朔金石目",
 "河朔新碑目",
 "河南古物調查表證誤",
 "河朔訪古隨筆",
 "夢碧簃石言",
 "袁州石刻記",
 "兩浙金石別錄",
 "古誌新目初編",
 "古誌彙目初集",
 "閩中金石志",
 "漢武梁祠堂石刻畫像考",
 "邠州石室錄",
 "希古樓金石萃編",
 "韡華閣集古錄跋尾",
 "金文分域編",
 "石鼓釋文考異",
 "石鼓文章句",
 "石鼓辨",
 "石鼓鑑",
 "石鼓釋文考異或問",
 "石鼓爾雅",
 "敘鼓",
 "殷契餘論",
 "金文續考",
 "石鼓文研究",
 "漢代石刻二種",
 "熹平石經魯詩殘石",
 "龜茲刻石",
 "金石三例",
 "金石三例再續編",
 "東萊先生史記詳節",
 "東萊先生西漢書詳節",
 "東萊先生東漢書詳節",
 "東萊先生三國志詳節",
 "東萊先生晉書詳節",
 "東萊先生南史詳節",
 "東萊先生北史詳節",
 "東萊先生隋書詳節",
 "東萊先生唐書詳節",
 "東萊先生五代史詳節",
 "宣和御製宮詞",
 "宋文安公宮詞",
 "花蘂夫人宮詞",
 "唐王建宮詞",
 "蜀花蘂夫人宮詞",
 "宋王岐公宮詞",
 "擬唐人宮詞",
 "閨辭百詠",
 "擬唐人塞下曲",
 "纂圖互注老子章句",
 "纂圖互注南華真經",
 "纂圖互注荀子",
 "纂圖互注楊子法言",
 "冲虛至德真經",
 "新纂門目五臣音註揚子法言",
 "關尹子文始真經",
 "亢倉子洞靈真經",
 "列子冲虛真經",
 "莊子南華真經內篇",
 "抱朴子外篇",
 "黃石公",
 "司馬子",
 "列子纂要",
 "呂氏纂要",
 "劉子纂要",
 "韓詩外傳纂要",
 "陸子新語",
 "晏子",
 "鄧子",
 "中論纂",
 "鹿門子隱書",
 "廣成子",
 "子牙子",
 "孫武子",
 "玉虛子",
 "鹿谿子",
 "汗子",
 "囂囂子",
 "波弄子",
 "子家子",
 "希子",
 "薛子",
 "風胡子",
 "三柱子",
 "歲寒子",
 "首山子",
 "呂子",
 "潼山子",
 "雲晃子",
 "隨巢子",
 "黃石子",
 "雲陽子",
 "金門子",
 "桂巖子",
 "封龍子",
 "吉雲子",
 "青黎子",
 "嵖岈子",
 "荊山子",
 "委宛子",
 "慎陽子",
 "黌山子",
 "回中子",
 "貞山子",
 "鏡機子",
 "白雲子",
 "靈源子",
 "雲門子",
 "干山子",
 "石匏子",
 "譚子",
 "天隨子",
 "來子",
 "文泉子",
 "協律子",
 "靈壁子",
 "次山子",
 "東萊子",
 "邵子",
 "橫渠子",
 "長春子",
 "艸廬子",
 "道園子",
 "桂巖子春秋繁露",
 "揚子太玄經",
 "絳守園池記",
 "道德經評註",
 "理惑論",
 "空洞子",
 "董子春秋繁露",
 "素問遺篇",
 "靈樞",
 "黃帝內經素問",
 "海潐子",
 "評註司馬法",
 "評註三畧",
 "管子識誤",
 "弟子識音誼",
 "荀子集解",
 "莊子集解",
 "莊子集釋",
 "墨子閒詁",
 "晏子春秋校注",
 "韓非子集解",
 "太玄",
 "曾子全書",
 "子思子全書",
 "曾子十二篇讀本",
 "重輯曾子遺書",
 "曾子十篇注釋",
 "顏子書",
 "子思子書",
 "曾子書",
 "孟子書",
 "閔子書",
 "冉子書",
 "端木子書",
 "仲子書",
 "卜子書",
 "有子書",
 "宰子書",
 "言子書",
 "顓孫子書",
 "朱子書",
 "孔子三朝記輯注",
 "曾子古本輯注",
 "子思子遺編輯注",
 "荀子新書輯注",
 "濂溪通書",
 "涑水迂書",
 "橫渠正蒙",
 "橫渠經學理窟",
 "橫渠語錄",
 "劉先生譚錄",
 "劉先生道護錄",
 "江民表心性說",
 "安正安筌集",
 "崇安聖傳論",
 "橫浦日新",
 "橫渠張子抄釋",
 "啟蒙意見",
 "律呂直解",
 "洪範圖解",
 "象山先生要語",
 "陽明先生要語",
 "通書解",
 "西銘解",
 "薛敬軒集",
 "胡敬齋集",
 "王陽明集",
 "陳白沙集",
 "方正學集",
 "何椒邱集",
 "吳康齋集",
 "羅一峯集",
 "王守溪集",
 "章楓山集",
 "蔡虛齋集",
 "邵二泉集",
 "王虎谷集",
 "羅整菴集",
 "崔後渠集",
 "呂涇野集",
 "韓苑洛集",
 "王心齋集",
 "鄭澹泉集",
 "歐陽南野集",
 "羅近溪集",
 "湛甘泉集",
 "劉晴川集",
 "王龍谿集",
 "羅念菴集",
 "楊斛山集",
 "唐荊川集",
 "蔡洨濱集",
 "周訥溪集",
 "楊椒山集",
 "耿天臺集",
 "錢啟新集",
 "來瞿唐集",
 "鄧潛谷集",
 "姜鳳阿集",
 "呂新吾集",
 "鄒南皋集",
 "顧涇陽集",
 "高景逸集",
 "曹真予集",
 "孫鍾元集",
 "呂豫石集",
 "鹿乾嶽集",
 "劉念臺集",
 "史惺堂集",
 "范竹溪集",
 "賀陽亨集",
 "張雞山集",
 "朱勉齋集",
 "吳素衣集",
 "陳幾亭集",
 "辛天齋集",
 "汪石潭集",
 "何粹夫集",
 "黃太泉集",
 "唐一菴集",
 "楊幼殷集",
 "胡廬山集",
 "尤西川集",
 "李見羅集",
 "宋望之集",
 "顧庸菴集",
 "黃幼元集",
 "魯媿尹集",
 "高白浦集",
 "孟雲浦集",
 "王惺所集",
 "唐曙臺集",
 "薛方山集",
 "海剛峯集",
 "于景素集",
 "姚培吾集",
 "焦澹園集",
 "丘仲深集",
 "鄒東廓集",
 "桑松風集",
 "秦弱水集",
 "魏莊渠先生書",
 "後渠子",
 "涇野集",
 "念庵子",
 "遵巖子",
 "重刊郁離子",
 "重刊草木子",
 "張子東西銘全註",
 "張子正蒙釋要",
 "張子語錄釋要",
 "關中四先生要語錄",
 "小學義疏",
 "小學後編",
 "小學考證",
 "小學釋文",
 "四書正誤",
 "朱子語類評",
 "禮文手鈔",
 "遺著",
 "繫辭",
 "說卦傳",
 "筮考",
 "詩經傳註",
 "春秋傳註",
 "論語傳註",
 "大學傳註",
 "中庸傳註",
 "傳註問",
 "論語傳註問",
 "大學傳註問",
 "中庸傳註問",
 "恕谷中庸講語",
 "附論學",
 "學樂錄",
 "閱史郗視",
 "四考辨",
 "宗廟考辨",
 "郊社考辨",
 "禘祫考辨",
 "田賦考辨",
 "天道偶測",
 "訟過則例",
 "恕谷詩集",
 "習齋語要",
 "恕谷語要",
 "顏李師承記",
 "大學困學錄",
 "中庸困學錄",
 "大學中庸本義",
 "學案",
 "集程朱格物法",
 "集朱子讀書法",
 "朱子白鹿洞規條",
 "沈端恪公（近思）年譜",
 "勵志錄",
 "古書疑義舉例校錄",
 "古書疑義舉例續補",
 "古書疑義舉例補附",
 "經詞衍釋",
 "周子大義",
 "二程子大義",
 "張子大義",
 "洛學傳授大義",
 "朱子大義",
 "湯文正公家書",
 "呻昑語節錄",
 "宰嘉訓俗",
 "張楊園訓子語",
 "張楊園初學備忘",
 "求闕齋語",
 "孔孟志略",
 "儒先訓要十四種續四種",
 "司馬溫公居家雜儀",
 "朱子白鹿洞書院揭示",
 "朱子增損呂氏鄉約",
 "呂舍人官箴",
 "呂新吾先生好人歌",
 "楊椒山先生遺訓",
 "張揚園先生訓子語",
 "朱柏廬先生治家格言",
 "于清端公家規範",
 "王氏宗規",
 "范魯公訓從子詩",
 "許魯齋先生訓子詩",
 "王中書勸孝歌",
 "八反歌",
 "呂新吾先生社學要畧",
 "方正學先生幼儀雜箴",
 "朱柏廬先生勸言",
 "張文端公恆產瑣言",
 "小兒書輯八種",
 "家常語",
 "小學詩禮",
 "女兒書輯八種",
 "女三字經",
 "女不費錢功德",
 "張氏母訓",
 "學規",
 "四書講習錄",
 "日程",
 "閨門寶鑑",
 "博愛心鑑撮要",
 "唐太宗李衛公問對",
 "李衛公問對",
 "孫武子直解",
 "吳子直解",
 "唐太宗李衛公問對直解",
 "六韜直解",
 "校正武經七書",
 "十七史百將傅",
 "百將傳續編",
 "練兵紀實",
 "兵鏡備考",
 "兵鏡或問",
 "孫子集註",
 "少林棍法闡宗",
 "劉伯溫先生重纂諸葛忠武侯兵法心要內集",
 "劉伯溫先生百戰奇略",
 "施山公兵法心略",
 "附心略火攻圖式",
 "陳資齋天下沿海形勢錄",
 "塞外行軍指掌",
 "李盤金湯十二籌",
 "圖式",
 "軍中醫方備要",
 "洴澼百金方",
 "操練洋槍淺言",
 "用礮要言",
 "魏武帝注孫子",
 "武侯火攻心法",
 "鄉兵管見",
 "刺字會鈔",
 "急救方補遺",
 "折獄金鍼",
 "慎刑便覽",
 "洗冤外編",
 "秋審指掌",
 "元新例",
 "平冤錄",
 "潘曾沂耿嵩陽先生種田說序",
 "秦聚奎重刊國脈民天序及區田一畝圖",
 "論區田",
 "修齊直指（節錄）",
 "增訂教稼書",
 "區種法",
 "豐豫莊呈文及官府批示文告",
 "石韞玉潘公輔區田說序",
 "多稼集",
 "凌霄區田圖說",
 "趙夢齡區種五種自序",
 "范梁區種五種序",
 "知本提綱（摘錄）",
 "農言著實",
 "馬首農言",
 "雲岐子七表八裏九道脉訣論并治法",
 "潔古老人珍珠囊",
 "海藏㿀論萃英",
 "脈訣",
 "東垣先生此事難知集",
 "海藏斑論萃英",
 "脈賦",
 "王叔和脈訣",
 "復真劉三點先生脤訣",
 "用藥歌訣",
 "藥性賦",
 "珍珠囊",
 "傷寒活人指掌",
 "諸病論",
 "難經",
 "外科集驗",
 "仙授理傷續斷方",
 "上清紫庭追癆仙方",
 "祕傳外科方",
 "濟急仙方",
 "新刊小兒痘疹證治",
 "徐氏胎產方",
 "醫學折衷",
 "醫學正傳",
 "遺篇",
 "脉經",
 "增注類證活人書",
 "黃帝素問宣明論方",
 "劉河間傷寒醫鑒",
 "劉河間傷寒直格論方",
 "張子和心鏡別集",
 "河間傷寒心要",
 "脉訣",
 "醫經㴑洄集",
 "新刻校定脉訣指掌病式圖說",
 "祕傳證治要訣",
 "傷寒證脉藥截江網",
 "周慎齋先生脈法解",
 "周慎齋先生三書",
 "查了吾先生正陽篇選錄",
 "胡慎柔先生五書要語",
 "筆談",
 "法古宜今",
 "景岳十機摘要",
 "毓麟策",
 "溫瘧論",
 "濕熱條辯",
 "受正玄機神光經",
 "四明心法",
 "四明醫案",
 "東莊醫案",
 "西塘感症",
 "醫學真傳",
 "質疑錄",
 "醫家心法",
 "易氏醫案",
 "芷園臆草存案",
 "傷寒金鏡錄",
 "痎虐疏方",
 "達生篇",
 "扁鵲心書",
 "神方",
 "本草崇原",
 "侶仙堂類辯",
 "齋古診則",
 "葛仙翁肘後備急方",
 "元和紀用經",
 "加減靈祕十八方",
 "韓氏醫通",
 "痘疹傳心錄",
 "附種痘",
 "折肱漫錄",
 "慎柔五書",
 "保嬰篇",
 "福幼編",
 "救急篇",
 "普濟應驗良方",
 "達生編",
 "遂生編",
 "宜麟策",
 "續扁",
 "保嬰易知錄",
 "叢桂堂集驗良方",
 "傷寒類書活人總括",
 "傳信滴用方",
 "葉天士醫案",
 "繆宜亭醫案",
 "薛生白醫案",
 "醫方集解",
 "附急救良方",
 "本草備要",
 "本草從新",
 "成方切用",
 "外科證治全生集",
 "傷寒讀本",
 "金匱讀本",
 "醫學三字經",
 "十二經脈歌",
 "指南摘要",
 "醫學實在易",
 "本草求真",
 "焦氏喉科枕祕",
 "急救腹痛暴卒病解",
 "爛喉⿸疒丹痧輯要",
 "世補齋不謝方",
 "傷寒論類方",
 "長沙方歌括",
 "醫學金鏚",
 "女科要略",
 "產寶",
 "理瀹外治方要",
 "外科症治全生集",
 "霍亂吐瀉方論",
 "官藥局示諭",
 "夏令施診簡明歌訣",
 "衛濟寶書",
 "太醫局諸科程文",
 "產育寶慶集方",
 "銅人針灸經",
 "西方子明堂灸經",
 "咽喉祕集",
 "痧症全書",
 "外科證治傳生集",
 "醫法心傳",
 "時病論",
 "醫家四要",
 "脈訣入門",
 "病機約論",
 "方歌別類",
 "藥賦新編",
 "周澂之校刻醫學叢書",
 "本草經",
 "本草經疏",
 "脈訣刊誤集解",
 "增輯難經本義",
 "內照法",
 "巢氏諸病源候總論",
 "脈因證治",
 "小兒藥證直訣",
 "閻氏小兒方論",
 "小兒斑疹備急方論",
 "脈學四種",
 "脈義簡摩",
 "脈簡補義",
 "診家直訣",
 "辨脈法篇",
 "平脈法篇",
 "內經評文素問",
 "讀醫隨筆",
 "診家樞要",
 "諸脈條辨",
 "藏府標本藥式",
 "三消論",
 "溫熱論",
 "幼科要略",
 "評點葉案存真類編",
 "評點馬氏醫案印機草",
 "評注史載之方",
 "傷寒補例",
 "形色外診簡摩",
 "重訂診家直訣",
 "脈學輯要",
 "中西醫解",
 "臟腑圖說症治要言合璧",
 "皮膚新編",
 "症治要言",
 "醫案類錄",
 "臟胕標本藥式",
 "金匱鉤元",
 "溫熱論注",
 "客塵醫話",
 "中西匯通醫經精義",
 "中西匯參醫學",
 "傷寒論淺注補正",
 "金匱要略淺注補正",
 "血證論",
 "醫學折衷勸讀篇",
 "本草問答",
 "薛生白溼熱條辨",
 "葉天士溫熱論",
 "本經逢原",
 "傷寒論淺註方論合編",
 "金匱要略淺註方論合編",
 "溫病條辨",
 "傷寒補亡論",
 "經史證類大觀本草",
 "大觀本草札記",
 "傷寒論",
 "類證增注傷寒百問歌",
 "活幼心書",
 "三字經湯方歌括",
 "春溫三字訣",
 "春溫三字訣方歌",
 "痢疾三字訣",
 "痢矣三字訣歌括",
 "研經言",
 "周氏易簡方集驗方合刻",
 "衛生易簡方",
 "周氏集驗方",
 "羅謙甫治驗案",
 "吳鞠通先生醫案",
 "惜分陰軒醫案",
 "人參考",
 "知醫必辨",
 "市隱盧醫學雜著",
 "徐批葉天土晚年方案真本",
 "周氏集驗方續編",
 "白喉證治通考",
 "琉球百問",
 "薜案辨疏",
 "葉氏伏氣解",
 "胎產指南",
 "重訂幼科金鑑評",
 "雪雅堂醫案",
 "附類中祕旨",
 "簡明眼科學",
 "溫熱逄源",
 "醫事啟源",
 "醫經祕旨",
 "醫病簡要",
 "醫階辨證",
 "喉科祕訣",
 "癧科全書",
 "重訂時行伏陰芻言",
 "村居救急方",
 "附餘",
 "敺蠱燃犀錄",
 "外科方外奇方",
 "欬論經旨",
 "臨症驗舌法",
 "沈氏經驗方",
 "重訂痧疫指迷",
 "重訂靈蘭要覽",
 "凌臨靈方",
 "舊德堂醫案",
 "內經辨言",
 "診脈三十二辨",
 "專治麻痧初編",
 "評注產科心法",
 "本草衍句",
 "先哲醫話",
 "陳氏幼科祕訣",
 "秋瘧指南",
 "備急灸法",
 "醫原",
 "馬培之先生醫案",
 "類證普濟本事方續集",
 "曹仁伯醫案論",
 "南病別鑑",
 "醫脈摘要",
 "崇實堂醫案",
 "千里醫案",
 "醫學課兒策",
 "經歷雜論",
 "痢疾明辨",
 "伏邪新書",
 "鬼遺方",
 "醫醫醫",
 "察病指南",
 "溫證指歸",
 "女科折衷纂要",
 "延陵弟子紀要",
 "過庭錄存",
 "醫中一得",
 "醫學說約",
 "醫學妙諦",
 "發背對口治訣論",
 "伏溫症治實驗談",
 "肯堂醫論",
 "傷科方書",
 "和緩遺風",
 "證治心傳",
 "金氏門診方案",
 "長沙正經證彙",
 "治痢捷要新書",
 "素問校義",
 "中風論",
 "琉球問答奇病論",
 "羊毛溫證論",
 "走馬急疳真方",
 "醫學輯要",
 "陰證略例",
 "瘍科綱要",
 "醫驗隨筆",
 "歷驗再壽編",
 "仿寓意草",
 "毛對山醫話",
 "沈氏女科輯要箋疏",
 "鱠殘篇",
 "喉科家訓",
 "外科學講義",
 "醫餘",
 "傷風約言",
 "解圍元藪",
 "丹溪脈訣指掌",
 "醫學體用",
 "疝癥積聚編",
 "醫易一理",
 "虺後方",
 "內經釋要",
 "許氏醫案",
 "醫經讀",
 "攝養枕中方",
 "靈藥祕方",
 "藥徵",
 "評琴書屋醫略",
 "重樓玉鑰續編",
 "傷寒論讀",
 "藥徵續編",
 "暑症發源",
 "徐渡漁先生醫案",
 "行軍方便便方",
 "內經素問校義",
 "內經博義",
 "難經古義",
 "難經正義",
 "古本難經闡注",
 "神農本草經贊",
 "附月令七十二候贊",
 "本草擇要綱目",
 "本草撮要",
 "本草思辨錄",
 "食鑑本草",
 "訂正太素脈祕訣",
 "脈訣乳海",
 "傷寒括要",
 "傷寒尋源",
 "傷寒捷訣",
 "傷寒法祖",
 "松厓醫徑",
 "古今醫徹",
 "醫略十三篇",
 "列方",
 "附關絡考",
 "人迎辨",
 "醫經小學",
 "通俗內科學",
 "雜症會心錄",
 "雞鳴錄",
 "醫學傳燈",
 "增訂傷暑全書",
 "辨疫瑣言",
 "李翁醫記",
 "六氣感證要義",
 "鼠疫約編",
 "溼溫時疫治瘵法",
 "溫熱經解",
 "溫熱論箋正",
 "醫寄伏陰論",
 "霍亂燃犀說",
 "六因條辨",
 "瘴瘧指南",
 "黑熱病證治指南",
 "瘋門全書",
 "瘋門辨症",
 "外科傳薪集",
 "產孕集",
 "胎產新書",
 "女科祕要",
 "女科祕旨",
 "女科旨要",
 "女科百問",
 "兒科醒",
 "麻疹闡注",
 "惠直堂經驗方",
 "絳囊撮要",
 "經驗奇方",
 "古方彙精",
 "醫方簡義",
 "回生集",
 "不知醫必要",
 "醫便",
 "春腳集",
 "外治壽世方",
 "文堂集驗方",
 "疑難急症簡方",
 "扶壽精方",
 "孫真人海上方",
 "魯府禁方",
 "祕傳大麻瘋方",
 "喻選古方試驗",
 "得心集醫案",
 "杏軒醫案初集",
 "輯錄",
 "古今醫案按選",
 "花韻樓醫案",
 "王旭高臨證醫案",
 "叢桂草堂醫案",
 "黃澹翁醫案",
 "診餘舉隅錄",
 "也是山人醫案",
 "龍砂八家醫案",
 "邵氏醫案",
 "沈氏醫案",
 "青霞醫案",
 "素圃醫案",
 "掃葉莊一瓢老人醫案",
 "壽世青編",
 "附病後調理服食法",
 "存存齋醫話稿",
 "吳山散記",
 "醫權初編",
 "一得集",
 "醫醫偶錄",
 "蠢子醫",
 "醫醫小草",
 "游藝誌略",
 "醫門補要",
 "履霜集",
 "廣嗣要語",
 "市隱廬醫學雜著",
 "保赤要言",
 "葉天土家傳祕訣",
 "白喉治法忌表抉微",
 "喉科十八證",
 "剌疔捷法",
 "七十四種疔瘡圖說",
 "弔腳痧方論",
 "白喉辨症",
 "脈訣祕傳",
 "發背對口治訣",
 "吐方考",
 "傷寒捷徑",
 "萬病皆鬱論",
 "江氏傷科學",
 "經目屢驗良方",
 "痧疫指迷",
 "霍亂平議",
 "時痘論",
 "小兒病叢談",
 "癆病指南",
 "傷寒論校勘記",
 "羚羊角辨",
 "類傷寒辨",
 "治疔錄要",
 "洄溪祕方",
 "傷寒撮要",
 "辨脈平脈章句",
 "難經懸解",
 "鍼灸要旨",
 "靈樞識",
 "黃帝內經素問集註",
 "黃帝內經靈樞集註",
 "雷公泡製藥性賦",
 "雷公泡製藥性解",
 "太素脈祕訣",
 "醫燈續燄",
 "脈說",
 "望診遵經",
 "察舌辨症新法",
 "醫方考",
 "脈語",
 "醫林改錯",
 "傷寒六經辨證治法",
 "張卿子傷寒論",
 "傷寒來蘇集",
 "傷寒附翼",
 "傷寒貫珠集",
 "增訂葉評傷暑全書",
 "溫熱暑疫全書",
 "增補評注溫病條辨",
 "溫病條辨歌括",
 "輯補溫熱諸方",
 "輯溫病條辨論",
 "溫病醫方撮要",
 "增補評注治溫提要",
 "溫病三字經",
 "溫熱病指南集",
 "溫熱逢源",
 "張氏溫暑醫旨",
 "伏氣解",
 "濕溫時疫治療法",
 "瘧疾論",
 "瘟疫論",
 "瘟疫明辨",
 "方",
 "重訂醫門普度瘟疫論",
 "鼠疫抉微",
 "羊毛瘟論",
 "隨息居霍亂論",
 "瘟疫霍亂答問",
 "附利濟瘟疫錄驗方",
 "霍亂審證舉要",
 "霍亂寒熱辨正",
 "伏陰論",
 "痧脹玉衡",
 "重刊金匱玉函經二註",
 "補方",
 "沈註金匱要略",
 "金匱要略心典",
 "金匱翼",
 "慎齋潰書",
 "症因脈治",
 "醫學心悟",
 "醫學舉要",
 "增訂十藥神書",
 "痰火點雪",
 "虛損啟微",
 "何氏虛勞心傳",
 "徐評外科正宗",
 "馬評陶批外科全生集",
 "附新增馬氏試驗祕方",
 "外科選要",
 "補遺方",
 "外科醫鏡",
 "痰癧法門",
 "附楊梅驗方",
 "喉蛾捷訣",
 "正體類要",
 "口齒類要",
 "尤氏喉科祕書",
 "重刊咽喉脈證通論",
 "喉舌備要祕旨",
 "重訂囊祕喉書",
 "附錄驗方",
 "增錄",
 "包氏喉證家寶",
 "附咽喉七十二證考",
 "附薛氏選方",
 "銀海指南",
 "經效產寶",
 "校註婦人良方",
 "女科經綸",
 "女科切要",
 "盤珠集胎產症治",
 "重訂產孕集",
 "小兒衛生總微論方",
 "慈幼新書",
 "幼科直言",
 "幼幼集成",
 "原瘄要論",
 "痳疹備要方論",
 "鍼灸素難要旨",
 "巢氏病源補養宣導法",
 "孫文垣醫案",
 "眉壽堂方案選存",
 "程杏軒醫案初集",
 "吳鞠通醫案",
 "何澹安醫案",
 "張畹香醫案",
 "邵蘭蓀醫案",
 "葉選醫衡",
 "友漁齋醫話六種",
 "一覽延齡",
 "橘旁雜論",
 "上池涓滴",
 "肘後偶鈔",
 "證治指要",
 "藥籠小品",
 "對山醫話",
 "冷廬醫話",
 "柳洲醫話",
 "馤塘醫話",
 "潛齋醫話",
 "醫暇巵言",
 "腧穴折衷",
 "幼科發揮",
 "本草飲食譜",
 "食養療法",
 "金匱要略方論",
 "傷寒類證",
 "淮注傷寒論",
 "運氣掌訣錄",
 "張仲景註解傷寒百證歌",
 "婦人良方",
 "保嬰撮要",
 "明醫雜著",
 "外科精要",
 "外科樞要",
 "錢氏小兒直訣",
 "原機啟微",
 "內科摘要",
 "女科撮要",
 "癘瘍機要",
 "陳氏小兒痘疹方論",
 "保嬰粹要",
 "保嬰金鏡錄",
 "敖氏傷寒金鏡錄",
 "十四經發揮",
 "本草發揮",
 "平治會萃",
 "傷寒鈐法",
 "外傷金鏡錄",
 "保嬰撮要錄",
 "立齊外科發揮",
 "外科心法",
 "癕疽神祕驗方",
 "外科經驗方",
 "傷寒家祕殺車槌法方",
 "脉刊誤集解",
 "讀素問鈔",
 "運氣易覽",
 "痘治理辨",
 "針灸問對",
 "萬氏家傳保命歌括",
 "萬氏家傳傷寒摘錦",
 "新刊萬氏家傳養生四要",
 "萬氏家傳婦人祕科",
 "內科要訣",
 "新刊萬氏家傳幼科發揮",
 "萬氏祕傳片玉心書",
 "萬氏家藏育嬰家祕",
 "萬氏家傳痘疹心法",
 "萬氏祕傳片玉痘疹",
 "萬氏家傳廣嗣紀要",
 "雜病證治類方",
 "傷寒證治準繩",
 "瘍醫準繩",
 "幼科證治準繩",
 "女科證治準繩",
 "傳忠錄",
 "脈神章",
 "傷寒典",
 "雜證謨",
 "婦人規",
 "小兒則",
 "痘疹詮",
 "外科鈐",
 "本草正",
 "新方八略",
 "新方八陣",
 "古方八陣",
 "婦人規古方",
 "小兒則古方",
 "痘疹詮古方",
 "外科鈐古方",
 "脈賦訓解",
 "脈訣正譌",
 "壺隱子應手錄",
 "壺隱子醫譚一得",
 "經絡考",
 "四診法",
 "病機部",
 "運氣略",
 "本草選",
 "治法彙",
 "診家正眼",
 "本草通元",
 "增補病機沙篆",
 "壽世正編",
 "金匱要略編註",
 "溫熱病論",
 "傷寒六經纂註",
 "虛勞內傷",
 "女科附翼",
 "客窗偶談",
 "醫學近編",
 "傷寒近前集",
 "幼幼近編",
 "濟陰近編",
 "陳氏診視近纂",
 "經絡診視",
 "陳氏藥理近考",
 "增訂本草備要",
 "醫方湯頭歌訣",
 "瀕湖二十七脉歌",
 "改正內景五臟六腑經絡圖說",
 "急救須知",
 "格物須知",
 "修養須知",
 "診宗三昧",
 "傷寒纘緒二論",
 "傷寒緒論",
 "張氏醫通",
 "傷寒纘論",
 "內經纂要",
 "雜症大小合參",
 "脈訣纂要",
 "女科精要",
 "藥按",
 "痘疹全集",
 "雜症痘疹藥性主治合參",
 "訂正仲景全書傷寒論註",
 "訂正什景全書金匱要略註",
 "刪補名醫方論",
 "編輯四診心法要訣",
 "編輯運氣要訣",
 "編輯傷寒心法要訣",
 "編輯雜病心法要訣",
 "編輯婦科心法要訣",
 "編輯幼科雜病心法要訣",
 "編輯痘疹心法要訣",
 "編輯幼科種痘心法要旨",
 "編輯外科心法要訣",
 "編輯眼科心法要訣",
 "編輯刺灸心法要訣",
 "編輯正骨心法要旨",
 "素靈摘要",
 "內景圖解",
 "脈法刪繁",
 "格言彙纂",
 "本草必用",
 "症方發明",
 "神效腳氣祕方",
 "追癆仙方",
 "婦科良方",
 "幼科良方",
 "痘疹良方",
 "何氏醫碥",
 "運氣要略",
 "脈法心參",
 "醫方捷徑",
 "傷寒論注",
 "金匱要略注",
 "婦科輯要",
 "幼科輯要",
 "四聖心源",
 "四聖懸樞",
 "玉楸藥解",
 "金匱懸解",
 "傷寒懸解",
 "長沙藥解",
 "傷寒說意",
 "素靈微蘊",
 "素問懸解",
 "附校餘偶識",
 "靈樞懸解",
 "難經經釋",
 "醫貫砭",
 "神葨本草經百種錄",
 "外科正宗",
 "道德經注",
 "內經詮釋",
 "脈訣啟悟注釋",
 "傷寒約編",
 "雜病源",
 "洄溪脈學",
 "六經病解",
 "舌鑑總論",
 "女科醫案",
 "治疫全書",
 "痢瘧纂要",
 "痘麻紺珠",
 "雜病源流犀燭",
 "傷寒論綱目",
 "婦科玉尺",
 "幼科釋謎",
 "要藥分劑",
 "傷寒雜病心法集解",
 "附醫方合編",
 "幼科心法集解",
 "彤園婦科",
 "外科圖形脈證",
 "附醫方便攷",
 "醫宗備要",
 "幼科指歸",
 "痘疹會通",
 "婦科指歸",
 "靈素提要淺註",
 "張仲景傷寒論原文淺註",
 "金匱要略淺註",
 "金匱方歌括",
 "醫學從眾錄",
 "女科要旨",
 "神農本草經讀",
 "時方妙用",
 "時方歌括",
 "傷寒真方歌括",
 "傷寒醫訣串解",
 "十藥神書註解",
 "修園七種合刊",
 "霍亂論",
 "神授急救異痧奇方",
 "靈素集註節要",
 "急救異痧奇方",
 "經驗百病內外方",
 "洞主仙師白喉治法忌表抉微",
 "救迷良方",
 "喉證要旨",
 "急治喉疹要法",
 "喉痧正的",
 "眼科捷徑",
 "養生鏡",
 "痢症三字訣",
 "保嬰要旨",
 "引痘略",
 "溼熱條辨",
 "本經便讀",
 "溫熱贅言",
 "婦科雜症",
 "名醫別錄",
 "平辨脈法歌括",
 "增補食物祕書",
 "內科簡效方",
 "女科簡效方",
 "外科簡效方",
 "幼科簡效方",
 "古今醫論",
 "刺疔捷法",
 "醫學論十種",
 "救急經驗良方",
 "醫學切要",
 "眼科切要",
 "幼科切要",
 "痘科切要",
 "外科切要",
 "奇方纂要",
 "醫學一統",
 "四時病機",
 "溫毒病論",
 "女科歌訣",
 "醫學溯源",
 "傷寒提鉤",
 "傷寒析疑",
 "雜症匯參",
 "女科原旨",
 "幼科集要",
 "痘疹精華",
 "方藥備考",
 "王氏醫案",
 "回春錄",
 "王氏醫案續編",
 "仁術志",
 "隨息居飲食譜",
 "隨息居重訂霍亂論",
 "霍亂括要",
 "重慶堂隨筆",
 "醫砭",
 "言醫",
 "願體醫話",
 "潛齋簡效方",
 "女科輯要",
 "王氏醫案初編",
 "王氏醫案三編",
 "歸硯錄",
 "瘍醫雅言",
 "痘疹索隱",
 "醫學讀書志",
 "本草匯纂",
 "脈訣匯纂",
 "藥性主治",
 "分類主治",
 "雜證良方",
 "婦嬰良方",
 "內科摘錄",
 "外科摘錄",
 "附急效便方",
 "增訂達生編",
 "附婦科雜症",
 "慈幼便覽",
 "附痘疹摘錄",
 "偏方補遺",
 "藥性摘錄",
 "附食物",
 "常用藥物",
 "醫門初步",
 "藥性簡要",
 "湯頭歌括",
 "切總傷寒",
 "增補脈訣",
 "傷寒論陽明病釋",
 "內經運氣病釋",
 "附內經遺篇病釋",
 "內經運氣表",
 "內經難字音義",
 "廣溫熱論",
 "傷寒論附餘",
 "傷寒例新注",
 "讀傷寒論心法",
 "迴瀾說",
 "時節氣修決病法",
 "醫學薪傳",
 "飼鶴亭集方",
 "醫粹精言",
 "醫意",
 "醫意內景圖說",
 "醫醫瑣言",
 "傷寒十六證類方",
 "傷寒證辨",
 "四診要訣",
 "雜證要法",
 "本草類要",
 "天人解",
 "六氣解",
 "臟腑各圖",
 "金匱要略淺註補正",
 "傷寒論淺註補正",
 "診病要訣",
 "寒溫指南",
 "雜症秘笈",
 "幼科指迷",
 "外科纂要",
 "學醫一得",
 "持脈大法",
 "本草分經",
 "痘源論",
 "傷燥論",
 "附經",
 "脈訣采真",
 "藥性選要",
 "醫書捷鈔",
 "醫學三書",
 "醫林獵要",
 "吳鞠通方歌",
 "陳修園方歌",
 "貽令堂雜俎",
 "與壻遺言",
 "退思集類方歌註",
 "醫方證治彙編歌訣",
 "增訂醫方歌訣",
 "王旭高先生醫方歌括",
 "薛氏濕熱論歌訣",
 "西溪書屋夜話錄",
 "醫經玉屑",
 "醫案摘奇",
 "舌胎統志",
 "課藝芻議析疑",
 "讀陳修園",
 "曉墀脈學",
 "中華醫學",
 "溫症金壺錄",
 "雜症名方",
 "袌青盧醫案",
 "退思盧感證輯要",
 "退思盧女科精華",
 "退思盧古今女科醫案選粹",
 "退思盧女科證治約旨",
 "著園醫話",
 "著園藥物學",
 "文苑集",
 "論醫集",
 "羣經見知錄",
 "傷寒論研究",
 "溫病明理",
 "熱病學",
 "生理新語",
 "脈學發微",
 "病理概論",
 "病理各論",
 "臨證筆記",
 "臨證演講錄",
 "金匱翼方選按",
 "風勞鼓病論",
 "保赤新書",
 "婦科大略",
 "論藥集",
 "十二經穴病候撮要",
 "神經系病理治療",
 "鱗爪集",
 "霍亂新論",
 "驗方新按",
 "金匱方論",
 "梅瘡見垣錄",
 "傷寒論輯義按",
 "藥盦醫案",
 "傷寒論章節",
 "傷寒方法",
 "傷寒表",
 "傷寒論講義",
 "傷寒方講義",
 "周禮醫師補注",
 "左氏秦和傳補注",
 "史記扁鵲倉公傳補注",
 "漢書藝文志方技補注",
 "後漢書華佗傳補注",
 "子華子醫道篇注",
 "病理發揮",
 "診斷提綱",
 "傷寒新義",
 "傷寒方解",
 "金匱方證詳解",
 "傷寒理解",
 "南陽藥證彙解",
 "傷寒雜病論章句",
 "傷寒雜病論讀本",
 "難經章句",
 "明堂孔穴鍼灸治要",
 "脈經鈔",
 "醫學三言",
 "天人要義表",
 "特效藥選便讀",
 "維摩醫室問答",
 "附陰陽大法表",
 "暑門症治要略",
 "方藥實在易",
 "舌診問答",
 "問診實在易",
 "病因證治問答",
 "脈學綱要",
 "本草法語",
 "病理方藥匯參",
 "研方必讀",
 "傷寒金匱方易解",
 "時病精要便讀",
 "醫門法律續編",
 "外科三字經",
 "六氣感證",
 "外科問答",
 "逆證彙錄",
 "五臟六腑圖說",
 "五臟補瀉溫涼藥性歌",
 "三百六十穴歌",
 "經絡起止歌",
 "附井滎俞經合歌",
 "運氣指掌",
 "類證注釋錢氏小兒方訣",
 "痘疹論",
 "痘疹寶鑑",
 "博愛心鑑",
 "小兒痘疹方論",
 "痘疹方論",
 "陳蔡二先生合併痘疹方",
 "博集稀痘方論",
 "種痘法",
 "褔幼編",
 "推拿摘要辨證指南",
 "翁仲仁先生痘疹金鏡錄",
 "橡村痘訣",
 "餘義",
 "小兒諸熱辨",
 "小兒治驗",
 "怡堂散記",
 "廣生編",
 "痘論",
 "錫麟寶訓",
 "釐正按摩要術",
 "鬻嬰提要說",
 "痧喉正義",
 "治驗錄",
 "保赤篇",
 "保赤輯要",
 "增補痘疹玉髓金鏡錄",
 "小兒推拿廣意",
 "渾天儀說",
 "測天約說",
 "大測",
 "測食",
 "比例規解",
 "測量全義",
 "學曆小辯",
 "新法曆引",
 "曆法西傳",
 "日躔表",
 "日躔曆指",
 "月離表",
 "月離曆指",
 "古今交食考",
 "交食曆指",
 "交食表",
 "五緯表",
 "五緯曆指",
 "黃赤道距度表",
 "割圓八線表",
 "籌算",
 "幾何要法",
 "西學凡",
 "景教流行中國碑頌",
 "重刻畸人十編",
 "西琴曲意",
 "交友論",
 "重刻二十五言",
 "天主實義",
 "辨學遺牘",
 "七克",
 "靈言蠡勺",
 "天文星總",
 "天文星纂",
 "天元玉曆",
 "三垣列舍入宿去極集",
 "星說",
 "天文玉曆精異賦",
 "天文風雨賦",
 "欽天監監正元統",
 "風角一覽占",
 "占日月虧食",
 "天文樞會",
 "曆象考成上編",
 "下編",
 "律呂正義上編",
 "數理精蘊上編",
 "測北極出地簡法",
 "方田度里",
 "新曆曉惑",
 "談天集證",
 "秝學巵言",
 "西日月攷補遺",
 "七國正朔不同攷",
 "天學入門",
 "海域大觀",
 "日晷圖法",
 "測夜時晷",
 "自嗚鐘表圖說",
 "天地圖儀",
 "撜日正方圖表",
 "高弧句股合表",
 "古今諸術考",
 "歲餘度餘考",
 "朔餘考",
 "古今朔閏考",
 "甲子紀元表",
 "四分術章蔀定率表",
 "授時術諸應定率表",
 "授時術氣朔用數鈐",
 "笠寫壺金",
 "交食南車",
 "髀矩測營",
 "視徑舉隅",
 "籌筆初梯",
 "九環西解",
 "胡氏宕田算稿",
 "盛世參苓",
 "附九章補例",
 "天代蒙泉細草",
 "附天元加減乘除釋例",
 "天元晰理衍草",
 "算學闢邪崇正說",
 "全輿分野釋略",
 "籌算補編",
 "梅心續集",
 "梅心集",
 "試造氣行輪船始末",
 "西法命盤圖說",
 "談天緒言",
 "祿命要覽",
 "選擇當知",
 "談天",
 "測候叢談",
 "甲子元術簡法",
 "癸卯元術簡法",
 "五星簡法",
 "三角法舉要",
 "句股闡微",
 "弧三角舉要",
 "環中黍尺",
 "塹堵測量",
 "方圓冪積",
 "幾何補編",
 "解八線割圓之根",
 "曆學疑問",
 "交食管見",
 "交食蒙求",
 "揆日候星紀要",
 "歲周地度合攷",
 "冬至攷",
 "諸方節氣加時日軌高度表",
 "五星紀要",
 "火星本法",
 "七政細草補註",
 "仰儀簡儀二銘補註",
 "曆學駢枝",
 "授時平立定三差詳說",
 "曆學答問",
 "古算衍略",
 "筆算",
 "度算釋例",
 "方程論",
 "少廣拾遺",
 "句股舉隅",
 "幾何通解",
 "平三角舉要",
 "歷學駢枝",
 "歷學疑問",
 "交食",
 "日食蒙求",
 "月食蒙求",
 "交會管見",
 "七政",
 "細草補注",
 "火星本法圖說",
 "七政前均簡法",
 "上三星軌迹成繞日圓象",
 "五星管見",
 "揆日紀要",
 "恆星紀要",
 "赤水遺珍",
 "操縵巵言",
 "矩綫原本",
 "一綫表用",
 "推步惟是",
 "學算存略",
 "樂律心得",
 "倉田通法",
 "量倉通法",
 "方田通法補例",
 "倉田通法續編",
 "八線類編",
 "八線對數類編",
 "弧角設如",
 "弧三角舉隅",
 "揣籥小錄",
 "高弧細草",
 "新測恆星圖表",
 "新測中星圖表",
 "新測更漏中星表",
 "金華晷漏中星表",
 "交食細草",
 "句股斜要",
 "數理摘要",
 "交食論義",
 "躔離法推",
 "氣候備考",
 "北極高度表",
 "句股容三事拾遺",
 "三角和較算例",
 "演元九式",
 "臺錐積演",
 "弧矢算術補",
 "割圜密率捷法",
 "四元玉鑑細草",
 "四象細草假令之圖",
 "附補增",
 "四元釋例",
 "新編算學啟蒙",
 "召誥日名攷",
 "漢三統術",
 "漢四分術",
 "漢乾象術",
 "補修宋奉元術",
 "補修宋占天術",
 "日法朔餘彊弱攷",
 "方程新術草",
 "句股算術細草",
 "開方說",
 "下卷",
 "尺筭日晷新義",
 "句股尺測量新法",
 "籌表開諸乘方捷法",
 "借根方法淺說",
 "輯古筭經補注",
 "弧矢啟祕",
 "對數探源",
 "垛積比類",
 "四元解",
 "麟德術解",
 "橢圜正術解",
 "橢圜新術",
 "橢圜拾遺",
 "火器真訣",
 "對數尖錐變法釋",
 "級數回求",
 "天算或問",
 "割圜連比例術圖解",
 "斜弧三邊求角補術",
 "堆垛求積術",
 "三統術衍補",
 "水經注圖說殘港稾",
 "文甲集",
 "文乙集",
 "蘭石詞",
 "易圖管見",
 "算學心悟",
 "珠算金鍼",
 "測圖海鏡識別詳解",
 "算書廿一種",
 "九章翼",
 "今有術",
 "分法",
 "開方",
 "平方各形術",
 "平圓各形圖",
 "立方立圓術",
 "句股",
 "衰分",
 "盈不足",
 "方程",
 "平三角邊角互求術",
 "弧三角術",
 "測量高遠術",
 "天元一術釋例",
 "天元名式釋例",
 "天元一草",
 "天元問答",
 "方程天元合釋",
 "四元名式釋例",
 "四元草",
 "四元加減乘除釋",
 "借根方句股細草",
 "徐莊愍公算書",
 "垛積招差",
 "附橢圜求周術",
 "百雞術衍",
 "求一術通解",
 "割圜八線綴術",
 "數學拾遺",
 "圜率攷真圖解",
 "算法圓理括囊",
 "粟布演草",
 "對數詳解",
 "綴術釋明",
 "綴術釋戴",
 "附四象假令細草",
 "弧三角形",
 "句股形",
 "帶縱立方形",
 "平圓形",
 "一乘方二乘方形",
 "諸乘方數根數真數楺雜設題式並訣",
 "衡齋遺書",
 "覆載通幾",
 "四邊形算法",
 "參雨算經",
 "樂律逢源",
 "考定磬氏倨句令鼓旁線中縣而縣居線右解",
 "校正九章算術及戴氏訂訛",
 "今有錄",
 "衡齋文集",
 "下學葊句股六術",
 "平三角和較術",
 "開諸乘方捷術",
 "七政算學",
 "算學各法引蒙",
 "開方別術",
 "數根術解",
 "開方古義",
 "積較術",
 "學算筆談",
 "算草叢存",
 "恆河沙館草",
 "連分數學",
 "答數界限",
 "算法須知",
 "測量法",
 "拋物線說",
 "垛積演較",
 "盈朒廣義",
 "積較客難",
 "諸乘方變式",
 "臺積術解",
 "青朱出入圖說",
 "代數初學",
 "微積初學",
 "决疑數學",
 "算學啟蒙",
 "增刪算法統宗",
 "數學理",
 "算式集要",
 "開方表",
 "句股六術",
 "積校術",
 "三角數理",
 "衍元要義",
 "弧田問率",
 "直積回求",
 "董方立遺書",
 "代數術",
 "代數難題解法",
 "微積溯源",
 "躔離引蒙",
 "附著述記",
 "恆氣注歷辯",
 "鄒徵君遺書",
 "乘方捷術",
 "赤道恆星圖",
 "夏氏算學",
 "代數句股術",
 "學計韻言",
 "縱方備證",
 "對數淺釋",
 "垛積解義",
 "古籌算考釋",
 "古籌算考釋續編",
 "籌算淺識",
 "籌算分法淺識",
 "籌算蒙課",
 "垛積籌法",
 "衍元小草",
 "循環餘冪",
 "詳函廣術",
 "反函詳級",
 "限一較數",
 "弧角平儀簡法",
 "橢圓盈縮簡法",
 "截垛發微",
 "引錣錄",
 "垛積比類後記",
 "數學九章後記",
 "借根代數會通",
 "玉鑑垛題闡幽",
 "臺體截積術",
 "代數助變術",
 "圓理拾遺",
 "衍元略法",
 "選擇通書祕竅",
 "奇門遁甲祕要",
 "天星祕竅圖書",
 "地理祕竅",
 "羅經祕竅圖書",
 "新鐫唐氏壽城",
 "璇璣經",
 "陽明按索",
 "佐玄直指圖解",
 "陰陽寶海三元玉鏡奇書",
 "三白寶海",
 "八宅明鏡",
 "堪輿正經",
 "青囊經",
 "玄女海角經纂",
 "郭氏葬經刪定",
 "楊公金函經刪定",
 "曾氏龍水經校",
 "青囊經序",
 "卜氏雪心賦刪定",
 "廖公四法心鏡",
 "附全局安墳立宅入式歌",
 "蔡氏發微論校",
 "附穴情賦",
 "賴公天星篇校",
 "石函平砂玉尺經纂",
 "司馬頭陀達僧問答",
 "附水法",
 "理氣部",
 "龍部",
 "穴部",
 "砂部",
 "水部",
 "作用部",
 "陽基部",
 "剋擇部",
 "奇聞口訣",
 "警世要言",
 "形勢真訣",
 "天機素書",
 "葬法",
 "倒杖十二法",
 "九星穴法",
 "披肝露膽經",
 "平洋論",
 "潮水論",
 "搜玄曠覽",
 "龍法",
 "穴法",
 "砂法",
 "水法",
 "粹言",
 "瑣言",
 "理氣祕旨",
 "玉尺經",
 "附原經圖式",
 "催官評龍篇",
 "附理氣穴法",
 "吳公教子書",
 "天玉經外傳",
 "附四十八局圖說",
 "索隱玄宗",
 "原說",
 "石譚",
 "要訣",
 "理氣砂水",
 "祕授命理須知滴天髓",
 "測字祕牒",
 "天玉經",
 "青囊鈙",
 "地理辨正圖說",
 "周易葬說",
 "罔極錄",
 "蜀山葬書",
 "喪葬雜說",
 "慎終錄要",
 "徵驗圖考",
 "地理辨正補義",
 "三字青囊經",
 "達僧問答",
 "玉函真義天元歌",
 "玉函真義古鏡歌",
 "陽宅指南",
 "傳家陽宅得一錄",
 "陽宅三格辨",
 "七十二葬法",
 "地理精語",
 "宅譜指要",
 "宅譜邇言",
 "選時造命",
 "宅譜修方",
 "撼龍",
 "疑龍",
 "菊逸山房山法備收",
 "玄空祕旨通釋",
 "玄機賦通釋",
 "飛星賦通釋",
 "紫白訣通釋",
 "米海嶽書史",
 "書法鉤玄",
 "字學新書摘鈔",
 "沈存中圖畫歌",
 "筆法記",
 "畫山水錄",
 "王維山水論",
 "聖朝名畫評",
 "米海嶽畫史",
 "梁元帝山水松石格",
 "豫章先生論畫山水賦",
 "李成山水訣",
 "郭若虛畫論",
 "宣和論畫雜評",
 "畫山水歌",
 "李廌畫品",
 "華光梅譜",
 "張退公墨竹記",
 "古今書評",
 "衛夫人筆陣圖",
 "冬心硯銘",
 "唐詩酒籌",
 "西廂記酒令",
 "才子文",
 "香奩詠物詩",
 "書法論",
 "說文字原表",
 "漢碑隸體舉要",
 "二十四書品",
 "南薰殿圖像攷",
 "西清劄記",
 "於越先賢傳",
 "列仙酒牌",
 "輞川畫訣",
 "郭氏畫訓",
 "大癡畫訣",
 "苦瓜和尚畫語",
 "山靜居論畫",
 "養素居畫學",
 "半千畫訣",
 "浦山論畫品",
 "過雲廬畫論",
 "桐陰畫訣",
 "大滌子題畫詩跋",
 "麓臺題畫稿",
 "廣藝舟雙楫",
 "桐陰論畫",
 "山水松石格",
 "山水論",
 "山水訣",
 "寫山水訣",
 "繪宗十二忌",
 "畫旨",
 "畫引",
 "石村畫訣",
 "芥舟學畫編",
 "谿山臥遊錄",
 "松壼畫憶",
 "醉蘇齋畫訣",
 "夢幻居畫學簡明",
 "頤園論畫",
 "春覺齋論畫",
 "文人畫之價值",
 "畫學講義",
 "天下有山堂畫藝",
 "題畫梅",
 "寫像祕訣",
 "柴丈人畫訣",
 "廣堪齋藏畫",
 "書畫心賞日錄",
 "養花館書畫目",
 "書畫書錄解題補編",
 "讀畫閒評",
 "劉湄書畫記",
 "書畫書錄解題補乙編",
 "明清五百年畫派概論",
 "樹石譜",
 "琴粹",
 "古琴考",
 "琴話",
 "幽蘭減字譜",
 "幽蘭雙行譜",
 "流水簡明譜",
 "琴學隨筆",
 "琴餘漫錄",
 "琴鏡",
 "印旨",
 "印經",
 "印章要論",
 "印章考",
 "敦好堂論印",
 "說篆",
 "印辨",
 "印述",
 "印戔說",
 "六書緣起",
 "古今印制",
 "篆印發微",
 "古印考畧",
 "重定續三十五舉",
 "印說",
 "印言",
 "印學管見",
 "續印人傳",
 "印鐙箋",
 "古今印說補",
 "印譜摘要",
 "屠琴隖印譜",
 "趙懿子印譜",
 "江西谷印譜",
 "徐問渠印譜",
 "丁敬身先生印譜",
 "錢叔蓋先生印譜",
 "奚鐵生先生印譜",
 "黃小松先生印譜",
 "趙次閑先生印譜",
 "硯林印存",
 "小蓬萊閣印存",
 "吉羅盦印存",
 "冬花庵印存",
 "求是齋印存",
 "種榆僊館印存",
 "萍寄室印存",
 "鐵廬印存",
 "印史",
 "印談",
 "摹印祕論",
 "篆刻針度",
 "印學集成",
 "雲莊印話",
 "歷朝印識",
 "寶印集",
 "多野齋印說",
 "績語堂論印彙錄",
 "三十五舉校勘記",
 "葉氏印譜存目",
 "治印雜說",
 "藝粟齋墨品",
 "春渚記墨",
 "疇齋墨譜",
 "墨譚",
 "程君房墨讚",
 "墨苑序",
 "墨雜說",
 "潘方凱墨序",
 "論墨",
 "說墨貽兄孫西侯",
 "續墨品",
 "硯山齋墨譜",
 "紀墨小言",
 "百十二家墨錄",
 "借軒墨存",
 "窳叟墨錄",
 "墨譜法式",
 "中山狼圖",
 "利瑪竇題寶像圖",
 "墨海",
 "鑑古齋墨藪",
 "中州墨錄",
 "內務府墨作則例",
 "南學製墨劄記",
 "玉紀補",
 "志雅堂雜抄摘抄",
 "齊東野語摘抄",
 "雲煙過眼錄摘抄",
 "雲煙過眼錄續集摘抄",
 "燕閒清賞箋摘抄",
 "文房器具箋摘抄",
 "韻石齋筆談摘抄",
 "清祕藏摘抄",
 "享金簿摘抄",
 "清宮交泰殿寶譜摘抄",
 "閱微草堂筆記摘抄",
 "金玉瑣碎摘抄",
 "清儀閣所藏古器物文",
 "前塵夢影錄摘抄",
 "古印考略摘抄",
 "記響拓玉印譜",
 "記羊城玉豬",
 "欣如談玉摘抄",
 "玉紀正誤",
 "玩古",
 "古玉器",
 "玉社古玉所見錄",
 "古玉圖",
 "絲繡筆記",
 "清內府藏刻絲書畫錄",
 "清內府藏繡線書畫錄",
 "女紅傳徵略",
 "存素堂絲繡錄",
 "蝶几圖",
 "蜨几圖",
 "匡几圖",
 "畫蘭瑣言",
 "詠蘭瑣言",
 "藝蘭瑣言",
 "評蘭瑣言",
 "鵪鶉論",
 "黃頭誌",
 "畫眉解",
 "日下看花記",
 "片羽集",
 "聽春新詠",
 "鶯花小譜",
 "金臺殘淚記",
 "燕臺鴻爪集",
 "辛壬癸甲錄",
 "夢華瑣簿",
 "曇波",
 "法嬰祕笈",
 "明僮小錄",
 "增補菊部羣英",
 "羣芳小集",
 "菊部羣英",
 "羣英續集",
 "羣芳小集續集",
 "擷華小錄",
 "側帽餘譚",
 "菊臺集秀錄",
 "新刊鞠臺集秀錄",
 "瑤臺小錄",
 "情天外史正冊",
 "續冊",
 "越縵堂菊話",
 "哭庵賞菊詩",
 "鞠部叢譚",
 "宣南零夢錄",
 "梨園舊話",
 "梨園軼聞",
 "舊劇叢談",
 "北京梨園掌故長編",
 "北京梨園金石文字錄",
 "九青圖詠",
 "消寒新詠",
 "眾香國",
 "燕臺集豔二十四花品",
 "燕臺花史",
 "檀清引",
 "鞠部明僮選勝錄",
 "杏林擷秀",
 "聞歌述憶",
 "北平梨園竹枝詞薈編",
 "燕都名伶傳",
 "燕歸來簃隨筆",
 "燕塵菊影錄",
 "歌臺摭舊錄",
 "蒨蒨室劇話",
 "詩鐘",
 "花間楹帖",
 "集西廂酒籌",
 "紅樓夢譜",
 "捧腹集詩鈔",
 "文虎",
 "南陵無雙譜",
 "東坡遺意",
 "官子譜",
 "靜觀自得錄",
 "說快又續筆",
 "雕玉雙聯",
 "醉月隱語",
 "回文片錦",
 "蝸角棋譜",
 "五星聯珠",
 "月夜鐘聲",
 "六十四卦令",
 "七十二侯令",
 "同歡令",
 "鬥花籌譜",
 "跬園謎稿",
 "凡民謎存",
 "商舊社友謎存",
 "笑林二十三則",
 "笑林二則",
 "啟顏錄敦煌卷子本三十六則",
 "啟顏錄太平廣記引二十五則",
 "啟顏錄類說本十則",
 "啟顏錄續百川學海本九則",
 "啟顏錄廣滑稽本二十一則",
 "啟顏錄捧腹編本一則",
 "諧噱錄三十九則",
 "笑言一則",
 "羣居解頤十九則",
 "調謔編二十八則",
 "遯齋閑覽二十八則",
 "善謔集八則",
 "絕倒錄一則",
 "漫笑錄四則",
 "諧史一則",
 "籍川笑林十則",
 "事林廣記二十六則",
 "稗史四則",
 "羣書通要二則",
 "楮記室六則",
 "權子五則",
 "山中一夕話十則",
 "艾子后語",
 "露書八則",
 "應諧錄十八則",
 "諧史五則",
 "五雜俎十六則",
 "諧語十四則",
 "蘇黃滑稽帖",
 "雅謔一百十則",
 "笑林九十四則",
 "迂仙別記二十四則",
 "七修類藳六則",
 "雪濤小說八則",
 "雪濤諧史一百三十三則",
 "謔浪十四則",
 "諧叢十五則",
 "笑贊五十九則",
 "笑禪錄一則",
 "笑府五十三則",
 "廣笑府九十四則",
 "古今譚概一百六十四則",
 "新話摭粹六則",
 "精選雅笑三十四則",
 "諧藪一則",
 "笑林四則",
 "續笑林一則",
 "解頤贅語一則",
 "胡盧編一則",
 "噴飯錄四則",
 "笑海千金十三則",
 "時尚笑談二十三則",
 "華筵趣樂談笑酒令二十八則",
 "遣愁集五則",
 "三山笑史一則",
 "寄園寄所寄十六則",
 "笑倒三十五則附半庵笑政",
 "增訂解人頤新集五則",
 "笑得好一百六十三則",
 "看山閣閑筆十七則",
 "萬寶全書一則",
 "廣談助二十則",
 "笑笑錄六十一則",
 "嘻談錄二十六則",
 "笑林廣記四十九則",
 "笑林廣記二十四則",
 "一笑十二則",
 "歷代已佚或未收笑話集書目",
 "笑府選",
 "笑例選",
 "笑得好選",
 "蝶几譜",
 "品藻",
 "采菊襍咏",
 "研錄",
 "冷仙琴聲十六法",
 "新室志",
 "香閨韵事",
 "熙寧新定時服式",
 "宣和冊禮圖",
 "宋人遺祻雜抄",
 "演伎細事",
 "香蓮品藻",
 "金園雜纂",
 "兌鉤",
 "菡珠經",
 "赫蹏書",
 "張氏書畫四表",
 "冬心題畫",
 "紅木軒紫泥法定本",
 "洞山芥茶系",
 "集唐楹聯",
 "樂府雅聯",
 "繹山碑集字聯",
 "校官碑集字聯",
 "曹全碑集字聯",
 "魯峻碑集字聯",
 "樊敏碑集字聯",
 "紀太山銘集字聯",
 "金剛經集字聯",
 "爭坐位帖集字聯",
 "蘭亭序帖集字聯",
 "醴泉銘集字聯",
 "聖教序集字聯",
 "石鼓文集字聯",
 "易林集聯",
 "詩品集聯",
 "四書對",
 "俗語對",
 "花品",
 "五色連珠",
 "豔體連珠",
 "續豔體連珠",
 "詩夢鐘聲錄",
 "西廂酒令",
 "唐詩酒令",
 "改字詩酒令",
 "集句詞",
 "詠物詞",
 "孟子人名廋詞",
 "四書人名廋辭",
 "日河新燈錄",
 "百美詩",
 "百花詩",
 "紅樓百美詩",
 "百聲詩",
 "百影詩",
 "月詩",
 "身體二十六詠",
 "春人賦",
 "捧腹集",
 "俗語詩",
 "紅樓西廂合錦",
 "百花扇序",
 "虎邱弔真娘墓文",
 "草心樓讀畫集",
 "藝蘭記",
 "履園畫學",
 "雨窻漫筆",
 "前塵夢影錄",
 "畫眼",
 "賴古堂書畫跋",
 "小松圓閣書畫跋",
 "附硯銘雜器銘",
 "荀勗苖律圖注",
 "書影擇錄",
 "論畫絕句",
 "漫堂書畫跋",
 "頻羅庵書畫跋",
 "古銅瓷器攷",
 "古銅器攷",
 "古窯器攷",
 "臨池管見",
 "徐電發楓江漁父小像題詠",
 "附三十五舉校勘記",
 "享金簿",
 "玉几山房畫外錄",
 "曝書亭書畫跋",
 "琉璃志",
 "天際烏雲帖攷",
 "眉公書畫史",
 "汪氏珊瑚網畫繼",
 "畫據",
 "畫法",
 "國朝吳郡丹青志",
 "竹嬾畫賸",
 "續畫賸",
 "竹嬾墨君題語",
 "醉鷗墨君題語",
 "評紙帖",
 "古今墨論",
 "今夕盦讀畫絕句",
 "今夕盦題畫詩",
 "七家印跋",
 "宣爐博論",
 "非煙香法",
 "墨竹記",
 "竹人錄",
 "朱臥菴藏書畫目",
 "金栗箋說",
 "青霞館論畫絕句",
 "談石",
 "字學憶參",
 "景德鎮陶錄",
 "紙墨筆硯箋",
 "山齋清供箋",
 "硃砂魚譜",
 "紅术軒紫泥法定本",
 "硯林印款",
 "米庵鑒古百一詩",
 "冬心先生雜畫題記",
 "冬心先生隨筆",
 "書學緒聞",
 "我川寓賞編",
 "我川書畫記",
 "四友齋書論",
 "茗壺圖錄",
 "論畫雜詩",
 "論書法",
 "曼盦壺盧銘",
 "冬花庵題畫絕句",
 "飲流齋說瓷",
 "端溪研坑考",
 "石隱硯談",
 "墨餘贅稿",
 "續收書畫奇物記",
 "嘯月樓印賞",
 "玉燕樓書法",
 "燕閒清賞箋",
 "南窰筆記",
 "紀硯",
 "畫錄廣遺",
 "茖笈",
 "翼譜叢談",
 "宋中興館閣儲藏圖書記",
 "南宋院畫錄補遺",
 "女紅傳徵畧",
 "書勢",
 "書畫目錄",
 "銅仙傳",
 "刺繡書畫錄",
 "聽颿樓書畫記",
 "湘管齋寓賞編",
 "趙蘭坡所藏書畫目錄",
 "悅生所藏書畫別錄",
 "竹園陶說",
 "古玉考",
 "羅鍾齋蘭譜",
 "慎子內外編",
 "諺語",
 "謠語",
 "諧語",
 "讔語",
 "譏語",
 "讖語",
 "雋區",
 "道言",
 "術言",
 "德言",
 "文心雕龍文言",
 "大有奇書",
 "尚論持平",
 "析疑待正",
 "事文標異",
 "眠雲閑錄",
 "藤亭漫抄",
 "情話記",
 "巡簷筆乘",
 "臥疴隨筆",
 "今是齋日鈔",
 "閉影雜識",
 "采榮錄",
 "飽卿談叢",
 "過庭暇錄",
 "東齋掌鈔",
 "予寧漫筆",
 "晏如筆記",
 "西廬漫筆",
 "晏如齋檠史",
 "耳順記",
 "嗇翁檠史",
 "休園語林",
 "憤助編",
 "正學矩",
 "筆花軒",
 "錢本草",
 "酒鑒",
 "粥飯緣",
 "粥經",
 "飯頌",
 "憨子",
 "妬律",
 "智囊補",
 "玉皇心印經",
 "濂溪書院興學編",
 "濂溪書院勸學編",
 "四禮初稿",
 "家禮雜儀",
 "通禮",
 "農桑易知錄",
 "十三經序錄",
 "二十四史序錄",
 "九通序錄",
 "五禮通攷序錄",
 "春秋大事表序錄",
 "方輿紀要序錄",
 "便民圖纂",
 "仁孝文皇后內訓",
 "曹大家女誡",
 "鄭氏女孝經",
 "宋若昭女論語",
 "王節婦女範捷錄",
 "裏言",
 "陰隲文像註",
 "增訂敬信錄",
 "玉歷鈔傳警世",
 "附呂新吾先生身家盛衰循環圖說",
 "身世準繩",
 "筆花醫鏡",
 "千字文釋義",
 "百家姓考畧",
 "三字經訓詁",
 "經腴類纂",
 "歷代史腴",
 "左傳紺珠",
 "爾雅貫珠",
 "山海經腴詞",
 "竹書紀年雋句",
 "六經蒙求",
 "十七史蒙求",
 "均藻",
 "文選集腋",
 "文選音義",
 "文選類雋",
 "洛神傳",
 "鄭德璘傳",
 "李章武傳",
 "趙合傳",
 "裴伷先別傳",
 "少室仙姝傳",
 "蚍蜉傳",
 "甘棠靈會錄",
 "顏濬傳",
 "板橋記",
 "洛京獵記",
 "玉壺記",
 "姚生傳",
 "唐晅手記",
 "獨孤穆傳",
 "王恭伯傳",
 "中山狼傳",
 "崔煒傳",
 "陸顒傳",
 "潤玉傳",
 "李衛公別傳",
 "齊推女傳",
 "魚服記",
 "聶隱娘",
 "袁天綱外傳",
 "曾季衡傳",
 "張遵言傳",
 "侯元傳",
 "同昌公主外傳",
 "睦仁蒨傳",
 "韋鮑二生傳",
 "張令傳",
 "王賈傳",
 "竇玉傳",
 "人虎傳",
 "馬自然傳",
 "白蛇記",
 "巴西侯傳",
 "柳歸舜傳",
 "山莊夜恠錄",
 "五真記",
 "小金傳",
 "朝黟遺紀",
 "艮獄記",
 "續齋諧記",
 "長恨傳",
 "韋安道傳",
 "周泰行紀",
 "嵩岳嫁女記",
 "崔少玄傳",
 "無雙傳",
 "鷪鷪傳",
 "柳氏傳",
 "蔣琛傳",
 "張太史明道雜志",
 "東坡居士艾子雜說",
 "鍾嶸詩品",
 "七人聯句詩紀",
 "太湖新錄",
 "陽山新錄",
 "蠶衣",
 "吳中往哲記",
 "今雨瑤華",
 "大石山房十友譜",
 "皇明天全先生遺事",
 "近言",
 "續編宋史辨",
 "縣笥瑣探",
 "冀越集",
 "寇萊公遺事",
 "歷代帝王傳國璽譜",
 "摭言述妓館五段事",
 "綠珠內傳",
 "東方朔神異經",
 "蓬軒吳記",
 "紀周文襄公見鬼事",
 "語怪四編",
 "說聽",
 "小窗自紀",
 "小窗別紀",
 "小窗清紀",
 "小窗豔紀",
 "綠天脞說",
 "廣莫野語",
 "驚座摭遺",
 "客窗隨筆",
 "碣石剩譚",
 "續偃曝談餘",
 "漢武事略",
 "椒官舊事",
 "趙氏二美遺蹤",
 "元氏掖庭侈政",
 "樂善錄略",
 "松窗錄略",
 "萬松閣記客言",
 "巳瘧編",
 "螘談",
 "摩訶船若波羅蜜多心經釋",
 "三十國記",
 "常清靜經",
 "壬子年拾遺記",
 "閑窓括異志",
 "搜采異聞錄",
 "游宧紀聞",
 "學齋佔畢纂",
 "祛疑說纂",
 "東坡先生志林",
 "蘇黃門龍川別",
 "暌車志",
 "楓窻小牘",
 "仙史傳",
 "異僧傳",
 "怪道士傳",
 "怪男子傳",
 "三異人傳",
 "豪客傳",
 "續劍俠傳",
 "狂奴傳",
 "麗姝傳",
 "義妓傳",
 "俊婢傳",
 "騃僕傳",
 "物怪錄",
 "夜怪錄",
 "妖妄傳",
 "妖蠱傳",
 "妖巫傳",
 "夜乂傳",
 "白猿",
 "幻影傳",
 "神呪志",
 "鸚鵡舍利塔記",
 "聖琵琶傳",
 "五方神傳",
 "冥遇傳",
 "冥感記",
 "冥音記",
 "鬼塚志",
 "見鬼傳",
 "冤債志",
 "尸媚傳",
 "賣鬼傳",
 "奇鬼傳",
 "夢游錄",
 "附枕中記",
 "巫山神女夢",
 "曹植洛神賦",
 "責髯奴辭",
 "琵琶婦傳",
 "李謩吹笛記",
 "衛公故物記",
 "癖顛小史",
 "說雋",
 "草堂隨筆",
 "談麈",
 "逃名傳",
 "蘇娥訴冤記",
 "泰山生令記",
 "泰嶽府君記",
 "度朔君別傳",
 "山陽死友傳",
 "縻生瘞卹記",
 "東越祭蛇記",
 "楚王鑄劍記",
 "古墓斑狐記",
 "太古蠶馬記",
 "烏衣鬼軍記",
 "夏侯鬼語記",
 "還冤記",
 "漢雜事秘辛",
 "丁新婦傳",
 "梓橦士女志",
 "梁京寺記",
 "三齊畧記",
 "相手板經",
 "松窻雜記",
 "籟記",
 "大鄿藏治病藥",
 "粧樓",
 "洞天褔地記",
 "畫學秘訣",
 "申宗傳",
 "奇男子傳",
 "墨崑崙傳",
 "御寨行程",
 "高宗幸張府節次畧",
 "東皐雜錄",
 "彭蠡小龍記",
 "植杖閒譚",
 "船窻夜話",
 "隱窟雜記",
 "藥議",
 "遊仙夢記",
 "龍壽丹記",
 "惠民藥局記",
 "鬼國續記",
 "海外怪洋記",
 "閩海蠱毒記",
 "福州猴王神記",
 "鳴鶴山記",
 "韓奉議鸚歌傳",
 "皇朝盛事",
 "推篷寤語",
 "琅琊漫抄",
 "蓬窓續錄",
 "腳氣集",
 "近峰聞略",
 "秘錄",
 "仿園酒評",
 "半庵笑政",
 "桓譚新論",
 "小窗自紀雜著",
 "閒中古今錄",
 "西峰淡話",
 "杼情錄",
 "漁洋感舊集小傳",
 "蚓庵瑣語",
 "研北雜記",
 "虛谷閒鈔",
 "蓉塘紀聞",
 "蓬軒別記",
 "然脂百一編六種",
 "東歸紀事",
 "燈花占",
 "追述黔塗略",
 "革除建文皇帝紀",
 "老父雲遊始末",
 "尊前話舊",
 "然燈紀聞",
 "仿園清語",
 "九華新譜",
 "明季詠史百一詩",
 "續驂鸞錄",
 "雅謔",
 "蓮子居詞話",
 "龍輔女紅餘志",
 "酒顛",
 "茶董",
 "師友詩傳續錄",
 "貯香小品",
 "雜事秘辛",
 "大唐傳戴",
 "支諾皐",
 "鑒戒錄",
 "朝野遺紀",
 "宣和遺事",
 "剪勝野聞",
 "蹇齋瑣綴錄",
 "天全先生遺事",
 "原李耳載",
 "眉公羣碎錄",
 "西遊補十六回續雜記",
 "方氏五種",
 "三風十愆記",
 "豔囮二則",
 "筆夢敘",
 "李姬傳",
 "王氏復仇記",
 "說夢",
 "閒處光陰",
 "日買齋塗說",
 "香畹樓憶語",
 "關隴興中偶憶編",
 "遊梁瑣記",
 "大獄記",
 "附龍川先生詩鈔",
 "私史獄",
 "列異傳",
 "古異傳",
 "戴祚甄異傳",
 "荀氏靈鬼志",
 "祖台之志怪",
 "孔氏志怪",
 "神怪錄",
 "劉之遴神錄",
 "謝氏鬼神列傳",
 "殖氏志怪記",
 "妬記",
 "陸氏異林",
 "曹毗志怪",
 "郭季產集異記",
 "王浮神異記",
 "續異記",
 "錄異傅",
 "雜鬼神志怪",
 "詳異記",
 "黛史",
 "艷體連珠",
 "三婦評牡丹亭雜記",
 "龜台琬琰",
 "艷囮二則",
 "附顧仲恭討錢岱檄",
 "金姬小傳",
 "邵飛飛傅",
 "纏足談",
 "今列女傳",
 "敝帚齋餘談節錄",
 "紅樓葉戲譜",
 "美人判",
 "比紅兒詩注",
 "某中丞夫人",
 "妖婦齊王氏傳",
 "老狐談歷代麗人記",
 "瑤臺片玉甲種",
 "瑤臺片玉乙種（一名花底拾遺集）",
 "王翠翹傳",
 "擬合德諫飛燕書",
 "金小品傳",
 "徐郎小傳",
 "頓子真小傳",
 "妓虎傳",
 "香本紀",
 "楊娥傳",
 "黔曲竹枝詞",
 "黑美人別傳",
 "某中丞",
 "女盜俠傳",
 "女俠翠雲孃傳",
 "記某生為人唆訟事",
 "記栗主殺賊事",
 "女俠荊兒記",
 "餘墨偶談節錄",
 "漢宮春色",
 "竹夫人傳",
 "湯媼傳",
 "周櫟園奇緣記",
 "彩雲曲並序",
 "苗妓詩",
 "梵門綺語錄",
 "琴譜序",
 "代少年謝狎妓書",
 "小腳文",
 "冷廬雜識節錄",
 "韻蘭序",
 "步非烟傳",
 "譚節婦詞堂記",
 "月夜彈琴記",
 "醋說",
 "戲擬青年上政府請弛禁早婚書",
 "自由女請禁婚嫁陃俗稟稿",
 "婦女贊成禁止娶妾律之大會議",
 "擬王之臣與其友絕交書",
 "代某校書謝某狎客饋送局帳啟",
 "懺船娘張潤金疏",
 "冶遊自懺文",
 "問蘇小小鄭孝女秋瑾松風和尚何以同葬於西泠橋試研究其命意所在",
 "冶遊賦",
 "閨中十二曲",
 "盤珠詞",
 "鬘華室詩選",
 "恨塚銘",
 "七外夜遊記",
 "俞三姑傳",
 "過壚志感",
 "文海披沙摘錄",
 "述懷小序",
 "河東君傳",
 "懼內供狀",
 "神山引曲",
 "宋詞媛朱淑真事略",
 "張靈崔瑩合傳",
 "小螺菴病榻憶語",
 "歌者葉記",
 "女官傳",
 "書葉氏女事",
 "貞婦屠印姑傳",
 "廬山二女",
 "五石瓠節錄",
 "王嬌傳",
 "記某生為人雪冤事",
 "玉鉤斜哀隋宮人文",
 "玉梅後詞",
 "雙頭牡丹燈記",
 "玫瑰花女魅",
 "織女",
 "蘇四郎傳",
 "菽園贅談節錄",
 "香咳集選",
 "五代花月",
 "喬復生王再來二姬合傳",
 "𢥾母傳",
 "十八娘傳",
 "真真曲",
 "至正妓人行",
 "圓圓傳",
 "溫柔鄉記",
 "斷袖篇",
 "欝輪袍傳",
 "烈女李三行",
 "蘇小小考",
 "甲癸議",
 "悼亡詞",
 "夏閨晚景瑣說",
 "茯苓仙傳奇",
 "太恨生傳",
 "廣東火劫記",
 "姍姍傳",
 "虞美人傳",
 "黃竹子傳",
 "春娘傳",
 "金華神記",
 "貞烈婢黃翠花傳",
 "花仙傳",
 "薄命曲",
 "徐娘自述詩記",
 "物妖志",
 "靈物志",
 "太曼生傳",
 "黃九煙先生和楚女詩",
 "千春一恨集唐詩六十首",
 "閨墨萃珍",
 "婚啟",
 "巫娥志",
 "誌許生奇遇",
 "誌舒生遇異",
 "姽嫿封傳奇",
 "玄妙洞天記",
 "西湖遊幸記",
 "續髻鬟品",
 "淞濱瑣話",
 "湘煙小錄",
 "喟菴叢錄",
 "金釧記",
 "俠女希光傳",
 "百花園夢記",
 "金粟閨詞百首",
 "梅喜緣",
 "沈警遇神女記",
 "娟娟傳",
 "石頭記評贊序",
 "石頭記評花",
 "讀紅樓夢雜記",
 "紅樓夢竹枝詞",
 "紅樓夢題詞",
 "紅樓夢賦",
 "南澗行",
 "清溪惆悵集",
 "對山餘墨",
 "十美詩",
 "節錄元周達觀真臘風土記",
 "附翾風傳",
 "陳張貴妃傳",
 "碧線傳",
 "張老傳",
 "瑤臺片玉甲種補錄",
 "續板橋雜記",
 "青冢志",
 "花國劇談",
 "沈秀英傳",
 "石頭記論贊",
 "笠翁偶集摘錄",
 "寄園寄所寄摘錄",
 "紀唐六如軼事",
 "西泠閨詠後序",
 "六憶詞",
 "春閨雜咏",
 "秀華續咏",
 "神異經十五則",
 "海內十洲記四則",
 "列仙傳十八則",
 "列女傳四刖",
 "西京雜記八則",
 "別國洞冥記一則",
 "笑林十則",
 "列女傳二則",
 "高士傳十則",
 "益都耆舊傳二則",
 "汝南先賢傳五則",
 "楚國先賢傳二則",
 "文士傳二則",
 "漢中士女志十三則",
 "梓潼士女志二則",
 "博物志九則",
 "列異傳七則",
 "搜神記二十六則",
 "南越記一則",
 "魏晉世語一則",
 "裴子語林十則",
 "神仙傳四十五則",
 "郭玄二則",
 "玄中記一則",
 "九江記三則",
 "王子年拾遺記十九則",
 "拾遺名山記八則",
 "搜神後記十四則",
 "蓮社高賢傳四則",
 "抱朴子四則",
 "冥祥記五則",
 "齊諧記三則",
 "幽明錄十七則",
 "世說新語五十七則",
 "襄陽耆舊傳五則",
 "異苑七則",
 "述異記八則",
 "俗說一則",
 "續齊諧記九則",
 "真誥一則",
 "高僧傳四則",
 "還冤記二十四則",
 "靈隱傳",
 "趙合傅",
 "眭仁蒨傳",
 "人虎傳　",
 "山莊夜怪錄",
 "負苓者傳",
 "李紳傳",
 "陶峴傳",
 "太湖石記",
 "泗州大水記",
 "下邳侯革華傳",
 "毛穎傳",
 "李赤傳",
 "段太尉逸事狀",
 "種樹郭橐駝傳",
 "梓人傳",
 "捕蛇者說",
 "河間婦傳",
 "宋清傅",
 "李賀小傳",
 "齊魯二生",
 "宜都內人",
 "拾甲子年事",
 "說石烈士",
 "蘭亭始末記",
 "楊烈婦傳",
 "高愍女傳",
 "書何易于",
 "竇烈女傳",
 "容成侯傳",
 "鬼塚志一則",
 "小說舊聞記一則",
 "常侍言旨一則",
 "龍城錄五則",
 "嶺表錄異三則",
 "教坊記一則",
 "李諅吹笛記一則",
 "次柳氏舊聞八則",
 "異疾志三則",
 "諾皐記八則",
 "支諾皐三則",
 "夜叉傳三則",
 "酉陽雜俎四十四則",
 "夢游錄四則",
 "仙吏傳二則",
 "英雄傳二則",
 "神女傳三則",
 "幻異志二則",
 "雷民傳一則",
 "玄怪錄十七則",
 "續玄怪錄十九則",
 "聞奇錄六則",
 "靈應錄二則",
 "幻影傳二則",
 "幻戲志二則",
 "再生記五則",
 "尸媚傳二則",
 "奇鬼傳一則",
 "才鬼記五則",
 "妖妄傳二則",
 "靈鬼志六則",
 "靈怪錄四則",
 "梁四公記一則",
 "樂府雜錄一則",
 "博異記四十則",
 "集異記四十六則",
 "松窗雜錄二則",
 "北里志十三則",
 "通幽記十四則",
 "傳奇十三則",
 "廣異記一百三十三則",
 "原化記二十三則",
 "紀聞四十一則",
 "宣室志八十三則",
 "逸史四十一則",
 "劇談錄十六則",
 "朝野僉載四十七則",
 "前定錄四十則",
 "河東記十八則",
 "乾𦠆子十七則",
 "定命錄十七則",
 "三水小牘十五則",
 "法苑珠林二十四則",
 "譚賓錄十一則",
 "杜陽雜編十三則",
 "雲溪友議十八則",
 "異聞集九則",
 "原仙記三則",
 "詳異記一則",
 "本事詩十四刖",
 "啟顏錄十六則",
 "幽閒鼓吹五則",
 "大唐奇事四則",
 "會昌解頤錄九則",
 "大唐新語七則",
 "仙傳拾遺二十五則",
 "玉泉子九則",
 "廣古今五行記六則",
 "瀟湘錄二十五則",
 "開天傳信記九則",
 "靈異記三則",
 "明皇雜錄十七則",
 "十二真君傳二則",
 "志怪三則",
 "八朝窮怪錄四則",
 "王氏見聞十五則",
 "冥報記七則",
 "甘澤謠三則",
 "戎幕閒談八則",
 "女仙傳三則",
 "續定命錄四則",
 "桂苑叢談五則",
 "御史臺記十一則",
 "因話錄四則",
 "南楚新聞五則",
 "羯鼓錄四則",
 "辨疑志四則",
 "水經一則",
 "陰德傳二則",
 "報應錄二則",
 "異聞錄一則",
 "于闐記",
 "陷北記",
 "耳目記六則",
 "鑒誡錄六則",
 "金華子五則",
 "錄異記十三則",
 "墉城集仙錄三則",
 "神仙感遇傳十七則",
 "釣磯立談一則",
 "唐闕史十二則",
 "唐摭言二十三則",
 "玉堂閒話四十五則",
 "開元天寶遺事二則",
 "稽神錄三十九則",
 "續仙傳七則",
 "中朝故事六則",
 "退士傳",
 "六一居士傳",
 "桑懌傳",
 "書張主客遺事",
 "書种放事",
 "書襄城公主事",
 "書賈偉節廟",
 "洪偓傳",
 "敘盜",
 "雜識二首",
 "東坡酒經",
 "方山子傳",
 "子姑神記",
 "天篆記",
 "孫少述傳",
 "趙延嗣傳",
 "錢乙傳",
 "玉友傳",
 "姚平仲小傳",
 "陳氏老傳",
 "書包明事",
 "書二公事",
 "記外大父祝公遺事",
 "書虞雍公守唐鄧事",
 "曹氏女傳",
 "一是居士傳",
 "北夢瑣言四十八則",
 "纂異記四則",
 "芝田錄六則",
 "甄異記二則",
 "野人閒話八則",
 "洛陽搢紳舊聞記八則",
 "茅亭客話十八則",
 "疑仙傳八則",
 "雞肋編十八則",
 "樂善錄十六則",
 "過庭錄十則",
 "泊宅編十則",
 "閒窗括異志三則",
 "東軒筆錄三十七則",
 "青箱雜記六則",
 "蒙齋筆錄（節錄巖下放言）四則",
 "畫墁錄六則",
 "游宦紀聞六則",
 "夢溪筆談四十六則",
 "墨莊漫錄十八則",
 "侍兒小名錄一則",
 "默記七則",
 "補侍兒小名錄五則",
 "續補侍兒小名錄三則",
 "嬾真子六則",
 "歸田錄十一則",
 "志林五則",
 "龍川別志十則",
 "澠水燕談錄十五則",
 "冷齋夜話七則",
 "續世說二十九則",
 "孔氏談苑三則",
 "鐵圍山叢談十一則",
 "老學菴筆記十八則",
 "雲麓漫鈔一則",
 "石林燕語十四則",
 "避暑錄話十六則",
 "清波雜志十二則",
 "墨客揮犀五則",
 "續墨客揮犀二則",
 "異聞總錄二十六則",
 "鶴林玉露九則",
 "儒林公議一則",
 "隨隱漫錄一則",
 "楓窗小牘三則",
 "厚德錄八則",
 "孫公談圃五則",
 "齊東野語三十三則",
 "癸辛雜識前集五則",
 "癸辛雜識後集六則",
 "癸辛雜識續集十一則",
 "癸辛雜識別集二則",
 "志雅堂雜鈔一則",
 "南部新書三則",
 "宣政雜錄一則",
 "朝野遺紀七則",
 "聞見雜錄三則",
 "諧史七則",
 "昨夢錄六則",
 "三朝野史一則",
 "談藪十三則",
 "清尊錄七則",
 "睽車志四則",
 "藏一話腴一則",
 "文昌雜錄二則",
 "錢氏私志七則",
 "高齋漫錄二則",
 "寓簡五則",
 "獨醒雜志十二則",
 "梁溪漫志七則",
 "聞見近錄一則",
 "甲申雜記三則",
 "隨手雜錄三則",
 "玉壺清話十九則",
 "萬柳溪邊舊話一則",
 "江南餘載一則",
 "江淮異人錄八則",
 "鬼董十四則",
 "嶺外代答七則",
 "耆舊續聞七則",
 "蘆浦筆記二則",
 "侯鯖錄三則",
 "曲洧舊聞十七則",
 "中吳紀聞三則",
 "北窗炙輠十一則",
 "佩韋齋輯聞一則",
 "岳陽風土記二則",
 "六朝事跡二則",
 "松漠紀聞五則",
 "五總志一則",
 "夷堅志一百八十六則",
 "容齋五筆四則",
 "友會談叢十一則",
 "可書一則",
 "碧湖雜記一則",
 "玄怪錄",
 "諧鐸",
 "螢窗異草初編",
 "子不語",
 "金壺七墨",
 "金壺遯墨",
 "金壺逸墨",
 "金壺戲墨",
 "金壺淚墨",
 "心影",
 "夜譚隨錄",
 "夜雨秋燈錄初集",
 "埋憂集",
 "墨餘錄",
 "閱微草堂筆記",
 "灤陽消夏錄",
 "如是我聞",
 "槐西雜志",
 "姑妄聽之",
 "灤陽續錄",
 "耳食錄",
 "庸盦筆記",
 "兩般秋雨盦隨筆",
 "湧幢小品",
 "舌華錄",
 "虞初新志",
 "虞初續志",
 "堅瓠首集",
 "六集",
 "七集",
 "八集",
 "九集",
 "十集",
 "漫遊紀略",
 "鷗陂漁話",
 "吹網錄",
 "獨醒雜誌",
 "夷堅志",
 "初月樓聞見錄",
 "歸田瑣記",
 "履園叢話",
 "貓苑",
 "谿上遺聞集錄",
 "島居隨錄",
 "雨窗消意錄",
 "池北偶",
 "聽雨軒筆記",
 "瀛壖雜志",
 "冷廬雜識",
 "硯北雜志",
 "昨非庵日纂",
 "台灣外記",
 "明齋小識",
 "退庵自訂年譜",
 "咫聞錄",
 "燕下鄉睉錄",
 "郎潛紀聞",
 "北行日譜",
 "附天香閣集",
 "南皋筆記",
 "宋艷",
 "客窗閒話初集",
 "熙朝新語",
 "北東園筆錄初編",
 "南燼紀聞",
 "海外紀事",
 "京麈雜錄",
 "酒令叢鈔",
 "黃孝子尋親紀程",
 "三借廬筆談",
 "識餘",
 "宜州家乘",
 "霞外麈談",
 "謏聞續筆",
 "古歡堂集雜著",
 "蜀都碎事",
 "藝文補遺",
 "三吳遊覽志",
 "增廣智囊補",
 "梅花草堂集",
 "千百年眼",
 "南滣楛話",
 "浪蹟叢譚",
 "續譚",
 "榆巢雜識",
 "暝庵雜識",
 "遊仙窟",
 "三國志平話",
 "照世盃",
 "補江總白猿傳",
 "編次鄭欽悅辨大同古銘論",
 "古嶽瀆經",
 "南柯太守傳",
 "盧江馮媼傳",
 "開元升平源",
 "鸎鸎傳",
 "湘中怨辭",
 "異夢錄",
 "秦夢記",
 "上清傳",
 "飛烟傳",
 "隋煬帝海山記",
 "流紅記",
 "譚意歌傳",
 "王榭傳",
 "稗邊小綴",
 "湘中怨詞",
 "貞娘墓詩",
 "李諅吹笛記",
 "紫花梨記",
 "錦裙記",
 "夜叉傳",
 "嬾真子錄五撰",
 "石林避暑錄話",
 "河南邵氏聞見錄",
 "邵氏聞見後錄",
 "燈下閑談",
 "武帝內傳",
 "閻典史傳",
 "費宮人傳",
 "近事叢",
 "太平天國別史（原名賊情彙纂）",
 "新刊全相平話武王伐紂書",
 "新刊全相平話樂毅圖齊七國春秋後集",
 "新刊全相秦併六國平話",
 "新刊全相平話前漢書續集",
 "至治新刊全相平話三國志",
 "玉嬌梨",
 "平山冷燕",
 "萬曆野獲編",
 "四友齋叢說",
 "續窈聞",
 "陶菴夢憶",
 "影梅菴憶語",
 "三儂贅人廣自序",
 "喬王二姬合傳",
 "秋鐙瑣憶",
 "美化文學名著年表",
 "史書佔畢",
 "七修類稿",
 "七修續稿",
 "冷盧雜識",
 "續子不語",
 "醉言",
 "關隴輿中偶憶編",
 "圓明園詞序",
 "金陵紀事雜詠",
 "秦淮感舊集",
 "張文襄幕府紀聞",
 "提牢瑣記",
 "八旗人著述存目",
 "光緒帝大婚粧奩單",
 "圓明園恭紀",
 "墨花吟館感舊懹人集",
 "避暑山莊紀事詩",
 "八旗詩媛小傳",
 "華嚴色相錄",
 "泰淮畫舫錄",
 "畫舫餘談",
 "冒氏小品四種",
 "今覺樓",
 "鐵菱角",
 "雙鸞配",
 "四命冤",
 "倒肥黿",
 "洲老虎",
 "自害自",
 "人擡人",
 "官業債",
 "錦堂春",
 "牛丞相",
 "狗狀元",
 "說𧏙螂",
 "飛蝴蝶",
 "村中俏",
 "關外緣",
 "假都天",
 "真菩薩",
 "老作孽",
 "附求嗣真銓",
 "少知非",
 "刻剝窮",
 "寬厚富",
 "斬刑廳",
 "埋積賊",
 "擲金杯",
 "還玉佩",
 "乩仙偈",
 "附往生奇逝傳",
 "亦佛歌",
 "枉貪賍",
 "空為惡",
 "三錠窟",
 "一文碑",
 "晦氣船",
 "魂靈帶",
 "得會銀",
 "失春酒",
 "旌烈妻",
 "剮淫婦",
 "定死期",
 "出死期",
 "通天樂",
 "長懽悅",
 "莫焦愁",
 "沈大漢",
 "麻小江",
 "追命鬼",
 "討債兒",
 "除魘魅",
 "打縣官",
 "下為上",
 "尊變卑",
 "投胎哭",
 "附六道因果圖說",
 "念佛功",
 "槐西雜誌",
 "竹窗隨筆",
 "病榻瑣談",
 "紫姬小傳",
 "心影（原名金壺淚墨）",
 "浪蹟叢談",
 "浪蹟續談",
 "新刊八仙出處東遊記",
 "南遊志傳",
 "西遊記傳",
 "新用北方真武祖師玄天上帝出身全傳",
 "北遊記玄帝出身傳",
 "道德真經",
 "文漿真經",
 "冲虛真經",
 "列子冲虛至德真經",
 "老子通義",
 "莊子通義",
 "列子通義",
 "鬳齋老子口義",
 "道德經釋辭",
 "金丹四百字註解",
 "文始經釋辭",
 "化書新聲",
 "南華真經田子方品殘卷",
 "老子義殘卷",
 "老子天應經",
 "南華真經正義不分卷南華真經識餘一卷",
 "靈寶无量度人上品妙經",
 "元始无量度人上品妙經直音",
 "元始說先天道德經註解",
 "无上內祕真藏經",
 "太上无極總真文昌大洞仙經",
 "上清大洞真經",
 "大洞玉經",
 "太上三十六部尊經",
 "太上一乘海空智藏經",
 "七寶莊嚴",
 "高上玉皇本行集經",
 "高上玉皇本行經髓",
 "高上玉皇心印經",
 "高上玉皇胎息經",
 "無上九霄玉清大梵紫微玄都雷霆玉經",
 "九天應元雷聲普化天尊玉樞寶經",
 "太上說朝天謝雷真經",
 "太上虛皇天尊四十九章經",
 "太上昇玄消災護命妙經",
 "三光注齡資福延壽妙經",
 "太上長生延壽集福德經",
 "元始五老赤書玉篇真文天書經",
 "太上諸天靈書度命妙經",
 "元始天尊說生天得道經",
 "元始天尊說得道了身經",
 "太上九天延祥滌厄四聖妙經",
 "元始天尊說北方真武妙經",
 "元始天尊說梓潼帝君應驗經",
 "元始天尊說梓潼帝君本願經",
 "元始八威龍文經",
 "混元陽符經",
 "上清黃氣陽精三道順行經",
 "藏月隱日",
 "太上開明天地本真經",
 "太上玄都妙本清靜身心經",
 "太上太玄女青三元品誡拔罪妙經",
 "元始天尊說變化空洞妙經",
 "太上昇玄三一融神變化妙經",
 "太上導引三光九變妙經",
 "太上導引三光寶真妙經",
 "太上修真體元妙道經",
 "玉清元始玄黃九光真經",
 "元始天尊說十一曜大消災神呪經",
 "太上洞真五星秘授經",
 "玉清无上靈寶自然北斗本生真經",
 "太乙元真保命長生經",
 "太上元始天尊證果真經",
 "太上元始天尊說續命妙經",
 "洞真太極北帝紫微神呪妙經",
 "太上說六甲直符保胎護命妙經",
 "太上元始天尊說大雨龍王經",
 "太上護國祈雨消魔經",
 "太上洞淵北帝天蓬護命消災神呪妙經",
 "太上洞淵辤瘟神呪妙經",
 "高上太霄琅書瓊文帝章經",
 "太上玉珮金璫太極金書上經",
 "上方天尊說真元通仙道經",
 "无上大乘要訣妙經",
 "元始洞真決疑經",
 "元始天尊說玄微妙經",
 "太上洞真賢門經",
 "元始天王歡樂經",
 "玉清胎元內養真經",
 "玉清元上內景真經",
 "太上真一報父母恩重經",
 "元始洞真慈善孝子報恩成道經",
 "太上元始天尊說消殄蟲蝗經",
 "太上安鎮九壘龍神妙經",
 "太上洞真安竈經",
 "太上元始天尊說金光明經",
 "元始天尊說三官寶號經",
 "元始天尊濟度血湖真經",
 "元始天尊說酆都滅罪經",
 "太上說九幽拔罪心印妙經",
 "元始天尊說甘露昇天神呪妙經",
 "元始說功德法食往生經",
 "太上玉華洞章拔亡度世昇仙妙經",
 "太上三洞神呪",
 "三洞神符記",
 "雲篆度人妙經",
 "洞真太微黃書天帝君石景金陽素經",
 "上清洞真元經五籍符",
 "白羽黑翮靈飛玉符",
 "上清瓊宮靈飛六甲左右上符",
 "太上洞真經洞章符",
 "太上祕法鎮宅靈符",
 "元始无量度人上品妙經四注",
 "元始无量度人上品妙經註",
 "元始无量度人上品妙經通義",
 "元始无量度人上品妙經內義",
 "附內義丹旨綱目舉要",
 "太上洞玄靈寶无量度人上品妙經註",
 "元始无量度人上品妙經註解",
 "太上洞玄靈寶无量度人上品經法",
 "洞玄靈寶度人經大梵隱語疏義",
 "洞玄靈寶无量度人經訣音義",
 "真藏經要訣",
 "太上靈寶諸天內音自然玉字",
 "諸天靈書度命妙經義疏",
 "九天應元雷聲普化天尊玉樞寶經集註",
 "太上昇玄說消災護命妙經註",
 "太上昇玄消災護命妙經註",
 "元始天尊說太古經註",
 "玉清无極總真文昌大洞仙經",
 "序圖",
 "上清大洞真經玉訣音義",
 "太上大通經註",
 "太上赤文洞古經註",
 "无上赤文洞古真經註",
 "黃帝陰符經集註",
 "黃帝陰符經講義",
 "黃帝陰符經集解",
 "黃帝陰符經注",
 "黃帝陰符經解",
 "黃帝陰符經注解",
 "黃帝陰符經解義",
 "陰符經三皇玉訣",
 "黃帝陰符經心法",
 "黃帝陰符經註",
 "黃帝陰符經註解",
 "黃帝陰符經夾頌解註",
 "太上求仙定錄尺素真訣玉文",
 "太霄琅書瓊文帝章訣",
 "胎息經註",
 "胎息祕要歌訣",
 "太清真人絡命訣",
 "太上洞房內經註",
 "陰真君還丹歌注",
 "崔公入藥鏡註解",
 "呂純陽真人沁園春丹詞註解",
 "青天歌註釋",
 "學仙辨真訣",
 "太上洞真凝神修行經訣",
 "上清握中訣",
 "紫陽真人悟真篇註疏",
 "紫陽真人悟真篇三註",
 "紫陽真人悟真直指詳說三乘祕要",
 "紫陽真人悟真篇拾遺",
 "悟真篇注釋",
 "紫陽真人悟真篇講義",
 "靈寶无量度人上品妙經符圖",
 "无量度人上品妙經旁通圖",
 "修真太極混元圖",
 "修真太極混元指玄圖",
 "金液還丹印證圖",
 "修真歷驗鈔圖",
 "龍虎手鑑圖",
 "上清太玄九陽圖",
 "三才定位圖",
 "上清洞真九宮紫房圖",
 "周易圖",
 "玄元十子圖",
 "上清三尊譜錄",
 "靈寶自然九天生神三寶大有金書",
 "元始上真衆仙記",
 "洞玄靈寶真靈位業圖",
 "元始高上玉檢大錄",
 "清河內傳",
 "梓潼帝君化書",
 "清微仙譜",
 "三茅真君加封事典",
 "金蓮正宗記",
 "金蓮正宗仙源像傳",
 "七真年譜",
 "玄風慶會錄",
 "太上洞真智慧上品大誡",
 "三洞衆戒文",
 "太微靈書紫文仙忌真記上經",
 "虛皇天尊初真十戒文",
 "太上九真妙戒金籙度命拔罪妙經",
 "太上十二上品飛天法輪勸戒妙經",
 "太極真人說二十四門戒經",
 "太真玉帝四極明科經",
 "太微仙君功過格",
 "太清五十八願文",
 "玄都律文",
 "太上靈寶朝天謝罪大懺",
 "太上玉清謝罪登真寶懺",
 "太上上清禳災延壽寶懺",
 "太上泰清拔罪昇天寶懺",
 "玉皇宥罪錫福寶懺",
 "高上玉皇滿願寶懺",
 "九天應元雷聲普化天尊玉樞寶懺",
 "雷霆玉樞宥罪法懺",
 "玉皇十七慈光燈儀",
 "上清十一大曜燈儀",
 "南斗延壽燈儀",
 "北斗七元星燈儀",
 "北斗本命延壽燈儀",
 "三官燈儀",
 "玄帝燈儀",
 "九天三茅司命仙燈儀",
 "萬靈燈儀",
 "五顯靈觀大帝燈儀",
 "土司燈儀",
 "東廚司命燈儀",
 "正一殟司辟毒神燈儀",
 "離明瑞象燈儀",
 "黃籙九陽梵炁燈儀",
 "黃籙九巵燈儀",
 "黃籙破獄燈儀",
 "黃籙五苦輪燈儀",
 "地府十王拔度儀",
 "上清天寶齋初夜儀",
 "太乙火府奏告祈禳儀",
 "清微玄樞奏告儀",
 "靈寶无量度人上經大法",
 "无上玄元三天玉堂大法",
 "无上三天玉堂正宗高奔內景玉書",
 "清微神烈祕法",
 "清微元降大法",
 "清微齋法",
 "太上九要心印妙經",
 "紫元君授道傳心法",
 "真龍虎九仙經",
 "龍虎中丹訣",
 "九還七返龍虎金丹析理真訣",
 "諸真論還丹訣",
 "真一金丹訣",
 "還丹祕訣養赤子神方",
 "還丹衆仙論",
 "修丹妙用至理論",
 "丹經極論",
 "金晶論",
 "還丹顯妙通幽集",
 "元陽子金液集",
 "還丹金液歌註",
 "玉清金笥青華祕文金寶內鍊丹訣",
 "碧虛子親傳直指",
 "紙舟先生金真直指",
 "陳虛白規中指南",
 "大丹直指",
 "玉谿子丹經指要",
 "西山羣仙會真記",
 "會真集",
 "啟真集",
 "中和集",
 "三天易髓",
 "全真集玄祕要",
 "谷神篇",
 "金闕帝君三元真一經",
 "大洞金華玉經",
 "太微靈書紫文琅玕華丹神真上經",
 "玉景九天金霄威神王祝太元上經",
 "洞真太微黃書九天八籙真文",
 "太玄八景籙",
 "陶真人內丹賦",
 "擒玄賦",
 "金丹賦",
 "谷神賦",
 "修真十書",
 "雜著指玄篇",
 "金丹大成集",
 "鍾呂傳道集",
 "雜著捷徑",
 "玉隆集",
 "上清集",
 "武夷集",
 "盤山語錄",
 "黃庭內景五藏六府圖",
 "黃庭內景玉經註",
 "外景玉經註",
 "真氣還元銘",
 "還丹歌訣",
 "金液還丹百問訣",
 "上乘修真三要",
 "乾元子三始論",
 "至真子龍虎大丹詩",
 "破迷正道歌",
 "太玄朗然子進道詩",
 "了明篇",
 "明道篇",
 "真仙祕傳火候法",
 "三極至命筌蹄",
 "析疑指迷論",
 "修真精義雜論",
 "清微丹訣",
 "先天金丹大道玄奧口訣",
 "金液大丹口訣",
 "抱一子三峯老人丹訣",
 "太上登真三矯靈應經",
 "靈臺經",
 "秤星靈臺祕要經",
 "歷世真仙體道通鑑",
 "桓真人升仙記",
 "紫陽真人內傳",
 "茅山志",
 "純陽帝君神化妙通紀",
 "大華希夷志",
 "西嶽華山誌",
 "凝陽董真人遇仙記",
 "諸師真誥",
 "金籙齋三洞讚詠儀",
 "黃帝陰符經頌",
 "太上昇玄消災護命妙經頌",
 "生天經頌解",
 "三洞讚頌靈章",
 "宋真宗御製玉京集",
 "太上濟度章赦",
 "靈寶天尊說洪恩靈濟真君妙經",
 "洞玄靈寶自然九天生神章經",
 "洞玄靈寶本相運度劫期經",
 "洞玄靈寶丹水飛術運度小劫妙經",
 "洞玄靈寶諸天世界造化經",
 "太上靈寶天地運度自然妙經",
 "太上洞玄靈寶三元無量壽經",
 "上清五常變通萬化鬱冥經",
 "太上洞玄靈寶智慧定志通微經",
 "太上洞玄靈寶觀妙經",
 "太上洞玄靈寶天尊說大通經",
 "太上洞玄靈寶護諸童子經",
 "太上洞玄靈寶開演祕密藏經",
 "太上洞玄靈寶真文要解上經",
 "太上黃庭內景玉經",
 "外景玉經",
 "靈寶天尊說祿庫受生經",
 "太上靈寶元陽妙經",
 "太上洞淵神呪經",
 "太上洞玄靈寶業報因緣經",
 "太上洞玄靈寶十號功德因緣妙經",
 "太上洞玄靈寶宿命因緣明經",
 "太上洞玄靈寶出家因緣經",
 "太上洞玄靈寶轉神度命經",
 "太上洞玄靈寶十師度人妙經",
 "太上洞玄靈寶太玄普慈勸世經",
 "太上洞玄靈寶四方大願經",
 "太上洞玄靈寶智慧本願大戒上品經",
 "太上洞玄靈寶誡業本行上品妙經",
 "太上洞玄靈寶真一勸誡法輪妙經",
 "太上玄一真人說妙通轉神入定經",
 "太上玄一真人說勸誡法輪妙經",
 "太上洞玄靈寶法燭經",
 "太上靈寶智慧觀身經",
 "太一救苦護身妙經",
 "太上洞玄靈寶赤書玉訣妙經",
 "上清金匱玉鏡修真指玄妙經",
 "上清三元玉檢三元布經",
 "太上洞玄靈寶福日妙經",
 "洞玄靈寶上師說救護身命經",
 "太上靈寶天尊說禳災度厄經",
 "太上神呪延壽妙經",
 "太上洞玄靈寶消禳火災經",
 "太上洞玄靈寶天尊說養蠶營種經",
 "太上洞玄靈寶八威召龍妙經",
 "太上洞淵說請雨龍王經",
 "太上召諸神龍安鎮墳墓經",
 "太上靈寶補謝竈王經",
 "太上說利益蠶王妙經",
 "太上說牛瀇妙經",
 "上清洞玄明燈上經",
 "太上洞玄寶元上經",
 "自然經",
 "太上洞玄靈寶滅度五鍊生尸妙經",
 "太上洞玄靈寶三元玉京玄都大獻經",
 "太上洞玄靈寶三塗五苦拔度生死妙經",
 "太上道君說解冤拔度妙經",
 "太上洞玄靈寶往生救苦妙經",
 "太上洞玄靈寶救苦妙經",
 "太上洞玄靈寶天尊說濟苦經",
 "太上洞玄靈寶淨供妙經",
 "太上靈寶洪福滅罪像名經",
 "太上救苦天尊說消愆滅罪經",
 "太上說酆都拔苦愈樂妙經",
 "洞玄靈寶道要經",
 "洞玄靈寶飛仙上品妙經",
 "太上靈寶天尊說延壽妙經",
 "太上七星神呪經",
 "太上虛皇保生神呪經",
 "太上洞玄三洞開天風雷禹步制魔神呪經",
 "太上洞淵三昧帝心光明正印太極紫微伏魔制鬼拯救惡道集福吉祥神呪",
 "太上三生解冤妙經",
 "太上靈寶五符序",
 "太上洞玄靈寶素靈真符",
 "太上洞玄靈寶五嶽神符",
 "上清金母求仙上法",
 "上清豁落七元符",
 "太上洞玄靈寶大綱鈔",
 "上清太一金闕玉璽金真紀",
 "太上洞玄靈寶投簡符文要訣",
 "洞玄靈寶自然九天生神章經解義",
 "洞玄靈寶自然九天生神玉章經解",
 "洞玄靈寶自然九天生神章經注",
 "太上洞玄靈寶天尊說救苦妙經註解",
 "洞玄靈寶定觀經註",
 "黃庭內外玉景經解",
 "上清丹元玉真帝皇飛仙上經",
 "上清紫精君皇初紫靈道居洞房上經",
 "上清紫微帝君南極元君玉經寶訣",
 "靈寶大鍊內旨行持機要",
 "上清胎精記解結行事訣",
 "上清華晨三奔玉訣",
 "太上洞玄靈寶衆簡文",
 "太上洞玄靈寶五帝醮祭招真玉訣",
 "上清佩符文青券訣",
 "上清佩符文白券訣",
 "上清佩符文絳券訣",
 "上清佩符文黑券訣",
 "上清佩符文黃卷訣",
 "太上大道三元品誡謝罪上法",
 "固氣還神九轉瓊丹論",
 "靈寶衆真丹訣",
 "神仙服餌丹石行藥法",
 "登真隱訣",
 "上清三真旨要玉訣",
 "上清洞真解過訣",
 "上清明堂元真經訣",
 "上清太極隱注玉經寶訣",
 "上清太上八素真經",
 "上清修行經訣",
 "太上飛行九晨玉經",
 "上清長生寶鑑圖",
 "上清八道祕言圖",
 "上清舍象劍鑑圖",
 "黃庭內景五臟六腑補瀉圖",
 "七域修真證品圖",
 "玄覽人鳥山經圖",
 "太上玉晨鬱儀結璘奔日月圖",
 "上方大洞真元妙經品",
 "上方大洞真元妙經圖",
 "上方大洞真元陰陽陟降圖書後解",
 "上方大洞真元圖書繼說終篇",
 "許太中真君圖傳",
 "洞玄靈寶五嶽古本真形圖",
 "上清後聖道君列紀",
 "上清高上玉真衆道綜監寶諱",
 "洞玄靈寶三師記",
 "洞玄靈寶三師名諱形狀居觀方所文",
 "上清衆經諸真聖祕",
 "許真君仙傳",
 "西山許真君八十五化錄",
 "孝道吳許二真君傳",
 "太極葛仙公傳",
 "雲阜山申仙翁傳",
 "南嶽九真人傳",
 "太上洞玄靈寶上品戒經",
 "太上玄一真人說三途五苦勸戒經",
 "太上洞玄靈寶三元品戒功德輕重經",
 "太上洞玄靈寶智慧罪根上品大戒經",
 "上清衆真教戒德行經",
 "洞玄靈寶天尊說十戒經",
 "太上洞玄靈寶宣戒首悔衆罪保護經",
 "上清骨髓靈文鬼律",
 "太上洞玄靈寶法身製論",
 "要修科儀戒律鈔",
 "齋戒籙",
 "靈寶領教濟度金書",
 "嗣教籙",
 "大明玄教立成齋醮儀範",
 "洪恩靈濟真君自然行道儀",
 "洪恩靈濟真君集福宿啟儀",
 "洪恩靈濟真君集福早朝儀",
 "洪恩靈濟真君集福午朝儀",
 "洪恩靈濟真君集福晚朝儀",
 "洪恩靈濟真君祈謝設醮科",
 "洪恩靈濟真君禮願文",
 "洪恩靈濟真君七政星燈儀",
 "洪恩靈濟真君事實",
 "羅天大醮早朝科",
 "羅天大醮午朝科",
 "羅天大醮晚朝科",
 "羅天大醮設醮儀",
 "玄門報孝追薦儀",
 "諸師聖誕冲舉酌獻儀",
 "金籙齋啟壇儀",
 "金籙大齋宿啟儀",
 "金籙大齋啟盟儀",
 "金籙大齋補職說戒儀",
 "金籙早朝儀",
 "金籙午朝儀",
 "金籙晚朝儀",
 "金籙齋懺方儀",
 "金籙解壇儀",
 "金籙設醮儀",
 "金籙放生儀",
 "金籙祈壽早朝儀",
 "金籙祈壽午朝儀",
 "金籙祈壽晚朝儀",
 "金籙上壽三獻儀",
 "金籙延壽設醮儀",
 "玄靈轉經早朝行道儀",
 "玄靈轉經午朝行道儀",
 "玄靈轉經晚朝行道儀",
 "金籙十迴度人早朝開收儀",
 "金籙十迴度人午朝開收儀",
 "金籙十迴度人晚朝開收儀",
 "金籙十迴度人早朝轉經儀",
 "金籙十迴度人午朝轉經儀",
 "金籙十迴度人晚朝轉經儀",
 "金籙齋投簡儀",
 "玉籙資度宿啟儀",
 "玉籙資度解壇儀",
 "王籙資度設醮儀",
 "玉籙資度早朝儀",
 "玉籙資度午朝儀",
 "玉籙資度晚朝儀",
 "玉籙生神資度轉經儀",
 "玉籙生神資度開收儀",
 "玉籙大齋第一日早朝儀",
 "玉籙大齋第一日午朝儀",
 "玉籙大齋第一日晚朝儀",
 "玉籙大齋第二日早朝儀",
 "玉籙大齋第二日午朝儀",
 "玉籙大齋第二日晚朝儀",
 "玉籙大齋第三日早朝儀",
 "玉籙大齋第三日午朝儀",
 "玉籙濟幽判斛儀",
 "太上黃籙齋儀",
 "无上黃籙大齋立成儀",
 "附修書本末",
 "黃籙救苦十齋轉經儀",
 "黃籙十念儀",
 "黃籙五老悼亡儀",
 "黃籙齋十天尊儀",
 "黃籙齋十洲三島拔度儀",
 "黃籙九幽醮無碍夜齋次第儀",
 "洞玄靈寶河圖仰謝三十六天齋儀",
 "洞玄靈寶河圖仰謝三十六土皇齋儀",
 "靈寶半景齋儀",
 "神功妙濟真君禮文",
 "太上靈寶玉匱明真齋懺方儀",
 "太上靈寶至匱明真大齋懺方儀",
 "太上靈寶玉匱明真大齋言功儀",
 "洞玄度靈寶自然券儀",
 "洞玄靈寶自然齋儀",
 "洞玄靈寶齋說光燭戒罰燈祝願儀",
 "太上洞淵三昧神呪齋懺謝儀",
 "太上洞淵三昧神呪齋清旦行道儀",
 "太上洞淵三昧神呪齋十方懺儀",
 "太上洞玄靈寶授度儀",
 "靈寶五經提綱",
 "洞玄靈寶玉籙簡文三元威儀自然真經",
 "洞玄靈寶鐘磬威儀經",
 "太極真人敷靈寶齋戒威儀諸經要訣",
 "太上靈寶上元天官消愆滅罪懺",
 "太上靈寶中元地官消愆滅罪懺",
 "太上靈寶下元水官消愆滅罪懺",
 "太上玄司滅罪紫府消災法懺",
 "太上消滅地獄昇陟天堂懺",
 "太上救苦天尊說拔度血湖寶懺",
 "青玄救苦寶懺",
 "慈尊昇度寶懺",
 "東嶽大生寶懺",
 "太上靈寶十方應號天尊懺",
 "太上慈悲道場消災九幽懺",
 "太上慈悲九幽拔罪懺",
 "太上慈悲道場滅罪水懺",
 "靈寶玉鑑",
 "太極祭鍊內法",
 "內法議略",
 "上清天樞院回車畢道正法",
 "許真君受鍊形神上清畢道法要節文",
 "天樞院都居須知令",
 "天樞院都居須知格",
 "靈寶淨明天樞都司法院須知法文",
 "靈寶淨明院教師周真公起請畫",
 "高上月宮太陰元君孝道仙王靈寶淨明黃素書",
 "靈寶淨明黃素書釋義祕訣",
 "太上靈寶淨明入道品",
 "靈寶淨明院真師密誥",
 "太上靈寶淨明法印式",
 "靈寶淨明大法萬道玉章祕訣",
 "太上靈寶淨明祕法篇",
 "靈寶淨明新修九老神印伏魔祕法",
 "太上靈寶淨明飛仙度人經法",
 "釋例",
 "太上淨明補奏職局太玄都省須知",
 "上清天心正法",
 "上清北極天心正法",
 "靈寶歸空訣",
 "上清大洞九宮朝修祕訣上道",
 "靈劍子",
 "靈劍子引導子午記",
 "養命機關金丹真訣",
 "玄珠歌",
 "玄珠心鏡註",
 "抱一函三祕訣",
 "存神固氣論",
 "攝生纂錄",
 "養生祕錄",
 "玄圃山靈⿷匚金祕籙",
 "靈寶六丁祕法",
 "魁罡六鎖祕法",
 "太上三辟五解祕法",
 "上清六甲祈禱祕法",
 "貫斗忠孝五雷武侯祕法",
 "黃帝太乙八門入式訣",
 "黃帝太一八門入式祕訣",
 "黃帝太一八門逆順生死訣",
 "太上赤文洞神三籙",
 "道教靈驗記",
 "神仙感遇傳",
 "歷代崇道記",
 "體玄真人顯異錄",
 "仙苑編珠",
 "道迹靈仙記",
 "洞天福地嶽瀆名山記",
 "梅仙觀記",
 "仙都志",
 "天台山志",
 "四明洞天丹山圖詠集",
 "南岳總勝集",
 "玉音法事",
 "上清諸真章頌",
 "太上洞玄靈寶智慧禮讚",
 "靈寶九幽長夜起尸度亡玄章",
 "洞玄靈寶六甲玉女上宮歌章",
 "上清侍帝晨桐栢真人真圖讚",
 "衆仙讚頌靈章",
 "洞玄靈寶昇玄步虛章序疏",
 "赤松子章曆",
 "太上宣慈助化章",
 "靈寶淨明院行遺式",
 "天樞院都司須知行遺式",
 "太上老君說常清靜妙經",
 "太上玄靈斗姆大聖元君本命延生心經",
 "太上玄靈北斗本命延生真經",
 "太上玄靈北斗本命長生妙經",
 "太上說南斗六司延壽度人妙經",
 "太上說東斗主算護命妙經",
 "太上說西斗記名護命妙經",
 "太上說中斗大魁保命妙經",
 "太上說中斗大魁掌算伏魔神呪經",
 "太上北斗二十八章經",
 "太上老君說救生真經",
 "太上老君說消災經",
 "太上太清天童護命妙經",
 "太上泰清皇老帝君運雷天章隱梵仙經",
 "太上老君說安宅八陽經",
 "太上老君說補謝八陽經",
 "太上說十鍊生神救護經",
 "太上飛步五星經",
 "太上飛步南斗太微玉經",
 "皇天上清金闕帝君靈書紫文上經",
 "洞神八帝妙精經",
 "太上老君內觀經",
 "太上老君說了心經",
 "太上老君內丹經",
 "太上內丹守一真定經",
 "太上老君內日用妙經",
 "太上老君外日用妙經",
 "太上說轉輪五道宿命因緣經",
 "太上化道度世仙經",
 "太上老君說天妃救苦靈驗經",
 "太上老君說長生益算妙經",
 "太上洞神三元妙本福壽真經",
 "太上老君說解釋呪詛經",
 "太上老君說五斗金章受生經",
 "太上洞神天公消魔護國經",
 "太上說紫微神兵護國消魔經",
 "太上日月混元經",
 "太上洞神五星諸宿日月混常經",
 "太上妙始經",
 "太上浩元經",
 "混元八景真經",
 "老子像名經",
 "太上老君說報父母恩重經",
 "玄天上帝說報父母恩重經",
 "道德經古本篇",
 "西昇經",
 "無上妙道文始真經",
 "太上無極大道自然真一五稱符上經",
 "太上老君說益算神符妙經",
 "太上老君混元三部符",
 "無上三元鎮宅靈籙",
 "上清丹天三氣玉皇六辰飛綱司命大籙",
 "大明太祖高皇帝御註道德真經",
 "唐玄宗御註道德真經",
 "唐玄宗御製道德真經疏",
 "宋徽宗御解道德真經",
 "宋徽宗道德真經解義",
 "道德真經解",
 "道德真經四子古道集解",
 "道德真經三解",
 "道德真經直解",
 "道德真經論",
 "道德真經新註",
 "道德真經疏義",
 "道德真經全解",
 "道德真經次解",
 "道經異同字",
 "德經異同字",
 "道德真經章句訓頌",
 "道德會元",
 "序例",
 "道德真經口義",
 "道德玄經原旨",
 "玄經原旨發揮",
 "道德真經集註",
 "道德真經玄德纂疏",
 "道德真經集義",
 "道德真經藏室纂微篇",
 "開題",
 "道德真經藏室纂微開題科文疏五卷纂微手鈔",
 "道德真經衍義手鈔",
 "道德真經取善集",
 "道德真經義解",
 "大旨",
 "道德真經廣聖義",
 "西昇經集註",
 "文始真經註",
 "文始真經言外旨",
 "冲虛至德真經鬳齋口義",
 "冲虛至德真經解",
 "冲虛至德真經義解",
 "冲虛至德真經四解",
 "冲虛至德真經釋文",
 "南華真經口義",
 "餘事",
 "南華真經直音",
 "南華邈",
 "莊子內篇訂正",
 "南華真經循本",
 "通玄真經註",
 "洞靈真經註",
 "通玄真經纘義",
 "太上玄靈北斗本命延生真經註",
 "太上玄靈北斗本命延生真經註解",
 "太上玄靈北斗本命延生經註",
 "附北斗七元金玄羽章",
 "太上說玄天大聖真武本傳神呪妙經",
 "太上老君說常清靜經註",
 "清靜經註",
 "太上老君說常清靜妙經纂圖解註",
 "太上老君元道真經註解",
 "太上太清天童護命妙經註",
 "老子說五廚經註",
 "太上三元飛星冠禁金書玉籙圖",
 "上清金闕帝君五斗三一圖訣",
 "四氣攝生圖",
 "太上通靈八史聖文真形圖",
 "圖經衍義本草",
 "圖經集註衍義本草",
 "混元聖紀",
 "太上老君年譜要略",
 "太上老君金書內序",
 "太上混元老子史略",
 "猶龍傳",
 "真武靈應真君增上佑聖尊號冊文",
 "章獻明肅皇后受上清畢法籙記",
 "華蓋山浮丘王郭三真君事實",
 "唐鴻臚卿越國公靈虛見素真人傳",
 "地祇上將溫太保傳",
 "玄品錄",
 "大滌洞天記",
 "墉城集仙錄",
 "太上老君戒經",
 "老君音誦誡經",
 "太上老君經律",
 "太上經戒",
 "三洞法服科戒文",
 "正一法文天師教戒科經",
 "女青鬼律",
 "正一威儀經",
 "玄門十事威儀",
 "太清道德顯化儀",
 "正一解戹醮儀",
 "正一出官章儀",
 "太上三五正一盟威閱籙醮儀",
 "太上正一閱籙儀",
 "正一指教齋儀",
 "正一指教齋清旦行道儀",
 "正一敕壇儀",
 "正一醮宅儀",
 "正一醮墓儀",
 "太上洞神三皇儀",
 "洞神三皇七十二君齋方懺儀",
 "太上洞神太元河圖三元仰謝儀",
 "太上金書玉諜寶章儀",
 "天心正法脩真道場設醮儀",
 "太上三洞傳授道德經紫虛籙拜表儀",
 "太上三五傍救醮五帝斷殟儀",
 "太上消災祈福醮儀",
 "太上金櫃玉鏡延生洞玄燭幽懺",
 "太上瑤臺益算寶籍延年懺",
 "太上正一朝天三八謝罪法懺",
 "真武靈應護世消災滅罪寶懺",
 "北極真武普慈度世法懺",
 "北極真武佑聖真君禮文",
 "太清中黃真經",
 "太清導引養生經",
 "太上養生胎息氣經",
 "太清調氣經",
 "太上老君養生訣",
 "太清服氣口訣",
 "莊周氣訣解",
 "嵩山太无先生氣經",
 "延陵先生集新舊服氣經",
 "諸真聖胎神用訣",
 "胎息抱一歌",
 "幼真先生服內元炁訣",
 "胎息精微論",
 "服氣精義論",
 "氣法要妙至訣",
 "上清司命茅真君修行指迷訣",
 "神氣養形論",
 "存神鍊氣銘",
 "保生銘",
 "神仙食炁金櫃妙錄",
 "養性延命錄",
 "三洞樞機雜說",
 "彭祖攝生養性論",
 "孫真人攝養論",
 "抱朴子養生論",
 "養生詠玄集",
 "神仙服食靈草菖蒲丸方傳",
 "上清經真丹祕訣",
 "太清經斷榖法",
 "太上肘後玉經方",
 "混俗頤生錄",
 "修真祕錄",
 "三元延壽參賛書",
 "太上保真養生論",
 "養生辯疑訣",
 "太上三皇寶齋神仙上錄經",
 "太清金闕玉華仙書八極神章三皇內祕文",
 "三皇內文遺祕",
 "祕藏通玄變化六陰洞微遁甲真經",
 "太上洞神玄妙白猿真經",
 "太上通玄靈印經",
 "上清鎮元榮靈經",
 "太上六壬明鑑符陰經",
 "顯道經",
 "神仙鍊丹點鑄三元寶照法",
 "元陽子五假論",
 "太清元極至妙神珠玉顆經",
 "天老神光經",
 "鬼谷子天髓靈文",
 "先天玄妙玉女太上聖母資傳仙道",
 "思印氣訣法",
 "北斗治法武威經",
 "太上除三尸九蟲保生經",
 "太上老君玄妙枕中內德神呪經",
 "黃庭遁甲緣身經",
 "紫庭內祕訣修行法",
 "太上老君大存思圖注訣",
 "太上五星七元空常訣",
 "上玄高真延壽赤書",
 "紫團丹經",
 "上清金書玉字上經",
 "太清金液神丹經",
 "太清石壁記",
 "太清金液神氣經",
 "太清經天師口訣",
 "太清修丹祕訣",
 "黃帝九鼎神丹經訣",
 "九轉靈砂大丹資聖玄經",
 "張真人金石靈砂論",
 "魏伯陽七返丹砂訣",
 "太極真人九轉還丹經要訣",
 "大洞鍊真寶經修伏靈砂妙訣",
 "大洞鍊真寶經九還金丹妙訣",
 "太上衛靈神化九轉丹砂法",
 "九轉靈砂大丹",
 "九轉青金靈砂丹",
 "陰陽九轉成紫金點化還丹訣",
 "玉洞大神丹砂真要訣",
 "靈砂大丹祕訣",
 "碧玉朱砂寒林玉樹匱",
 "大丹記",
 "丹房須知",
 "稚川真人校證術",
 "純陽呂真人藥石製",
 "金碧五相類參同契",
 "參同契五相類祕要",
 "陰真君金石五相類",
 "金石簿五九數訣",
 "上清九真中經內訣",
 "龍虎還丹訣",
 "金華玉液大丹",
 "感氣十六轉金丹",
 "修鍊大丹要旨",
 "通幽訣",
 "金華冲碧丹經祕旨",
 "還丹肘後訣",
 "蓬萊山西竈還丹歌",
 "抱朴子神仙金汋經",
 "諸家神品丹法",
 "鉛汞甲庚至寶集成",
 "丹房奧論",
 "指歸集",
 "還金述",
 "大丹鉛汞論",
 "真元妙道要略",
 "丹方鑑源",
 "大還丹照鑑",
 "太清玉碑子",
 "懸解錄",
 "軒轅黃帝水經藥法",
 "三十六水法",
 "巨勝歌",
 "白雲仙人靈草歌",
 "種芝草法",
 "太白經",
 "丹論訣旨心鑑",
 "大還心鑑",
 "大還丹金虎白龍論",
 "大丹篇",
 "大丹問答",
 "金木萬靈論",
 "紅鉛入黑鉛訣",
 "通玄祕術",
 "靈飛散傳信錄",
 "鴈門公妙解錄",
 "玄霜掌上錄",
 "太極真人雜丹藥方",
 "玉清內書",
 "神仙養生祕術",
 "太古土兌經",
 "上洞心丹經訣",
 "許真君石函記",
 "九轉流珠神仙九丹經",
 "庚道集",
 "太上混元真錄",
 "終南山祖庭仙真內傳",
 "終南山說經臺歷代真仙碑記",
 "古樓觀紫雲衍慶集",
 "玄天上帝啟聖錄",
 "大明玄天上帝瑞應圖錄",
 "玄天上帝啟聖靈異錄",
 "武當福地總真集",
 "武當紀勝",
 "集",
 "西川青羊宮碑銘",
 "宋東太一宮碑銘",
 "宋西太乙宮碑銘",
 "宋中太乙宮碑銘",
 "龍角山記",
 "天壇王屋山聖迹記",
 "唐王屋山中巖臺正一先生廟碣",
 "唐嵩高山啟母廟碑銘",
 "宮觀碑誌",
 "甘水仙源錄",
 "太上老君說常清靜經頌註",
 "北斗七元金玄羽章",
 "太上洞神五星讚",
 "道德經篇章玄頌",
 "道德真經頌",
 "明真破妄章頌",
 "諸真歌頌",
 "大明御製玄教樂章",
 "太上三洞表文",
 "萃善錄",
 "玄精碧匣靈寶聚玄經",
 "太上洞玄靈寶三一五氣真經",
 "太上清靜元洞真文玉字妙經",
 "太上洞玄靈寶天關經",
 "上清無英真童合遊內變玉經",
 "上清神寶洞房真諱上經",
 "洞玄靈寶九真人五復三歸行道觀門經",
 "太上長文大洞靈寶幽玄上品妙經",
 "太上長文大洞靈寶幽玄上品妙經發揮",
 "上清祕道九精回曜合神上真玉經",
 "上清太淵神龍瓊胎乘景上玄玉章",
 "淵源道妙洞真繼篇",
 "古文龍虎上經註",
 "附讀龍虎經",
 "周易參同契註",
 "周易參同契注",
 "周易參同契分章通真義",
 "周易參同契鼎器歌明鏡圖",
 "周易參同契釋疑",
 "金鎖流珠引",
 "道樞",
 "黃帝內經素問補註釋文",
 "黃帝內經靈樞略",
 "黃帝素問靈樞集註",
 "素問六氣玄珠密語",
 "黃帝八十一難經纂圖句解",
 "註義圖序論",
 "至言總",
 "太玄寶典",
 "道體論",
 "坐忘論",
 "大道論",
 "心目論",
 "三論元旨",
 "皇極經世",
 "靈棊本章正經",
 "太上修真玄章",
 "海客論",
 "悟玄篇",
 "太虛心淵篇",
 "玄珠錄",
 "雲宮法語",
 "宗玄先生文集",
 "宗玄先生玄綱論",
 "南統大君內丹九章經",
 "純陽真人渾成集",
 "晉真人語錄",
 "丹陽真人語錄",
 "無為清靜長生真人至真語錄",
 "盤山棲雲王真人語錄",
 "清庵瑩蟾子語錄",
 "上清太玄集",
 "洞淵集",
 "玄教大公案",
 "玄宗直指萬法同歸",
 "上陽子金丹大要",
 "上陽子金丹大要圖",
 "上陽子金丹大要列仙誌",
 "上陽子金丹大要仙派",
 "原陽子法語",
 "金丹直指",
 "道禪集",
 "還真集",
 "道玄篇",
 "隨機應化錄",
 "修鍊須知",
 "玉室經",
 "真人高象先金丹歌",
 "金丹真一論",
 "金丹四百字",
 "龍虎還丹訣頌",
 "龍虎元旨",
 "龍處還丹訣",
 "內丹祕訣",
 "漁莊邂逅錄",
 "金丹正宗",
 "還丹復命篇",
 "愛清子至命篇",
 "翠虛篇",
 "還源篇",
 "還丹至藥篇",
 "亶甲集",
 "金液大丹詩",
 "證道歌",
 "內丹訣",
 "洞元子內丹訣",
 "內丹還元訣",
 "長生指要篇",
 "太平經",
 "太平經聖君祕旨",
 "太上靈寶淨明洞神上品經",
 "太上靈寶淨明玉真樞真經",
 "太上靈寶淨明道元正印經",
 "太上靈寶淨明天尊說禦殟經",
 "太上靈寶首入淨明四規明鑑經",
 "太上靈寶淨明九仙水經",
 "太上靈寶淨明中黃八柱經",
 "淨明忠孝全書",
 "太玄真一本際妙經",
 "洞玄靈寶八仙王教誡經",
 "太上洞玄靈寶國王行道經",
 "太上洞玄靈寶本行宿緣經",
 "太上洞玄靈寶本行因緣經",
 "洞玄靈寶太上真人問疾經",
 "太極左仙公說神符經",
 "太上洞玄靈寶飛行三界通微內思妙經",
 "洞玄靈寶玄一真人說生死輪轉因緣經",
 "太上洞玄靈寶中和經",
 "太上洞玄靈寶三十二天天尊應號經",
 "太上靈寶昇玄內教經中和品述議疏",
 "一切道經音義妙門由起",
 "洞玄靈寶玄門大義",
 "洞玄靈寶三洞奉道科戒營始",
 "洞玄靈寶道學科儀",
 "陸先生道門科略",
 "道門經法相承次序",
 "道教義樞",
 "道典論",
 "太上妙法本相經",
 "上清道類事相",
 "上方靈寶无極至道開化真經",
 "上方鈞天演範真經",
 "太平兩同書",
 "洞玄靈寶左玄論",
 "上清太玄鑑誡論",
 "無上祕要",
 "三洞珠囊",
 "雲山集",
 "仙樂集",
 "漸悟集",
 "草堂集",
 "自然集",
 "玄虛子鳴真集",
 "葆光集",
 "西雲集",
 "勿齋先生文集",
 "洞玄金玉集",
 "丹陽神光燦",
 "悟真集",
 "雲光集",
 "重陽全真集",
 "重陽教化集",
 "重陽分梨十化集",
 "重陽真人金關玉鎖訣",
 "馬自然金丹口訣",
 "重陽真人授丹陽二十四訣",
 "磻溪集",
 "太古集",
 "孫真人備急千金要方",
 "仙傳外科祕方",
 "法海遺珠",
 "太上老君中經",
 "太上老君清靜心經",
 "太上老君說上七滅罪集福妙經",
 "孫子註解",
 "集註太玄經",
 "橐籥子",
 "附陰丹內篇",
 "天機經",
 "祕傳正陽真人靈寶畢法",
 "大惠靜慈妙樂天尊說福德五聖經",
 "太上正一呪鬼經",
 "太上洞玄靈寶天尊說羅天大醮上品妙經",
 "老君變化無極經",
 "太上金華天尊救劫護命妙經",
 "無上三天法師說廕育眾生妙經",
 "太上說青玄雷令法行因地妙經",
 "上清太霄隱書元真洞飛二景經",
 "洞玄靈寶太上六齋十直聖紀經",
 "道要靈祇神鬼品經",
 "洞神八帝元變經",
 "太上三天正法經",
 "太上正一法文經",
 "三天內解經",
 "上清明鑑要經",
 "太上明鑑真經",
 "太上三五正一盟威籙",
 "太上正一盟威法籙",
 "正一法文十籙召儀",
 "附正一法文傳都功版儀",
 "醮三洞真文五法正一盟威籙立成儀",
 "太上玄天真武無上將軍籙",
 "高上大洞文昌司祿紫陽寶籙",
 "太上北極伏魔神呪殺鬼籙",
 "太上正一延生保命籙",
 "太上正一解五音呪詛祕籙",
 "正一法文經章官品",
 "高上神霄玉清真王紫書大法",
 "道法會元",
 "上清靈寶大法",
 "道門定制",
 "道門科範大全集",
 "道門通教必用集",
 "太上助國救民總真祕要",
 "正一論",
 "全真坐鉢捷法",
 "太平御覽道部",
 "道書援神契",
 "道門十規",
 "重陽立教十五論",
 "丹陽真人直言",
 "全真清規",
 "太上出家傳度儀",
 "三洞修道儀",
 "傳授經戒儀注訣",
 "正一修真略儀",
 "洞玄靈寶道士受三洞經誡法籙擇日曆",
 "傳授三洞經戒法籙略說",
 "正一法文法籙部儀",
 "正一法文太上外籙儀",
 "受籙次第法信儀",
 "洞玄靈寶道士明鏡法",
 "洞玄靈寶課中法",
 "太清玉司左院祕要上法",
 "三洞羣仙錄",
 "三十代天師虛靖真君語錄",
 "沖虛通妙侍宸王先生家話",
 "虛靜沖和先生徐神翁語錄",
 "靜餘玄問",
 "道法心傳",
 "雷法議玄篇",
 "老子微旨例略",
 "真仙真指語錄",
 "羣仙要語纂集",
 "諸真內丹集要",
 "龍虎精微論",
 "三要達道篇",
 "六根歸道篇",
 "離峯老人集",
 "北帝七元紫庭延生祕訣",
 "鄧天君玄靈八門報應內旨",
 "九天上聖祕傳金符經",
 "天皇太一神律避穢經",
 "上清修身要事經",
 "正一法文修真旨要",
 "洞玄靈寶真人修行延年益算法",
 "三洞道士居山修鍊科",
 "正一天師告趙昇口訣",
 "玄和子十二月卦金訣",
 "雨暘氣候親機",
 "盤天經",
 "道法宗旨圖衍義",
 "洞玄靈寶五感文",
 "靈書肘後鈔",
 "玄壇刊誤論",
 "五嶽真形序論",
 "高上神霄宗師受經式",
 "太上洞神行道授度儀",
 "太上洞神三皇傳授儀",
 "翊聖保德",
 "廬山太平興國宮採訪真君事實",
 "正一法文經護國醮海品",
 "元辰章醮立成曆",
 "六十甲子本命元辰曆",
 "太上洞神洞淵神呪治病口章",
 "上清經祕訣",
 "靈寶鍊度五仙安靈鎮神黃繒章法",
 "上清太微帝君結帶真文法",
 "交帶文",
 "上清黃書過度儀",
 "太上洞玄靈寶二部傳授儀",
 "洞玄靈寶八節齋宿啟儀",
 "洞玄靈寶五老攝召北酆鬼魔赤書玉訣",
 "四聖真君靈籤",
 "玄真靈應寶籤",
 "大慈好生九天衛房聖母元君靈應寶籤",
 "洪恩靈濟真君靈籤",
 "靈濟真君注生堂靈籤",
 "扶天廣聖如意靈籤",
 "護國嘉濟江東王靈籤",
 "海瓊白真人語錄",
 "海瓊問道集",
 "傳道集",
 "清和真人北遊語錄",
 "太上大道玉清經",
 "洞真高上玉帝大洞雌一玉檢五老寶經",
 "洞真太上素靈洞元大有妙經",
 "洞真上清青要紫書金根衆經",
 "洞真上清太微帝君步天綱飛地紀金簡玉字上經",
 "洞真上清開天三圖七星移度經",
 "洞真太上三元流珠經",
 "洞真西王母寶神起居經",
 "洞真太上八素真經精耀三景妙訣",
 "洞真太上八素真經修習功業妙訣",
 "洞真太上八素真經三五行化妙訣",
 "洞真太上八素真經服食日月皇華訣",
 "洞真太上八素真經登壇符札妙訣",
 "洞真太上八素真經占候入定妙訣",
 "洞真上清龍飛九道尺素隱訣",
 "洞真太上三九素語玉精真訣",
 "洞真太上八道命籍經",
 "太上九赤班符五帝內真經",
 "洞真太一帝君太丹隱書洞真玄經",
 "洞真上清神州七轉七變舞天經",
 "洞真太上紫度炎光神元變經",
 "洞真太上神虎玉經",
 "洞真太上神虎隱文",
 "洞真太上紫文丹章",
 "洞真太上金篇虎符真文經",
 "洞真太微金虎真符",
 "洞真太上太素玉籙",
 "洞真八景玉籙晨圖隱符",
 "洞真太上倉元上錄",
 "洞真太上上皇民籍定真玉錄",
 "洞真太上紫書籙傳",
 "洞真黃書",
 "洞真太上說智慧消魔真經",
 "洞真太上道君元丹上經",
 "洞真金房度命綠字廻年三華寶曜內真上經",
 "洞真太上上清內經",
 "洞真太上丹景道精經",
 "洞真太上青牙始生經",
 "洞真三天祕諱",
 "洞真太上飛行羽經九真昇玄上記",
 "上清太上廻元九道飛行羽經",
 "洞真太上太霄琅書",
 "上清道寶經",
 "上清太上開天龍蹻經",
 "上清太上玉清隱書滅魔神慧高玄真經",
 "上清高上滅魔玉帝神慧玉清隱書",
 "上清高上滅魔洞景金元玉清隱書經",
 "上清高上金元羽章玉清隱書經",
 "上清丹景道精隱地八術經",
 "上清九天上帝祝百神內名經",
 "上清七聖玄紀經",
 "上清太上廻元隱道除罪籍經",
 "上清太極真人撰所施行祕要經",
 "上清洞真智慧觀身大戒文",
 "上清元始譜籙太真玉訣",
 "解形𨔵變流景玉光",
 "上清天關三圖經",
 "上清河圖內玄經",
 "上清廻神飛霄登空招五星上法經",
 "上清化形隱景登昇保仙上經",
 "上清廻耀飛光日月精華上經",
 "上清素靈上篇",
 "上清高上玉晨鳳臺曲素上經",
 "上清外國放品青童內文",
 "上清諸真人援經時頌金真章",
 "上清無上金元玉清金真飛元步虛玉章",
 "上清太上帝君九真中經",
 "上清太上九真中經絳生神丹訣",
 "上清金真玉光八景飛經",
 "上清玉帝七聖玄紀廻天九霄經",
 "上清太上黃素四十四方經",
 "上清明堂玄丹真經",
 "上清九丹上化胎精中記經",
 "上清太上元始耀光金虎鳳文章寶經",
 "上清太一帝君太丹隱書解胞十二結節圖訣",
 "上清洞真天寶大洞三景寶籙",
 "上清大洞三景玉清隱書訣籙",
 "上清元始高上玉皇九天譜籙",
 "上清金真玉皇上元九天真靈三百六十五部元錄",
 "上清高聖太上大道君洞真金元八景玉錄",
 "上清洞天三五金剛玄籙儀經",
 "上清瓊宮靈飛六甲籙",
 "上清曲素訣辭籙",
 "九天鳳炁玄丘大書",
 "上清元始變化寶真上經九靈大妙龜山玄籙",
 "上清高上龜山玄籙",
 "上清大洞九微八道大經妙籙",
 "上清河圖寶籙",
 "四斗二十八宿天帝大籙",
 "大乘妙林經",
 "太上元寶金庭無為妙經",
 "上清黃庭養神經",
 "太上黃庭中景經",
 "上清黃庭五藏六府真人玉軸經",
 "上清僊府瓊林經",
 "上清太極真人神仙經",
 "長生胎元神用經",
 "太上靈寶芝草品",
 "洞玄靈寶二十四生圖經",
 "玉清上宮科太真文",
 "太上九真明科",
 "洞玄靈寶千真科",
 "洞玄靈寶長夜之府九幽玉匱明真科",
 "太上元始天尊說北帝伏魔神呪妙經",
 "北帝伏魔經法建壇儀",
 "伏魔經壇謝恩醮儀",
 "北帝說豁落七元經",
 "七元真訣語驅疫祕經",
 "七元璇璣召魔品經",
 "元始說度酆都經",
 "七元召魔伏六天神呪經",
 "七元真人說神真靈符經",
 "太上紫微中天七元真經",
 "枕中經",
 "太清元道真經",
 "太上老君太素經",
 "靈信經旨",
 "唐太古妙應孫真人福壽論",
 "太清道林攝生論",
 "侍帝晨東華上佐司命楊君傳記",
 "道藏經目錄",
 "續道藏經目錄",
 "太上中道妙法蓮華經",
 "太上元始天尊說寶月光皇后聖母天尊孔雀明王經",
 "聖母孔雀明王尊經啟白儀",
 "太上元始天尊說孔雀經白文",
 "上清元始變化寶真上經",
 "太上老君開天經",
 "太上老君虛無自然本起經",
 "洞玄靈寶玉京山步虛經",
 "皇經集註",
 "元始天尊說東獄化身濟生度死拔罪解冤保命玄範誥咒妙經",
 "太上三元賜福赦罪解厄消災延生保命妙經",
 "太上元陽上帝無始天尊說火車王靈官真經",
 "元始天尊說藥王救八十一難真經",
 "碧霞元君護國庇民普濟保生妙經",
 "太上大聖朗靈上將護國妙經",
 "太上老君說城隍感應消災集福妙經",
 "太上洞玄靈寶五顯觀華光本行妙經",
 "太上說通真高皇解冤經",
 "中天紫微星真寶懺",
 "紫皇鍊度玄科",
 "先天斗母奏告玄科",
 "朝真發願懺悔文",
 "靈寶施食法",
 "太微帝君二十四神回元經",
 "北斗九皇隱諱經",
 "高上玉宸憂樂章",
 "太上洞真徊玄章",
 "上清金章十二篇",
 "太上洞玄濟衆經",
 "大洞經吉祥神咒法",
 "皇明恩命世錄",
 "漢天師世家",
 "弘道錄",
 "消搖墟經",
 "長生詮經",
 "無生訣經",
 "徐仙翰藻",
 "贊靈集",
 "徐仙真錄",
 "儒門崇理折衷堪輿完孝錄",
 "岱史",
 "易因",
 "古易考原",
 "太初元氣接要保生之論",
 "水鏡錄",
 "許真君玉匣記",
 "諸神聖誕日玉匣記等集目錄",
 "法師選擇記",
 "玄天上帝百字聖號",
 "天皇至道太清玉冊",
 "呂祖志",
 "紫微斗數",
 "唐玄宗御註道德真經疏",
 "道德真經集註釋文",
 "道德真經集註雜說",
 "道德真經藏室纂微開題科文疏",
 "道德真經藏室纂微手鈔",
 "道德真經集義大旨",
 "南華真經章句餘事",
 "南華真經章句雜錄",
 "漢武帝外傳",
 "西嶽華山誌一撰",
 "仙傳方科秘方",
 "重刊道藏輯要總目",
 "重刊道藏輯要子目初編",
 "道門一切經總目",
 "元始无量度人上品妙經",
 "元始无量度人上品經法",
 "元始天尊說无上內祕真藏經",
 "元始大洞玉經",
 "大洞仙經觀想要訣",
 "洞經示讀",
 "大洞玉經疏要十二義",
 "大洞玉經壇儀",
 "元始上帝毘盧遮耶說大洞救劫尊經",
 "元始消劫梓潼本願真經",
 "元始天尊說東嶽化身濟生拔罪保命妙經",
 "太上洞玄靈寶天尊說救苦妙經",
 "太上金匱玉鏡修真指玄妙經",
 "太上神咒延壽妙經",
 "太上洞淵三昧帝心光明正印太極紫微伏魔制鬼拯救惡道集福吉祥神咒",
 "太上玄元道德經解",
 "太上道德真經四子古道集解",
 "太上道德寶章翼",
 "太上道德真經章句訓頌",
 "太上道德真經集注不分卷釋文一卷",
 "道德上經釋辭",
 "下經釋辭",
 "旨意總論",
 "太上老君說常清靜真經",
 "太上道德大天尊說道元一炁經",
 "下經",
 "黃庭內景經",
 "黃庭外景經",
 "太上黃庭外景經",
 "太上感應篇集註",
 "太上混元聖紀",
 "高上玉皇本行集經註解",
 "太上洞玄靈寶紫微金格高上玉皇本行集經闡微",
 "高上玉皇心印妙經",
 "終真八祖說心印妙經解",
 "高上玉皇心印經註",
 "先天斗帝敕演無上玄功靈妙真經疏解",
 "九皇斗姥戒殺延生真經",
 "觀音大士蓮船經",
 "五斗經",
 "太上說西斗記名護身妙經",
 "九皇新經註解",
 "玄宗正旨",
 "浮黎鼻祖金華祕訣",
 "金碧古文龍虎上經",
 "金碧古文龍處上經",
 "唱道真言",
 "黃帝陰符經十真集解",
 "陰符玄解",
 "玉樞寶經",
 "五百靈官爵位姓氏總錄",
 "參同契闡幽",
 "參同契分章注",
 "入藥鏡",
 "靈寶畢法",
 "銅符鐵券",
 "石函記",
 "太上靈寶淨明宗教錄",
 "葛仙翁太極冲玄至道心傳",
 "呂祖本傳",
 "十六品經",
 "八品經",
 "五品經",
 "三品經",
 "金華宗旨",
 "金華宗旨闡幽問答",
 "同參經",
 "五經合編",
 "呂帝心經",
 "先天一炁度人妙經",
 "延生證聖真經",
 "金玉寶經",
 "醒心真經",
 "呂帝文集",
 "易說上經",
 "圖解",
 "孚佑上帝語錄大觀",
 "附孚佑帝君正教編",
 "三寶心鐙",
 "微言摘要",
 "呂帝聖蹟紀要",
 "天仙金丹心法",
 "東園語錄",
 "至真歌",
 "玉清金笥青華祕文金寶內鍊丹法",
 "悟真篇拾遺",
 "悟真篇直指詳說",
 "金丹四百字注",
 "石橋歌卷",
 "悟真篇闡幽",
 "泥洹集",
 "瓊琯真人集",
 "海瓊白真君語錄",
 "分梨十化集",
 "立教十五論",
 "五篇靈文",
 "孫不二元君法語",
 "孫不二元君傳述丹道祕書",
 "金液還丹印證圖詩",
 "金丹大要",
 "金丹大成",
 "規中指南",
 "陰丹內篇",
 "鳴真集",
 "虛靜冲和先生徐神翁錄",
 "仙佛合宗語錄",
 "天仙正理直論增註",
 "道原淺說篇",
 "金丹要訣",
 "伍真人丹道九篇",
 "張三丰先生全集",
 "養真集",
 "玉詮",
 "真詮",
 "心傳述證錄",
 "懺法大觀",
 "三寶萬靈法懺",
 "太上靈寶朝天謝罪法懺",
 "漢丞相諸葛忠武侯",
 "文昌帝君本傳",
 "文帝化書",
 "文昌孝經",
 "文昌應化元皇大道真君說注生延嗣妙應真經",
 "陰隲文註",
 "三界伏魔關聖帝君忠孝忠義真經",
 "關聖帝君本傳年譜",
 "道門功課",
 "太上玄門早壇功課經",
 "晚壇功課經",
 "金真清規",
 "十戒功過格",
 "警世功過格",
 "三壇圓漢天仙大戒略說",
 "初真戒律",
 "中極戒",
 "終南山說經臺歷代真仙碑說",
 "青羊宮二仙菴碑記",
 "華蓋山三仙真經",
 "華蓋山三仙事實",
 "續刊青城山記",
 "天下名山記",
 "元道經",
 "五廚經",
 "文始經",
 "洞靈經",
 "呂祖師先天虛無太一金華宗旨",
 "尹真人東華正脈皇極闔闢證道仙經",
 "尹真人寥陽殿問答編",
 "泄天機",
 "古法養生十三則闡微",
 "上品丹法節次",
 "管窺編",
 "與林奮千先生書",
 "呂祖師三尼醫世說述",
 "讀呂祖師三尼醫世說述管窺",
 "呂祖師三尼醫世功訣",
 "天仙心傳",
 "內篇",
 "附圓訣",
 "玄科",
 "神人李蓬頭法言",
 "真師太虛氏法言",
 "天仙道戒忌須知",
 "天仙道程寶則",
 "二懶心話",
 "三丰真人玄譚全集",
 "西王母女修正途十則",
 "泥丸李祖師女宗雙修寶筏",
 "金丹四百字註釋",
 "瑣言續",
 "棲雲山悟元子修真辯難參證前編",
 "道藏輯要總目",
 "道譜源流圖",
 "道學指南",
 "說齋",
 "說戒",
 "禁忌篇",
 "戒忌禳災祈善法",
 "將攝保命篇",
 "服氣長生辟穀法",
 "至言總養生篇",
 "攝生月令",
 "真誥篇",
 "古仙導引按摩法",
 "修齡指要",
 "陰符天機經",
 "集註陰符經",
 "老君太上虛無自然本起經",
 "老君清淨心經",
 "神仙可學論",
 "仙籍旨訣",
 "道生旨",
 "養生辨疑訣",
 "下元歌",
 "諸真語錄",
 "真仙要語",
 "七部要語",
 "七部名數要記",
 "文昌帝君救劫開心聰明大洞真經",
 "太上純陽真君了三得一經",
 "太上無極混元一炁度人妙經",
 "周易參同契正義",
 "金碧古文龍虎上經註疏",
 "鍾呂傳道栠",
 "漁莊錄",
 "紫清指玄集",
 "悟真篇正義",
 "悟真外篇",
 "性命圭旨",
 "孫不二元君傳述丹道秘書",
 "復命篇",
 "天仙真理直論增註",
 "老子中經",
 "珠宮玉曆",
 "太清中黃真經并釋題",
 "上清黃庭內景經",
 "靈寶洞玄自然九天生神章經",
 "三寶大有全書",
 "天蓬神咒",
 "北帝祝法",
 "濟祖師文集",
 "海內十洲三島記",
 "太上洞淵三昧神咒齋懺謝儀",
 "太上洞淵三昧神咒齋清旦行道儀",
 "太上洞淵三昧神咒齋十方懺儀",
 "太上洞玄靈授度儀",
 "黃籙九幽醮無礙夜齋次第儀",
 "太上靈寶玉匱明真大齋懺方儀",
 "洞玄靈寶鐘罄威儀經",
 "上清侍帝宸桐栢真人真圖譖",
 "金丹正理大全",
 "玄學正宗",
 "悟真註疏直指詳說三乘秘要",
 "金丹四百字內外註解",
 "附金穀歌註解",
 "諸真元奧集成",
 "群仙珠玉集成",
 "玄宗內典諸經註",
 "太上昇玄說消災護命經註",
 "無上玉皇心印經",
 "羣仙要語",
 "玉清金笥青華祕文金寶內煉丹訣",
 "鍾呂二仙修真傳道集",
 "純陽呂真人文集",
 "黃庭內景五藏六腑圖說",
 "周易參同契脉望",
 "悟真篇約註",
 "承志錄",
 "金丹就正篇玄膚論",
 "元丹篇",
 "元丹篇約注",
 "修真六書",
 "還原篇",
 "元真錄",
 "丹道發微",
 "仙傳宗源",
 "性學筌蹄",
 "太上黃庭經發微",
 "黃帝陰符經本義",
 "老子道德經本義",
 "敲爻歌直解",
 "百字碑註",
 "西遊原旨讀法",
 "詩結",
 "修真辨難",
 "神室八法",
 "修真九要",
 "無根樹解",
 "悟真直指",
 "黃庭經解",
 "參同契經文直指",
 "參同契直指箋註",
 "參同契直指三相類",
 "悟道錄",
 "十二段錦",
 "碧苑壇經",
 "棲霞山悟元子修真辯難參證",
 "陰符經玄解正義",
 "金丹四百字注釋",
 "太乙金華宗",
 "皇極闔闢證道仙經",
 "寥陽殿問答編",
 "養生十三則闡微",
 "雨香天經咒註",
 "智慧真言注",
 "一目真言注",
 "增智慧真言",
 "祭煉心咒註",
 "玄譚全集",
 "李祖師女宗雙修寶筏",
 "持世陀羅尼經法",
 "陀羅尼經注",
 "密蹟金剛神咒注",
 "大悲神咒注",
 "清規玄妙",
 "道書一貫真機易簡錄",
 "新鐫道書度人梯徑",
 "自題所畫",
 "性天正鵠",
 "新鐫道書樵陽經",
 "心學",
 "新鐫道書五篇註",
 "黃鶴賦",
 "百句章",
 "真經歌",
 "鼎器歌",
 "採金歌",
 "道書杯溪錄",
 "赤水吟",
 "外金丹",
 "內金丹",
 "邱祖全書",
 "玄微心印",
 "丹經示讀",
 "三丰丹訣",
 "天仙正理讀法點睛",
 "道海津梁",
 "無上玉皇心印妙經測疏",
 "黃帝陰符經測疏",
 "老子道德經玄覽",
 "周易參同契測疏",
 "參同契口義",
 "崔公入藥鏡測疏",
 "純陽呂公百字碑測疏",
 "紫陽真人金丹四百字測疏",
 "龍眉子金丹印證詩測疏",
 "邱長春真人青天歌測疏",
 "玄膚就正篇",
 "金丹大旨圖",
 "七破論",
 "金丹悟",
 "金丹疑",
 "步天歌圖註",
 "龍山紀載",
 "楞園賦說",
 "訓詁珠塵",
 "解真篇",
 "試金石二十四詠",
 "楞園詩草",
 "頂批金丹真傳",
 "道書試金石",
 "邵子詩註",
 "入藥鏡註",
 "附通釋",
 "離騷圖經",
 "楚辭拾遺",
 "左傳選",
 "公羊傳選",
 "穀梁傳選",
 "國語選",
 "史記選",
 "西漢文選",
 "東漢文選",
 "韓昌黎文選",
 "柳柳州文選",
 "歐陽廬陵文選",
 "蘇老泉文選",
 "蘇東坡文選",
 "蘇潁濱文選",
 "曾南豐文選",
 "王臨川文選",
 "古詩選",
 "漢詩",
 "魏詩",
 "晉詩",
 "宋詩",
 "齊詩",
 "梁詩",
 "陳詩",
 "隋詩",
 "北朝詩",
 "古逸歌謠",
 "初盛唐詩選",
 "中唐詩選",
 "晚唐詩選",
 "唐詩拾遺",
 "宋詩選",
 "元詩選",
 "明詩選",
 "明詩一集選",
 "明詩次集選",
 "明詩三集選",
 "明詩四集選",
 "明詩五集選",
 "續五集",
 "五續集",
 "明詩六集選",
 "六續集",
 "明續集",
 "閨秀集",
 "南直集",
 "浙江集",
 "福建集",
 "社集",
 "楚集",
 "四川集",
 "江右集",
 "江西集",
 "陝西集",
 "張司空集",
 "郭景純集",
 "袁忠憲集",
 "司空表聖集",
 "傅忠肅集",
 "宗忠簡公集",
 "陳修撰集",
 "楳野集",
 "陸忠烈公書",
 "郝文忠公集",
 "師山先生文集",
 "戴九靈集",
 "練中丞金川集",
 "程巽隱先生文集",
 "于忠肅公集",
 "張文僖集",
 "劉兩谿文集",
 "周忠愍公垂光集",
 "桂洲文集",
 "趙忠毅公文集",
 "熊襄愍公集",
 "徐念陽公集",
 "楊忠烈公文集",
 "左忠毅公集",
 "周忠毅公奏議",
 "黃忠端公集",
 "藏密齋集",
 "盧忠肅公文集",
 "鹿忠節公集",
 "倪文正集",
 "凌忠介公文集",
 "吳忠節公遺集",
 "周文忠公集",
 "劉文烈公集",
 "申端愍公集",
 "金忠潔公集",
 "賀文忠公集",
 "瑤光閣集",
 "左忠貞公文集",
 "劉子文編",
 "祁忠惠公遺集",
 "陳忠裕全集",
 "仍貽堂集",
 "陶庵文集",
 "谷濂先生遺書",
 "葛中翰集",
 "金太史集",
 "溫寶忠先生遺稿",
 "白谷集",
 "堵文忠公集",
 "王季重先生文集",
 "黃石齋先生集",
 "四明先生遺集",
 "蓮鬚閣集",
 "影園集",
 "江止庵遺集",
 "郝太樸遺集",
 "陳忠簡公遺集",
 "賜誠堂文集",
 "陳巖野先生集",
 "張閣學文集",
 "瞿忠宣公集",
 "夏節愍公集",
 "蔡忠恪公語錄",
 "高陽文集",
 "觀復堂集",
 "屈大夫文",
 "賈太傅文",
 "陶靖節集",
 "陶靖節先生年譜",
 "蘇東坡和陶詩",
 "宗忠簡公文集",
 "文信國公集",
 "陶淵明全集",
 "李長吉詩集",
 "李卓吾批選陶淵明集",
 "李卓吾批選王摩詰集",
 "衆玅集",
 "張文昌集",
 "張于湖集",
 "唐大家韓文公文鈔",
 "唐大家柳柳州文鈔",
 "宋大家歐陽文忠公文鈔",
 "宋大家蘇文公文鈔",
 "宋大家蘇文忠公文鈔",
 "宋大家蘇文定公文鈔",
 "宋大家王文公文鈔",
 "宋大家曾文定公文鈔",
 "韓文選",
 "柳文選",
 "王文選",
 "曾文選",
 "歐文選",
 "老蘇文選",
 "大蘇文選",
 "小蘇文選",
 "昌黎詩鈔",
 "河東詩鈔",
 "廬陵詩鈔",
 "老泉詩鈔",
 "東坡詩鈔",
 "欒城詩鈔",
 "半山詩鈔",
 "南豐詩鈔",
 "昌黎先生全集錄",
 "河東先生全集錄",
 "外集錄",
 "習之先生全集錄",
 "可之先生全集錄",
 "六一居士全集錄",
 "老泉先生全集錄",
 "東坡先生全集錄",
 "欒城先生全集錄",
 "南豐先生全集錄",
 "臨川先生全集錄",
 "杜審言集",
 "南陽詩集",
 "青社黃先生伐檀集",
 "韓昌黎尺牘",
 "柳柳州尺牘",
 "蘇東坡尺牘",
 "黃山谷尺牘",
 "司馬溫公尺牘",
 "呂東萊尺牘",
 "歐陽修尺牘",
 "蘇老泉尺牘",
 "王臨川尺牘",
 "曾南豐尺牘",
 "附魚集考異",
 "綠牕遺藳",
 "傅若金詩",
 "晝錦堂詩",
 "稽愆詩",
 "姓名爵里",
 "趙清獻公詩集",
 "唐眉山詩集",
 "陳簡齋詩集",
 "米襄陽詩集",
 "蔡莆陽詩集",
 "清苑齋詩集",
 "葦碧軒詩集",
 "文與可古樂府",
 "嚴滄浪詩集",
 "裘竹齋詩集",
 "秦少游詩集",
 "放翁詩集",
 "二薇亭詩集",
 "花蘂夫人詩集",
 "吳草盧詩集",
 "盧含雪詩集",
 "虞邵菴詩集",
 "揭秋宜詩集",
 "王陌菴詩集",
 "薛象峯詩集",
 "陸湖峯詩集",
 "迺前岡詩集",
 "松谷詩集",
 "魚軒詩集",
 "貢南湖詩集",
 "春慵軒詩集",
 "倪雲林詩集",
 "句曲張外史詩集",
 "陳荔溪詩集",
 "楊鐵崖古樂府",
 "傅玉樓詩集",
 "柳初陽詩集",
 "張蛻菴詩集",
 "泰顧北詩集",
 "李五峯詩集",
 "余竹窓詩集",
 "貢玩齋詩集",
 "成柳庄詩集",
 "石屋禪師山居詩集",
 "陳笏齋詩集",
 "貫酸齋詩集",
 "困學齋詩集",
 "衆妙集",
 "林君復詩",
 "姜白石詩",
 "倪雲林詩",
 "王元章詩",
 "張乖崖事文錄",
 "余忠宣公青陽山房集",
 "廬陽周忠愍公垂光集",
 "史道鄰先生遺稿",
 "青陽山房集",
 "元遺山先生文選",
 "姚牧菴先生文選",
 "吳草盧先生文選",
 "虞道園先生文選",
 "宋景濂先生文選",
 "王陽明先生文選",
 "唐荊川先生文選",
 "歸震川先生文選",
 "虞道園文選",
 "揭曼碩文選",
 "王陽明文選",
 "歸震川文選",
 "唐荊川文選",
 "王遵巖文選",
 "艾東鄉文選",
 "歸震川文鈔",
 "方望溪文鈔",
 "姚姬傳文鈔",
 "梅伯言文鈔",
 "曾滌生文鈔",
 "張濂亭文鈔",
 "吳摯甫文鈔",
 "王陽明尺牘",
 "歸震川尺牘",
 "錢牧齋尺牘",
 "顧亭林尺牘",
 "侯朝宗尺牘",
 "尤西堂尺牘",
 "方望溪尺牘",
 "姚惜抱尺牘",
 "吳穀人尺牘",
 "王弢園尺牘",
 "唐人傳奇選",
 "倦雲憶語",
 "蘭閨清課",
 "香籢集",
 "小詩選",
 "描寫人生斷片之歸有光",
 "胡笳十八拍及其他",
 "董仲舒集",
 "司馬長卿集",
 "東方先生集",
 "阮嗣宗集",
 "謝惠連集",
 "顏延之集",
 "鮑明遠集",
 "任彥升集",
 "江文通文集",
 "庚開府集",
 "漢褚先生集",
 "王諫議集",
 "漢劉中壘集",
 "漢劉子駿集",
 "東漢崔亭伯集",
 "張河閒集",
 "漢蘭臺令李伯仁集",
 "李蘭臺集",
 "東漢馬季長集",
 "東漢荀侍中集",
 "東漢王叔師集",
 "諸葛丞相集",
 "魏阮元瑜集",
 "魏劉公幹集",
 "魏應德璉集",
 "魏應休璉集",
 "鍾司徒集",
 "晉杜征南集",
 "魏荀公曾集",
 "晉張司空集",
 "張茂先集",
 "孫馮翌集",
 "晉摯太常集",
 "晉束廣微集",
 "夏侯常侍集",
 "潘太常集",
 "陸清河集",
 "晉成公子安集",
 "晉張孟陽集",
 "晉張景陽集",
 "晉劉越石集",
 "晉王右軍集",
 "晉王大令集",
 "孫廷尉集",
 "宋何衡陽集",
 "宋傅光祿集",
 "宋袁陽源集",
 "謝法曹集",
 "謝光祿集",
 "南齊竟陵王集",
 "王文憲集",
 "齊張長史集",
 "南齊孔詹事集",
 "梁武帝御製集",
 "梁簡文帝御製集",
 "江醴陵集",
 "沈隱侯集",
 "陶隱居集",
 "梁丘司空集",
 "王左丞集",
 "陸太常集",
 "劉戶曹集",
 "王詹事集",
 "劉秘書集",
 "劉豫章集",
 "劉庶子集",
 "何記室集",
 "吳朝請集",
 "陳後主集",
 "沈侍中集",
 "江令君集",
 "陳張散騎集",
 "溫侍讀集",
 "邢特進集",
 "魏特進集",
 "隋煬帝集",
 "李懷州集",
 "牛奇章集",
 "薜司隸集",
 "賈長沙集選",
 "司馬文園集選",
 "楊侍郎集選",
 "劉子駿集選",
 "蔡中郎集選",
 "陳思王集選",
 "阮步兵集選",
 "嵇中散集選",
 "鍾司徒集選",
 "杜征南集選",
 "荀公曾集選",
 "傅鶉觚集選",
 "傅中丞集選",
 "潘太常集選",
 "陸平原集選",
 "陸清河集選",
 "成公子安集選",
 "張孟陽集選",
 "張景陽集選",
 "劉越石集選",
 "郭弘農集選",
 "王右軍集選",
 "王大令集選",
 "孫廷尉集選",
 "陶彭澤集選",
 "何衡陽集選",
 "傅光祿集選",
 "謝康樂集選",
 "顏光祿集選",
 "鮑參軍集選",
 "袁陽源集選",
 "謝法曹集選",
 "謝光祿集選",
 "竟陵王集選",
 "王文憲集選",
 "王寧朔集選",
 "謝宣城集選",
 "張長史集選",
 "孔詹事集選",
 "梁武帝集選",
 "梁昭明集選",
 "梁簡文帝集選",
 "梁元帝集選",
 "江醴陵集選",
 "沈隱侯集選",
 "陶隱居集選",
 "丘司空集選",
 "任中丞集選",
 "王左丞集選",
 "陸太常集選",
 "劉戶曹集選",
 "王詹事集選",
 "劉祕書集選",
 "劉豫章集選",
 "劉庶子集選",
 "庾度支集選",
 "何記室集選",
 "吳朝請集選",
 "陳後主集選",
 "徐僕射集選",
 "沈侍中集選",
 "江令君集選",
 "高令公集選",
 "溫侍讀集選",
 "邢特進集選",
 "魏特進集選",
 "庾開府集選",
 "王司空集選",
 "隋煬帝集選",
 "盧武陽集選",
 "牛奇章集選",
 "薛司隸集選",
 "司馬子長集",
 "班孟堅集",
 "王叔師集",
 "鄭康成集",
 "劉公幹集",
 "應德璉集",
 "孔文舉集",
 "王仲宣集",
 "徐偉長集",
 "嵇叔夜集",
 "左太沖集",
 "潘安仁集",
 "謝希逸集",
 "顏延年集",
 "沈休文集",
 "任彥昇集",
 "隋楊帝集",
 "魏曹子建集",
 "晉陶靖節集",
 "宋謝康樂集",
 "梁宣帝集",
 "後周明帝集",
 "梁沈約集",
 "梁劉孝綽集",
 "梁劉孝威集",
 "陰常侍集",
 "王子淵集",
 "採輯歷朝詩話",
 "辨訛攷異",
 "梁代帝王合集",
 "庚子山集",
 "陶彭澤詩",
 "謝康樂詩",
 "謝法曹詩",
 "謝宣城詩",
 "劉孝標集",
 "太宗集",
 "玄宗集",
 "許敬宗集",
 "虞世南集",
 "盧照鄰集",
 "張九齡集",
 "楊炯集",
 "李嶠集",
 "駱賓王集",
 "蘇廷碩集",
 "陳子昂集",
 "張說之集",
 "沈佺期集",
 "孫逖集",
 "王摩詰集",
 "崔顥集",
 "祖詠集",
 "李頎集",
 "儲光羲集",
 "王昌齡集",
 "常建集",
 "崔曙集",
 "包何集",
 "包佶集",
 "李嘉祐集",
 "秦隱君集",
 "皇甫冉集",
 "皇甫曾集",
 "韓君平集",
 "郎士元集",
 "嚴維集",
 "耿湋集",
 "戴叔倫集",
 "盧綸集",
 "李益集",
 "李端集",
 "司空曙集",
 "武元衡集",
 "權德輿集",
 "羊士諤集",
 "唐太宗文皇帝集",
 "李百藥集",
 "楊師道集",
 "董思恭集",
 "劉廷芝集",
 "金華山陳拾遺亭記",
 "唐喬知之詩集",
 "陳伯玉集",
 "杜審言詩集",
 "沈雲卿集",
 "盧僎集",
 "唐玄宗皇帝集",
 "崔顥詩集",
 "李頎詩集",
 "王昌齡詩集",
 "顏魯公詩集",
 "嚴武集",
 "郎士元詩集",
 "皇甫冉詩集",
 "皇甫御史詩集",
 "唐司空文明詩集",
 "李端詩集",
 "耿湋詩集",
 "嚴維詩集",
 "唐靈一詩集",
 "唐皎然詩集",
 "唐包秘監詩",
 "唐包刑侍詩集",
 "華陽真逸詩",
 "戎昱詩集",
 "于鵠詩集",
 "羊士諤詩集",
 "唐張處士詩集",
 "會昌進士詩集",
 "唐秦隱君詩集",
 "呂衡州詩集",
 "張司業樂府集",
 "李長吉集",
 "劉滄詩集",
 "盧仝詩集",
 "喻鳧詩集",
 "項斯詩集",
 "曹鄴詩集",
 "李洞詩集",
 "李昌符詩集",
 "李山甫詩集",
 "崔塗詩集",
 "張喬詩集",
 "張蠙詩集",
 "邵謁詩",
 "劉駕詩集",
 "劉叉詩集",
 "蘇拯詩集",
 "章孝標詩集",
 "于濆詩集",
 "唐貫休詩集",
 "唐齊己詩集",
 "僧無可詩集",
 "曹松詩集",
 "劉兼詩集",
 "王周詩集",
 "于鄴詩集",
 "儲嗣宗詩集",
 "章碣詩集",
 "伍喬詩集",
 "唐姚鵠詩集",
 "李遠詩集",
 "羅鄴詩集",
 "林寬詩集",
 "經進周曇詠史詩",
 "劉威詩集",
 "秦韜玉詩集",
 "殷文珪集",
 "唐詩品",
 "劉隨州詩",
 "錢考功詩集",
 "包刑侍詩集",
 "包秘監詩集",
 "臺閣集",
 "韓君平詩集",
 "張祠部詩集",
 "皇甫補闕詩集",
 "郎刺史詩集",
 "秦公緒詩集",
 "嚴正文詩集",
 "顧逋翁詩集",
 "耿拾遺詩集",
 "李君虞詩集",
 "盧戶部詩集",
 "臨淮詩集",
 "楊凝詩集",
 "劉虞部詩集",
 "陳羽詩集",
 "昌黎先生詩集",
 "柳河東先生詩集",
 "張司業詩集",
 "王建詩集",
 "權文公詩集",
 "楊少尹詩集",
 "歐陽助教詩集",
 "張祜詩集",
 "李衛公詩集",
 "追昔遊詩集",
 "樊川集",
 "李商隱詩集",
 "丁卯詩集",
 "段成式詩",
 "顧非熊詩集",
 "唐鄭嵎詩",
 "唐隱居詩",
 "曹祠部詩集",
 "司馬扎先輩詩集",
 "鹿門詩集",
 "續補詩",
 "賈浪仙長江集",
 "陳嵩伯詩集",
 "元英先生詩集",
 "文化集",
 "曹從事詩集",
 "許琳詩集",
 "邵謁詩集",
 "周見素詩集",
 "司空表聖詩",
 "李才江詩集",
 "韓翰林詩集",
 "韓內翰香奩集",
 "杜荀鶴文集",
 "徐昭夢詩集",
 "翁拾遺詩集",
 "唐任藩詩小集",
 "孟一之詩集",
 "黃滔詩集",
 "李丞相詩",
 "唐求詩集",
 "王周詩",
 "殷文珪詩集",
 "唐尚顏詩集",
 "于武陵詩集",
 "無名氏詩集",
 "顧況集",
 "王維集",
 "高適集",
 "岑參集",
 "呂衡州文集",
 "孟襄陽集",
 "香蘝集",
 "金荃集",
 "王建詩",
 "鮑溶詩",
 "姚少監詩",
 "薛許昌詩集",
 "李文山詩集",
 "李義山集",
 "王右丞詩集",
 "韋蘇州詩集",
 "孟襄陽詩集",
 "柳河東詩集",
 "柳柳州集",
 "唐四家詩集辨譌考異",
 "杜工部詩鈔",
 "韓吏部詩鈔",
 "王右丞詩鈔",
 "孟襄陽詩鈔",
 "韋蘇州詩鈔",
 "柳河東詩鈔",
 "唐包秘監詩集",
 "張曲江集",
 "王摩詰詩集",
 "孟浩然詩集",
 "李翰林集",
 "李集",
 "杜集",
 "李詩鈔評",
 "杜詩鈔評",
 "分類補注李太白詩",
 "集千家注杜工部詩集",
 "中唐劉叉詩",
 "中唐劉商詩",
 "中唐劉言史詩",
 "晚唐劉得仁詩",
 "晚唐劉駕詩",
 "晚唐劉滄詩",
 "晚唐劉兼詩",
 "晚唐劉威詩",
 "中唐姚合詩",
 "中唐周賀詩",
 "中唐戎昱詩",
 "中唐唐求詩",
 "中唐沈亞之詩",
 "中唐儲嗣宗詩",
 "晚唐曹鄴詩",
 "晚唐姚鵠詩",
 "晚唐邵謁詩",
 "晚唐韓偓詩",
 "晚唐林寬詩",
 "晚唐孟貫詩",
 "晚唐伍喬詩",
 "唐儲光羲詩集",
 "唐儲進士詩集",
 "唐劉隨州詩集",
 "唐盧戶部詩集",
 "唐錢起詩集",
 "唐孫集賢詩集",
 "唐崔補闕詩集",
 "唐劉賓客詩集",
 "唐王建詩集",
 "集傳",
 "韓文",
 "柳文",
 "唐韓昌黎集",
 "唐駕部侍郎知制誥中書舍人韓君平詩集",
 "唐翰林學士中書舍人韓致光香匳集",
 "甫里先生集",
 "文藪",
 "皮從事倡酬詩",
 "唐歐陽四門集",
 "翰林集",
 "唐黃御史集",
 "徐正字集",
 "林邵州遺集",
 "河嶽英靈集",
 "御覽詩",
 "唐寫本唐人選唐詩",
 "又玄集",
 "楊文公集",
 "王正美詩",
 "文潞公詩集",
 "陳副使遺稿",
 "寇萊公集",
 "咸平詩集",
 "胡文恭詩集",
 "皇雅",
 "夏英公雜詩",
 "元憲詩稿",
 "西州猥稿",
 "珠溪詩集",
 "蘇侍郎集",
 "魚樂軒吟稿",
 "肥川小集",
 "范蜀公集",
 "王岐公集",
 "劉忠肅集",
 "獨樂園稿",
 "張都官集",
 "富鄭公詩集",
 "東堂小集",
 "漫園小稿",
 "安樂窩吟",
 "梅諫議集",
 "杏花村集",
 "王校理集",
 "樂圃餘稿",
 "公非集",
 "齊州吟稿",
 "映雪齋集",
 "景迂小集",
 "五桃軒集",
 "杜祁公摭稿",
 "老泉集",
 "藜齋小集",
 "三徑集",
 "安岳吟稿",
 "潘邠老小集",
 "許文定集",
 "石曼卿詩集",
 "歸愚集",
 "古靈詩集",
 "蘿軒外集",
 "東湖居士集",
 "玉澗小集",
 "樸齋小集",
 "張章簡集",
 "慶湖集",
 "菘坪小稿",
 "石羊山房集",
 "艇齋小集",
 "沈中允集",
 "李方叔遺稿",
 "傅忠肅公集",
 "明道先生詩集",
 "荊齋詩集",
 "寄亭詩遺",
 "幻雲居詩稿",
 "陳子高遺稿",
 "拙齋別集",
 "尹和靖集",
 "環碧亭詩集",
 "琴溪集",
 "岳忠武摭稿",
 "盤州集",
 "栟櫚詩集",
 "撫松集",
 "方舟詩集",
 "五峰集",
 "椒亭小集",
 "說齋小集",
 "南澗小集",
 "梅谿集",
 "李文簡詩集",
 "文杏山房雜稿",
 "梅山小稿",
 "澗泉吟稿",
 "澹菴集",
 "艮齋集",
 "葆真居士集",
 "李敷詩集",
 "雪溪詩集",
 "捫膝稿",
 "竹谿集",
 "雲莊詩集",
 "盧溪逸稿",
 "文谿集",
 "觀我軒集",
 "豫章先生詩集",
 "象山先生集",
 "魯齋詩集",
 "慈湖小集",
 "洺水小集",
 "桂巖吟稿",
 "文惠詩集",
 "勉齋先生集",
 "退菴遺集",
 "栗齋詩集",
 "遂初小稿",
 "章泉詩集",
 "滄浪詩集",
 "蕙菴詩稿",
 "菊坡集",
 "野谷詩集",
 "東閣吟稿",
 "介軒詩集",
 "延月樓詩稿",
 "方是閒居士小稿",
 "靜軒詩集",
 "西山先生詩集",
 "鶴山詩集",
 "靖逸小集",
 "山居存稿",
 "方泉詩集",
 "巽齋小集",
 "露香拾稿",
 "斗野稿支卷",
 "雪坡小稿",
 "梅屋吟",
 "心游摘稿",
 "石屏續集",
 "端平詩雋",
 "蒙泉詩稿",
 "可齋詩集",
 "招山小集",
 "庸齋小集",
 "葛無懷小集",
 "轉菴集",
 "梅屋詩稿",
 "雲臥詩集",
 "鷗渚微吟",
 "順適堂吟稿",
 "芸隱倦游稿",
 "橫舟稿",
 "雅林小稿",
 "竹莊小稿",
 "竹所吟稿",
 "檜庭吟稿",
 "竹溪十一稿",
 "秋江煙草",
 "學詩初稿",
 "小山集",
 "雪窗小稿",
 "吾竹小稿",
 "南岳詩稿",
 "菊磵小集",
 "雪篷稿",
 "靜佳龍尋稿",
 "靜佳乙稿",
 "抱拙小稿",
 "學吟",
 "臞翁詩集",
 "泗州集",
 "看雲小集",
 "端隱吟稿",
 "華谷集",
 "菊潭詩集",
 "東齋小集",
 "適安藏拙餘稿",
 "北窗詩稿",
 "皇荂曲",
 "雪林刪餘",
 "高峯別集",
 "飲冰詩集",
 "西塍稿",
 "海陵稿",
 "四明吟稿",
 "裨幄集",
 "東齋吟稿",
 "慵菴小集",
 "石堂集",
 "遺古小集",
 "玉楮詩稿",
 "六朝遺事雜詠",
 "蒙川詩集",
 "藤齋小集",
 "雁山吟",
 "說劍吟",
 "農歌續集",
 "圖詩",
 "怡雲軒詩集",
 "棣華館小集",
 "彝齋集",
 "秋堂遺稿",
 "王尚書遺稿",
 "瑞州小集",
 "小畜集鈔",
 "騎省集鈔",
 "安陽集鈔",
 "滄浪集鈔",
 "乖崖詩鈔",
 "清獻詩鈔",
 "宛陵詩鈔",
 "武溪詩鈔",
 "歐陽文忠詩鈔",
 "和靖詩鈔",
 "徂徠詩鈔",
 "武仲清江集鈔",
 "文仲清江集鈔",
 "平仲清江集鈔",
 "南陽集鈔",
 "臨川詩鈔",
 "西塘詩鈔",
 "廣陵詩鈔",
 "後山詩鈔",
 "丹淵集鈔",
 "襄陽詩鈔",
 "山谷詩鈔",
 "宛丘詩鈔",
 "具茨集鈔",
 "陵陽詩鈔",
 "雞肋集鈔",
 "道鄉詩鈔",
 "淮海集鈔",
 "江湖長翁詩鈔",
 "雲巢詩鈔",
 "西溪集鈔",
 "龜谿集鈔",
 "節孝詩鈔",
 "簡齋詩鈔",
 "盱江集鈔",
 "雙溪詩鈔",
 "眉山詩鈔",
 "鴻慶集鈔",
 "蘆川歸來集鈔",
 "建康集鈔",
 "橫浦詩鈔",
 "浮溪集鈔",
 "香溪集鈔",
 "屏山集鈔",
 "韋齋詩鈔",
 "玉瀾集鈔",
 "北山小集鈔",
 "竹洲詩鈔",
 "益公省齋藁鈔",
 "益公平園續稿鈔",
 "文公集鈔",
 "石湖詩鈔",
 "劍南詩鈔",
 "止齋詩鈔",
 "誠齋江湖集鈔",
 "荊溪集鈔",
 "西歸集鈔",
 "南海集鈔",
 "朝天集鈔",
 "江西道院集鈔",
 "朝天續集鈔",
 "江東集鈔",
 "退休集鈔",
 "浪語集鈔",
 "水心詩鈔",
 "艾軒詩鈔",
 "攻媿集鈔",
 "清苑齋詩鈔",
 "葦碧軒詩鈔",
 "芳蘭軒詩鈔",
 "二薇亭詩鈔",
 "知稼翁集鈔",
 "後村詩鈔",
 "盧溪集鈔",
 "漫塘詩鈔",
 "義豐集鈔",
 "東皐詩鈔",
 "石屏詩鈔",
 "農歌集鈔",
 "秋崖小稿鈔",
 "清雋集鈔",
 "晞髮集鈔",
 "晞髮近稿鈔",
 "附天地間集",
 "文山詩鈔",
 "先天集鈔",
 "白石樵唱鈔",
 "山民詩鈔",
 "水雲詩鈔",
 "隆吉詩鈔",
 "潛齋詩鈔",
 "參寥詩鈔",
 "石門詩鈔",
 "花蕊詩鈔",
 "小畜集補鈔",
 "騎省集補鈔",
 "安陽集補鈔",
 "滄浪集補鈔",
 "武溪集補鈔",
 "歐陽文忠詩補鈔",
 "和靖集補鈔",
 "平仲清江集補鈔",
 "文仲清江集補鈔",
 "南陽集補鈔",
 "臨川集補鈔",
 "東坡集補鈔",
 "西塘集補鈔",
 "廣陵集補鈔",
 "後山集補鈔",
 "丹淵集補鈔",
 "襄陽集補鈔",
 "山谷集補鈔",
 "宛丘集補鈔",
 "具茨集補鈔",
 "陵陽集補鈔",
 "雞肋集補鈔",
 "道鄉集補鈔",
 "淮海集補鈔",
 "江湖長翁鈔",
 "龍雲集鈔",
 "雲巢集補鈔",
 "西谿集補鈔",
 "龜谿集補鈔",
 "節孝集補鈔",
 "簡齋集補鈔",
 "旴江集補鈔",
 "栟櫚集鈔",
 "雙溪集補鈔",
 "眉山集補鈔",
 "鴻慶集補鈔",
 "蘆川歸來集補鈔",
 "建康集補鈔",
 "橫浦集補鈔",
 "浮溪集補鈔",
 "香溪集補鈔",
 "屏山集補鈔",
 "韋齋集補鈔",
 "玉瀾集補鈔",
 "竹洲集補鈔",
 "省齋集補鈔",
 "平園集補鈔",
 "文公集補鈔",
 "石湖集補鈔",
 "止齋集補鈔",
 "誠齋集補鈔",
 "水心集補鈔",
 "攻媿集補鈔",
 "清苑齋集補鈔",
 "葦碧軒集補鈔",
 "芳蘭軒集補鈔",
 "二薇亭集補鈔",
 "知稼翁集補鈔",
 "後村集補鈔",
 "盧溪集補鈔",
 "勉齋集鈔",
 "鶴山集鈔",
 "東皐集補鈔",
 "石屏集補鈔",
 "農歌集補鈔",
 "蛟峯集鈔",
 "雪巖集鈔",
 "秋崖集補鈔",
 "縉雲集鈔",
 "玉楮集鈔",
 "滄浪吟集鈔",
 "竹齋集鈔",
 "晞髮集補鈔",
 "文山詩補鈔",
 "疊山集鈔",
 "白石樵唱集補鈔",
 "水雲集補鈔",
 "隆吉集補鈔",
 "仲安集鈔",
 "所南集鈔",
 "潛齋集補鈔",
 "魯齋集鈔",
 "玉蟾集鈔",
 "參寥集補鈔",
 "石門文字禪集補鈔",
 "斷腸集",
 "東坡先生詩鈔",
 "山谷先生詩鈔",
 "石湖先生詩鈔",
 "放翁先生詩鈔",
 "宛陵詩選",
 "廬陵詩選",
 "南豐詩選",
 "臨川詩選",
 "東坡詩選",
 "欒城詩選",
 "山谷詩選",
 "石湖詩選",
 "劍南詩選",
 "誠齋詩選",
 "梅溪詩選",
 "朱子詩選",
 "菊磵詩選",
 "秋崖詩選",
 "文山詩選",
 "景文詩集",
 "伐壇集",
 "陳副使遺藁",
 "文潞公集",
 "樂靜居士集",
 "姑溪集",
 "松隱集",
 "雅林小藁",
 "醉軒集",
 "網山月魚集",
 "漁詩詩藁",
 "秋堂遺藁",
 "雪窗小藁",
 "臞翁集",
 "龍洲道人集",
 "梅屋吟藁",
 "順適堂吟藁",
 "白石道人集",
 "靜佳詩集",
 "沃州鴈山吟",
 "橘潭詩藁",
 "杜清獻集",
 "芸居乙藁",
 "山居存藁",
 "方壺存藁",
 "端平集",
 "露香拾藁",
 "雪篷詩藁",
 "竹莊小藁",
 "骳藁",
 "適安藏拙餘藁",
 "芸隱詩集",
 "竹溪詩集",
 "無懷小集",
 "抱拙小藁",
 "瓜廬集",
 "吾竹小藁",
 "雪坡小藁",
 "雪泉詩集",
 "靖逸小藁",
 "斗野支藁",
 "端隱吟藁",
 "實齋詠梅集",
 "雪磯叢藁",
 "可齋詩藁",
 "竹所吟藁",
 "佩韋齋集",
 "西麓詩藁",
 "古梅吟藁",
 "滄洲集",
 "采芝集",
 "臨川詩集",
 "西塘詩集",
 "廣陵詩集",
 "後山詩集",
 "襄陽詩集",
 "山谷集鈔",
 "宛丘詩集",
 "節孝詩集",
 "雙溪詩集",
 "梅溪詩集",
 "漫塘詩集",
 "秋崖小藁集",
 "文山詩集",
 "白石樵唱集",
 "山民詩集",
 "水雲詩集",
 "隆吉詩集",
 "乖崖詩集",
 "清獻詩集",
 "宛陵詩集",
 "武溪詩集",
 "歐陽文忠詩集",
 "徂徠詩集",
 "眉山詩集",
 "竹洲詩集",
 "益公省齋藁集",
 "朱子詩集",
 "石湖集鈔",
 "劍南集鈔",
 "後村詩集",
 "大隱居士集",
 "蘭皋集",
 "柳堂外集",
 "鐵牛翁遺槀",
 "崧庵集",
 "竹齋先生詩集",
 "宋學士徐文惠公存稿",
 "元獻遺文",
 "慶湖遺老詩集",
 "後集補遺",
 "寧極齊稿",
 "北遊詩集",
 "莆陽知稼翁文集",
 "德隅堂畫品",
 "洛陽九老祖龍學文集",
 "骳稿",
 "釋希旦詩",
 "聖宋九僧詩",
 "宋著作王先生文集",
 "須溪先生四景詩集",
 "蒙泉詩藁",
 "學詩初藁",
 "檜庭吟藁",
 "雲臥詩藁",
 "北窗詩藁",
 "雅林小集",
 "雲泉詩集",
 "簫臺公餘詞",
 "玉照堂詞鈔",
 "龍洲道人詩集",
 "玉楮詩藁",
 "雪牕小集",
 "斗野藁",
 "野谷詩藁",
 "陵陽先生詩",
 "倚松老人詩集",
 "方泉先生詩集",
 "棠湖詩",
 "雪巖吟草",
 "梅屋詩藁",
 "融春小綴",
 "梅屋第三藁",
 "第四藁",
 "竹溪十一藁詩選",
 "菊澗小集",
 "北牕詩藁",
 "心游摘藁",
 "乙卷",
 "漁溪詩藁",
 "斗野藁支卷",
 "靜佳龍尋藁",
 "雪窗小集",
 "雪蓬藁",
 "順適堂吟藁甲集",
 "知不足齋輯錄宋集補遺",
 "白石道人集補遺",
 "菊潭詩集補遺",
 "雪巖吟草補遺",
 "菊磵小集補遺",
 "疎寮小集補遺",
 "靖逸小集補遺",
 "秋江煙草補遺",
 "巽齋小集補遺",
 "招山小集補遺",
 "靜佳乙藁補遺",
 "雪窗小集補遺",
 "南宋八家集",
 "葦碧軒集",
 "梅花衲",
 "退菴先生遺集",
 "芸居遺詩",
 "吾竹小稾",
 "梅屋詩稾",
 "梅屋第四藁",
 "芸隱橫舟藁",
 "勌游藁",
 "竹所吟槀",
 "適安藏拙餘槀",
 "乙槀",
 "疏寮小集",
 "檜亭吟稿",
 "骳稾",
 "漁溪詩稾",
 "斗野稾支卷",
 "露香拾稾",
 "竹溪十一稾詩選",
 "靜佳乙稾",
 "靜佳龍尋槀",
 "山居存槀",
 "端隱吟槀",
 "雪蓬稾",
 "心游摘槀",
 "林同孝詩",
 "蒙泉詩稾",
 "野谷詩稾",
 "亞愚江浙紀行集句詩",
 "增廣聖宋高僧詩選前集",
 "前賢小集拾遺",
 "中興羣公吟藁戊集",
 "羣賢小集補遺",
 "葦碧軒集補遺",
 "清苑齋集補遺",
 "芳蘭軒集補遺",
 "二薇亭集補遺",
 "述古先生詩集",
 "蘇文忠公尺牘",
 "黃文節公尺牘",
 "淮海先生文粹",
 "豫章先生文粹",
 "濟北先生文粹",
 "宛丘先生文粹",
 "後山居士文粹",
 "濟南先生文粹",
 "壺山先生",
 "臞軒先生",
 "後村先生",
 "巽齋先生",
 "附校札記",
 "滹南遺老王先生文集",
 "蕭閑老人明秀集注",
 "摭遺",
 "遺山先生詩集",
 "玉山草堂集",
 "張伯雨集外詩",
 "虞伯生詩",
 "楊仲弘詩",
 "莊靖先生集",
 "丁亥集",
 "靜修續集",
 "靜修遺詩",
 "靜修拾遺",
 "月屋漫藁",
 "富山嬾藁",
 "寧極齋藁",
 "輝山存藁",
 "草廬集",
 "金囦吟",
 "雪莊類藁",
 "漢泉漫藁",
 "閑居叢藁",
 "雲峰集",
 "德機集",
 "秋宜集",
 "日損齋稿",
 "天錫集",
 "鯨背吟",
 "玩齋拾遺",
 "存復齋集",
 "清江碧嶂集",
 "叔淵遺藁",
 "白雲先生集",
 "寶峯集",
 "溝南漫存藁",
 "友石山人遺藁",
 "師山集",
 "圭峰集",
 "傲軒吟藁",
 "待清軒遺藁",
 "復古詩",
 "鐵崖先生集",
 "廬陵集",
 "清閟閣藁",
 "黃楊集",
 "海巢集",
 "玉山璞藁",
 "霞外集",
 "筠溪牧潛集",
 "山居詩",
 "澹居藁",
 "師子林別錄",
 "綠窻遺稿",
 "安南集",
 "神仙遯士集",
 "山村遺藁",
 "存悔齋藁",
 "石塘稾",
 "竹素山房詩",
 "習嬾齋藁",
 "立雪稾",
 "青山稾",
 "水雲稾",
 "昭忠逸詠",
 "稼村類槀",
 "雪齋集",
 "還山遺稾",
 "鹿菴集",
 "威卿集",
 "兩山稾",
 "野齋集",
 "牧菴集",
 "秋谷集",
 "困學齋集",
 "酸齋集",
 "素履齋槀",
 "房山集",
 "養蒙先生集",
 "秋岡先生集",
 "彥威集",
 "鳩巢漫稾",
 "子方集",
 "子構集",
 "知非堂稾",
 "松鄉集",
 "紫巖集",
 "旴里子集",
 "得之集",
 "清江集",
 "至治集",
 "江亭集",
 "正卿集",
 "溉之集",
 "梅花菴稾",
 "大癡道人集",
 "樵水集",
 "桂隱集",
 "五雲漫稾",
 "宗海集",
 "江檻集",
 "允從集",
 "雲嶠集",
 "農務集",
 "梅花字字香",
 "子中集",
 "滋溪集",
 "箹房樵唱",
 "新山稿",
 "野航亭稾",
 "滄江散人集",
 "雲臺集",
 "山陰集",
 "龜巢稾",
 "青邨遺稾",
 "東山存稾",
 "素軒集",
 "主一集",
 "山窗餘藁",
 "佩玉齋類槀",
 "清輝樓稾",
 "看雲集",
 "松瀑稾",
 "學詩初稾",
 "中峰廣錄",
 "寒拾里人稾",
 "古鼎外集",
 "栯堂山居詩",
 "碧山堂集",
 "聯芳集",
 "貽溪集",
 "子颺集",
 "白雲子集",
 "兌齋集",
 "緱山集",
 "善夫先生集",
 "陶然集",
 "石堂先生遺稾",
 "聊復軒斐集",
 "自家意思集",
 "祥卿集",
 "北村集",
 "敬仲集",
 "疎齋集",
 "玉霄集",
 "海粟集",
 "雪菴集",
 "如是翁集",
 "侍郎集",
 "華峰漫稾",
 "拙菴集",
 "仁父集",
 "超然集",
 "聲之集",
 "南山先生集",
 "丹丘生稾",
 "時中集",
 "可立集",
 "絪縕集",
 "中行齋集",
 "本齋集",
 "仲實集",
 "仁里漫稾",
 "止止齋稾",
 "覺是集",
 "仲淵集",
 "仲禮集",
 "兩峰慚稾",
 "鳴琴集",
 "江村先生集",
 "元亮集",
 "太初集",
 "芝軒集",
 "宛陵遺稾",
 "伯將集",
 "萬戶集",
 "君瑞集",
 "子平遺稾",
 "廷美集",
 "純節先生集",
 "師魯集",
 "容窗集",
 "純白類槀",
 "世玉集",
 "石渠居士集",
 "松雲道人集",
 "春詠亭集",
 "宜之集",
 "彥德集",
 "啟文集",
 "寄情稾",
 "柔克齋集",
 "寅夫集",
 "孤篷倦客稾",
 "子素集",
 "鄭氏聯璧集",
 "廷璧集",
 "貞期生稾",
 "弋陽山樵稾",
 "杞菊軒稾",
 "仲贅集",
 "敬聚齋稾",
 "仲愈集",
 "溪雲集",
 "學古集",
 "履道集",
 "明卿集",
 "鐵牛翁遺稾",
 "雲松野褐集",
 "希呂集",
 "山長集",
 "雲丘道人集",
 "睿夫集",
 "乾乾居士集",
 "公振集",
 "來鶴草堂稾",
 "既白軒稾",
 "竹洲歸田稾",
 "豆亭集",
 "會稽外史集",
 "不繫舟集",
 "凝始子集",
 "蘭雪集",
 "靜樂稾",
 "國朝風雅",
 "偉觀集",
 "馬石田文集",
 "明秀集補遺",
 "滏水集補遺",
 "滹南遺老集補遺",
 "遺山集補遺",
 "莊靖集補遺",
 "二妙集補遺",
 "天籟集補遺",
 "馮海粟梅花百詠詩",
 "中峯和馮海粟梅花詩",
 "賡和中峯詩韻",
 "高楊張徐集",
 "高季迪集",
 "楊孟載集",
 "張來儀集",
 "徐幼文集",
 "宋學士集",
 "劉誠意伯集",
 "林員外集",
 "袁海叟集",
 "王學士集",
 "王舍人集",
 "浦舍人集",
 "錢翰撰集",
 "李文正公集",
 "邵文莊公集",
 "石閣老集",
 "夏赤城集",
 "秦修敬集",
 "李空同集",
 "沈石田集",
 "桑思玄集",
 "史山人集",
 "二杭詩集",
 "杭世卿集",
 "杭東卿集",
 "張伎陵集",
 "顧司寇集",
 "熊侍御集",
 "王渼陂集",
 "二朱詩集",
 "朱升之集",
 "朱子价集",
 "孫山人集",
 "何大復集",
 "王浚川集",
 "左中川集",
 "邊華泉集",
 "康狀元集",
 "徐尚書集",
 "二俞詩集",
 "俞國昌集",
 "俞國光集",
 "祝枝山集",
 "徐迪功集",
 "殷石川集",
 "王太僕集",
 "戴學憲集",
 "韓參議集",
 "方棠陵集",
 "楊升菴集",
 "薛考功集",
 "張禺山集",
 "蔣南泠集",
 "王夢澤集",
 "李嵩渚集",
 "陳行卿集",
 "馬西玄集",
 "許少華集",
 "許雲村集",
 "陸盧龍集",
 "二周詩集",
 "周定齋集",
 "周浮峰集",
 "高蘇門集",
 "黃泰泉集",
 "徐相公集",
 "栗太行集",
 "傅夢求集",
 "蔡翰目集",
 "文翰詔集",
 "唐伯虎集",
 "傅山人集",
 "王參政集",
 "華學士集",
 "樊南溟集",
 "屠漸山集",
 "王履吉集",
 "王少泉集",
 "陸貞山集",
 "袁學憲集",
 "陳后岡集",
 "二黃集",
 "黃五嶽集",
 "黃質山集",
 "田豫陽集",
 "張崑崙集",
 "唐中丞集",
 "陳鳴野集",
 "宗室匡南集",
 "羅贊善集",
 "沈鳳峯集",
 "任少海集",
 "薛浮休集",
 "皇甫昆季集",
 "皇甫華陽集",
 "皇甫百泉集",
 "皇甫理山集",
 "續皇甫百泉集",
 "孔方伯集",
 "蔡白石集",
 "王巖潭集",
 "朱鎮山集",
 "許茗山集",
 "王祭酒集",
 "薛憲副集",
 "喬三石集",
 "陳參議集",
 "王僉憲集",
 "馮少洲集",
 "侯二谷集",
 "孟衛源集",
 "吳霽寰集",
 "范中方集",
 "華比部集",
 "謝中丞集",
 "何刑侍集",
 "洪芳洲集",
 "施武陵集",
 "姚山人集",
 "萬履菴集",
 "鄧山人集",
 "宗室武岡王集",
 "張王屋集",
 "鄭石南集",
 "許長史集",
 "郭山人集",
 "羅山人集",
 "李學憲集",
 "王副使集",
 "李尚寶集",
 "徐龍灣集",
 "吳川樓集",
 "梁比部集",
 "張居來集",
 "盧次楩集",
 "周山人集",
 "史文學集",
 "王澄原集",
 "謝茂秦集",
 "俞仲蔚集",
 "王上舍集",
 "梁國子生集",
 "張敉集",
 "俞繡峯集",
 "龔內監集",
 "釋雪江集",
 "釋魯山集",
 "釋半峯集",
 "釋同石集",
 "淑秀總集",
 "廣中四傑集",
 "孫仲衍集",
 "王彥舉集",
 "黃庸之集",
 "李仲修集",
 "汪右丞集",
 "張翰講集",
 "倪隱君集",
 "吳主一集",
 "唐丹崖集",
 "趙鳴秋集",
 "郭子章集",
 "許士修集",
 "華氏黃楊集",
 "解學士集",
 "韓中允集",
 "二倪詩集",
 "倪維嶽集",
 "倪汝敬集",
 "練榜眼集",
 "姚少師集",
 "曾狀元集",
 "郭定襄伯集",
 "王翰檢集",
 "林登州集",
 "高漫士集",
 "王皆山集",
 "劉忠宣公集",
 "聶掌教集",
 "張東海集",
 "張白齋集",
 "薛檢討集",
 "謝文肅公集",
 "羅太守集",
 "王古直集",
 "錢山人集",
 "湯將軍集",
 "顧東江集",
 "周草庭集",
 "秦端敏公集",
 "錢太守集",
 "王方伯集",
 "朱蕩南集",
 "孫鷺沙集",
 "楊通府集",
 "周尚書集",
 "莫南沙集",
 "顧同府集",
 "陸文裕公集",
 "顧憲副集",
 "齊憲副集",
 "王僉事集",
 "鄒九峯集",
 "敖東谷集",
 "朱福州集",
 "錢逸人集",
 "二浦詩集",
 "浦文玉集",
 "浦道徵集",
 "張學士集",
 "顧廉訪集",
 "二謝詩集",
 "謝野全集",
 "謝與槐集",
 "張通參集",
 "王止一集",
 "潘尚書集",
 "張司馬集",
 "續傅夢求集",
 "蘇督撫集",
 "孫漁人集",
 "續傅山人集",
 "馮三石集",
 "吳少參集",
 "田莘野集",
 "沈少參集",
 "續姚山人集",
 "唐山人集",
 "續沈鳳峯集",
 "薛兵憲集",
 "張臬副集",
 "姚本修集",
 "沈石灣集",
 "續黃五嶽集",
 "陳山人集",
 "岳山人集",
 "顧給舍集",
 "高光州集",
 "趙文學集",
 "周太僕集",
 "包侍御集",
 "秦封君集",
 "秦方伯集",
 "強德州集",
 "王侍御集",
 "黎瑤石集",
 "駱翰編集",
 "王禮部集",
 "王翰林集",
 "陸文學集",
 "陳隱士集",
 "許石城集",
 "舒東岡集",
 "林介山集",
 "尹洞山集",
 "溫大谷集",
 "續王僉憲集",
 "茅副使集",
 "二莫詩集",
 "莫中江集",
 "莫少江集",
 "曹于野集",
 "呂山人集",
 "續萬履菴集",
 "何翰目集",
 "萬總戎集",
 "續皇甫理山集",
 "龔憲副集",
 "劉魏比玉集",
 "劉子威集",
 "魏季朗集",
 "王督撫集",
 "李青霞集",
 "續王鳳洲集",
 "續李滄溟集",
 "王儀部集",
 "胡苑卿集",
 "方員外集",
 "續吳川樓集",
 "李武選集",
 "張周田集",
 "續徐龍灣集",
 "余憲副集",
 "李內翰集",
 "范中吳集",
 "王氏松雲集",
 "沈青門集",
 "方侍御集",
 "沈嘉則集",
 "朱仲開集",
 "吳之山集",
 "張心父集",
 "陸客集",
 "歐司訓集",
 "丁少鶴集",
 "梁中舍集",
 "金白嶼集",
 "李千戶集",
 "馮海浮集",
 "徐文學集",
 "魯藩二宗室集",
 "務本公集",
 "史立公集",
 "顧山人集",
 "林公子集",
 "葉客集",
 "周東田集",
 "王逸人集",
 "李公子集",
 "王僅初集",
 "王貢士集",
 "潘象安集",
 "康裕卿集",
 "續王上舍集",
 "朱山人集",
 "莫公遠集",
 "顧伯子集",
 "張文學集",
 "童賈集",
 "黃趙客集",
 "釋全室集",
 "釋夢觀集",
 "釋方澤集",
 "盧羽士集",
 "章羽士集",
 "錢羽士集",
 "楊狀元妻詩集",
 "馬氏芷居集",
 "孫夫人詩集",
 "潘氏詩集",
 "李生集",
 "貝清江先生全集",
 "高青邱集",
 "程巽隱先生全集",
 "李卓吾評選方正學文集",
 "李卓吾評選楊椒山集",
 "李卓吾評于節闇集奏疏",
 "丘文莊公集",
 "凝齋稿",
 "保和齋稿",
 "綠筠軒稿",
 "清秋唱和引",
 "脩業堂稿",
 "陳白陽集",
 "石田先生集",
 "徐昌穀集",
 "宋文憲先生集選",
 "劉文成先生集選",
 "方正學先生集選",
 "王文成先生集選",
 "唐荊川先生集選",
 "王遵巖先生集選",
 "歸震川先生集選",
 "茅鹿門先生集選",
 "李崆峒先生詩集",
 "何仲默先生詩集",
 "空同集選",
 "大復集選",
 "滄溟集選",
 "弇州集選",
 "李空同詩集",
 "何大復詩集",
 "徐迪功詩集",
 "邊華泉詩集",
 "空同詩集",
 "信陽詩集",
 "滄溟詩集",
 "弇州山人詩集",
 "餐蔗堂殘詩",
 "志學堂殘詩",
 "蝶園草殘稿",
 "東田集",
 "隰西草堂詩集",
 "附遯渚唱和集",
 "蜃園文集",
 "詩前集",
 "七言雜詠",
 "梅花集句十首",
 "九山遊草",
 "蠹魚稿",
 "芳洲詩文集",
 "宗賢和尚集",
 "有明兩大儒（王守仁高攀龍）手帖",
 "明十五完人手帖",
 "大參陳公手集同人尺牘",
 "王文成與朱侍御三劄",
 "瞿忠宣公手札及蠟丸書",
 "明東林八賢遺札",
 "明賢名翰合冊",
 "鵠灣遺稿",
 "石林西墅遺稿",
 "裴村遺稿",
 "黃葉庵遺稿",
 "珠塵遺稿",
 "清喚齋遺稿",
 "素水居遺稿",
 "四溟山人集選",
 "澗上集選",
 "射堂集選",
 "林孝廉集選",
 "雪鴻集選",
 "嶽歸堂集選",
 "嶽歸堂遺集選",
 "鵠灣集選",
 "溉園集選",
 "鼇峯集選",
 "松圓浪淘集選",
 "耦耕堂集選",
 "不已集選",
 "河邨集選",
 "嶧桐後集選",
 "汊上集選",
 "石臼後集選",
 "自娛齋集選",
 "蓮鬚閣集選",
 "涉江集選",
 "昔耶園集選",
 "唾餘集選",
 "幾社集選",
 "作朋集選",
 "渚宮集選",
 "潭庵集選",
 "褐塞軒集選",
 "樸草選",
 "天爵堂集選",
 "棲約齋集選",
 "時術堂集選",
 "王學人遺集選",
 "棗堂集選",
 "梁一儒詩",
 "馮明期詩",
 "沈師昌詩",
 "楊惟休詩",
 "賴古集",
 "比部集",
 "四照堂集",
 "窺園集",
 "僅齋集",
 "珠樹堂集",
 "澤月齋集",
 "斗齋詩選",
 "學易庵詩選",
 "安雅堂詩選",
 "愚山詩選",
 "顥亭詩選",
 "信美軒詩選",
 "稽留詩選",
 "魏貞菴詩",
 "李坦園詩",
 "王敬哉詩",
 "龔芝麓詩",
 "梁蒼巖詩",
 "王胥庭詩",
 "錢牧齋詩",
 "吳梅村詩",
 "曹秋岳詩",
 "申鳧盟詩",
 "曹澹餘詩",
 "佟高岡詩",
 "楊猶龍詩",
 "戴道默詩",
 "沈繹堂詩",
 "陳說巖詩",
 "王西樵詩",
 "王阮亭詩",
 "曹顧菴詩",
 "施愚山詩",
 "嚴顥亭詩",
 "宋荔裳詩",
 "張爾成詩",
 "梁敷五詩",
 "范覲公詩",
 "范允公詩",
 "范彥公詩",
 "魏竟甫詩",
 "孔心一詩",
 "郜凌玉詩",
 "陳綠崖詩",
 "柯素培詩",
 "毛錦來詩",
 "成率菴詩",
 "程湟榛詩",
 "周計百詩",
 "李梅邨詩",
 "傅暘谷詩",
 "程天翼詩",
 "嚴柱峯詩",
 "顧見山詩",
 "陸密菴詩",
 "周伯衡詩",
 "王北山詩",
 "范雪樵詩",
 "王蓼航詩",
 "竇松濤詩",
 "王雪洲詩",
 "李素園詩",
 "紀檗子詩",
 "劉智侯詩",
 "黃石笥詩",
 "宋子飛詩",
 "孔紹先詩",
 "申定舫詩",
 "袁杜少詩",
 "毛乳雪詩",
 "梅瞿山詩",
 "計甫艸詩",
 "趙書癡詩",
 "孟二青詩",
 "程念伊詩",
 "楊潤丘詩",
 "成仲謙詩",
 "黃美中詩",
 "黃志伊詩",
 "張又益詩",
 "張企麓詩",
 "張念麓詩",
 "劉魚計詩",
 "戴雪看詩",
 "李劬菴詩",
 "陸雪樵詩",
 "沈彥澈詩",
 "朱汗朱詩",
 "孫雪厓詩",
 "劉夢闈詩",
 "楊宣樓詩",
 "楊因之詩",
 "劉瑞公詩",
 "王昊廬詩",
 "丘曙戒詩",
 "葉蓉菴詩",
 "宗定九詩",
 "毛端峯詩",
 "黃訥庵詩",
 "曹陸海詩",
 "吳南溪詩",
 "釋蒼雪詩",
 "釋南菴詩",
 "魏惟度詩",
 "金豈凡詩選",
 "薛行屋詩選",
 "程端伯詩選",
 "曹秋岳詩選",
 "周櫟園詩選",
 "趙蘊退詩選",
 "彭禹峰詩選",
 "柯素培詩選",
 "姜真源詩選",
 "王玉叔詩選",
 "曹顧庵詩選",
 "劉航石詩選",
 "劉岸先詩選",
 "董文友詩選",
 "王敬哉詩選",
 "魏石生詩選",
 "楊猶龍詩選",
 "盧澹崖詩選",
 "施愚山詩選",
 "王貽上詩選",
 "黃雲孫詩選",
 "嚴灝亭詩選",
 "錢日庵詩選",
 "鄒訏士詩選",
 "錢先生詩",
 "吳先生詩",
 "熊先生詩",
 "龔先生詩",
 "宋先生詩",
 "靜惕堂詩",
 "賴古堂詩",
 "南田詩",
 "采山堂詩",
 "十笏草堂詩",
 "遺山詩",
 "青門詩",
 "陋軒詩",
 "畏壘山人詩",
 "弱水詩",
 "柏支亭稿",
 "龍樹齋稿",
 "龍華院稿",
 "王氏漁洋詩鈔",
 "宋氏綿津詩鈔",
 "荔裳詩選",
 "顧菴詩選",
 "繹堂詩選",
 "西樵詩選",
 "湟榛詩選",
 "阮亭詩選",
 "說巖詩選",
 "荔裳詩鈔",
 "愚山詩鈔",
 "阮亭詩鈔",
 "秋谷詩鈔",
 "竹垞詩鈔",
 "初白詩鈔",
 "西廬詩集",
 "西谿詩集",
 "浣愁草",
 "雲門詩集",
 "桂山堂詩鈔",
 "學源堂詩鈔",
 "中山集詩鈔",
 "茨菴集詩鈔",
 "且亭詩鈔",
 "漫與詩稿",
 "香山詩稿",
 "芳潤堂詩稿",
 "桐邨詩槀",
 "草草亭詩槀",
 "曉谷詩槀",
 "耕養齋集",
 "硯山堂集",
 "履二齋集",
 "聽雨樓集",
 "媕雅堂集",
 "辛楣吟藁",
 "宛委山房集",
 "研山堂集",
 "蒲褐山房集",
 "硯靜齋集",
 "花雨香齋集",
 "借樹軒集",
 "拳石山房集",
 "古槐草堂集",
 "深竹閒園集",
 "槐陰樓集",
 "聽雨草堂集",
 "天瓢文鈔",
 "停霞詩鈔",
 "西莊詞鈔",
 "雪蕉集鈔",
 "晴沙文鈔",
 "錢唐集鈔",
 "蒙泉詩鈔",
 "蠹餘草",
 "繡餘小草",
 "嘉樂堂詩集",
 "芸香堂詩集",
 "延禧堂詩鈔",
 "竹所詞稿",
 "余棲書屋詞藳",
 "鎮石齋詩稿鈔存",
 "不波書舫詩稿",
 "樂潛堂集",
 "拜石山房集",
 "金粟葊集",
 "壺園集",
 "真松閣集",
 "秋潭詩選",
 "竹嶼詩選",
 "岱輿詩選",
 "漁菴詩選",
 "願學齋唫藳",
 "秦晉詩存",
 "情影集存稿",
 "靈石軒存稿",
 "借園詩存",
 "蒼水詩鈔",
 "肩鳳齋存稿",
 "待蘭軒存稿",
 "知魚樂齋存稿",
 "蓉湖存稿",
 "堞影軒存稿",
 "紙香書屋存稿",
 "夢闌居士存稿",
 "吟香館存稿",
 "鐵盂居士存稿",
 "惺齋詩存",
 "海鷗集存稿",
 "燃松閣存稿",
 "六梅書屋存稿",
 "有竹居存稿",
 "清籟館存稿",
 "鐵硯齋存稿",
 "小如詩存",
 "夢綠詩鈔",
 "小雲液草",
 "白雲軒存稿",
 "棣華軒存稿",
 "醒菴存稿",
 "石香存稿",
 "湘痕閣存稿",
 "白醉題襟",
 "草堂題贈",
 "柏梘山房文鈔",
 "月滄文鈔",
 "來鶴山房文鈔",
 "致翼堂文鈔",
 "經德堂文鈔",
 "龍壁山房文鈔",
 "漢南春柳詞鈔",
 "瘦春詞鈔",
 "雪波詞鈔",
 "桐軒詩鈔",
 "惟雒齋詩鈔",
 "聽松濤館詩選",
 "信芳閣詩存",
 "佩雅堂詩鈔",
 "九疊山房詩存",
 "佩湘詩草",
 "月波樓詩草",
 "識密齋詩鈔",
 "迦齡盦詩鈔",
 "李文恭公詩存",
 "訪粵集",
 "有嘉聲齋賸草",
 "葆天爵齋遺草",
 "侶石山房詩草",
 "息踵軒賸草",
 "慎誠堂詩鈔",
 "陳禮部集",
 "嶺海樓詩鈔",
 "樂志堂詩集",
 "挹甕齋詩草",
 "春暉書屋詩集",
 "子良詩存",
 "榕塘吟館詩鈔",
 "融谷詩草",
 "宜亭草",
 "嘯劍山房剩草",
 "靈洲山人詩鈔",
 "詩義堂後集",
 "蓼東賸草",
 "懹古田舍詩鈔",
 "彊恕齋吟草",
 "二知軒詩鈔",
 "捉麈集",
 "醉鶴詩草",
 "蔗境軒詩鈔",
 "遺經樓草",
 "洛川詩畧",
 "嶽雪樓詩存",
 "漁石賸草",
 "珍帚編詩集",
 "知稼軒詩鈔",
 "公餘閒詠詩鈔",
 "綠雲軒吟草",
 "雲圃詩鈔",
 "軍中草",
 "夢花草堂詩錄",
 "日新樓詩草",
 "柳村遺草",
 "至堂詩鈔",
 "海天樓詩鈔",
 "太華山人詩存",
 "松石齋詩集",
 "愛廬吟草",
 "松寮詩訪存",
 "樵湖詩鈔",
 "紅樹山莊詩鈔",
 "澧陽遺草",
 "枕琴僅存草",
 "味鐙閣詩鈔",
 "竹筠書屋詩鈔",
 "夢鯉山房詩鈔",
 "插菊軒詩鈔",
 "二山賸稿",
 "迂翁詩草",
 "黎齋詩草",
 "杏林莊吟草",
 "寄漚館拾餘草",
 "未覺軒賸草",
 "修竹軒遺草",
 "六橋詩集",
 "春藻堂詩集",
 "嵋君詩鈔",
 "山右吟草",
 "四照堂詩集",
 "芙生詩鈔",
 "曼陀羅盦詩鈔",
 "寶墨樓詩冊",
 "如不及軒詩草",
 "務時敏齋詩集",
 "耘花館詩鈔",
 "聽秋閣詩鈔",
 "雲洋山館詩鈔",
 "仰高軒詩草",
 "知不足齋詩草",
 "海鶴巢詩鈔",
 "雙桐圃詩鈔",
 "瑞香吟館遺草",
 "雲根老屋詩鈔",
 "夢香園賸草",
 "槐花吟館詩鈔",
 "評琴書屋吟草",
 "紅蔦山房詩鈔",
 "倚魚山閣詩集",
 "覺非堂稿",
 "巢雲山房詩鈔",
 "有絮吟館詩鈔",
 "雪鴻草",
 "玉儀軒吟草",
 "崎陽雜詠",
 "松雲閣詩鈔",
 "劍生遺草",
 "六友堂賸草",
 "小山園吟草",
 "雪香齋吟草",
 "退學吟庵詩鈔",
 "朝珊賸草",
 "樵西草堂詩鈔",
 "安所遇軒詩鈔",
 "湖海詩存",
 "春星閣詩鈔",
 "蓉舟遺詩",
 "二半山房吟草",
 "松菊山房詩刪",
 "不寐齋詩畧",
 "小摩圍閣詩鈔",
 "桃花仙館詩鈔",
 "潛修堂吟草",
 "翠竹軒詩鈔",
 "竹素園詩鈔",
 "心復心齋詩鈔",
 "聽鸝軒詩鈔",
 "六勿軒詩存",
 "愛竹館詩藳",
 "孕花吟草",
 "悔昨齋詩錄",
 "巢蚊睫齋詩稿",
 "蓬蓬館詩稿",
 "焦琴吟草",
 "瀟碧亭吟稿",
 "覺鹿軒詩草",
 "龜樹根館詩草",
 "三十二蘭亭室詩鈔",
 "佩韋齋詩鈔",
 "懺花盦詩鈔",
 "自怡齋詩鈔",
 "眠琴館詩鈔",
 "秦瓦硯齋詩鈔",
 "虛舟詩草",
 "詩愚餘草",
 "秩堂賸稿",
 "磬舟遺稿",
 "醉客詩草",
 "小泉詩草",
 "惜陰軒詩草",
 "雙青堂詩鈔",
 "蕉雨山房詩集",
 "鳴琴仙館詩鈔",
 "攬芳園詩鈔",
 "不懈齋詩鈔",
 "曼園詩鈔",
 "雌伏吟",
 "養拙齋詩鈔",
 "蜨花吟館詩鈔",
 "綠綺樓詩鈔",
 "榮寶堂詩鈔",
 "養志書屋詩鈔",
 "紀遊吟草",
 "洗俗齋詩草",
 "海雪詩龕詩鈔",
 "銀月山房詩草",
 "豐壽山樵詩鈔",
 "欣所遇齋詩存",
 "念先堂詩稿",
 "桐桂軒課孫草",
 "紫薇山館遺草",
 "綠雲山房遺草",
 "偶香園詩草",
 "金臺詩鈔",
 "嘉穀山房詩草",
 "草草草堂詩草",
 "一得山房詩鈔",
 "竹坪詩草",
 "澹虛齋詩草",
 "思齊草堂詩鈔",
 "海嶽堂詩稿",
 "綠榕書屋賸草",
 "昧閒軒詩鈔",
 "欣寄小集",
 "問鸝山館詩鈔",
 "稻鄉樵唱",
 "子新遺詩",
 "子熙賸草",
 "守默齋詩稿",
 "清芬閣詩草",
 "珊洲別墅詩鈔",
 "綠芸吟館詩鈔",
 "公餘寄詠詩鈔",
 "月巖詩鈔",
 "澹園吟草",
 "枕上吟",
 "古香樓詩鈔",
 "鼇山存真草",
 "嶺南遊草",
 "天覺樓詩集",
 "澗南遺草",
 "梅花書屋詩鈔",
 "攬香閣詩稿",
 "毋自欺齋詩稿",
 "宦游吟草",
 "松壽軒詩鈔",
 "陶情小草",
 "寄影軒詩鈔",
 "笠山詩草",
 "鹿洲吟草",
 "駕海樓稿",
 "委懹書舫遺草",
 "綠珊軒詩草",
 "眠綠山房詩草",
 "延正學齋詩集",
 "梧桐庭院詩鈔",
 "三十六村草堂詩鈔",
 "慧海小草",
 "片雲行草",
 "龍藏山人賸草",
 "小浮山齋詩",
 "亙禪偶存草",
 "簪花閣詩鈔",
 "鏡香賸草",
 "錄窗吟草",
 "順叔吟草",
 "樹經堂詠史詩",
 "話雲軒詠史詩",
 "覺生詠史詩",
 "澹香齋詠史詩",
 "集義軒詠史詩",
 "匪石山人遺詩",
 "芋香山房詩鈔",
 "話雨山房吟草",
 "復堂詩",
 "蒿庵詩",
 "蒿庵詞",
 "復堂詞",
 "五之草堂詩稿",
 "九十九峯草堂詩鈔",
 "粲花樓詩稿",
 "靜觀齋詩鈔",
 "春影樓詩稿",
 "問園詩集",
 "松心集",
 "僊屏書屋詩錄",
 "鹿蔥花館詩鈔",
 "持雅堂詩鈔",
 "怡志堂詩鈔",
 "敦夙好齋詩稿",
 "無不自得齋詩鈔",
 "寄鷗館詩錄",
 "夢綠草堂詩鈔",
 "采蘭集",
 "鳳簫集",
 "侶樊草堂詩鈔",
 "看山樓詩鈔",
 "愚泉詩選",
 "春林詩選",
 "心葭詩選",
 "霞梯詩選",
 "息影廬殘稿",
 "學為褔齋詩鈔",
 "醉園詩存",
 "次園詩存",
 "哦月樓詩存",
 "附詩餘",
 "銀礫詞",
 "幸齋詩錄",
 "鹿儕詩賸",
 "詁紅館殘稿",
 "款紅社詩存",
 "滄粟庵詩存",
 "鏡閣新集",
 "嘯雪庵詩鈔",
 "臥月軒詩稿",
 "素賞樓詩稿",
 "凝翠樓詩集",
 "凝香室詩鈔",
 "硯隱集",
 "蘊真軒小草",
 "林下風清集",
 "湘靈集",
 "古香樓詩集",
 "竹隱樓詩草",
 "鳳簫樓詩集",
 "繡餘小稿",
 "蠹窗詩集",
 "疎影軒詩稿",
 "片石齋燼餘草",
 "培遠堂詩集",
 "悟雪堂詩鈔",
 "柴車倦遊集",
 "玉芳亭詩集",
 "靜香閣詩草",
 "清香閣詩鈔",
 "一桂軒詩鈔",
 "鴻寶樓詩鈔",
 "瑞圃詩鈔",
 "問花樓詩集",
 "在璞草堂詩稿",
 "浣青詩草",
 "臥雪軒吟草",
 "繡餘草",
 "職思居詩鈔",
 "聊一軒詩稿",
 "綠秋書屋詩集",
 "聽月樓遺草",
 "紅雪軒詩稾",
 "蘩香詩草",
 "石蘭詩鈔",
 "采香樓詩集",
 "吟香摘蠹集",
 "鶴語軒詩集",
 "兩面樓詩稿",
 "蘭圃遺草",
 "青藜閣詩集",
 "瑤草軒詩鈔",
 "不櫛吟",
 "澹如軒吟草",
 "起雲閣詩鈔",
 "修竹廬吟稿",
 "花語軒詩鈔",
 "韻松樓詩集",
 "味雪樓詩稿",
 "望雲閣詩集",
 "清娛閣吟稿",
 "唐宋舊經樓稿",
 "白鳳樓詩鈔",
 "長真閣詩稿",
 "玉簫樓詩集",
 "瘦吟樓詩草",
 "綠陰紅雨軒詩鈔",
 "聽秋軒詩稿",
 "寄梅館詩鈔",
 "織雲樓詩稿",
 "貽硯齋詩稿",
 "繪聲閣詩稿",
 "琴香閣詩箋",
 "曉春閣詩集",
 "貯月軒詩稿",
 "翡翠樓詩集",
 "吟香館詩草",
 "環碧軒詩集",
 "藕香館詩鈔",
 "露香閣詩鈔",
 "瑤草珠華閣詩鈔",
 "澹蘜軒詩藳",
 "吟紅閣詩鈔",
 "綠窗吟稿",
 "繡篋小集",
 "養花軒詩鈔",
 "自然好學齋詩集",
 "繡吟樓詩鈔",
 "鵠吟樓詩鈔",
 "印月樓詩集",
 "小鷗波館詩鈔",
 "錦槎軒詩集",
 "絮雪吟",
 "敏求齋詩集",
 "焚餘小草",
 "鏡倚樓小稿",
 "佩湘詩稿",
 "花鳳樓吟稾",
 "韻香書室吟稿",
 "琴隱園詩",
 "春影樓詩",
 "靜觀齋詩",
 "心遠樓詩鈔",
 "佳谷遺稿",
 "王小梧遺文",
 "徐竹所先生遺稿",
 "東蘿遺稿",
 "題照集",
 "寵硯錄",
 "唱和詩",
 "西河慰悼詩",
 "湯餅辭",
 "花嶼嚶鳴",
 "同心言初集",
 "蓮洋詩",
 "白燕栖詩草",
 "岸堂稿",
 "中江詩略",
 "紅蘭集",
 "秋蓬俚語",
 "斲冰集",
 "晴雲書屋稿",
 "蘭秋介雅堂詩略",
 "若谷小集",
 "一亭雲集",
 "小丹丘詩稿",
 "嶺雲集",
 "江草集",
 "不虛齋詩",
 "芸齋詩鈔",
 "曙春詩草",
 "慕閑詩草",
 "金愚詩草",
 "其生詩草",
 "鑒齋詩草",
 "師范詩草",
 "蓀香詩草",
 "刈雲詩草",
 "牧餘詩草",
 "墨農詩草",
 "溪南詩草",
 "水山詩草",
 "笠舫詩藳",
 "靄雲草",
 "筠溪詩草",
 "幽蘭草",
 "拾餘偶存",
 "漁亭小草",
 "桐石山房詩",
 "借薇山館詩",
 "揖翠山房小草",
 "花事草堂學吟",
 "茸城老友會詩序題詞",
 "怡園同人吟鈔",
 "自怡吟鈔",
 "續刊同人吟鈔",
 "來青堂遺草",
 "馬洲吟鈔",
 "課暇吟",
 "織餘草",
 "山居足音集",
 "僧寮吟課",
 "銷夏彙存",
 "小檀欒室題詞",
 "說詩類編",
 "耶谿漁隱題辭",
 "日下題襟集",
 "雙藤錄別詩鈔",
 "從政未信錄",
 "弦韋贈處集",
 "湘靈館雜鈔",
 "鑾江懷古集",
 "江上詠花集",
 "真州官舍十二詠",
 "天香雲舫詩草",
 "竹素園詩草",
 "紅葉山樵詩草",
 "叢蘭山館詩草",
 "薜荔山莊詩草",
 "西亭詩草",
 "味清堂詩鈔",
 "半間雲詩",
 "焦尾編",
 "霏玉軒詩草",
 "萬壑雲樓詩",
 "小紅薇館吟草",
 "思無邪室吟草",
 "小紅薇館拾餘詩鈔",
 "鐵笛詞",
 "酒痕詞",
 "雲瓿詞",
 "長毋相忘室詞",
 "瀣碧詞",
 "玉龍詞",
 "盋山舊館詞",
 "桃花春水詞",
 "雲左山房詩鈔",
 "高歌集",
 "粵西筆述",
 "驂鸞吟稾",
 "桂勝集",
 "肆覲集",
 "藍橋集",
 "北山之什",
 "南山集",
 "詒安堂初稿",
 "試帖詩鈔",
 "應求集",
 "可作集",
 "同人詩錄",
 "朱藤老屋詩鈔",
 "誦清閣詩鈔",
 "邃懷堂詩集",
 "過庭小草",
 "棗花老屋集",
 "舒藝室詩",
 "舒嘯樓詩集",
 "伏敔堂詩集",
 "修竹軒詩鈔",
 "淞溪遺稿",
 "城北草堂詩餘",
 "梅花百和",
 "梅花集句",
 "梅花十咏",
 "集唐梅花詩",
 "梅花賦",
 "梅花賦註",
 "大梅歌",
 "律蘇和陶",
 "八十自壽",
 "梅花詩集唐",
 "切法指南",
 "無言祕訣",
 "按聲指數法",
 "切法辨疑",
 "和涉江梅花詩",
 "定峯文選",
 "賜書堂詩稿",
 "宛委山房詩詞賸稾",
 "青箱室詩鈔",
 "龍泉園集",
 "龍泉園語",
 "龍泉園詩草",
 "文草",
 "蘭陽養疴雜紀",
 "問青園集",
 "手帖",
 "遺囑",
 "東顰集",
 "醞香樓集",
 "紅樓夢詩",
 "松蔭軒稿",
 "紅樓新咏",
 "紅樓夢詞",
 "石頭記評讚序",
 "紅樓夢賦敍",
 "紅樓夢問答",
 "紅樓夢存疑",
 "石頭記總評",
 "石頭記分評",
 "大觀園圖說",
 "侯朝宗文鈔",
 "魏叔子文鈔",
 "汪鈍翁文鈔",
 "軫石文鈔",
 "亭林文鈔",
 "雪苑文鈔",
 "愚山文鈔",
 "勺庭文鈔",
 "改亭文鈔",
 "潛菴文鈔",
 "湛園文鈔",
 "竹垞文鈔",
 "三魚文鈔",
 "在陸文鈔",
 "青門文鈔",
 "鶴舫文鈔",
 "秋錦文鈔",
 "午亭文鈔",
 "稼棠文鈔",
 "丹崖文鈔",
 "少渠文鈔",
 "望溪文鈔",
 "穆堂文鈔",
 "鈍叟文鈔",
 "椒園文鈔",
 "隨園文鈔",
 "熊學士文集錄",
 "亭林文錄",
 "石莊先生文錄",
 "南雷文錄",
 "壯悔堂文錄",
 "恥躬堂文錄",
 "四照堂文錄",
 "湘帆堂文錄",
 "水田居文錄",
 "潛痷先生遺藳文錄",
 "愚山先生文錄",
 "午亭文錄",
 "張文貞公文錄",
 "帶經堂集文錄",
 "鄭靜菴先生文錄",
 "榕村全集文錄",
 "西陂類稾文錄",
 "湛園未定藳文錄",
 "居業齋文錄",
 "邵青門文錄",
 "朱文端公文集",
 "孫文定公文錄",
 "二希堂文錄",
 "鮚埼亭集文錄",
 "紫竹山房文集",
 "鹿洲文錄",
 "白鶴堂文錄",
 "南庄類稿文錄",
 "海峯先生文錄",
 "潛研堂文錄",
 "惜抱軒先生文選",
 "紀文達公文錄",
 "清獻堂文錄",
 "忠雅堂文錄",
 "二林居文錄",
 "厚岡文錄",
 "陶士升先生萸江文錄",
 "劉寄庵文錄",
 "知恥齋文錄",
 "惕園初藳文",
 "姚端恪公文錄",
 "變雅堂文錄",
 "白茅堂文錄",
 "砥齋文錄",
 "聰山文錄",
 "改亭文錄",
 "魏伯子文錄",
 "河東文錄",
 "榆溪集選",
 "庸書文錄",
 "白石山房文錄",
 "三魚堂文錄",
 "蒼峴山人文錄",
 "憺園文錄",
 "百尺梧桐閣文錄",
 "飴山文錄",
 "可儀堂文錄",
 "趙忠毅公文錄",
 "白田草堂文錄",
 "梅莊文錄",
 "梅崖居士集文錄",
 "四知堂文錄",
 "孺廬先生文錄",
 "雙桂堂文錄",
 "松泉文錄",
 "集虛齋文錄",
 "歸愚文錄",
 "果堂文錄",
 "培遠堂文錄",
 "香國集文錄",
 "小倉山房文錄",
 "尊聞居士集",
 "叢桂堂文錄",
 "海崖文錄",
 "切問齋文錄",
 "經韻樓集文錄",
 "更生齋文錄",
 "頤綵堂文錄",
 "韞山堂文錄",
 "竹香齋文錄",
 "養一齋文錄",
 "鑑止水齋文錄",
 "雀研齋文錄",
 "雕菰集文錄",
 "崇百藥齋文錄",
 "學福齋文錄",
 "左海文錄",
 "存吾文集錄",
 "邃雅堂文錄",
 "邁堂文畧",
 "彭躬菴文鈔",
 "邱邦士文鈔",
 "魏伯子文鈔",
 "魏季子文鈔",
 "李咸齋文鈔",
 "林確齋文鈔",
 "彭中叔文鈔",
 "曾青藜文鈔",
 "汪大紳文鈔",
 "羅臺山文鈔",
 "彭尺木文鈔",
 "薛家三遺文",
 "玉芝堂文集",
 "思補堂文集",
 "儀鄭堂遺稿",
 "有正味齋文續集",
 "西溪漁隱外集",
 "問字堂外集",
 "卷施閣文乙集",
 "孟塗駢體文鈔",
 "子詵駢體文鈔",
 "蘭石齋駢體文鈔",
 "萬善花室駢體文鈔",
 "柏梘山房駢體文鈔",
 "梧生駢體文鈔",
 "思益堂駢體文鈔",
 "湘綺樓駢體文鈔",
 "琴鶴山房駢體文鈔",
 "湖塘林館駢體文鈔",
 "桴亭先生文鈔",
 "確菴先生文鈔",
 "晚翠軒集",
 "說經堂詩草",
 "介白堂詩集",
 "雪虛聲堂詩鈔",
 "楊漪春侍御奏稿",
 "康幼博茂才遺詩",
 "𨷲三寶齋詩",
 "袌春林屋詩",
 "榮雅堂詩",
 "遠堂詩",
 "嶺雲海日樓詩鈔",
 "人境廬詩草",
 "有正味齋賦稿",
 "蘭修館賦稿",
 "覺生賦鈔",
 "簡學齋賦鈔",
 "樊榭山房賦",
 "有正味齋律賦",
 "壽花堂律賦",
 "翠雲館律賦",
 "試體詩",
 "貽經堂試體詩",
 "澄鑒堂律賦",
 "古芬書屋律賦",
 "醞藉堂試體詩",
 "書畫舫試體詩",
 "震川尺牘",
 "牧齋尺牘",
 "張嘯山先生尺牘",
 "顧亭林先生尺牘",
 "佩弦齋尺牘",
 "朱鼎甫先生尺牘",
 "吳穀人先生尺牘",
 "湖海樓尺牘",
 "陳其年先生尺牘",
 "大雲山房尺牘",
 "惲子居先生尺牘",
 "張廉卿先生尺牘",
 "洪稚存先生尺牘",
 "芙蓉山館尺牘",
 "楊蓉裳先生尺牘",
 "因寄軒尺牘",
 "管異之先生尺牘",
 "梅伯言先生尺牘",
 "芙蓉山館師友尺牘",
 "縵雅堂尺牘",
 "王眉叔先生尺牘",
 "尚絅堂尺牘",
 "劉芙初先生尺牘",
 "養一齋尺牘",
 "李申耆先生尺牘",
 "明清藏書家尺牘",
 "明清畫苑尺牘",
 "蘧盦遺墨",
 "元明詩翰",
 "瞿忠宣公蠟丸書侯忠節公絕纓書合璧",
 "楊忠烈公左忠毅公遺札合璧",
 "明季忠烈尺牘初編",
 "明季忠烈尺牘二編",
 "明季吳中三老手札",
 "松風舞鶴圖題辭",
 "授經教子圖題辭",
 "滮湖漁隱圖題辭",
 "采菊思親圖題辭",
 "自然好學齋詩鈔",
 "花簾詞",
 "香南雪北詞",
 "秋水軒詩選",
 "硯緣記",
 "眉子硯圖",
 "題硯叢鈔",
 "葉小鸞眉子硯題詞前集",
 "今集",
 "葉小鸞眉子硯閨秀題詞",
 "徵仙集",
 "徵仙彙錄",
 "題象集",
 "疎香遺影",
 "汾干訪墓",
 "疏香閣附集",
 "彤奩續些選",
 "鸝吹選",
 "愁言選",
 "默盦詩存",
 "一山詩存",
 "龔耕廬詩",
 "楊致存詩",
 "聊園文鈔",
 "紉秋軒詞鈔",
 "聯句",
 "傅渭磯先生手札",
 "纓義樓金香錄",
 "問梅盦詩餘",
 "拳鶴山房詞",
 "劍影琴聲室詩賸",
 "藕船詩話",
 "苔岑社詩課",
 "待旦集",
 "尻輪集",
 "遜遯吟",
 "偪側吟",
 "觀酒狂齋詩錄",
 "瀟湘秋雨舸駢文鈔",
 "半墅草堂新詠",
 "江東雲影集",
 "苔岑修禊圖題詠",
 "周菊人先生遺稿",
 "周王運新先生遺稿",
 "胡周脩輝先生遺稿",
 "萍緣集",
 "錦囊殘墨",
 "宣城秋雨錄",
 "消寒三十韻",
 "南社文選",
 "南社詩選",
 "南社詞選",
 "怡園賸稿",
 "氣聽齋駢文零拾",
 "漚公遺稿",
 "冶盦文鈔",
 "文無館詩鈔",
 "愚谷修禊集",
 "檳榔浴佛集",
 "展重五集",
 "延陵挂劍集",
 "展重九集",
 "消寒集",
 "難老集",
 "賞荷酬唱集",
 "借中秋集",
 "聚星酬唱集",
 "陶社詩鐘選",
 "桐花閣詞",
 "憶江南館詞",
 "誦芬錄",
 "微尚齋詩",
 "雨屋深鐙詞",
 "椶窗雜記",
 "汪祠譜序",
 "逸園詩稿",
 "蓉裳文稿",
 "兆芝賸玉",
 "吉光片羽",
 "贈言萃珍",
 "雁帛魚牋",
 "攀鱗附翼",
 "王湘綺文鈔",
 "康南海文鈔",
 "嚴幾道文鈔",
 "林琴南文鈔",
 "張季直文鈔",
 "章太炎文鈔",
 "梁任公文鈔",
 "馬通伯文鈔",
 "譚復生文鈔",
 "容城文靖劉先生文集",
 "容城忠愍楊先生文集",
 "容城鍾元孫先生文集",
 "欸乃書屋乙亥詩集",
 "履閣詩集",
 "秦游詩",
 "讀書舫詩鈔",
 "卜硯山房詩鈔",
 "炅齋詩集",
 "青蜺居士集",
 "林於館詩集",
 "蕉石山房詩草",
 "欲起竹閒樓存稿",
 "韻湖偶吟",
 "醉茶吟草",
 "念堂詩鈔",
 "樹君詩鈔",
 "霜紅龕詩略",
 "測魚詩略",
 "畸人之詩略",
 "我詩略",
 "睫巢集",
 "雷溪草堂詩",
 "太谷山堂集",
 "朱令昭詩",
 "方起英詩",
 "劉伍寬詩",
 "牧齋詩鈔",
 "芝麓詩鈔",
 "梅村詩鈔",
 "王式丹詩選",
 "吳廷楨詩選",
 "宮鴻曆詩選",
 "徐昂發詩選",
 "錢名世詩選",
 "張大受詩選",
 "管棆詩選",
 "吳士玉詩選",
 "顧嗣立詩選",
 "李必恒詩選",
 "蔣廷錫詩選",
 "繆沅詩選",
 "王圖炳詩選",
 "徐永宣詩選",
 "郭元釪詩選",
 "南岡草堂詩選",
 "可園詩存",
 "扁善齋詩選",
 "盋山詩錄",
 "青溪詩選",
 "寄漚詩存",
 "挹翠樓詩存",
 "迂齋集",
 "石帆吟",
 "雲心編",
 "耕煙集",
 "匪莪集",
 "花塢吟",
 "怡雲集",
 "伴香閣詩",
 "卷施閣詩",
 "兩當軒詩",
 "樹蘐堂詩",
 "教經堂詩",
 "闠清山房詩",
 "九柏山房集",
 "吟翠軒詩",
 "笠舫詩稿",
 "憶園詩鈔",
 "桐華吟館稿",
 "玉山閣稿",
 "翠苕館詩",
 "雨粟樓詩",
 "長離閣詩",
 "靈芬館集外詩",
 "秋夢齋詩稿",
 "竹溪社易門詩鈔",
 "梅葉閣詩鈔",
 "行素居詩鈔",
 "清溪詩稿",
 "潮生閣詩稿",
 "賞奇樓蠹餘稿",
 "琴好樓小製",
 "青藜閣集詩",
 "翡翠樓集詩",
 "曉春閣詩稿",
 "停雲閣詩稿",
 "翡翠林閨秀雅集",
 "簫譜",
 "涵清閣詩鈔",
 "懷清書屋吟稿",
 "素言集",
 "藼宦吟稿",
 "破窗風雨樓詩",
 "海門遺詩",
 "愚谷遺詩",
 "茹荼軒續集",
 "附炳燭隨筆",
 "待烹生文集",
 "三易集",
 "吳歈小草",
 "松圓偈庵集",
 "耦耕詩集",
 "繡閒草",
 "團香吟",
 "楊莊詩草",
 "梅影山房詩賸",
 "賜墨齋詩",
 "絃詩塾詩",
 "益神智室詩",
 "東岡集",
 "芝廛集",
 "秋水集",
 "忍菴集",
 "碩園集",
 "健菴集",
 "東皋集",
 "水鄉集",
 "步檐集",
 "南田詩鈔",
 "香草堂詩鈔",
 "西林詩鈔",
 "𦬊野詩鈔",
 "梅坪詩鈔",
 "澹蘜軒詩初稿",
 "綠槐書屋詩初稿",
 "鄰雲友月之居詩初稿",
 "餐楓館文集",
 "丁布衣詩鈔",
 "朱布衣詩鈔",
 "張弘山先生集",
 "禹貢集註",
 "感述錄",
 "孟我疆先生集",
 "借庵詩選",
 "擊竹山房吟草",
 "栴檀閣詩鈔",
 "澹雅山堂詩鈔",
 "簾波閣詩鈔",
 "野雲詩鈔",
 "弢庵詩集",
 "種竹軒詩鈔",
 "三山草堂集",
 "青苔館詩鈔",
 "清娛閣詩鈔",
 "三秀齋詩鈔",
 "借菴詩鈔",
 "秋屏詩存",
 "性源詩存",
 "月輝詩存",
 "芥航詩存",
 "懶餘吟草",
 "隰西草堂詩",
 "白耷山人詩",
 "吳非熊集",
 "程孟陽集",
 "梅湖詩鈔",
 "枳六齋詩鈔",
 "息六齋遺稿",
 "七峰詩稿",
 "容齋千首詩",
 "野香亭集",
 "盤隱山樵詩集",
 "玉禾山人集",
 "樊榭山房詩",
 "海珊詩",
 "丁辛老屋詩",
 "蘀石齋詩",
 "小倉山房詩",
 "有正味齋詩",
 "臨江鄉人詩",
 "硯林詩集",
 "冬心先生集",
 "三體詩",
 "自度曲",
 "柳洲遺稿",
 "冬花庵燼餘稿",
 "湖墅詩鈔",
 "湖墅雜詩前集",
 "草閣詩集",
 "寶日軒詩集",
 "養素園題詠",
 "激楚齋詩集",
 "秋槐堂詩集",
 "靈蘭館詩集",
 "大經堂詩集",
 "采山堂詩集",
 "懷古堂詩集",
 "荇谿詩集",
 "漁莊詩集",
 "演谿詩集",
 "苹園二史詩集",
 "道南堂詩集",
 "花南老屋詩集",
 "懶人詩集",
 "笠亭詩選",
 "春橋詩選",
 "東亭詩選",
 "厚齋詩選",
 "梅涇草堂集鈔",
 "甌香集",
 "雪芸草",
 "梅花逸叟集",
 "恬翁集",
 "懷孟草",
 "藍染齋集",
 "雲竹集",
 "勗亭集",
 "心隱集",
 "碧草軒詩鈔",
 "得月樓艸",
 "竹岳樓艸",
 "來霞詩鈔",
 "晚盥集鈔",
 "嶧山集",
 "緩菴詩鈔",
 "順寧樓稿",
 "故鄉草詩鈔",
 "學圃詩鈔",
 "赤巖集",
 "嬾髯集",
 "南遊草",
 "萍梗詩鈔",
 "謹堂集",
 "荻書樓稿",
 "石墩艸",
 "寓硤草",
 "客星零草",
 "霽陽詩鈔",
 "一得吟",
 "芳嵕稿",
 "柴門詩鈔",
 "荻書樓遺草",
 "龍潭集",
 "隨扣詩草",
 "思可堂詩集",
 "磷秋閣詩鈔",
 "墨浪軒遺稿",
 "筠閣詩鈔",
 "墨莊詩鈔",
 "石壑詩草",
 "高陽詩草",
 "高陽遺詩",
 "近青山草堂詩初稿",
 "昔巢先生遺稿",
 "蜀遊存稿",
 "一爐香室詩存",
 "東海鯫生詞鈔",
 "養性讀書齋詩存",
 "繭室遺詩",
 "指馬樓詞鈔",
 "環緣軒選詞",
 "瓦鳴集",
 "抱月軒詩續鈔",
 "循陔吟草鈔",
 "日香居課餘吟草鈔",
 "撝菴詩稿鈔",
 "古音閣吟草鈔",
 "是耶樓初稿鈔",
 "復齋詩鈔",
 "華陔吟館詩鈔",
 "秋舫詩鈔",
 "蒔桂堂詩鈔",
 "蒔桂堂試帖鈔",
 "東門寄軒草",
 "閑閑閣草",
 "南谿僅真集",
 "西郭冰雪集",
 "苦吟",
 "北溟見山集",
 "鷗寄軒詩存",
 "蘭因館吟草",
 "梅芝館詩",
 "抱影廬詩",
 "丹棘園詩",
 "越縵堂文鈔",
 "實齋文集",
 "國朝文棷題辭",
 "永嘉集",
 "永嘉證道歌",
 "柔克齋詩輯",
 "二黃先生集",
 "鮮庵遺稿",
 "縵庵遺稿",
 "林膳部詩",
 "陳徵君詩",
 "高待詔詩",
 "王典籍詩",
 "唐觀察詩",
 "鄭博士詩",
 "王檢討詩",
 "王翰林詩",
 "周祠部詩",
 "黃博士詩",
 "傅木虛集",
 "七幅菴草",
 "吳遊記",
 "拔劍集",
 "箜篌集",
 "啽囈存卷",
 "唾心集",
 "步天集",
 "英雄失路集",
 "宋王梅溪先生溫陵留墨",
 "宋真西山先生溫陵留墨",
 "明朱白野先生溫陵留墨",
 "常清集",
 "溪山集",
 "三峰集",
 "幼溪集",
 "奉常集",
 "蓮湖草",
 "偶菴集",
 "目錄備考",
 "姚文公牧菴集",
 "馬文貞公石田集",
 "許文忠公圭塘小藳",
 "王文定公秋澗集",
 "孛术魯文靖公遺文",
 "曹月川先生文集",
 "薛文清公文集",
 "王文莊公凝齋集",
 "何文定公柏齋集",
 "崔文敏公洹詞",
 "尤西川先生文集",
 "孟雲浦先生文集",
 "張抱初先生文集",
 "理寒石先生文集",
 "變雅堂文集",
 "些山集輯",
 "樂志齋詩集",
 "何少詹文鈔",
 "林太僕文鈔",
 "邱太守文鈔",
 "羅文止先生全稿",
 "陳大士先生未刻稿",
 "章大力先生全稿",
 "楊維節先生稿",
 "艾千子先生全稿",
 "湘颿堂集",
 "天傭子集",
 "太乙山房集",
 "此觀堂集",
 "仰止堂集",
 "章柳州集",
 "晏同叔先生集",
 "晏叔原先生集",
 "王介甫先生集",
 "章介庵先生集",
 "陳明水先生集二集",
 "帥惟審先生集",
 "湯義仍先生集",
 "丘毛伯先生集",
 "章大力先生集",
 "艾千子先生集",
 "羅文止先生集",
 "陳大士先生集",
 "揭蒿庵先生集",
 "游日生先生集",
 "傅平叔先生集",
 "歐陽文忠公全集",
 "胡澹庵先生文集",
 "周文忠公全集",
 "文信國公全集",
 "文溪集",
 "秋曉先生覆瓿集",
 "九峯先生集",
 "李駕部前集",
 "青霞漫稿",
 "瑤石山人詩稿",
 "區太史詩集",
 "陳文忠公遺集",
 "中洲草堂遺集",
 "九谷集",
 "六瑩堂集",
 "評詞",
 "大樗堂初集",
 "雲華閣詩畧",
 "坡亭詞鈔",
 "楞華室詞",
 "隨山館詞",
 "秋夢龕詞",
 "弱盦詩",
 "蛻盦詩",
 "李宮詹文集",
 "蕭給諫湖山集",
 "蕭太史鐵峯集",
 "薛御史中離集",
 "林殿撰東莆集",
 "翁襄敏東涯集",
 "蕭御史同野集",
 "王別駕半憨集",
 "饒副使三溪集",
 "薛孝廉拯庵文集",
 "陳侍郎玉簡山堂集",
 "林提學井丹集",
 "唐選部醉經樓集",
 "周大理明農堂集",
 "林尚書城南書莊集",
 "謝御史六集",
 "郭忠節宛在堂集",
 "羅吏部瞻六堂集",
 "謝給諫霜崖集",
 "黃處士遙峯閣集",
 "不自棄齋詩草",
 "聽濤屋詩鈔",
 "祖坡吟館詩鈔",
 "高涼耆舊文鈔",
 "有明三家稿",
 "四李集",
 "癖草文鈔",
 "雪溪集文鈔",
 "恒峰文鈔",
 "梅溪剩稿文鈔",
 "夢庵文鈔",
 "種芝山房文鈔",
 "青藜閣文鈔",
 "緘石集文鈔",
 "三喦山房文鈔",
 "萟蘭山房文鈔",
 "橫塘文鈔",
 "心亭亭居文鈔",
 "見星廬文鈔",
 "嶺隅文鈔",
 "怡雲山房文鈔",
 "本學居文鈔",
 "外編叢鈔",
 "亂離見聞錄",
 "見星廬館閣詩話",
 "見星廬賦話",
 "月凔文集",
 "怡志堂文初編",
 "經德堂文集",
 "龍壁山房文集",
 "補學軒文集",
 "初月樓文談",
 "怡志堂文集",
 "茂陵秋雨詞",
 "浣月山房詩集",
 "梅神吟館詩草",
 "致翼堂文集",
 "雪波詞",
 "彭子穆先生詞集",
 "槐廬詞學",
 "校夢龕集",
 "唐詩名媛集",
 "唐詩香奩集",
 "唐詩觀妓集",
 "唐詩名花集",
 "劍峰詩鈔",
 "柳塘詩鈔",
 "麓原詩鈔",
 "芷潭詩鈔",
 "伯韓詩鈔",
 "翰臣詩鈔",
 "子穆詩鈔",
 "小廬詩鈔",
 "澹仙詩鈔",
 "香圃詩鈔",
 "錢南園詩鈔",
 "黃榘卿詩選",
 "戴雲帆詩選",
 "朱丹木詩選",
 "趙樾村詩選",
 "張天船詩選",
 "陳虛齋詩選",
 "李厚安詩選",
 "小槐簃吟稿",
 "小槐簃聯存",
 "王風箋題",
 "東河新櫂歌",
 "武林市肆吟",
 "永嘉金石百詠",
 "永嘉三百詠",
 "和永嘉百詠",
 "禾廬詩鈔",
 "西溪懷古詩",
 "西泠懷古詩",
 "禾廬新年雜詠",
 "武林新市肆吟",
 "文淶水遺文",
 "文中丞詩",
 "文溫州詩",
 "文太史詩",
 "明文博士詩集",
 "文和州詩",
 "文錄事詩集",
 "蘭雪齋詩集",
 "碧華館昑草",
 "養雲廬詩草",
 "依園詩畧",
 "星硯齋存稿",
 "垢硯昑",
 "葆素齋集",
 "如是齋集",
 "陸塘初稿",
 "出關詩",
 "東閭剩稿",
 "入塞詩",
 "懷南草",
 "豎步吟",
 "叩舷昑",
 "宜田彙稿",
 "松漠草",
 "薇香集",
 "燕香集",
 "慥菴草",
 "員峯稿",
 "歸田稿",
 "竹軒稿",
 "升齋草",
 "鈒鏤稿",
 "如江集",
 "蘆菴稿",
 "鳩飛草堂稿",
 "拙逸堂草",
 "吾廬集",
 "嶺雲草",
 "近勇堂草",
 "珠溪集",
 "竹裏館草",
 "思齋集",
 "蘆漪草",
 "南行吟草",
 "蕅唐詩集",
 "滄浪詩話補註",
 "碧香閣遺稾",
 "天香樓遺澤集",
 "天香樓唫稿",
 "墨花書舫唫稿",
 "天香別墅學吟",
 "減庵公詩存",
 "西田集",
 "練川雜詠",
 "謝橋詞",
 "承清堂詩集",
 "靜軒駢文賸稿",
 "葒花榭詩鈔",
 "紫萸香館詞鈔",
 "昔夢錄",
 "王氏藝文目",
 "考槃集遺什",
 "虛亭詩鈔遺什",
 "鶴谿賸稿遺什",
 "恕堂存稿詩",
 "耕養齋遺文",
 "蓑笠軒遺文",
 "馥芬居日記",
 "恕堂存稿",
 "琴言館詩稿",
 "吟香館剩稿",
 "伯瀛詩草",
 "泛瀛圖題詞",
 "王光祿遺文集",
 "王文簡公遺文集",
 "王壽昌文集",
 "青箱書屋詞",
 "青箱書屋餘韻詞存",
 "清貽堂存藳",
 "清貽堂賸稿",
 "偷閒集賸稿",
 "安流舫存稿",
 "復初集賸稿",
 "鵞溪草堂存藳",
 "蘭堂賸稿",
 "憺園草",
 "橘香堂存稿",
 "清閨遺稿",
 "絜華樓存稿",
 "無止境初存藳",
 "續存稿",
 "集外詩續存",
 "芬響閣初藳",
 "續鄉程日記",
 "芬響閣附存藳",
 "雙紅豆館遺稿",
 "慕雲山房遺稿",
 "月媒小史詩稿",
 "左忠貞公集",
 "艤舟亭集",
 "蓉湖吟藳",
 "秋水亭詩鈔",
 "磊軒小稿",
 "餐玉詞",
 "月珠樓詩鈔",
 "澹齋詩草",
 "青愛山房詩鈔",
 "蕉林書屋詩鈔",
 "春雨堂集",
 "洗影樓集",
 "雪浪集",
 "懹山園遺文",
 "夏雲堂稿",
 "吉光集",
 "虹城子集",
 "錦囊集",
 "紹前集",
 "武岡集",
 "繼芳集",
 "嶰谷集",
 "月峰集",
 "霜筠集",
 "朱雀橋邊野草",
 "懸磬集",
 "洲居集",
 "雲圃集",
 "待潮集",
 "倦遊集",
 "居敬集",
 "楹書集",
 "葛覃集",
 "華峰集",
 "璞疑詩集",
 "毅堂集",
 "莊恪集",
 "澹持集",
 "臥秋草堂詩鈔",
 "二亭詩鈔",
 "紉蘭軒詩稿",
 "涇南詩稿",
 "小酉詩稿",
 "快晴室駢體文",
 "養中之塾文集",
 "蒼雪山房稿",
 "雲根清壑山房詩",
 "觀稼樓詩",
 "吳船書屋詩",
 "楓香集",
 "倚華樓詩",
 "桐陰書屋詩",
 "政和堂遺稿",
 "臞仙吟館遺稿",
 "清芬館詞草",
 "愛吾廬詩鈔",
 "讀月樓吟稿",
 "隨月讀書樓集",
 "晴綺軒集",
 "練溪漁唱",
 "集山中白雲詞",
 "玉華詩鈔",
 "文峯遺稿",
 "何翰林集",
 "何禮部集",
 "味梅吟草",
 "冗餘草",
 "吉羽草",
 "憨石山房詩鈔",
 "朗僊唫稿",
 "睫巢詩鈔",
 "小羅浮山館詩鈔",
 "硯壽堂詩鈔",
 "詩續鈔",
 "訪秋書屋遺詩",
 "小酉山房遺詩",
 "灌園居偶存草",
 "夢煙舫詩",
 "壺庵詩",
 "芴庵詩",
 "小斜川室初存詩",
 "小鄂不館初存草",
 "秋雪山房初存詩",
 "典裘購書歌",
 "典裘購書吟",
 "字香亭梅花百詠",
 "粵東懷古",
 "鞠隱山莊遺詩",
 "附稟稿",
 "南湖東游草",
 "剪淞留影集",
 "潭柘紀游詩",
 "南湖集古詩",
 "質璞草",
 "秋陽草",
 "莊敏公遺集",
 "福山公遺集",
 "文康公遺集",
 "文康公年譜",
 "春蘿書屋詩存",
 "南川草堂詩鈔",
 "味經齋存稿",
 "味雪樓詩草",
 "別稿",
 "省疚齋吟稿",
 "恐齋詩鈔",
 "易園文集",
 "猶得住樓詩稿",
 "優盋羅室文稿",
 "月來軒詩稿",
 "李徵士遺稿",
 "六宜樓詩稿",
 "桂巖居詩稿",
 "談劍廬詩稿",
 "蓮青詩館吟稿",
 "冕常賸稿",
 "李光祿公遺集",
 "李文忠公遺集",
 "李襲侯遺集",
 "藿園詩存",
 "蒼雪齋詩存",
 "視彼亭詩存",
 "李杏山集",
 "李太史集",
 "李比部集",
 "李侍御集",
 "李白羽集",
 "李秋羽集",
 "石桐先生詩鈔",
 "少鶴先生詩鈔",
 "定性齋集",
 "附蓮塘遺集",
 "鶴峯詩鈔",
 "檗菴集",
 "石西集",
 "崇禮堂詩",
 "西園康範詩集",
 "西園康範先生實錄",
 "附錄外集",
 "杏山摭稿",
 "韻香廬詩鈔",
 "蓼菴手述",
 "春星草堂集",
 "看山樓草",
 "松桂林草",
 "夢蛟山人集",
 "百秋閒咏",
 "竹園集記",
 "匏庵詩鈔",
 "館課存稿",
 "述昔吟草",
 "淚餘續草",
 "吟虀小鈔",
 "重光集",
 "吟秋百律",
 "澹園倡和集",
 "石臺聯昹",
 "澧溪姚氏詩鈔",
 "秋塘蜀道詩",
 "吉仙賸稿",
 "六宜樓吟草",
 "見貽雜錄",
 "南蔭堂姚氏家乘雜詠",
 "續詠",
 "車參政集",
 "車逸民集",
 "車教援集",
 "車都諫集",
 "車飲賓集",
 "車隱君集",
 "車督學集",
 "車雙亭集",
 "車貢士集",
 "車孝廉集",
 "車廣文集",
 "車雙秀集",
 "車別駕集",
 "鷗亭詩草",
 "海上篇",
 "夫椒山館集",
 "餐芍華館詩集",
 "蕉心詞",
 "春瀑山館詩存",
 "公暇墨餘錄存藳文",
 "使黔集",
 "雲圃詩存",
 "提舉集",
 "蹄涔集",
 "愚直存稿",
 "佩韋子存稿",
 "榕蔭書屋筆記",
 "樹蘐草堂文集",
 "三絳隨筆",
 "夢湘樓詩藳",
 "詞藳",
 "繭香館唫艸",
 "繡餘詞",
 "凝道堂集",
 "玉芝堂詩集",
 "隱几山房詩集",
 "聊存草",
 "樂陶閣集",
 "黃竹山房詩鈔",
 "黃竹山房詩鈔補",
 "附田盤紀遊",
 "致遠堂集",
 "善吾廬詩存",
 "芸書閣賸稿",
 "遯廬吟草",
 "拾翠軒詞稿",
 "悔廬吟草",
 "原灋",
 "林屋山人夢遊草",
 "翠娛樓詩草",
 "翠娛樓詩餘",
 "翠娛樓雜著",
 "味真山房詩草",
 "其恕齋詩草",
 "聽雨芭蕉館詩草",
 "海杓堂文",
 "尊聞堂文集",
 "胡文忠公書牘",
 "壽聲堂存稿",
 "道存堂存稿",
 "潔貞紗櫥繡餘存草",
 "雛鳳精舍存稿",
 "西園雜詠",
 "固陵小草",
 "岱帖詩",
 "汝固集",
 "燕遊草",
 "二頃園遺藳",
 "棣軒遺藳",
 "泰履樓偶作",
 "蓼村遺稿",
 "飲香軒詩藳",
 "西江紀遊草",
 "柱明集",
 "偶吟",
 "氾葉集",
 "悔菴詩藳",
 "問渡小草",
 "湘園詩草",
 "嚥雪堂詩藳",
 "玩極堂詩藳",
 "聞可堂詩藳",
 "澂志樓詩藳",
 "鶮珠堂詩集",
 "居業堂遺藳",
 "貯虛堂詩集",
 "翏莫子集",
 "翏莫子雜識",
 "高辛硯齋雜著",
 "見聞近錄",
 "紅林禽館詩錄",
 "井眉居詩錄",
 "穀庵集撰",
 "觀頤摘稿",
 "東齋稿畧",
 "附濟美錄摘畧",
 "帥子古詩撰",
 "墨瀾亭文集",
 "別本嗜退山房稾",
 "綠滿窗前草",
 "樹人堂詩",
 "多博唫",
 "宗悳文鈔",
 "老樹軒詩集",
 "卓山詩集",
 "三十乘書樓詩集",
 "卓山詩續集",
 "帥氏清芬集萃編",
 "咫聞軒詩草",
 "咫聞軒賸稾",
 "紫雯軒館課錄存",
 "詞垣日記",
 "左海交遊錄",
 "帥公子文重與鹿鳴筵宴錄",
 "帥子文公崇祀鄉賢錄",
 "附行述",
 "贈詩",
 "咫聞軒遺稾",
 "太僕公詩稿",
 "宗伯公賜閒隨筆",
 "龍南老人自述",
 "龍南集",
 "先考調庵府君（姜廷枚）行實",
 "先妣吳太君行實",
 "祭亡弟開先文",
 "先考徵齋府君（姜東毓）家傳",
 "臨雲亭詩鈔",
 "悟雲詩存",
 "壬寅存稿",
 "夢田詞",
 "靜學廬遺文",
 "靜學廬逸筆",
 "金鍾山房詩集",
 "金鍾山房文集",
 "蠖齋談助",
 "初堂遺稿",
 "伯初文存",
 "一鑑樓詩畧",
 "師儉堂詩鈔",
 "居易齋詩鈔",
 "雜作",
 "棣華居詩畧",
 "種義園詩草",
 "萊娛軒詩草",
 "素癡集",
 "繭迂集",
 "筠軒詩藳",
 "文藳",
 "白雲詩藳",
 "梧岡詩藳",
 "家傳",
 "姑妄存之詩鈔",
 "家庭雜憶",
 "秋根詩鈔",
 "薝蔔花館詩集",
 "蓮因室詩集",
 "冬日百詠",
 "名山福壽編",
 "蘇海餘波",
 "留雲集",
 "墨池賡和",
 "九芝仙館行卷",
 "葡萄徵事詩",
 "西堂得桂詩",
 "鸞綸紀寵詩",
 "雲麾碑陰先翰詩",
 "疎影山莊吟稿",
 "臥梅廬詩存",
 "荷香水亭吟草",
 "己壬叢稿",
 "怡雲館詩鈔",
 "夢草詞",
 "植八杉齋詩鈔",
 "蒓湖公遺詩",
 "亞陶公遺詩",
 "漱珊公遺詩",
 "子梅公遺詩",
 "杏伯公遺詩",
 "蓉史公遺詩",
 "菊農公遺詩",
 "藕卿公遺詩",
 "松石廬詩存",
 "玉壺天詩錄",
 "春暉閣紅餘吟草",
 "青霞吟館詩鈔",
 "貯雲書屋詩鈔",
 "玉涵堂剩稿",
 "修敬詩集",
 "鳳山詩集",
 "從川詩集",
 "雪村詩草摘刊",
 "峋菴詩",
 "具菴詩草摘刊",
 "雅季詩存",
 "符君詩存",
 "蕃卿詩存",
 "聽雨軒詩鈔",
 "少尹詩",
 "蕉窗訓蒙錄",
 "附詩文",
 "蛾術山房詩鈔",
 "六芳草堂詩存",
 "柳枝唱和詞",
 "淞逸詩存",
 "井夫詩存",
 "漱瑛樓詩存",
 "秋聲館詩草",
 "蘭芬詩存",
 "新鐫玉蟠袁會元集",
 "鐫袁中蚓未刻遺稿",
 "鐫袁小修集",
 "白洋里墓田丙舍錄",
 "鄂韡聯吟處題贈錄",
 "抱樸居詩",
 "鄂韡聯吟稿",
 "愚庵初稿",
 "少白初稿",
 "忠節馬光祿先生軼詩",
 "侍御馬師山先生軼詩",
 "馬從甫賈餘稿",
 "拙餘老人遺稿",
 "補梅書屋詩存",
 "自有樂地吟草",
 "寒碧軒賸墨",
 "逸廬天籟",
 "頤齋僅存草",
 "逃禪閣集",
 "入告編",
 "遺編",
 "退思軒詩集",
 "賦閒樓詩集",
 "篔谷詩選",
 "捫腹齋詩鈔",
 "藕村詞存",
 "涉園題詠",
 "寄吾廬初稿選鈔",
 "竺嵒詩存",
 "半農草舍詩選",
 "西泠鴻爪",
 "張氏藝文",
 "涉園題詠續編",
 "涉園修褉集",
 "聞濤軒詩稿",
 "寶閒齋詩集",
 "蔚秀軒詩存",
 "斅坡詩鈔",
 "香谷詩鈔",
 "耜洲詩鈔",
 "嬰山小園詩集",
 "聽泉詩鈔",
 "秋樵詩鈔",
 "漁隱詩鈔",
 "病梅盦詩",
 "成章詩鈔",
 "曹太史文集",
 "崑禾堂集",
 "洮浦集",
 "南華泚筆",
 "訓兒錄",
 "霞間稿",
 "新山詩集",
 "友竹稿",
 "橘坡稿",
 "道腴堂集",
 "放言居詩集",
 "長嘯軒詩集",
 "四焉齋詩集",
 "梯仙閣餘課",
 "拂珠樓偶鈔",
 "四焉齋文集",
 "畦樂先生詩集",
 "泊痷先生文集",
 "坦庵先生文集",
 "東山老人詩賸",
 "冬榮室詩鈔",
 "閒氣集",
 "吟秋館詩草",
 "澂觀齋詩",
 "勵學室詩存",
 "寄廬詩草",
 "寄廬倡和詩鈔",
 "和詩續鈔",
 "又鈔",
 "寄廬春莫懷人詩",
 "南峯雜詠",
 "耕閒偶吟",
 "本支世系記略",
 "日山文集",
 "慎餘堂文稿",
 "都御史陳虞山先生集",
 "祭酒琴溪陳先生集",
 "華溪莫堂集",
 "天柱詩草",
 "醉草堂集",
 "梅緣詩草",
 "蘭陂剩稿",
 "涔園詩鈔",
 "虛航集",
 "銕門詩草",
 "梅田詩草",
 "諫亭詩草",
 "凹堂詩草",
 "雲泉詩草",
 "澗南吟稿",
 "介珊先生遺墨",
 "日東先生文",
 "拙脩老人遺稿",
 "殘葉箋",
 "一繫之居遺稿",
 "緘齋遺稿",
 "高節陳氏詞略",
 "陶子師先生集",
 "南崖集",
 "陶退菴先生集",
 "陶晚聞先生集",
 "自序",
 "萸江古文存",
 "遺集附",
 "印心石屋文鈔",
 "詩鈔初集",
 "試律",
 "漕河禱冰圖詩錄",
 "辛夷花館詩賸",
 "守瓶文賸",
 "花村詞賸",
 "西村詞草",
 "夢逋草堂劫餘稿",
 "文賸",
 "誦芬館詩鈔",
 "少蒙詩存",
 "思嗜齋詩賸",
 "溉釜家書",
 "陸氏詩賸彙編",
 "文賸彙編",
 "古柏重青圖題識",
 "壽萱集",
 "詠梨集試帖",
 "獨吟樓詩",
 "嚥雪山房詩",
 "貯月軒詩",
 "敏求齋詩",
 "繡珠軒詩",
 "屠康僖公文集",
 "太和堂集",
 "太史屠漸山文集",
 "蘭暉堂集",
 "彭文憲公文集",
 "殿試策",
 "彭文思公文集",
 "曾庭聞詩",
 "曾青藜詩",
 "曾麗天詩",
 "儆炫遺詩",
 "莞石遺詩",
 "訒庵遺詩",
 "即庵詩",
 "擬庵遺詩",
 "依隱堂詩",
 "醒庵遺詩",
 "五梅遺詩",
 "步適堂遺詩",
 "又盤遺詩",
 "紉芳堂遺詩",
 "自怡軒詩",
 "唯堂遺詩",
 "薌屏遺詩",
 "少坡遺詩",
 "梅巖遺詩",
 "養拙齋詩",
 "齩菜根齋詩",
 "于樂遺詩",
 "尊酒草堂詩",
 "梅月龕詩",
 "用逵遺詩",
 "字雲巢詩鈔",
 "寄軒詩鈔",
 "劍山詩鈔",
 "留雪堂懷人詩鈔",
 "宿月詩草",
 "聽雪詩選",
 "山館偶存",
 "山館學規",
 "蒲江縣練團規約",
 "味鮮集試帖",
 "附集唐人句",
 "行我法軒二十四孝試帖",
 "馮舍人遺詩",
 "默庵遺藳",
 "鈍吟老人遺稿",
 "方伯集",
 "陂門集",
 "大行集",
 "光祿集",
 "水豹堂詩選",
 "白蘭堂詩選",
 "拙園詩選",
 "文僖公集",
 "道南先生集",
 "半山先生集",
 "潁州集",
 "丁山先生集",
 "景州集",
 "竹橋十詠",
 "訒齋詩草",
 "見山樓詩草",
 "於斯堂詩集",
 "鴻集亭詩草",
 "鏡巖樓詩集",
 "澹心齋詩集",
 "石語亭詩草",
 "紫雪軒詩集",
 "友晉軒詩集",
 "栗里詩草",
 "脩竹山房詩草",
 "夕霏亭詩集",
 "快山堂詩集",
 "永德堂詩草",
 "華萼館詩草",
 "涵清館詩草",
 "來山閣詩草",
 "寄盧遺稿",
 "春谷遺草",
 "花溪遺草",
 "籟鳴詩鈔",
 "第六絃溪詩鈔",
 "小酉山房賸草",
 "虞邑紀變略",
 "墨舫賸稿",
 "東井詩鈔",
 "垂老讀書廬詩草",
 "雜體文",
 "古干亭詩集",
 "菁山詩鈔",
 "嶺外雜言",
 "二江草堂文",
 "補不足齋文",
 "可怡齋賸稿",
 "自怡齋吟稿",
 "溫恭毅公文集",
 "二園詩集",
 "嶼浮閣賦集",
 "海印樓集",
 "紀堂遺稿",
 "默菴詩鈔",
 "讀書一間鈔",
 "屺雁哀",
 "固庵詩鈔",
 "愚峯詩鈔",
 "惕齋先生放言",
 "迪彝先生文",
 "素庵先生文",
 "夢餘草",
 "西園遺稿",
 "西十賢人集",
 "熊補亭遺詩",
 "藕頤類稿",
 "藕頤類稿外集",
 "畹香閣詩鈔",
 "三國志小樂府箋注",
 "閒居戲吟箋注",
 "蘇林詩賸",
 "含齋詩賸",
 "海琴樓遺文",
 "亦佳園詩存",
 "鴻述館詩存",
 "廣平梅花館詩草",
 "爽氣西來齋詩草",
 "春夢初覺室詩草",
 "攷古軒遺墨",
 "金粟齋遺集",
 "帶耕堂遺詩",
 "蒯公子範歷任治所崇祀錄",
 "欹閣集",
 "文燕齋遺稿",
 "環石齋詩集",
 "星閣詩集",
 "五松遺草",
 "漱芳居遺草",
 "梅軒草",
 "耕氓草",
 "甄溪小稿",
 "築巖詩集",
 "竹坡小草",
 "肖巖詩鈔",
 "月巖詩遺",
 "台巖詩鈔",
 "馥雲軒詩集",
 "懶雲詩鈔",
 "偉堂詩鈔",
 "龜山遺草",
 "竹廬詩鈔",
 "葵陽詩鈔",
 "柳蔭居詩草",
 "省齋詩鈔",
 "枕山面水草堂詩鈔",
 "雲閣遺草",
 "古墨齋詩鈔",
 "肯堂詩鈔",
 "總宜山房詩集",
 "一樹棠棣館詩集",
 "澄懷堂詩集",
 "自怡吟拾存",
 "半讀齋賸稿",
 "棠蔭軒遺稿",
 "醫學一得",
 "戊午輓言錄",
 "毛太君徽音集",
 "成思室遺稿",
 "成思室遺稿附錄",
 "壬申輓言錄",
 "淍芳錄",
 "洄泉詩鈔",
 "蘭言居遺稿",
 "目省集",
 "芳皐棄餘錄",
 "止唐韻語存",
 "燕臺集",
 "臺中集",
 "司封集",
 "清居集",
 "希蹤稿",
 "旅中稿",
 "黎邦琛集",
 "黎邦璘集",
 "籟鳴集",
 "鷽鳴集",
 "文水居集",
 "愧菴稿",
 "鞟言",
 "洞石集",
 "貽清堂集",
 "雪窓集",
 "芙航集",
 "瓜圃小草",
 "醇曜堂集",
 "夢餘筆談",
 "長山公自書年譜",
 "石頭山人遺稿",
 "蛉石齋詩鈔",
 "千家詩注",
 "侍雪堂詩鈔",
 "慕耕草堂詩鈔",
 "椒園詩鈔",
 "丁亥入都紀程",
 "青田山廬詩鈔",
 "悅坳遺詩",
 "瑟廬遺詩",
 "昭覺丈雪醉禪師語錄",
 "傳鐙賸稿",
 "棠雲館殘稿",
 "虛白舫詩刪存",
 "詩焚餘",
 "文鈔附刻",
 "牧堂公集",
 "西山公集",
 "節齋公集",
 "復齋公集",
 "素軒公集",
 "九峯公集",
 "覺軒公集",
 "久軒公集",
 "靜軒公集",
 "謙受益齋文集",
 "友竹草堂文集",
 "友竹草堂隨筆",
 "友竹草堂楹聯",
 "趨庭錄",
 "平洛遺草",
 "九疑仙館詩鈔",
 "諸圖題詞",
 "季紅花館偶吟",
 "英甫遺詩",
 "桂影軒筆記",
 "鳳威遺詩",
 "雲芝遺詩",
 "夢石未定稿",
 "鄭忠肅公奏議遺集",
 "鄭忠肅公年譜",
 "開國公遺集",
 "鄭所南先生詩選",
 "僑吳遺集",
 "平橋藁",
 "綠蔭齋詩稿",
 "谷愚學吟草",
 "步齋學吟草",
 "齎志長懷詩集",
 "蕭齋詩集",
 "敦厚堂近體詩",
 "棣韡堂吟賸",
 "留香閣吟鈔",
 "觀自得廬詩存",
 "評花齋詩錄",
 "寸草軒詩賸",
 "佳樂堂遺稿",
 "九峰閣詩集",
 "摘星初集詩",
 "說詩",
 "摘星二集文",
 "摘星三集文",
 "雲在軒詩集",
 "北窗吟草",
 "謫星對聯",
 "乩詩錄",
 "求拙齋遺詩",
 "澄碧齋詩鈔",
 "澄碧齋別集",
 "晴江遺詩",
 "渼陂遺詩",
 "梅簃遺詩",
 "遁香小草",
 "齋心草堂詩集",
 "松壼畫贅",
 "紅樹山廬詩稿",
 "適意吟",
 "有真意齋遺文",
 "秋岩遺詩",
 "息園遺詩",
 "硯癡遺詩",
 "雙橋書屋遺詩",
 "詞存",
 "蘅皋遺詩",
 "綠伽楠精舍詩草",
 "小謝詞存",
 "信孚遺詩",
 "金塗塔齋詩稿",
 "燕游詩草",
 "廉泉山館遺詩",
 "見山樓詩鈔",
 "柏樹軒詩稿",
 "棣華堂詩稿",
 "晚香堂詩藁",
 "詞藁",
 "飛白竹齋詩鈔",
 "玉照堂詩稿",
 "蕪鷯枝集",
 "老梅書屋遺詩",
 "曇花叢稿",
 "淥坪遺詩",
 "述古軒詩草",
 "景陸遺詩",
 "惜花軒詩稿",
 "繩槎遺詩",
 "韻園遺詩",
 "倚玉生詩稿",
 "幼學存草",
 "酉山遺詩",
 "補拙齋稿",
 "小漪詩屋吟稾",
 "繡藥軒遺詩",
 "榕陰草堂遺詩",
 "汪海樹詞",
 "藤香館詩鈔",
 "藤香館詩續鈔",
 "藤香館詞",
 "念鞠齋詩文賸稿",
 "味經得雋齋律賦",
 "儲光羲詩集",
 "望錦樓遺稿",
 "窨花書屋遺稿",
 "紅藥山房吟稿",
 "繡山小草",
 "學吟賸草",
 "聘梅僊館詩草",
 "蜀游草",
 "望雲懷雨印雪廬詞",
 "江陽草",
 "半隱先生花甲紀略",
 "師竹軒草",
 "垂裕堂遺草",
 "石秀齋集",
 "小菴羅集",
 "采隱草",
 "拾香草",
 "墨莊詩草",
 "吹月填詞館賸稾",
 "鐵琴銅劍樓詞草",
 "藍山詩集",
 "藍澗詩集",
 "魏伯子文集",
 "魏季子文集",
 "魏興士文集",
 "梓室文稿",
 "魏昭士文集",
 "耕廡文稿",
 "魏敬士文集",
 "為谷文稿",
 "清嘯樓詩鈔",
 "含芳館詩鈔",
 "老泉先生集",
 "東坡先生集",
 "穎濱先生集",
 "欒城文集",
 "老泉生先文集",
 "經進嘉祐文集事略",
 "老泉先生文集補遺",
 "經進欒城文集事略",
 "郎氏事輯",
 "桂軒先生全集",
 "永思錄",
 "附贈言",
 "鼇峰藁",
 "百詠天香集",
 "啖蔗餘甘詞",
 "斯文會詩",
 "先桂軒府君（顧恂）年譜",
 "朋壽圖詩",
 "先自如府君（顧左）年譜",
 "靜觀堂集",
 "疣贅錄",
 "炳燭軒詩集",
 "南雍草",
 "楚思賦",
 "雙星館集",
 "違竽集",
 "張表臣詩話",
 "溫公續詩話",
 "唐子西文錄",
 "歷代詩話考索",
 "詩人主客圖",
 "梅礀詩話",
 "藝苑巵言",
 "國雅品",
 "逸老堂詩話",
 "詩鏡總論",
 "詩法",
 "詩學正源",
 "詩辯",
 "詩體",
 "附答出繼叔臨安吳景僊書",
 "歷代吟譜",
 "詩格",
 "緣情手鑑詩格",
 "金針詩格",
 "名賢詩旨",
 "續句圖",
 "杜律心法",
 "附虞註刪要",
 "應制詩式",
 "應試詩式",
 "古夫于亭詩問答",
 "漁洋答問",
 "談龍集",
 "附吳脩齡與萬季埜書",
 "唐音審體",
 "樂府集",
 "等音",
 "晦庵詩說",
 "詩家宜說",
 "夕堂永日緒論",
 "修詞鑑衡",
 "退庵論文",
 "文概",
 "論文集要",
 "文心雕龍註",
 "飲冰室詩話",
 "本事詞",
 "帝京景物畧",
 "列朝詩集小傳",
 "書影",
 "小說叢考",
 "詩最",
 "文奇",
 "文韻",
 "書雋",
 "四六儷",
 "小札簡",
 "清語部",
 "紀遊",
 "詞菁",
 "讀杜詩寄廬小箋",
 "讀杜二箋",
 "讀杜私言",
 "言文",
 "薑齋詩話",
 "答萬季野詩問",
 "然鐙說聞",
 "王文簡古詩平仄論",
 "趙秋谷所傳聲調譜",
 "五言詩平仄舉隅",
 "七言詩平仄舉隅",
 "七言詩三昧舉隅",
 "而庵詩話",
 "全唐詩話續編",
 "履園譚詩",
 "峴傭說詩",
 "王志論詩",
 "硯齋詩談",
 "硯齋論文",
 "天下同文",
 "金奩集",
 "宋徽宗詞",
 "范文正公詩餘",
 "忠宣公詩餘",
 "南陽詞",
 "臨川先生歌曲",
 "韋先生詞",
 "紫陽真人詞",
 "東坡樂府",
 "龍雲先生樂府",
 "淮海居士長短句",
 "寶晉長短句",
 "竹友詞",
 "畫墁詞",
 "北湖詩餘",
 "賀方回詞",
 "東山詞補",
 "頤堂詞",
 "虛靖真君詞",
 "陽春詞",
 "浮溪詞",
 "苕溪樂章",
 "阮戶部詞",
 "華陽長短句",
 "鄱陽詞",
 "龜溪長短句",
 "相山居士詞",
 "飄然先生詞",
 "灊山詩餼",
 "松隱樂府",
 "屏山詞",
 "浮山詩餘",
 "澹齋詞",
 "鄮峰真隱大曲",
 "蓮社詞",
 "南澗詩餘",
 "盤洲樂章",
 "漢濱詩餘",
 "芸庵詩餘",
 "雲莊詞",
 "澹軒詩餘",
 "文簡公詞",
 "雪山詞",
 "誠齋樂府",
 "松坡詞",
 "渭川居士詞",
 "介庵琴趣外篇",
 "竹齋詞",
 "玉蟾先生詩餘",
 "方舟詩餘",
 "舒蓺室餘筆",
 "澗泉詩餘",
 "客亭樂府",
 "稼軒詞補遺",
 "康範詩餘",
 "應齋詞",
 "蒲江詞稿",
 "定齋詩餘",
 "丘文定公詞",
 "省齋詩餘",
 "南湖詩餘",
 "張樞詞",
 "鶴林詞",
 "笑笑詞",
 "徐清正公詞",
 "東澤綺詞",
 "清江漁譜",
 "默齋詞",
 "方壼詩餘",
 "臞軒詩餘",
 "後村長短句",
 "矩山詞",
 "篔窗詞",
 "退庵詞",
 "屐齋先生詩餘",
 "彝齋詩餘",
 "白雲小稿",
 "蓬萊鼓吹",
 "小箋",
 "方是閒居士詞",
 "秋堂詩餘",
 "本堂詞",
 "秋聲詩餘",
 "陵陽詞",
 "須溪詞",
 "水雲詞",
 "雙溪詞",
 "西麓經周集",
 "勿軒長短句",
 "龜溪二隱詞",
 "在軒詞",
 "白雪遺音",
 "寧極齋樂府",
 "則堂詩餘",
 "心泉詩餘",
 "蘭雪詞",
 "拙軒詞",
 "莊靖先生樂府",
 "遯庵樂府",
 "菊軒樂府",
 "磻溪詞",
 "魯齋詞",
 "稼村樂府",
 "瓢泉詞",
 "秋澗樂府",
 "勤齋詞",
 "牧庵詞",
 "青山詩餘",
 "水雲邨詩餘",
 "養蒙先生詞",
 "中庵詩餘",
 "樵庵詞",
 "樵庵槳府",
 "雲峰詩餘",
 "定宇詩餘",
 "漢泉樂府",
 "養吾齋詩餘",
 "樂庵詩餘",
 "芳洲詩餘",
 "順齋樂府",
 "無絃琴譜",
 "玉斗山人詞",
 "桂隱詩餘",
 "默庵樂府",
 "道園樂府",
 "貞一齋詞",
 "蘭軒詞",
 "清庵先生詞",
 "此山先生樂府",
 "梅花道人詞",
 "王文忠詩餘",
 "去華山人詞",
 "圭齋詞",
 "圭塘樂府",
 "趙待制詞",
 "葯房樂府",
 "燕石近體樂府",
 "龜巢詞",
 "雙溪醉隱詩餘",
 "寓庵詞",
 "石門詞",
 "書林詞",
 "貞素齋詩餘",
 "可庵詩餘",
 "竹窗詞",
 "柘軒詞",
 "韓山人詞",
 "益齋長短句",
 "松雪齋詞",
 "附錄樂語",
 "柳屯田樂章集",
 "後山居士詞",
 "抄補",
 "酒邊集",
 "友古居士詞",
 "簡齋詞",
 "樂齋詞",
 "苕溪詞",
 "呂聖求詞",
 "盧溪詞",
 "松坡居士詞",
 "知稼翁詞集",
 "稼軒詞甲集",
 "樵隱詩餘",
 "竹坡老人詞",
 "養拙堂詞",
 "晦菴詞",
 "介菴趙寶文雅詞",
 "後村居士詩餘",
 "蒲江居士詞",
 "履齋先生詩餘",
 "玉林詞",
 "龜峯詞",
 "玉笥山人詞集",
 "玉田詞",
 "草窗詞集",
 "水雲詞集",
 "附宋舊宮人贈水雲詞",
 "白雪詞",
 "杜壽域詞",
 "烘堂集",
 "靜脩詞",
 "靜春詞",
 "雲林樂府",
 "耐軒詞",
 "晦庵詞",
 "文山樂府",
 "雪樓樂府",
 "雲林詞",
 "演山詞",
 "雪坡詞",
 "雙白詞",
 "白石道人詞集",
 "東山寓聲樂府",
 "東山寓聲樂府補鈔",
 "南宋四名臣詞集",
 "趙忠簡得全居士詞",
 "李莊簡詞",
 "李忠定梁溪詞",
 "胡忠簡澹菴長短句",
 "精選名賢詞話草堂詩餘",
 "清真集",
 "四印齋彙刻宋元三十一家詞",
 "逍遙詞",
 "筠谿詞",
 "栟櫚詞",
 "樵歌拾遺",
 "梅詞",
 "綺川詞",
 "東溪詞",
 "文定公詞",
 "梅山詞",
 "拙菴詞",
 "宣卿詞",
 "雙溪詩餘",
 "龍川詞補",
 "梅屋詩餘",
 "秋崖詞",
 "碎錦詞",
 "潛齋詞",
 "覆瓿詞",
 "撫掌詞",
 "章華詞",
 "藏春樂府",
 "淮陽樂府",
 "樵菴詞",
 "牆東詩餘",
 "天遊詞",
 "草廬詞",
 "五峯詞",
 "梁溪詞",
 "梅屋詞",
 "澗泉詞",
 "松隱詞",
 "拙庵詞",
 "可齋詞",
 "西麓詞",
 "待制詞",
 "五峰詞",
 "歐陽文忠公集近體樂府",
 "醉翁琴趣外篇",
 "閑齋琴趣外篇",
 "晁氏琴趣外篇",
 "于湖居士文集樂府",
 "渭南文集詞",
 "重校鶴山先生大全文集長短句",
 "可齋雜藁詞",
 "續藁詞",
 "石屏長短句",
 "知常先生雲山集",
 "增修箋註妙選羣英草堂詩餘前集",
 "詳註周美成詞片玉集",
 "于湖先生長短句",
 "後村居士集詩餘",
 "秋崖先生小藁詞",
 "棲霞長春子丘神仙磻溪集詞",
 "二妙集樂府（遯庵先生）",
 "二妙集樂府（菊軒先生）",
 "松雪齋文集樂府",
 "靜修先生文集樂府",
 "道園遺藁樂府",
 "此山先生詩集樂府",
 "漢泉曹文貞公詩集樂府",
 "楚國文憲公雪樓程先生文集樂府",
 "秋澗先生大全文集樂府",
 "絕妙詞選",
 "方是閑居小稾",
 "寫情集",
 "宋景文公長短句",
 "柯山詩餘",
 "李元膺詞",
 "舒學士詞",
 "王晉卿詞",
 "聊復集",
 "晁叔用詞",
 "冠柳集",
 "寶月集",
 "⿰口芋嘔集",
 "大聲集",
 "箕潁詞",
 "浩歌集",
 "沈文伯詞",
 "了齋詞",
 "趙子發詞",
 "紫微詞",
 "冲虛詞",
 "順庵樂府",
 "稼軒詞丁集",
 "招山樂章",
 "靜寄居士樂章",
 "隨如百詠",
 "順受老人詞",
 "古洲詞",
 "李氏花萼集",
 "松窗詞",
 "紫岩詞",
 "江湖長翁詞",
 "橘山樂府",
 "漁樵笛譜",
 "篁塛詞",
 "可軒曲林",
 "花翁詞",
 "蕭閒詞",
 "郢莊詞",
 "碧梧玩芳詩餘",
 "退齋詞",
 "蠙洲詞",
 "處靜詞",
 "在庵詞",
 "碧澗詞",
 "梅淵詞",
 "葵牕詞稿",
 "松山詞",
 "釣月詞",
 "中齋詞",
 "東山樂府",
 "耶律文獻公詞",
 "小亨詩餘",
 "青崖詞",
 "西巖詞",
 "中庵樂府",
 "疏齋詞",
 "羣賢梅苑",
 "天機餘錦",
 "時賢本事曲子集",
 "古今詞話",
 "復雅歌詞",
 "宋金元名家詞補遺",
 "藏春詞",
 "牧菴詞",
 "清閟閣詞",
 "信道詞",
 "曹元寵詞",
 "後湖詞",
 "詩餘圖譜",
 "夏內史詞",
 "溉園詩餘",
 "凭西閣長短句",
 "香嚴齋詞",
 "寓言集",
 "文江酬唱",
 "休園詩餘",
 "秋閒詞",
 "扶荔詞",
 "容齋詩餘",
 "金粟詞",
 "江湖載酒集",
 "蔭綠詞",
 "秋水詞",
 "菊莊詞",
 "耕煙詞",
 "峽流詞",
 "溉堂詞",
 "青城詞",
 "螺舟綺語",
 "松溪詩餘",
 "映竹軒詞",
 "錦瑟詞",
 "迦陵詞",
 "藝香詞",
 "棣華堂詞",
 "東白堂詞",
 "月聽軒詩餘",
 "秋雪詞",
 "竹香亭詩餘",
 "飲水詞",
 "柯亭詞",
 "紅藕莊詞",
 "柯齋詩餘",
 "志壑堂詞",
 "吳山鷇音",
 "蔗閣詩餘",
 "柳塘詞",
 "嘯閣餘聲",
 "玉壼詞",
 "月團詞",
 "蘭舫詩",
 "守齋詞",
 "葯菴詞",
 "探酉詞",
 "澄暉堂詞",
 "響泉詞",
 "畫餘譜",
 "蘃棲詞",
 "碧巢詞",
 "粵游詞",
 "藕花詞",
 "夢花窓詞",
 "容居堂詞",
 "棠村詞",
 "南礀詞",
 "橫江詞",
 "香膽詞",
 "蔬香詞",
 "楓香詞",
 "留村詞",
 "當樓詞",
 "白茅堂詞",
 "紫雲詞",
 "微雲詞",
 "句雲堂詞",
 "影樹樓詞",
 "改蟲齋詞",
 "澹雪詞",
 "萬卷山房詞",
 "竹西詞",
 "染香詞",
 "罨畫溪詞",
 "雙溪泛月詞",
 "湖山詞",
 "攝閒詞",
 "課鵡詞",
 "寒山詩餘",
 "紅橋詞",
 "一曲灘詞",
 "綺霞詞",
 "曠觀樓詞",
 "團扇詞",
 "栩園詞",
 "玉豔詞",
 "仿橘詞",
 "陶村詞",
 "南耕詞",
 "鳳車詞",
 "梅沜詞",
 "荔軒詞",
 "噀霞閣詞",
 "蓼齋詞",
 "梅村詩餘",
 "靜惕堂詞",
 "坦菴詞三種",
 "甕吟",
 "且謠",
 "美人詞",
 "毛翰林詞",
 "湖海樓詞",
 "曝書亭詞三種",
 "靜志居琴趣",
 "荼煙閣體物集",
 "蒼梧詞",
 "青吟堂詞二種",
 "餘波詞",
 "通志堂詞",
 "飴山詩餘",
 "樊榭山房詞",
 "琴畫樓詞",
 "瑤想詞",
 "曼香詞",
 "更生齋詩餘二種",
 "冰天雪窖詞",
 "機聲鐙影詞",
 "有正味齋詞五種",
 "佇月樓琴言",
 "三影亭寫生譜",
 "鐵撥餘音",
 "江上尋煙語",
 "紅橋笛唱",
 "秋籟吟",
 "竹眠詞",
 "芙蓉山館詞",
 "斷水詞",
 "小謨觴館詩餘",
 "柯家山館詞",
 "玉壼山房詞",
 "香消酒醒",
 "浮谿精舍詞三種",
 "畫梅樓倚聲",
 "小庚詞",
 "味雋齋詞",
 "心日齋詞四種",
 "種芸仙館詞三種",
 "花墩琴雅",
 "釣船笛譜",
 "月湖秋瑟",
 "真松閣詞",
 "拜石山房詞",
 "定盦詞五種",
 "無著詞",
 "懷人館詞",
 "影事詞",
 "小奢摩詞",
 "庚子雅詞",
 "憶雲詞",
 "疏影樓詞四種",
 "畫邊琴趣",
 "吳涇蘋唱",
 "剪鐙夜語",
 "石雲吟雅",
 "倚晴樓詩餘",
 "芬陀利室詞六種",
 "綠簫詞",
 "碧田詞",
 "紅衲詞",
 "青瑟詞",
 "白華詞",
 "拈花詞",
 "漢南春柳詞",
 "思益堂詞",
 "龍壁山房詞二種",
 "瘦春詞",
 "空青館詞",
 "太素齋詞",
 "藤香館詞二種",
 "西湖艣唱",
 "江舟欸乃",
 "碧瀣詞",
 "中白詞",
 "湘綺樓詞",
 "蒿盦詞",
 "半塘定稿",
 "袌碧齋詞",
 "雲起軒詞",
 "彊村語業",
 "蕙風詞",
 "飲虹簃論清詞百家",
 "琴清閣詞",
 "生香館詞",
 "茝香詞",
 "鴻雪廔詞",
 "玉雨詞",
 "古春軒詞",
 "洞簫廔詞",
 "聽雪詞",
 "古雪詩餘",
 "梅華園詩餘",
 "玉窗詩餘",
 "貯素廔詞",
 "綠月廔詞",
 "靜一齋詩餘",
 "冷香齋詩餘",
 "㝱湘廔詞",
 "簪華閣詩餘",
 "栖香閣詞",
 "蠹窗詩餘",
 "絳雪詞",
 "浣紗詞",
 "青藜閣詞",
 "碧桃館詞",
 "松籟閣詩餘",
 "鮮潔亭詩餘",
 "澹音閣詞",
 "寫麋廔詞",
 "秌水軒詞",
 "雨花盦詩餘",
 "鷰影廔詞",
 "澹蘜軒詞",
 "緯青詞",
 "龢漱玉詞",
 "澗南詞",
 "濾月軒詩餘",
 "月廔琴語",
 "倩影廔遺詞",
 "寫均廔詞",
 "華簾詞",
 "秌笳詞",
 "聞妙香室詞",
 "長真閣詩餘",
 "秌瘦閣詞",
 "綠㝱軒遺詞",
 "賦鷰廔詞",
 "光霽廔詞",
 "翠螺閣詞",
 "彈綠詞",
 "聽雨廔詞",
 "瑤華閣詞",
 "九疑僊館詞",
 "澹僊詞",
 "有誠堂詩餘",
 "玉簫詞",
 "芷衫詩餘",
 "菊籬詞",
 "哦月廔詩餘",
 "嘯雪菴詩餘",
 "繡閒詞",
 "三秀齋詞",
 "德風亭詞",
 "碧梧紅蕉館詞",
 "冷吟僊館詩餘",
 "蓮因室詞",
 "慈暉館詞",
 "曇華詞",
 "蕉窗詞",
 "錦囊詩餘",
 "澹香廔詞",
 "補欄詞",
 "晚香居詞",
 "瘦吟詞",
 "浣青詩餘",
 "茶香閣詞",
 "雯窗瘦影詞",
 "佩秌閣詞",
 "慧福廔詞",
 "鏡閣新聲",
 "古香廔詞",
 "棃雲榭詞",
 "湘筠館詞",
 "韞玉廔詞",
 "楚畹閣詩餘",
 "壽研山房詞",
 "含青閣詩餘",
 "繡墨軒詞",
 "飲露詞",
 "鸝吹詞",
 "芳雪軒詞",
 "疎香閣詞",
 "雪壓軒詞",
 "倚雲閣詞",
 "翠薇僊館詞",
 "唾絨詞",
 "霞珍詞",
 "崦廔詞",
 "華影吹笙室詞",
 "閨秀詞鈔",
 "聽弈軒小稿",
 "集山中白雲詞句",
 "銀藤花館詞",
 "百蕚紅詞",
 "佩蘅詞",
 "竹鄰遺稿",
 "讀雪軒詞",
 "求是堂詩",
 "伊蒿室詩餘",
 "西圃詞說",
 "羹天閣琴趣",
 "雲藍詞",
 "蝶菴詞",
 "吹蘭巵語",
 "樵玉山房詞",
 "涉江詞",
 "糽花別集",
 "月香綺業",
 "美人香草詞",
 "碧雲詞",
 "響山閣詞",
 "玉葉詞",
 "修況詩餘",
 "夢唐詩餘",
 "楚畹詩餘",
 "麝塵詞",
 "紅豆詞",
 "尺壼詞",
 "絮月詞",
 "青山草堂詞鈔",
 "瓶軒詞鈔",
 "留我相庵詞",
 "漱花詞",
 "玉椒詞",
 "蛻學齋詞",
 "課花盦詞",
 "香嚴詞",
 "衍愚詞",
 "紅橋倡和第一集",
 "廣陵倡和詞",
 "柘西精舍集",
 "無弦琴譜",
 "李太白詞",
 "李德潤詞",
 "歐陽舍人詞",
 "尹參卿詞",
 "梨雨選聲",
 "稼村填詞",
 "滴露堂小品",
 "澹吟樓詞",
 "白蕉詞",
 "響山詞",
 "竹香詞",
 "小長蘆漁唱",
 "丁辛老屋詞",
 "杉亭詞",
 "延青閣詞",
 "曇香閣琴趣",
 "梅鶴詞",
 "花嶼詞",
 "媕雅堂詞",
 "曇華閣詞",
 "采蓴詞",
 "湘雲遺稿",
 "綠陰槐夏閣詞",
 "夜船吹𥴦詞",
 "鷗邊漁唱",
 "香溪瑤翠詞",
 "滇游詞",
 "有正味齋詞",
 "小湖田樂府",
 "吟翠軒初稿",
 "味經堂詞稾",
 "橫枝詞",
 "芳影詞",
 "後巖簫雅",
 "寒山樂府",
 "瀟湘聽雨詞",
 "芳草詞",
 "香草題詞",
 "春融堂詞",
 "忠雅堂詞",
 "是程堂詞",
 "天真閣詞",
 "薲香詞選",
 "微波亭詞選",
 "悔存詞選",
 "炙硯詞",
 "琴隱園詞稿",
 "東虬草堂詞",
 "聽松濤館詞稿",
 "枝安山房詞草",
 "沿波舫詞",
 "西湖艣唱詞",
 "倚竹齋詞草",
 "澼月樓詞稾",
 "泡影集",
 "曇花集",
 "塔影樓詞",
 "鹿門詞",
 "玉洤詞",
 "聽雨詞",
 "桐華仙館詞",
 "海國歸櫂詞",
 "梅笙詞",
 "晚翠軒詞",
 "冷灰詞",
 "匏瓜室詞",
 "梅邊吹笛詞",
 "冰持庵詞",
 "受辛詞",
 "冰甌館詞",
 "荳蔻詞",
 "印山堂詞",
 "雲笙詞",
 "棲雲山館詞",
 "江上維舟詞",
 "附錄詞",
 "綠雪館詞鈔",
 "萬竹樓詞選",
 "瓊華室詞",
 "窺生鐵齋詞",
 "劍虹盦詞",
 "橫山草堂詞",
 "獨絃詞",
 "衷墨詞",
 "新鶯詞",
 "茝香詞鈔",
 "以恬養智齋詞錄",
 "簫材琴德廬詞稿",
 "春水船詞鈔",
 "碧梧秋館詞鈔",
 "墨壽閣詞鈔",
 "尺雲樓詞鈔",
 "紫芳心館詞",
 "彊邨樂府",
 "蕙風琴趣",
 "倚樓詞",
 "曼香書屋詞",
 "句婁詞",
 "薝蔔花館詞",
 "廣小圃詠",
 "玉可盦詞存",
 "湖天曉角詞",
 "牧莊詞",
 "鹿川詞",
 "璿甫綺語",
 "梅邊吹邃譜",
 "餅說盦詞",
 "雙屬玉亭詞",
 "小娜嬛詞箋",
 "彊邨語業",
 "花菴絕妙詞選",
 "詞林萬選",
 "秦張兩先生詩餘合璧",
 "少游詩餘",
 "天籟軒詞選",
 "天籟軒詞譜",
 "詞韻",
 "閩詞鈔",
 "小庚詞存",
 "唐五代詞選",
 "宋七家詞選",
 "甲乙丙丁藳",
 "玉田先生樂府指迷",
 "宋六十家詞選",
 "蒙香室賦錄",
 "吳禮部詞話",
 "弇州山人詞評",
 "爰園詞話",
 "窺詞管見",
 "古今詞論",
 "填詞雜說",
 "御選歷代詩餘話",
 "雕菰樓詞話",
 "靈芬館詞話",
 "詞綜偶評",
 "介存齋論詞雜著",
 "附宋四家詞選目錄序論",
 "詞苑萃編",
 "填詞淺說",
 "雙硯齋詞話",
 "詞逕",
 "聽秋聲館詞話",
 "憩園詞話",
 "詞學集成",
 "蒿庵論詞",
 "菌閣瑣談",
 "芬陀利室詞話",
 "詞概",
 "白雨齋詞話",
 "譯仲修先生復堂詞話",
 "論詞隨筆",
 "詞徵",
 "袌碧齋詞話",
 "詞論",
 "近詞叢話",
 "海綃說詞稿",
 "粵詞雅",
 "柳塘詞話",
 "填詞名解",
 "填詞圖譜",
 "古韻通略",
 "宋名家詞選",
 "清代詞選",
 "女性詞選",
 "李後主詞",
 "李清照詞",
 "辛棄疾詞",
 "納蘭性德詞",
 "吳藻詞",
 "詞學研究",
 "張小山小令",
 "喬夢符小令",
 "北樂府小令",
 "類聚名賢樂府羣玉",
 "東籬樂府",
 "夢符散曲",
 "惺惺道人樂府",
 "文湖州集詞",
 "小山樂府前集今樂府",
 "後集蘇隄漁唱",
 "續集吳鹽",
 "別集新樂府",
 "酸甜樂府",
 "沜東樂府",
 "王西樓先生樂府",
 "唾窗絨",
 "海浮山堂詞稿",
 "秋水菴花影集",
 "清人散曲選刊",
 "曝書亭集葉兒樂府",
 "樊榭山房集北樂府小令",
 "有正味齋集南北曲",
 "江山風月譜散曲",
 "香銷酒醒曲",
 "中原音韻作詞十法疏證",
 "散曲概論",
 "曲諧",
 "中州樂府音韻類編",
 "雲莊張文忠公休居自適小樂府",
 "秋碧樂府",
 "棃雲寄傲",
 "雙溪樂府",
 "柏齋先生樂府",
 "南曲次韻",
 "樂府餘音",
 "陶情樂府",
 "楊夫人樂府",
 "玲瓏倡和",
 "鷗園新曲",
 "詞臠",
 "蓮湖樂府",
 "射陽先生曲存",
 "筆花樓新聲",
 "步雪初聲",
 "黍離續奏",
 "越溪新詠",
 "不殊堂近草",
 "楊夫人曲",
 "新鋟天下時尚南北新調",
 "精選天下時尚南北徽池雅調",
 "新刊大字魁本全相參增奇妙註釋西廂記",
 "重刻元本題評音釋西廂記",
 "張深之先生正北西廂秘本",
 "小孫屠",
 "張協狀元",
 "宦門子弟錯立身",
 "新刊元本蔡伯喈琵琶記",
 "李卓吾先生批評琵琶記",
 "新刊重訂出相附釋標註月亭記",
 "李卓吾先生批評幽閨記",
 "白兔記",
 "新刻出像音註增補劉智遠白兔記",
 "新刻原本王狀元荊釵記",
 "屠赤水先生批評荊釵記",
 "殺狗記",
 "新刊重訂出像附釋標註音釋趙氏孤兒記",
 "新編金童玉女嬌紅記",
 "楊東來先生批評西游記",
 "刻李九我先生批評破窰記",
 "蘇武牧羊記",
 "新刻出像音註岳飛破虜東牕記",
 "韋鳳翔古玉環記",
 "黃孝子傳奇",
 "新鐫圖像音註周羽教子尋親記",
 "新刻全像古城記",
 "新刻出像音註劉玄德三顧草廬記",
 "重校金印記",
 "新刻出像音註商輅三元記",
 "馮京三元記",
 "新刻出像音註花欄南調西廂記",
 "新刻出像音註花欄韓信千金記",
 "新刊重訂出相附釋標註裴度香山還帶記",
 "新刻出像音註唐朝張巡許遠双忠記",
 "金丸記",
 "精忠記",
 "新刻出像音註姜詩躍鯉記",
 "新刊重訂附釋標註出相伍倫全備忠孝記",
 "新刻魏仲雪先生批評投筆記",
 "舉鼎記傳奇",
 "重校五倫傳香囊記",
 "新刻出像音註薛平遼金貂記",
 "新刊音註出像韓朋十義記",
 "新刻出像音註劉漢卿白蛇記",
 "新刻出像音註何文秀玉釵記",
 "新刻出像音註蘇英皇后鸚鵡記",
 "新刻出像音註薛仁貴跨海征東白袍記",
 "新刻出像音註韓湘子九度文公昇仙記",
 "玉茗堂批評新著續西廂昇仙記",
 "附釋義",
 "新刻全像臙脂記",
 "怡雲閣浣紗記",
 "新刻出像音註釋義王商忠節癸靈廟玉玦記",
 "新編林冲寶劎記",
 "連環記傳奇",
 "新刻玉茗堂批評焚香記",
 "新刊合併陸天池西廂記",
 "明珠記",
 "懷香記",
 "鳴鳳記",
 "紅拂記",
 "新刻出像音註點板徐孝克孝義祝髮記",
 "新刊音註出像齊世子灌園記",
 "新刻出像音註花將軍虎符記",
 "重校呂真人黃粱夢境記",
 "狂鼓史漁陽三弄",
 "玉禪師翠鄉一夢",
 "雌木蘭替父從軍",
 "女狀元辭凰得鳳",
 "譚友夏批點想當然傳奇",
 "新編目連救母勸善戲文",
 "新刻出像音註管鮑分金記",
 "李卓吾先生批評玉合記",
 "長命縷",
 "綵毫記",
 "曇花記",
 "脩文記",
 "牡丹亭",
 "墨憨齋重定三會親風流夢",
 "新刻出像點板音註李十郎紫簫記",
 "柳浪館批評玉茗堂紫釵記",
 "邯鄲夢記",
 "南柯夢",
 "重校義俠記",
 "桃符記",
 "重校埋劔記",
 "重校雙魚記",
 "新刻博笑記",
 "一種情傳奇",
 "新鐫全像藍橋玉杵記",
 "蓬瀛真境",
 "天台奇遇",
 "重校玉簪記",
 "節孝記",
 "新刊重訂出相附釋標註賦歸記",
 "新刊重訂出像附釋標註陳情記",
 "玉茗堂批評紅梅記",
 "雙珠記",
 "鮫綃記",
 "新刻全像易鞋記",
 "水滸記",
 "橘浦記",
 "玉茗堂批評節俠記",
 "新刻出相點板宵光記",
 "紅梨花記",
 "丹桂記",
 "新編奇遇玉丸記",
 "新刻全像點板張子房赤松記",
 "新刻全象高文舉珍珠記",
 "新刻出像音註觀世音修行香山記",
 "新刻全像觀音魚籃記",
 "新刻全像包龍圖公案袁文正還魂記",
 "新刻全像漢劉秀雲臺記",
 "新刻出像音註王昭君出塞和戎記",
 "新刻出像音註范睢綈袍記",
 "新刊校正全相音釋青袍記",
 "綵樓記",
 "櫻桃夢",
 "鸚鵡洲",
 "麒麟罽",
 "靈寶刀",
 "獅吼記",
 "玉茗堂批評種玉記",
 "重訂天書記",
 "三祝記",
 "投桃記",
 "彩舟記",
 "義烈記",
 "八義記",
 "新刻五鬧蕉帕記",
 "青衫記",
 "重校錦箋記",
 "鸞鎞記",
 "四豔記",
 "春豔夭桃紈扇",
 "夏豔碧連繡符",
 "秋豔丹桂鈿合",
 "冬豔素梅玉蟾",
 "新編全像點板竇禹鈞全德記",
 "新鍥重訂出像附釋標註驚鴻記",
 "重校旗亭記",
 "玉鏡臺記",
 "新刻出相點板櫻桃記",
 "墨憨齋重定夢磊傳奇",
 "新刻狄梁公返周望雲忠孝記",
 "新刻出相雙鳳齊鳴記",
 "春蕪記",
 "四喜記",
 "金蓮記",
 "龍膏記",
 "重校韓夫人題紅記",
 "新鐫量江記",
 "新刻出相音釋點板東方朔偷桃記",
 "新鐫武侯七勝記",
 "雙烈記",
 "抄白遍地錦",
 "上林春",
 "玉茗堂批評異夢記",
 "釵釧記",
 "冬青記",
 "琴心記",
 "重校劍俠傳雙紅記",
 "重校四美記",
 "新刻出相點板八義雙盃記",
 "鐫新編全像三桂聯芳記",
 "續精忠記",
 "新編全相點板西湖記",
 "鐫唐韋狀元自製箜篌記",
 "新編孔夫子周遊列國大成麒麟記",
 "墨憨齋詳定酒家傭傳奇",
 "墨憨齋新定灑雪堂傳奇",
 "墨憨齋新訂精忠旗傳奇",
 "譚友夏鍾伯敬先生批評綰春園傳奇",
 "新鐫節義鴛鴦塚嬌紅記",
 "張玉娘閨房三清鸚鵡墓貞文記",
 "小青娘風流院傳奇",
 "青虹嘯傳奇",
 "厓山烈傳奇",
 "望湖亭記",
 "翠屏山",
 "全本千祥記",
 "荷花蕩",
 "斐堂戲墨蓮盟",
 "十錦塘",
 "東郭記",
 "墨憨齋重定雙雄傳奇",
 "善惡圖",
 "墨憨齋訂定萬事足傳奇",
 "評點鳳求凰",
 "喜逢春",
 "泊菴芙蓉影",
 "花筵賺",
 "鴛鴦棒",
 "夢花酣",
 "懷遠堂批點燕子箋",
 "劎嘯閣自訂西樓夢傳奇",
 "劎嘯閣鷫鸘裘記",
 "明月環傳奇",
 "詩賦盟傳奇",
 "靈犀錦傳奇",
 "鬱輪袍傳奇",
 "金鈿盒傳奇",
 "桃林賺傳奇",
 "元宵鬧傳奇",
 "新鐫磨忠記",
 "滑稽館新編三報恩傳奇",
 "竹葉舟傳奇",
 "五福記",
 "竊符記",
 "重校十無端巧合紅蕖記",
 "金鎖記",
 "投梭記",
 "靈犀佩傳奇",
 "新刻宋璟鶼釵記",
 "新鐫二胥記",
 "雙螭璧",
 "筆耒齋訂定二奇緣傳奇",
 "弄珠樓",
 "識閒堂第一種飜西廂",
 "蝴蝶夢",
 "綠牡丹傳奇",
 "療妒羹記",
 "西園記",
 "畫中人傳奇",
 "情郵傳奇",
 "紅情言",
 "景園記傳奇",
 "新刻回春記",
 "三社記",
 "吐絨記",
 "羅衫記傳奇",
 "衣珠記",
 "倒浣紗傳奇",
 "金花記傳奇",
 "錦蒲團",
 "一笠庵新編一捧雪傳奇",
 "一笠庵新編人獸關傳奇",
 "一笠庵新編永團圓傳奇",
 "一笠庵新編占花魁傳奇",
 "牛頭山",
 "太平錢",
 "一笠庵新編眉山秀傳奇",
 "一笠庵新編兩鬚眉傳奇",
 "一笠庵彙編清忠譜傳奇",
 "千鍾祿",
 "萬里圓",
 "麒麟閣",
 "意中人",
 "英雄概傳奇",
 "琥珀匙",
 "瓔珞會",
 "乾坤嘯",
 "艷雲亭",
 "懷古堂新編後漁家樂傳奇",
 "御雪豹",
 "血影石傳奇",
 "軒轅鏡",
 "石麟鏡",
 "五代榮",
 "朝陽鳳",
 "吉慶圖",
 "奪秋魁",
 "雙和合",
 "未央天傳奇",
 "十五貫",
 "聚寶盆",
 "新編龍鳳錢",
 "二分明月集",
 "名媛題咏",
 "翡翠園",
 "錦衣歸",
 "萬年觴",
 "龍燈賺",
 "御袍恩",
 "黨人碑",
 "幻緣箱傳奇",
 "天馬媒",
 "倒鴛鴦傳奇",
 "玉鴛鴦",
 "醉菩提傳奇",
 "重重喜傳奇",
 "雙福壽",
 "吉祥兆",
 "金剛鳳傳奇",
 "快活",
 "紫瓊瑤",
 "釣魚船",
 "如是觀",
 "海潮音",
 "讀書聲",
 "人中龍傳奇",
 "新編臙脂雪傳奇",
 "雙冠誥",
 "稱人心",
 "長生樂",
 "金瓶梅",
 "非非想",
 "秋虎丘",
 "雙蝶夢",
 "紅羅鏡",
 "新編磨塵鑑",
 "繡幃燈傳奇",
 "新編雙魚珮傳奇",
 "天寶曲史",
 "鴛鴦夢傳奇",
 "元刊雜劇三十種",
 "大都新編關張雙赴西蜀夢",
 "新刊關目閨怨佳人拜月亭",
 "古杭新刊的本關大王單刀會",
 "新刊關目詐妮子調風月",
 "新刊關目好酒趙元遇上皇",
 "大都新編楚昭王疎者下船",
 "新刊關目看錢奴買怨家債主",
 "新刊的本泰華山陳摶高臥",
 "新栞關目馬丹陽三度任風子",
 "新刊的本散家財天賜老生兒",
 "古杭新刊的本尉遲恭三奪槊",
 "新刊關目漢高皇濯足氣英布",
 "趙氏孤兒",
 "古杭新刊的本關目風月紫雲庭",
 "大都新編關目公孫汗衫記",
 "新刊的本薛仁貴衣錦還鄉",
 "新刊關目張鼎智勘魔合羅",
 "古杭新刊關目的本李太白貶夜郎",
 "新編岳孔目借鐵拐李還魂",
 "新編關目晉文公火燒介子推",
 "大都新刊關目的本東窗事犯",
 "古杭新刊關目霍光鬼諫",
 "新刊死生交范張雞黍",
 "新刊關目嚴子陵垂釣七里灘",
 "古杭新刊關目輔成王周公攝政",
 "新栞關目全蕭何追韓信",
 "新刊關目陳季卿悟道竹葉舟",
 "新刊關目諸葛亮博望燒屯",
 "新編足本關目張千替殺妻",
 "古杭新刊小張屠焚兒救母",
 "古雜劇",
 "望江亭中秋切鱠旦",
 "白敏中㑳梅香",
 "錢大尹智勘緋衣夢",
 "玉簫女兩世姻緣",
 "江州司馬青衫淚",
 "李太白匹配金錢記",
 "蕭淑蘭情寄菩薩蠻",
 "杜蘂娘智賞金線池",
 "臨江驛瀟湘夜雨",
 "荊楚臣重對玉梳",
 "李雲英風送梧桐葉",
 "漢元帝孤鴈漢宮秋",
 "秦脩然竹塢聽琴",
 "宋太祖龍虎風雲會",
 "謝金蓮詩酒紅梨花",
 "脈望館鈔校本古今雜劇",
 "孤鴈漢宮秋",
 "孟浩然踏雪尋梅",
 "開壇闡教黃粱夢",
 "蘇子瞻風雪貶黃州",
 "四丞相歌舞麗春堂",
 "呂蒙正風雪破窰記",
 "劉夫人慶賞五侯宴",
 "單刀會",
 "鄧夫人苦痛哭存孝",
 "感天動地竇娥冤",
 "山神廟裴度還帶",
 "狀元堂陳母教子",
 "董秀英花月東墻記",
 "裴少俊墻頭馬上",
 "保成公徑赴澠池會",
 "劉玄德獨赴襄陽會",
 "立成湯伊尹耕莘",
 "鍾離春智勇定齊",
 "虎牢關三戰呂布",
 "張子房圮橋進履",
 "破苻堅蔣神靈應",
 "莊周夢蝴蝶",
 "東堂老勸破家子弟",
 "孝義士趙禮讓肥",
 "陶母剪髮待賓",
 "宋上皇御斷金鳳釵",
 "看財奴買冤家債主",
 "斷冤家債主",
 "諸葛亮博望燒屯",
 "龐涓夜走馬陵道",
 "忠義士豫讓吞炭",
 "錦雲堂美女連環記",
 "蘇子瞻醉寫赤壁賦",
 "鄭月蓮秋夜雲窗夢",
 "王月英元夜留鞋記",
 "硃砂擔滴水浮漚記",
 "貨郎旦",
 "敬德不伏老",
 "施仁義劉弘嫁婢",
 "劉千病打獨角牛",
 "斷殺狗勸夫",
 "大婦小妻還牢末",
 "講陰陽八卦桃花女",
 "玎玎璫璫盆兒鬼",
 "劉玄德醉走黃鶴樓",
 "玉清庵錯送鴛鴦被",
 "關雲長千里獨行",
 "孟光女舉案齊眉",
 "存孝打虎",
 "狄青復奪衣襖車",
 "摩利支飛刀對箭",
 "降桑椹蔡順奉母",
 "馬丹陽度脫劉行首",
 "閥閱舞射柳蕤丸記",
 "百花亭",
 "龍濟山野猿聽經",
 "二郎神醉射鎖魔鏡",
 "漢鍾離度脫藍采和",
 "趙匡義智娶符金錠",
 "包待制智賺生金閣",
 "張公藝九世同居",
 "獨步大羅天",
 "卓文君私奔相如",
 "劉晨阮肇誤入天台",
 "黃廷道夜走流星馬",
 "呂洞賓三度城南柳",
 "鐵拐李度金童玉女",
 "呂洞賓桃柳昇仙夢",
 "翠紅鄉兒女兩團圓",
 "洞天玄記",
 "司馬入相傳奇",
 "灌將軍使酒罵座記",
 "金翠寒衣記",
 "玉通和尚罵紅蓮",
 "木蘭女",
 "黃崇嘏女狀元",
 "僧尼共犯傳奇",
 "東華仙三度十長生",
 "羣仙慶壽蟠桃會",
 "呂洞賓花月神仙會",
 "惠禪師三度小桃紅",
 "張天師明斷辰鉤月",
 "洛陽風月牡丹仙",
 "清河縣繼母大賢",
 "趙貞姬身後團圓夢",
 "劉盻春守志香囊怨",
 "紫陽仙三度常椿壽",
 "福祿壽仙官慶會",
 "十美人慶賞牡丹園",
 "善知識苦海回頭",
 "瑤池會八仙慶壽",
 "黑旋風仗義疎財",
 "伍子胥鞭伏柳盜跖",
 "十八國臨潼鬬寶",
 "田穰苴代晉興齊",
 "後七國樂毅圖齊",
 "吳起敵秦掛帥印",
 "守貞節孟母三移",
 "漢公卿衣錦還鄉",
 "運機謀隨何騙英布",
 "隨何賺風魔蒯徹",
 "韓元帥暗度陳倉",
 "司馬相如題橋記",
 "馬援撾打聚獸牌",
 "雲臺門聚二十八將",
 "漢姚期大戰邳仝",
 "寇子翼定時捉將",
 "鄧禹定計捉彭寵",
 "十樣錦諸葛論功",
 "曹操夜走陳倉路",
 "陽平關五馬破曹",
 "走鳳雛龐掠四郡",
 "周公瑾得志娶小喬",
 "張翼德單戰呂布",
 "莽張飛大鬧石榴園",
 "關雲長單刀劈四寇",
 "壽亭侯怒斬關平",
 "關雲長大破蚩尤",
 "劉關張桃園三結義",
 "張翼德三出小沛",
 "張翼德大破杏林莊",
 "陶淵明東籬賞菊",
 "長安城四馬投唐",
 "立功勳慶賞端陽",
 "賢達婦龍門隱秀",
 "招涼亭賈島破風詩",
 "眾僚友喜賞浣花溪",
 "魏徵改詔風雲會",
 "程咬金斧劈老君堂",
 "徐茂公智降秦叔寶",
 "小尉遲將鬬將將鞭認父",
 "尉遲恭鞭打單雄信",
 "十八學士登瀛洲",
 "唐李靖陰山破虜",
 "李嗣源復奪紫泥宣",
 "飛虎峪存孝打虎",
 "壓關樓疊掛午時牌",
 "存仁心曹彬下江南",
 "八大王開詔救忠臣",
 "楊六郎調兵破天陣",
 "焦光贊活拏蕭天佑",
 "宋大將岳飛精忠",
 "十探子大鬧延安府",
 "張于湖誤宿女真觀",
 "女學士明講春秋",
 "趙匡胤打董達",
 "穆陵關上打韓通",
 "相國寺公孫汗衫記",
 "海門張仲村樂堂",
 "王閏香夜月四春園",
 "女姑姑說法陞堂記",
 "清廉官長勘金環",
 "雷澤遇仙記",
 "若耶溪漁樵閑話",
 "徐伯株貧富興衰記",
 "薛包認母",
 "認金梳孤兒尋母",
 "四時花月賽嬌容",
 "王文秀渭塘奇遇記",
 "月夜淫奔記",
 "風月南牢記",
 "秦月娥誤失金環記",
 "釋迦佛雙林坐化",
 "觀音菩薩魚籃記",
 "許真人拔宅飛昇",
 "孫真人南極登仙會",
 "呂翁三化邯鄲店",
 "呂純陽點化度黃龍",
 "邊洞玄慕道昇仙",
 "李雲卿得悟昇真",
 "王蘭卿真烈傳",
 "太平仙記",
 "瘸李岳詩酒翫江亭",
 "太乙仙夜斷桃符記",
 "南極星度脫海棠仙",
 "時真人四聖鎖白猿",
 "猛烈那吒三變化",
 "二郎神鎖齊天大聖",
 "灌口二郎斬健蛟",
 "二郎神射鎖魔鏡",
 "魯智深喜賞黃花峪",
 "梁山五虎大劫牢",
 "梁山七虎鬧銅臺",
 "王矮虎大鬧東平府",
 "宋公明排九宮八卦陣",
 "奉天命三保下西洋",
 "寶光殿天真祝萬壽",
 "眾羣仙慶賞蟠桃會",
 "祝聖壽金母獻蟠桃",
 "降丹墀三聖慶長生",
 "眾神聖慶賀元宵節",
 "祝聖壽萬國來朝",
 "爭玉板八仙過滄海",
 "慶豐年五鬼鬧鍾馗",
 "河嵩神靈芝慶壽",
 "慶賀長春節",
 "賀萬壽五龍朝聖",
 "眾天仙慶賀長生會",
 "慶冬至共享太平宴",
 "賀昇平羣仙祝壽",
 "慶千秋金母賀延年",
 "廣成子祝賀齊天壽",
 "黃眉翁賜福上延年",
 "感天地羣仙朝聖",
 "古名家雜劇",
 "杜牧之詩酒揚州夢",
 "帝妃春遊",
 "雜劇選",
 "須賈𧫒范睢",
 "包待制智賺合同文字",
 "薩真人夜斷碧桃花",
 "王鼎臣風雪漁樵記",
 "陽春奏三種",
 "元明雜劇四種",
 "新鐫半夜雷轟薦福碑",
 "新鐫唐明皇秋夜梧桐雨",
 "新鐫杜牧之詩酒揚州夢",
 "新鐫鐵拐李度金童玉女",
 "古今名劇合選",
 "新鐫古今名劇柳枝集",
 "倩女離魂",
 "翰林風月",
 "青衫淚",
 "兩世姻緣",
 "詩酒揚州夢",
 "金錢記",
 "玉鏡臺",
 "智賞金線池",
 "墻頭馬上",
 "秋夜瀟湘雨",
 "詩酒紅梨花",
 "張生煮海",
 "二郎收豬八戒",
 "竹塢聽琴",
 "柳毅傳書",
 "悞入桃源",
 "三度城南柳",
 "重對玉梳記",
 "蕭淑蘭",
 "三度小桃紅",
 "春風慶朔堂",
 "泣賦眼兒媚",
 "桃源三訪",
 "花前一笑",
 "新鐫古今名劇酹江集",
 "孤雁漢宮秋",
 "三渡任風子",
 "雷轟薦福碑",
 "秋夜梧桐雨",
 "范張雞黍",
 "王粲登樓",
 "竇娥冤",
 "鐵拐李",
 "李逵負荊",
 "誶范叔",
 "東堂老",
 "高宴麗春堂",
 "燕青博魚",
 "天賜老生兒",
 "龍虎風雲會",
 "智勘魔合羅",
 "隔江鬬智",
 "黑旋風仗義疏財",
 "沽酒遊春",
 "一世不伏老",
 "昆侖奴",
 "鄭節度殘唐再創",
 "劉晨阮肇悞入天台",
 "玉蕭女兩世姻緣",
 "群仙慶壽蟠桃會",
 "劉盼春守志香囊怨",
 "新鐫半夜雷轟薦福碑雜劇",
 "新鐫李太白匹配金錢記",
 "新鐫杜子美沽酒遊春雜劇",
 "董秀英花月東牆記",
 "莊周夢胡蝶",
 "田穰苴伐晉興齊",
 "走鳳雛龐統掠四郡",
 "尉遲公鞭打單雄信",
 "關大王獨赴單刀會",
 "張子房圯橋進履",
 "諸葛亭博望燒屯",
 "鴈門關存孝打虎",
 "閥閱舞射柳捶丸記",
 "冲漠子獨步大羅天",
 "王蘭卿貞烈傳",
 "獨樂園司馬入相",
 "僧尼共犯",
 "漢銚期大戰邳彤",
 "薛苞認母",
 "徐懋功智降秦叔寶",
 "慶豐門蘇九淫奔記",
 "紫微宮慶賀長春節",
 "賀萬薵五龍朝聖",
 "孤本元明雜劇提要",
 "新刻全像高文舉珍珠記",
 "新刊重訂出相附釋標註香囊記",
 "重校投筆記",
 "重校古荊釵記",
 "重刻出像浣紗記",
 "新刻重訂出像附釋標註琵琶記",
 "新刻全像觀音魚藍記",
 "新刻重訂附釋標註出相伍倫全備忠孝記",
 "新刻牡丹亭還魂記",
 "重校註釋紅拂記",
 "玉合記",
 "新鍥重訂出像附釋標註驚鴻記題評",
 "重校拜月亭記",
 "新刻出像音註唐韋皐玉環記",
 "新刻出像音註花欄裴度香山還帶記",
 "新刻出像音註呂蒙正破窰記",
 "新刊攷正全像評釋北西廂記",
 "董解元西廂一本圖",
 "附考據",
 "西廂記五劇五本附考據",
 "重編會真雜錄",
 "商調蝶戀花詞",
 "西廂記五劇五本解證",
 "北西廂記釋義字音大全",
 "西廂記古本校注",
 "西廂記釋義字音",
 "五劇箋疑",
 "絲竹芙蓉亭一折",
 "圍棋闖局一折",
 "錢塘夢一折",
 "園林午夢一折",
 "南西廂記",
 "批評釋義音字琵琶記",
 "四聲猿一本",
 "雌木蘭替父從征",
 "玉茗堂還魂記",
 "格正牡丹亭還魂記詞調",
 "玉茗堂南柯記",
 "綠牡丹",
 "療妬羹記",
 "通天臺一本附曲譜",
 "臨春閣一本附曲譜",
 "秣陵春",
 "長生殿",
 "小忽雷",
 "大忽雷",
 "曲譜",
 "附雙忽雷本事",
 "曲品",
 "傳奇品",
 "董解元西廂記",
 "西廂記",
 "續西廂記",
 "李日華南西廂記",
 "陸天池南西廂記",
 "園林午夢",
 "陳眉公批評西廂記",
 "陳眉公批評幽閨記",
 "陳眉公批評琵琶記",
 "陳眉公批評紅拂記",
 "陳眉公批評玉簪記",
 "陳眉公批評繡襦記",
 "死生交范張鷄黍",
 "趙匡義智聚符金錠",
 "玉清菴錯送鴛鴦被",
 "新刊關目閨怨佳拜月亭",
 "新刊關目看錢奴買冤家債主",
 "新刊關目馬丹陽三度任風子",
 "新刊的本薛仁貴衣錦還卿關目",
 "大都新刊關目的本東窻事犯",
 "新刊死生交范張鷄黍",
 "新刊關目嚴子陸垂釣七里灘",
 "新刊關目全蕭何追韓信",
 "裴少俊牆頭馬上雜劇",
 "說鱄諸伍員吹簫雜劇",
 "迷青瑣倩女雜魂雜劇",
 "金安壽",
 "包待制照賺灰闌記雜劇",
 "崔府君斷冤家債主雜劇",
 "杜蘂娘智賞金線池雜劇",
 "月明和尚度翠柳雜劇",
 "感天動地竇娥冤雜劇",
 "桃花女破法嫁周公",
 "逞風流王煥百花亭",
 "包待制三勘蝴蠂夢",
 "朱太守風雪漁樵記",
 "破幽夢孤鴈漢宮秋",
 "龐居士誤放來生債",
 "月明和尚度翠柳",
 "悞入桃源",
 "三度任風子",
 "尋親記",
 "金雀記",
 "焚香記",
 "荊釵記",
 "霞箋記",
 "浣紗記",
 "琵琶記",
 "幽閨記",
 "拜月亭",
 "玉簪記",
 "還魂記",
 "紫釵記",
 "邯鄲記",
 "運甓記",
 "三元記",
 "飛丸記",
 "紅梨記",
 "西樓記",
 "錦箋記",
 "蕉帕記",
 "紫簫記",
 "玉玦記",
 "灌園記",
 "種玉記",
 "義俠記",
 "千金記",
 "玉環記",
 "贈書記",
 "香囊記",
 "四賢記",
 "節俠記",
 "詠懹堂新編十錯認春燈謎記",
 "山水隣新鐫花筵賺",
 "金印合縱記",
 "山水隣新鐫出像四大癡傳奇",
 "五湖游",
 "修文記",
 "磨忠記",
 "博笑記",
 "摘星樓傳奇",
 "梅村樂府二種",
 "煖香樓雜劇",
 "雙報應",
 "沈氏傳奇四種",
 "報恩緣",
 "才人福",
 "文星榜",
 "伏虎韜",
 "誠齋樂府二十四種",
 "新編天香圃牡丹品",
 "新編十美人慶賞牡丹園",
 "新編蘭紅葉從良烟花夢",
 "新編瑤池會八仙慶壽",
 "新編搊搜判官喬斷鬼",
 "新編豹子和尚自還俗",
 "新編甄月娥春風慶朔堂",
 "新編美姻緣風月桃源景",
 "新編宣平巷劉金兒復落娼",
 "新編福祿壽仙官慶會",
 "新編神后山秋獮得騶虞",
 "新編黑旋風仗義疎財",
 "新編小天香半夜朝元",
 "新編張天師明斷辰鉤月",
 "新編李妙清花裏悟真如",
 "新編洛陽風月牡丹仙",
 "新編李亞仙花酒曲江池",
 "新編清河縣繼母大賢",
 "新編趙貞姬身後團圓夢",
 "新編劉盻春守志香囊怨",
 "新編紫陽仙三度常椿壽",
 "新編孟浩然踏雪尋梅",
 "粲花別墅五種曲",
 "療妒羹傳奇",
 "西園記傳奇",
 "情郵記傳奇",
 "空堂話",
 "蘇園翁",
 "秦廷筑",
 "金門戟",
 "醉新豐",
 "鬧門神",
 "雙合歡",
 "半臂寒",
 "長公妹",
 "中郎女",
 "京兆眉",
 "翠鈿緣",
 "汨羅江",
 "黃鶴樓",
 "滕王閣",
 "眼兒媚",
 "孤鴻影",
 "夢幻緣",
 "不了緣",
 "櫻桃宴",
 "昭君夢",
 "旗亭讌",
 "餓方朔",
 "城南寺",
 "西臺記",
 "衛花符",
 "鯁詩讖",
 "風流塚",
 "續離騷",
 "劉國師教習扯淡歌",
 "杜秀才痛哭泥神廟",
 "癡和尚街頭笑布袋",
 "憤司馬夢裏罵閻羅",
 "明翠湖亭四韻事",
 "昆明池",
 "集翠裘",
 "鑑湖隱",
 "旗亭館",
 "續四聲猿",
 "杜秀才痛哭霸亭廟",
 "戴院長神行薊州道",
 "王節使重續木蘭詩",
 "李翰林醉草清平調",
 "後四聲猿",
 "放楊枝",
 "題園壁",
 "謁府帥",
 "投圂中",
 "桃花吟",
 "四色石",
 "張雀網廷平感世",
 "序蘭亭內史臨波",
 "宴滕王子安檢韻",
 "寓同谷老杜興歌",
 "花間九奏",
 "伏生授經",
 "羅敷采桑",
 "桃葉渡江",
 "桃源漁父",
 "梅妃作賦",
 "樂天開閣",
 "賈島祭詩",
 "琴操參禪",
 "對山救友",
 "秋聲譜",
 "武則天風流案卷",
 "判艷",
 "沈媚娘秋牕情話",
 "譜秋",
 "洛陽殿無雙艷福",
 "坦菴買花錢雜劇",
 "坦菴大轉輪雜劇",
 "坦菴拈花笑雜劇",
 "坦菴浮西施雜劇",
 "孔方兄",
 "賈閬僊",
 "十三娘笑擲神奸首",
 "狗咬呂洞賓雜劇",
 "柴舟別集四種",
 "醉畫圖",
 "訴琵琶劇本",
 "續訴琵琶劇本",
 "鏡花亭",
 "四嬋娟",
 "四名家填詞摘齣",
 "藍關雪",
 "柳州煙",
 "醉翁亭",
 "遊赤壁",
 "玉田春水軒雜齣",
 "訊翂",
 "題肆",
 "琴別",
 "畫隱",
 "碎胡琴",
 "安巿",
 "看真",
 "遊山",
 "壽甫",
 "璿璣錦雜劇",
 "女專諸雜劇",
 "松年長生引",
 "北涇草堂外集三種",
 "苧蘿夢",
 "紫姑神",
 "維揚夢",
 "喬影",
 "飲酒讀離圖",
 "當鑪艷",
 "宓妃影傳奇",
 "江州淚傳奇",
 "燕子樓傳奇",
 "新編美姻緣風月桃花景",
 "新編福祿壽僊官慶會",
 "新編黑旋風仗義疏財",
 "新編洛陽風月牡丹僊",
 "女紅紗塗抹試官",
 "禿碧紗炎涼秀士",
 "小青娘挑燈閒看牡丹亭",
 "量江記",
 "女丈夫",
 "新灌園",
 "夢磊記",
 "灑雪堂",
 "雙雄記",
 "楚江情",
 "精忠旗",
 "萬事足",
 "酒家傭",
 "花莚賺",
 "北曲譜",
 "情郵記",
 "香草吟傳奇",
 "載花舲傳奇",
 "墨憨齋訂定人獸關傳奇",
 "墨憨齋重訂永團圓傳奇",
 "坦庵買花錢雜劇",
 "坦庵大轉輪雜劇",
 "坦庵拈花笑雜劇",
 "坦庵浮西施雜劇",
 "坦庵詩餘甕吟",
 "坦庵樂府忝香集",
 "憐香伴傳奇",
 "風箏誤傳奇",
 "意中緣傳奇",
 "蜃中樓傳奇",
 "凰求鳳傳奇",
 "奈何天傳奇",
 "奇福記",
 "比目魚傳奇",
 "玉搔頭傳奇",
 "巧團圓傳奇",
 "夢中樓",
 "慎鸞交傳奇",
 "風流棒傳奇",
 "念八翻傳奇",
 "空青石傳奇",
 "珊瑚玦傳奇",
 "元寶媒傳奇",
 "雙忠廟傳奇",
 "四才子傳奇",
 "夢揚州",
 "飲中仙",
 "藍橋驛",
 "忠孝福",
 "柳州烟",
 "夢中緣",
 "梅花簪",
 "懷沙記",
 "玉獅墜",
 "青衫泪",
 "後一片石",
 "空谷香傳奇",
 "賜衣記",
 "康衢樂",
 "忉利天",
 "昇平瑞",
 "盧山會",
 "採樵圖",
 "采石磯",
 "卓女當盧",
 "酉陽修月",
 "轉天心",
 "清忠譜正案",
 "雙釘案",
 "釣金龜",
 "巧換緣",
 "三元報",
 "蘆花絮",
 "梅龍鎮",
 "麵缸笑",
 "虞兮夢",
 "天緣債",
 "英雄報",
 "女彈詞",
 "長生殿補闕",
 "十字坡",
 "笳騷",
 "東城老父鬬雞懺傳奇",
 "五虎記",
 "四友記",
 "三世記",
 "雙兔記",
 "度藍關",
 "無瑕璧傳奇",
 "杏花村傳奇",
 "瑞筠圖傳奇",
 "廣寒梯傳奇",
 "南陽樂傳奇",
 "花萼吟傳奇",
 "新豐店馬周獨酌",
 "大江西小姑送風",
 "李衛公替龍行雨",
 "黃石婆授計逃關",
 "快活山樵歌九轉",
 "窮阮籍醉罵財神",
 "溫太真晉陽分別",
 "邯鄲邵錯嫁才人",
 "賀蘭山謫仙贈帶",
 "開金榜朱衣點頭",
 "夜香臺持齋訓子",
 "汲長孺矯詔發倉",
 "魯仲連單鞭蹈海",
 "荷花蕩將種逃生",
 "灌口二郎初顯聖",
 "魏徵破笏再朝天",
 "動文昌狀元配瞽",
 "感天后神女露筋",
 "華表柱延陵掛劍",
 "東萊邵暮夜卻金",
 "下江南曹彬誓眾",
 "韓文公雪擁藍關",
 "荀灌娘圍城救父",
 "信陵君義葬金釵",
 "偷桃捉住東方朔",
 "換扇巧逢春夢婆",
 "西塞山漁翁封拜",
 "諸葛亭夜祭瀘江",
 "凝碧池忠魂再表",
 "大蔥嶺隻履西歸",
 "寇萊公思親罷宴",
 "翠微亭卸甲間遊",
 "吟風閣譜",
 "仙緣記傳奇",
 "蜀錦袍傳奇",
 "海虬記傳奇",
 "梅喜緣傳奇",
 "同亭宴傳奇",
 "迴流記傳奇",
 "海雪唫傳奇",
 "負薪記傳奇",
 "錯姻緣傳奇",
 "悲鳳曲",
 "才人福傳奇",
 "輞川圖傳奇",
 "金石錄傳奇",
 "十二釵傳奇",
 "平錁記傳奇",
 "守濬記傳奇",
 "詩扇記傳奇",
 "夢裏緣傳奇",
 "賞心幽品四種",
 "採蘭紉佩",
 "賞菊傾酒",
 "愛梅錫號",
 "畫竹傳神",
 "破牢愁",
 "砥石齋韻品雜齣",
 "砥石齋散曲",
 "影梅菴傳奇",
 "香畹樓",
 "宴金臺",
 "定中原",
 "河梁歸",
 "琵琶語",
 "紉蘭佩",
 "碎金牌",
 "紞如鼓",
 "波弋香",
 "鳳凰琴",
 "雙龍珠",
 "金榜山",
 "四賢配",
 "孝感天",
 "天感孝",
 "西遼記北曲",
 "雁帛書北曲",
 "女雲臺北曲",
 "孝女存孤北曲",
 "儒吏完城北曲",
 "三釵夢北曲",
 "紫荊花傳奇",
 "胭脂舄傳奇",
 "銀漢槎傳奇",
 "鳳飛樓傳奇",
 "雁書記",
 "安市",
 "游山",
 "芋佛",
 "賦棋",
 "逼月",
 "平濟",
 "梨花雪",
 "白霓裳",
 "白頭新",
 "鴈鳴霜",
 "花葉粉",
 "瘞雲巖傳奇",
 "臙脂獄",
 "茯苓仙",
 "靈媧石",
 "神山引",
 "風雲會傳奇",
 "碧聲吟館談麈",
 "硯辨",
 "香銷酒醒詞",
 "碧聲吟館倡酬錄",
 "後勸農",
 "活佛圖",
 "同胞案",
 "義民記",
 "海烈婦記",
 "岳侯訓子",
 "英雄譜",
 "風流鑒",
 "延壽籙",
 "育怪圖",
 "屠牛報",
 "老年福",
 "文星現",
 "掃螺記",
 "掃螄記",
 "前出劫圖",
 "後出劫圖",
 "義犬記",
 "回頭岸",
 "推磨記",
 "公平判",
 "陰陽獄",
 "硃砂志",
 "同科報",
 "福善圖",
 "酒樓記",
 "綠林鐸",
 "劫海圖",
 "燒香案",
 "俠女記",
 "烈女記",
 "玉簪記曲譜",
 "浣紗記曲譜",
 "豔雲亭曲譜",
 "湘真閣",
 "附譜",
 "無價寶",
 "惆悵爨",
 "魚兒佛譜",
 "療妬羹譜",
 "鈞天樂譜",
 "伏虎韜譜",
 "情郵譜",
 "才人福譜",
 "東艷禍傳奇",
 "南冠血傳奇",
 "玉川子嘯旨",
 "皇極聲音數",
 "律呂",
 "樂府原題",
 "詩餘譜",
 "致語",
 "周德清中原音韻",
 "務頭正語作詞起例",
 "南曲譜",
 "中州音韻",
 "司馬溫公切韻",
 "新傳奇品",
 "舊編南九宮目錄",
 "衡曲麈譚",
 "曲目表",
 "十三調南呂音節譜",
 "衡曲麈談",
 "度曲須知",
 "曲目韻編",
 "曲談",
 "古劇腳色考",
 "唱論",
 "輟耕曲錄",
 "丹丘先生曲論",
 "四友齋曲說",
 "王氏曲藻",
 "三家村老委談",
 "少室山房曲考",
 "堯山堂曲紀",
 "周氏曲品",
 "梅花草堂曲談",
 "客座曲語",
 "程氏曲藻",
 "九宮譜定總論",
 "太霞曲語",
 "笠翁劇論",
 "在園曲志",
 "大成曲譜論例",
 "易餘曲錄",
 "艾塘曲錄",
 "書隱曲說",
 "兩般秋雨盦曲談",
 "北涇草堂曲論",
 "京塵劇錄",
 "曲概",
 "中州切音譜贅論",
 "曲海一勺",
 "曲稗",
 "菉猗室曲話",
 "霜厓曲跋",
 "曲海揚波"
]
});
require.register("ccs_classifier/index.js", function(exports, require, module){
var boot=require("boot");
boot("ccs_classifier","main","main");
});


















require.alias("ksanaforge-boot/index.js", "ccs_classifier/deps/boot/index.js");
require.alias("ksanaforge-boot/index.js", "ccs_classifier/deps/boot/index.js");
require.alias("ksanaforge-boot/index.js", "boot/index.js");
require.alias("ksanaforge-boot/index.js", "ksanaforge-boot/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "ccs_classifier/deps/bootstrap/dist/js/bootstrap.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "ccs_classifier/deps/bootstrap/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "bootstrap/index.js");
require.alias("brighthas-bootstrap/dist/js/bootstrap.js", "brighthas-bootstrap/index.js");
require.alias("ksana-document/index.js", "ccs_classifier/deps/ksana-document/index.js");
require.alias("ksana-document/document.js", "ccs_classifier/deps/ksana-document/document.js");
require.alias("ksana-document/api.js", "ccs_classifier/deps/ksana-document/api.js");
require.alias("ksana-document/xml.js", "ccs_classifier/deps/ksana-document/xml.js");
require.alias("ksana-document/template_accelon.js", "ccs_classifier/deps/ksana-document/template_accelon.js");
require.alias("ksana-document/persistent.js", "ccs_classifier/deps/ksana-document/persistent.js");
require.alias("ksana-document/tokenizers.js", "ccs_classifier/deps/ksana-document/tokenizers.js");
require.alias("ksana-document/markup.js", "ccs_classifier/deps/ksana-document/markup.js");
require.alias("ksana-document/typeset.js", "ccs_classifier/deps/ksana-document/typeset.js");
require.alias("ksana-document/sha1.js", "ccs_classifier/deps/ksana-document/sha1.js");
require.alias("ksana-document/users.js", "ccs_classifier/deps/ksana-document/users.js");
require.alias("ksana-document/customfunc.js", "ccs_classifier/deps/ksana-document/customfunc.js");
require.alias("ksana-document/configs.js", "ccs_classifier/deps/ksana-document/configs.js");
require.alias("ksana-document/projects.js", "ccs_classifier/deps/ksana-document/projects.js");
require.alias("ksana-document/indexer.js", "ccs_classifier/deps/ksana-document/indexer.js");
require.alias("ksana-document/indexer_kd.js", "ccs_classifier/deps/ksana-document/indexer_kd.js");
require.alias("ksana-document/kdb.js", "ccs_classifier/deps/ksana-document/kdb.js");
require.alias("ksana-document/kdbfs.js", "ccs_classifier/deps/ksana-document/kdbfs.js");
require.alias("ksana-document/kdbw.js", "ccs_classifier/deps/ksana-document/kdbw.js");
require.alias("ksana-document/kdb_sync.js", "ccs_classifier/deps/ksana-document/kdb_sync.js");
require.alias("ksana-document/kdbfs_sync.js", "ccs_classifier/deps/ksana-document/kdbfs_sync.js");
require.alias("ksana-document/html5fs.js", "ccs_classifier/deps/ksana-document/html5fs.js");
require.alias("ksana-document/kse.js", "ccs_classifier/deps/ksana-document/kse.js");
require.alias("ksana-document/kde.js", "ccs_classifier/deps/ksana-document/kde.js");
require.alias("ksana-document/boolsearch.js", "ccs_classifier/deps/ksana-document/boolsearch.js");
require.alias("ksana-document/search.js", "ccs_classifier/deps/ksana-document/search.js");
require.alias("ksana-document/plist.js", "ccs_classifier/deps/ksana-document/plist.js");
require.alias("ksana-document/excerpt.js", "ccs_classifier/deps/ksana-document/excerpt.js");
require.alias("ksana-document/link.js", "ccs_classifier/deps/ksana-document/link.js");
require.alias("ksana-document/tibetan/wylie.js", "ccs_classifier/deps/ksana-document/tibetan/wylie.js");
require.alias("ksana-document/languages.js", "ccs_classifier/deps/ksana-document/languages.js");
require.alias("ksana-document/diff.js", "ccs_classifier/deps/ksana-document/diff.js");
require.alias("ksana-document/xml4kdb.js", "ccs_classifier/deps/ksana-document/xml4kdb.js");
require.alias("ksana-document/buildfromxml.js", "ccs_classifier/deps/ksana-document/buildfromxml.js");
require.alias("ksana-document/tei.js", "ccs_classifier/deps/ksana-document/tei.js");
require.alias("ksana-document/concordance.js", "ccs_classifier/deps/ksana-document/concordance.js");
require.alias("ksana-document/regex.js", "ccs_classifier/deps/ksana-document/regex.js");
require.alias("ksana-document/bsearch.js", "ccs_classifier/deps/ksana-document/bsearch.js");
require.alias("ksana-document/index.js", "ccs_classifier/deps/ksana-document/index.js");
require.alias("ksana-document/index.js", "ksana-document/index.js");
require.alias("ksana-document/index.js", "ksana-document/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "ccs_classifier/deps/fileinstaller/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "ccs_classifier/deps/fileinstaller/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "fileinstaller/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-fileinstaller/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-fileinstaller/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-checkbrowser/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-fileinstaller/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-fileinstaller/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-htmlfs/index.js");
require.alias("ksanaforge-fileinstaller/index.js", "ksanaforge-fileinstaller/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ccs_classifier/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ccs_classifier/deps/checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "checkbrowser/index.js");
require.alias("ksanaforge-checkbrowser/index.js", "ksanaforge-checkbrowser/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ccs_classifier/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ccs_classifier/deps/htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "htmlfs/index.js");
require.alias("ksanaforge-htmlfs/index.js", "ksanaforge-htmlfs/index.js");
require.alias("ccs_classifier-main/index.js", "ccs_classifier/deps/main/index.js");
require.alias("ccs_classifier-main/index.js", "ccs_classifier/deps/main/index.js");
require.alias("ccs_classifier-main/index.js", "main/index.js");
require.alias("ccs_classifier-main/index.js", "ccs_classifier-main/index.js");
require.alias("ccs_classifier-comp1/index.js", "ccs_classifier/deps/comp1/index.js");
require.alias("ccs_classifier-comp1/index.js", "ccs_classifier/deps/comp1/index.js");
require.alias("ccs_classifier-comp1/index.js", "comp1/index.js");
require.alias("ccs_classifier-comp1/index.js", "ccs_classifier-comp1/index.js");
require.alias("ccs_classifier-dataset/index.js", "ccs_classifier/deps/dataset/index.js");
require.alias("ccs_classifier-dataset/titlenames.js", "ccs_classifier/deps/dataset/titlenames.js");
require.alias("ccs_classifier-dataset/index.js", "ccs_classifier/deps/dataset/index.js");
require.alias("ccs_classifier-dataset/index.js", "dataset/index.js");
require.alias("ccs_classifier-dataset/index.js", "ccs_classifier-dataset/index.js");
require.alias("ccs_classifier/index.js", "ccs_classifier/index.js");
if (typeof exports == 'object') {
  module.exports = require('ccs_classifier');
} else if (typeof define == 'function' && define.amd) {
  define(function(){ return require('ccs_classifier'); });
} else {
  window['ccs_classifier'] = require('ccs_classifier');
}})();