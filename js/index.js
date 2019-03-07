var $ = function(param, oParent) {
  var obj = oParent || document;
  if (param.charAt(0) === '#') {
    return document.getElementById(param.slice(1));
  } else if (param.indexOf('.') === 0) {
    return getByClass(param.slice(1), obj);
  } else {
    return obj.getElementsByTagName(param);
  }
}

function getByClass(className, oParent) {
  var obj = oParent || document;
  if (obj.getElementsByClassName) {
    return obj.getElementsByClassName(className)
  }
  // ie8以下
  var result = [];
  var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
  var aElement = obj.getElementsByTagName('*');
  for (var i = 0, len = aElement.length; i < len; i++) {
    reg.test(aElement[i].className) && result.push(aElement[i])
  }
  return result;
}

var addHandler = function(element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler);
  } else {
    element['on' + type] = handler;
  }
};

(function() {
  function Tab(nav, con, navCur, conCur, autpl) {
    this.navLi = $('li', $('.' + nav)[0]);
    this.navSpan = $('span', $('.' + nav)[0]);
    this.con = $('.' + con);
    this.conCls = con;
    this.navCls = nav;
    this.navCur = navCur;
    this.conCur = conCur;
    this.len = this.con.length;
    this.autpl = autpl;
    this.lastId = 0;
    this.index = 0;
    this.t = null;
  }
  Tab.prototype = {
    'setId': function() {
      for (var i = 0; i < this.len; i++) {
        if (this.navLi[i]) {
          this.navLi[i].id = i;
        }
        if (this.navSpan[i]) {
          this.navSpan[i].id = i;
        }
      }
    },
    'invoke': function(e) {
      var el = e.target || e.srcElement,
        id = el.id,
        i = 0;
      for (i = 0; i < this.len; i++) {
        this.navLi[i].className = '';
        this.con[i].className = this.conCls;
      }
      /*tab的结构为ul>li时*/
      if (el.tagName === 'LI') {
        el.className += ' ' + this.navCur;
        this.con[id].className += ' ' + this.conCur;
      }
      /*tab的结构为ul>li>a时*/
      else if (el.tagName === 'A') {
        id = el.parentNode.id;
        el.parentNode.className += ' ' + this.navCur;
        this.con[id].className += ' ' + this.conCur;
      }
      /*tab的结构为ul>li>a>i时*/
      else if (el.tagName === 'I') {
        id = el.parentNode.parentNode.id;
        el.parentNode.parentNode.className += ' ' + this.navCur;
        this.con[id].className += ' ' + this.conCur;
      }
    },
    'over': function(e) {
      var el = e.target || e.srcElement,
        id = el.id,
        w = this.con[0].offsetWidth;
      clearInterval(this.t);
      this.t = null;
      if (el.tagName.toUpperCase() === 'SPAN') {
        for (var i = this.len - 1; i >= 0; i--) {
          this.navSpan[i].className = '';
        }
        this.con[0].parentNode.style.left = (-w * id) + 'px';
        el.className = ' ' + this.navCur;
      }
      // return id;
    },
    'autoplay': function() {
      if (this.autpl == true) {
        var oThis = this,
          w = Number(oThis.con[0].offsetWidth),
          l = Number(($('.' + oThis.conCur)[0].style.left).slice(0, -2)); //当前left, 再去掉px
        this.index = Math.abs(l) / w;
        clearInterval(oThis.t);
        oThis.t = setInterval(function() {
          for (var i = 0; i < oThis.len; i++) {
            oThis.navSpan[i].className = '';
          }
          if (oThis.index >= (oThis.len - 1) || isNaN(oThis.index)) {
            oThis.index = 0;
          } else {
            oThis.index++;
          }
          $('.' + oThis.conCur)[0].style.left = -oThis.index * w + 'px';
          oThis.navSpan[oThis.index].className += ' ' + oThis.navCur;
        }, 2000)
      }
    },
    'prevNext': function(e) {
      var el = e.target || e.srcElement;
      for (var i = 0; i < this.len; i++) {
        this.navSpan[i].className = '';
      }
      if (el.className === 'slider_prev') {
        this.index--;
      } else if (el.className === 'slider_next') {
        this.index++;
      }
      if (this.index > this.len - 1) {
        this.index = 0;
      } else if (this.index < 0) {
        this.index = this.len - 1;
      }
      $('.' + this.conCur)[0].style.left = -1 * this.index * Number(this.con[0].offsetWidth) + 'px';
      this.navSpan[this.index].className = ' ' + this.navCur;
    }
  };
  window.Tab = Tab;
})();

window.onload = function() {
  var tab1 = new Tab('tab1_nav', 'tab1_content_item', 'tab1_nav_item_active', 'tab1_content_item_active'),
    tab2 = new Tab('tab2_nav', 'tab2_content_item', 'tab2_nav_item_active', 'tab2_content_item_active'),
    tab3 = new Tab('tab3_nav', 'tab3_content_item', 'tab3_nav_item_active', 'tab3_content_item_active'),
    sliderTab = new Tab('slider_tab', 'slider_img_item', 'slider_tab_item_active', 'slider_img_item_active', true),

    tab1Nav = $('.tab1_nav')[0],
    tab2Nav = $('.tab2_nav')[0],
    tab3Nav = $('.tab3_nav')[0],
    sliderControl = $('.slider_tab')[0],
    slider = $('.slider')[0];

  sliderTab.autoplay();

  addHandler(tab1Nav, 'mouseover', function(event) {
    var ev = event || window.event;
    tab1.setId();
    tab1.invoke(ev);
  });
  addHandler(tab2Nav, 'mouseover', function(event) {
    var ev = event || window.event;
    tab2.setId();
    tab2.invoke(ev);
  });
  addHandler(tab3Nav, 'mouseover', function(event) {
    var ev = event || window.event;
    tab3.setId();
    tab3.invoke(ev);
  });
  addHandler(sliderControl, 'mouseover', function(event) {
    var ev = event || window.event;
    sliderTab.setId();
    sliderTab.over(ev);
  });
  addHandler(sliderControl, 'mouseout', function(event) {
    sliderTab.autoplay();
  });
  
  // addHandler(slider, 'mouseover', function(event) {
  //   var ev = event || window.event;
  //   sliderTab.over(ev);
  // });
  // addHandler(slider, 'mouseout', function(event) {
  //   sliderTab.autoplay();
  // });

  addHandler(slider, 'click', function(event) {
    var ev = event || window.event;
    sliderTab.prevNext(ev);
    sliderTab.autoplay();
  });
}
