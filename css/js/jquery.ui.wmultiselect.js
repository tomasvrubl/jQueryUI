/***
 * Multiselect
 * created by miniwork.eu
 * version: 0.2b
 ***/

(function(jQuery) {
                jQuery.widget("ui.wmultiselect", {
		options: {
                        selected:  new Array(),  //list of keys
                        items: new Array(), //array where [ { 'v': val, 'l': lab } ...
                        maxselected: 0, //maximum of selected vals                        
                        minchars: 2,    //at least 2 chars to show autocomplete
                        tags: false
		},
                _uq : function()
                {
                    if (this.uniqId)
                    {
                        return this.uniqId;
                    }
                    
                    $.ui.wmultiselect.uniq = ($.ui.wmultiselect.uniq || 0)+1;
                    this.uniqId = 'wmultiselect-' + $.ui.wmultiselect.uniq;
                    
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
                    
                    var inputText = jQuery('input[type="text"]', el);
                    inputText.off('focus');
                    inputText.on('focus', function(){    

                            jQuery(window).off('keydown.' + self._uq());
                            jQuery(window).on('keydown.' + self._uq(),function(e) {
                                  
                                 if (inputText.get(0) != e.target)
                                 {
                                    jQuery(window).off('keydown.' + self._uq());         
                                    return;
                                 }
                                 if(e.which == 13) {
                                     if(self.e_popup.is(':visible')){
                                        var it =jQuery('.focused', self.e_popup);
                                        if(it != null && it.length > 0){
                                            it.click();
                                        }
                                    }
                                    else if (o.tags  && self.e_textbox.val().trim().length > 0){
                                         var v = self.e_textbox.val();
                                         self._appendItem(v,v);
                                         self.e_textbox.val('');
                                    }
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
                                 else if(e.which == 38){ //key up
                                     self._prevItemPopup();
                                     return;
                                 }
                                 else if(e.which == 40){ //key down
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
                     })
                    
                    jQuery(el).unbind('click');
                    jQuery(el).click(function(){
                        jQuery('input[type="text"]', el).focus();
                        
                    });
                    
                    
                   
                    
                    self.e_textbox.unbind('keyup');
                    self.e_textbox.keyup(function(ev){
                        var val = jQuery(this).val();
                        var w = (val.length * 10), mw = parseInt(jQuery(this).css('min-width'));
                        w = w < mw ? mw : w;
                        jQuery(this).attr('style' , 'width: '+w+'px !important');
                        
                        val = val.trim();
                        if(self.tmp_prev != val && o.minchars <= val.length){   
                            self._showWnd(val);    
                            self._nextItemPopup();
                            
                        }
                        self.tmp_prev = val;
                    });
                    
                    this.e_button.unbind('click');
                    this.e_button.click(function(){
                        self._showWnd();
                    });
                    this._refreshdrop();                    
                },
                _prevItemPopup : function(){
                    var d = this.e_popup;
                    if(d.is(':visible')){
                        var s = jQuery('.focused', d);
                        if(s != null && s.length < 1){
                            jQuery('.opt:first-child', d).addClass('focused');
                            return;
                        }
                        var p = s.prev();
                        if(p != null && p.length >0){                            
                            jQuery('.focused', d).removeClass('focused');
                            p.addClass('focused');
                        }
                    }
                },
                _nextItemPopup : function(){
                    var d = this.e_popup;
                    if(d.is(':visible')){
                        var s = jQuery('.focused', d);
                        
                        if(s != null && s.length < 1){
                            jQuery('.opt:first-child', d).addClass('focused');
                            return;
                        }
                        
                        var n = s.next();
                        if(n != null && n.length > 0){
                           jQuery('.focused', d).removeClass('focused');
                           n.addClass('focused');
                        }
                    }
                },                
                _hidepopup: function(){
                    var d = this.e_popup;
                    jQuery(d).hide();
                    jQuery('.opt', d).unbind('click');
                    jQuery(window).unbind('click.' + this._uq());
                },
                _appendItem: function(val, label, nohide){
                    
                    var o = this.options;
                    if(val == null || label == null)
                        return;
                    
                    this.options.selected.push(val);
                    this.e_textbox.val('');                    
                    
                    jQuery('<li class="item" val="'+val+'">'+label+'</div></li>').insertBefore(jQuery('li.text', this.element));
                    
                    if(nohide == null || nohide == false){
                      this._hidepopup();
                    }
                    
                    this._refreshdrop();
                    this._checkmaxselected();
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
                    
                    this._checkmaxselected();
                    
                },
                _checkmaxselected: function(){
                     var o = this.options;
                    
                     if(o.maxselected  < 1){
                         return;
                     }
                     
                     if(o.selected.length >= o.maxselected){
                        this.e_button.hide();
                        this.e_textbox.hide();
                        this._hidepopup();
                     }
                     else{
                         this.e_button.show();
                         this.e_textbox.show();
                     }
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
                _showWnd: function(val){

                    var d = this.e_popup, o = this.options, self =this;
                    var html = '';
                    d.html('');
                    
                    if(val != null && val.trim().length > 0){
                        for(var i=0; i < o.items.length; ++i){
                            if(o.items[i].l.toLowerCase().indexOf(val) > -1 && 
                                (o.selected.indexOf(o.items[i].v+'') < 0)){                               
                                html += '<div v="'+o.items[i].v+'" class="opt"><input type="checkbox">&nbsp;'+o.items[i].l+'</div>';
                            }
                        }
                    }
                    else{
                        for(var i=0; i < o.items.length; ++i){

                            if(o.selected.indexOf(o.items[i].v+'') < 0){
                                html += '<div v="'+o.items[i].v+'" class="opt"><input type="checkbox">&nbsp;'+o.items[i].l+'</div>';
                            }
                        }
                    }
                    
                    if(html.length < 1){
                        this._hidepopup();
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
                        jQuery(window).unbind('click.' + self._uq());
                        jQuery(window).on('click.'+self._uq(),function(e) {                               
                           if(d.is(':visible') && 
                                   (!d.is(e.target) && d.has(e.target).length == 0)){                                
                                 self._hidepopup();
                           }   
                       });
                    });
                    
                },
                value: function(value){
                    if(value != null){
                        var o = this.options;
                        o.selected = value;
                       
                        var ul =  jQuery('ul', this.element);
                        jQuery('li.item', ul).remove();
                        var li = '';
                        for(var j=0; j < o.selected.length; ++j){
                            o.selected[j] = o.selected[j] + '';

                            for(var i=0; i < o.items.length; ++i){

                               if(o.selected[j] == (o.items[i].v+'')){
                                    li += '<li class="item" val="'+o.items[i].v+'">'+o.items[i].l+'</li>';
                                    continue;
                               }
                            }
                        }
                        
                        jQuery(li).insertBefore(jQuery('li.text', ul));
                        
                    }
                    return this.options.selected;
                },    
                maxselected: function(val){
                    if(val != null){
                        this.options.maxselected = val;
                        this._checkmaxselected();
                    }
                    return this.options.maxselected;
                },
                destroy: function(){
                    this._hidepopup();
                }
	});
})(jQuery);