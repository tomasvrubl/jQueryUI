/***
 * Multiselect
 * created by miniwork.eu
 ***/

(function(jQuery) {
                jQuery.widget("ui.wmultiselect", {
		options: {
                        selected:  new Array(),  //list of keys
                        items: new Array(), //array where [ { 'v': val, 'l': lab } ...
                        autocomplete: true,
                        minchars: 2     //at least 2 chars to show autocomplete
		},
                tmp_prev : '',
                e_popup: null,
                e_button: null,
                e_textbox: null,
                 isinit: false,
                _init: function() {
                        if(!this.isinit){
                            this.init();
                            this.isinit = true;
                        }                                      
		},
                
                init: function() {
                    
                    var self = this, el = self.element, o = self.options;                    
                    jQuery(el).addClass('wmultiselect');
                    
                    var li = '';
                                                
                    this.e_popup = jQuery('<div class="popup"></div>');
                    this.e_button = jQuery('<button>&nbsp;</button>');
                    this.e_textbox =jQuery("<input type='text' value='' placeholder='add item...' />");
                    jQuery(el).html('');
                    
                    for(var j=0; j < o.selected.length; ++j){
                        o.selected[j] = o.selected[j] + '';
                        
                        for(var i=0; i < o.items.length; ++i){

                           if(o.selected[j] == (o.items[i].v+'')){
                                li += '<li class="item" val="'+o.items[i].v+'">'+o.items[i].l+'</li>';
                                continue;
                           }
                        }
                    }
                    
                    
                    var html = jQuery("<ul>"+li+"<li class='text'></li></ul>");
                    
                    jQuery('li.text', html).append(self.e_textbox);
                    
                    jQuery(el).append(self.e_button);
                    jQuery(el).append(html);
                    jQuery(el).append(self.e_popup);
                    
                    jQuery(el).unbind('click');
                    jQuery(el).click(function(){
                        jQuery('input[type="text"]', el).focus();
                    });
                    
                    jQuery(window).unbind('keydown');
                    jQuery(window).keydown(function(e) {
                      
                         if(e.which == 13) {
                             jQuery('.selected', this.e_popup).click();                               
                         }
                         else if(e.which == 8 && self.e_textbox.val().length == 0){
                             if(jQuery('.item:last', el).hasClass('drop')){
                                self._removeItem(jQuery('.item:last', el).attr('val'));
                             }
                             else{
                                 jQuery('.item:last',el).addClass('drop');
                             }
                             return;
                         }
                         else if(e.which == 38){
                             self._prevItemPopup();
                             return;
                         }
                         else if(e.which == 40){
                             self._nextItemPopup();
                             return;
                         }
                         
                         else if(e.which = 27){                             
                               self._hidepopup();
                               return;
                         }
                                 
                         if(jQuery('.item:last', el).hasClass('drop')){
                             jQuery('.item:last', el).removeClass('drop');
                         }
                         
                    });
                    
                    self.e_textbox.unbind('keyup');
                    self.e_textbox.keyup(function(){
                        var val = jQuery(this).val();
                        var w = (val.length * 10), mw = parseInt(jQuery(this).css('min-width'));
                        w = w < mw ? mw : w;
                        jQuery(this).attr('style' , 'width: '+w+'px !important');
                        if(o.autocomplete && self.tmp_prev != val){   
                            self._autocomplete(val);    
                            self.tmp_prev = val;
                        }
                    });
                    self.e_button.unbind('click');
                    
                    self.e_button.click(function(){
                        self._showWnd();
                    });
                    
                    this._refreshdrop();                    
                },
                _autocomplete: function(val){
                    var self = this;
                    var o = self.options;
                    var d = self.e_popup;
                    
                    
                    if(val.length < o.minchars){
                        this._hidepopup();
                        return;
                    }
                    
                    var html = '';
                       
                    d.html('');
                    for(var i=0; i < o.items.length; ++i){
                        if(o.items[i].l.toLowerCase().indexOf(val) > -1 && 
                                (o.selected.indexOf(o.items[i].v+'') < 0)){                               
                            html +='<div v="'+o.items[i].v+'">'+o.items[i].l+'</div>';
                        }
                    }

                    if(html.length == 0 )
                        return;

                    var e = this.element;
                    var pos = jQuery(e).position();
                    d.html(html);
                    jQuery('div:first-child', d).addClass('selected');

                     var w = jQuery(e).width() + parseInt(jQuery(e).css('padding-left')) + parseInt(jQuery(e).css('padding-right'));
                     d.css({left: pos.left, top: pos.top + jQuery(e).height() + jQuery(e).css('margin-top') + jQuery(e).css('margin-bottom'), width: w});

                     jQuery('div', d).bind('click', function(){
                         
                        self._appendItem(jQuery(this).attr('v'), jQuery(this).html());
                     });

                     jQuery('div', d).hover(function(){
                         jQuery('div', d).removeClass('selected');    
                         jQuery(this).addClass('selected');
                     });


                     d.show(150, function(){                                
                         jQuery(window).click(function (){                                    
                             if(d.is(':visible')){                                
                               this._hidepopup();
                             }   
                         });
                     });
                
                },
                _prevItemPopup : function(){
                    var d = this.e_popup;
                    if(d.is(':visible')){
                        var s = jQuery('.selected', d);
                        var p = s.prev();
                        if(p != null && p.length >0){
                            p.addClass('selected');
                            s.removeClass('selected');
                        }
                    }
                },
                _nextItemPopup : function(){
                    var d = this.e_popup;
                    if(d.is(':visible')){
                        var s = jQuery('.selected', d);
                        var n = s.next();
                        
                        if(n != null && n.length > 0){
                           n.addClass('selected');
                           s.removeClass('selected');
                        }
                    }
                },                
                _hidepopup: function(){
                    var d = this.e_popup;
                    jQuery('div', d).unbind('click');
                    d.hide();
                    jQuery(window).unbind("click");
                },
                _appendItem: function(val, label, nohide){
                    
                    if(val == null || label == null)
                        return;
                    
                    this.options.selected.push(val);
                    this.e_textbox.val('');                    
                    
                    jQuery('<li class="item" val="'+val+'">'+label+'</div></li>').insertBefore(jQuery('li.text', this.element));
                    
                    if(nohide == null || nohide == false){
                     this._hidepopup();
                    }
                    
                    this._refreshdrop();
                    
                },  
                _removeItem: function(val){
                    var o = this.options;
                    
                    if(val == null || o.selected.length < 1)
                        return;
                    
                    var i =  o.selected.indexOf(val+'');
                    if(i < 0)
                        return;
                    
                    o.selected.splice(i, 1);
                    jQuery('li.item[val="'+val+'"]', this.element).remove();
                    
                },
                _refreshdrop:function(){   
                    var self = this;
                    jQuery('li.item', self.element).unbind('click');
                    jQuery('li.item', self.element).bind('click', function(){                        
                         self._removeItem(jQuery(this).attr('val')); 
                    });
                },
                _wndAddDropItem: function(opt){
                        
                        if(opt == null){
                            return;
                        }
                        var e = this.element,  d = this.e_popup, chk = jQuery('input[type="checkbox"]',opt);
                      
                        if(chk.is(':checked')){                            
                            this._removeItem(opt.attr('v'));
                            opt.removeClass('selected');
                            chk.attr('checked', null);
                        }
                        else{
                            this._appendItem(opt.attr('v'), opt.text(), true);
                            opt.addClass('selected');     
                            chk.attr('checked', 'checked');
                        }
                        
                        var pos = jQuery(e).position();
                        var w = jQuery(e).width() + parseInt(jQuery(e).css('padding-left')) + parseInt(jQuery(e).css('padding-right'));
                        d.css({left: pos.left, top: pos.top + jQuery(e).height() + jQuery(e).css('margin-top') + jQuery(e).css('margin-bottom'), width: w});
                      
                },
                _showWnd: function(){
                    //console.log('showWnd');
                    var d = this.e_popup, o = this.options, self =this;
                    var html = '';
                    d.html('');
                    
                    for(var i=0; i < o.items.length; ++i){
                        
                        if(o.selected.indexOf(o.items[i].v+'') < 0){
                            html += '<div v="'+o.items[i].v+'" class="opt"><input type="checkbox">&nbsp;'+o.items[i].l+'</div>';
                        }
                    }
                    
                    this._hidepopup();
                    if(html.length < 1){
                       return;
                    }
                    
                    d.html(html);
                    
                    var e = this.element;
                    jQuery('.opt',d).click(function(){      
                        self._wndAddDropItem(jQuery(this));
                    });
                    
                    jQuery('input[type="checkbox"]',d).click(function(){  
                        self._wndAddDropItem(jQuery(this).parent());
                    });
                    
                    var pos = jQuery(e).position();
                    var w = jQuery(e).width() + parseInt(jQuery(e).css('padding-left')) + parseInt(jQuery(e).css('padding-right'));
                    d.css({left: pos.left, top: pos.top + jQuery(e).height() + jQuery(e).css('margin-top') + jQuery(e).css('margin-bottom'), width: w});
                    
                    d.show(150, function(){                                
                        jQuery(window).click(function (e){                                    
                           if(d.is(':visible') && 
                                   (!d.is(e.target) && d.has(e.target).length == 0)){                                
                                 d.hide();
                           }   
                       });
                    });
                    
                },
                value: function(value){
                    if(value != null){
                        this.options.selected = value;
                        this.init();
                    }
                    return this.options.selected;
                },    
                destroy: function(){
                    jQuery(window).unbind("click");
                }
	});
})(jQuery);