import{B as H,r as S,c as U,d as g,o as m,w as K,e as f,f as b,m as l,F as P,a4 as D,p,j as B,u as w,q as O,t as V,i as N,g as k,A as ae,L as q,G as C,af as Ie,ag as I,ah as F,z as L,ai as _,Y,aj as rt,ak as at,h as st,x as E,K as x,V as se,l as A,al as X,ab as oe,n as M,a9 as ge,aa as ve,a3 as R,H as ue,N as ye,v as j,a7 as z,am as ke,an as de,ao as G,Q as J,ap as $,X as T,D as ot}from"./index-CIvZqnG9.js";import{s as xe}from"./index-CI70ECEq.js";import{s as Le}from"./index-ntJNSm1c.js";import{s as Pe}from"./index-CDHacQLo.js";import{s as ee,a as we}from"./index-DtbhESyl.js";import{O as Ke,C as Me}from"./index-B8K14yKN.js";import{s as ut,a as lt,b as mt}from"./index-Bzi9e_JM.js";import{s as dt}from"./index-Cm4eTBAt.js";import{s as ct,a as ft}from"./index-2HQD3IZ5.js";import{s as ht}from"./index-Q5f-HasL.js";import"./index-D2qeKuO0.js";var pt=`
    .p-contextmenu {
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
        min-width: 12.5rem;
    }

    .p-contextmenu-root-list,
    .p-contextmenu-submenu {
        margin: 0;
        padding: dt('contextmenu.list.padding');
        list-style: none;
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('contextmenu.list.gap');
    }

    .p-contextmenu-submenu {
        position: absolute;
        display: flex;
        flex-direction: column;
        min-width: 100%;
        z-index: 1;
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
    }

    .p-contextmenu-item {
        position: relative;
    }

    .p-contextmenu-item-content {
        transition:
            background dt('contextmenu.transition.duration'),
            color dt('contextmenu.transition.duration');
        border-radius: dt('contextmenu.item.border.radius');
        color: dt('contextmenu.item.color');
    }

    .p-contextmenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('contextmenu.item.padding');
        gap: dt('contextmenu.item.gap');
        user-select: none;
    }

    .p-contextmenu-item-label {
        line-height: 1;
    }

    .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.color');
    }

    .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.color');
        margin-left: auto;
        font-size: dt('contextmenu.submenu.icon.size');
        width: dt('contextmenu.submenu.icon.size');
        height: dt('contextmenu.submenu.icon.size');
    }

    .p-contextmenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content {
        color: dt('contextmenu.item.active.color');
        background: dt('contextmenu.item.active.background');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.active.color');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.active.color');
    }

    .p-contextmenu-separator {
        border-block-start: 1px solid dt('contextmenu.separator.border.color');
    }

    .p-contextmenu-enter-from,
    .p-contextmenu-leave-active {
        opacity: 0;
    }

    .p-contextmenu-enter-active {
        transition: opacity 250ms;
    }

    .p-contextmenu-mobile .p-contextmenu-submenu {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .p-contextmenu-mobile .p-contextmenu-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .p-contextmenu-mobile .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        transform: rotate(-90deg);
    }
`,bt={root:function(e){var n=e.instance;return["p-contextmenu p-component",{"p-contextmenu-mobile":n.queryMatches}]},rootList:"p-contextmenu-root-list",item:function(e){var n=e.instance,r=e.processedItem;return["p-contextmenu-item",{"p-contextmenu-item-active":n.isItemActive(r),"p-focus":n.isItemFocused(r),"p-disabled":n.isItemDisabled(r)}]},itemContent:"p-contextmenu-item-content",itemLink:"p-contextmenu-item-link",itemIcon:"p-contextmenu-item-icon",itemLabel:"p-contextmenu-item-label",submenuIcon:"p-contextmenu-submenu-icon",submenu:"p-contextmenu-submenu",separator:"p-contextmenu-separator"},It=H.extend({name:"contextmenu",style:pt,classes:bt}),gt={name:"BaseContextMenu",extends:C,props:{model:{type:Array,default:null},appendTo:{type:[String,Object],default:"body"},autoZIndex:{type:Boolean,default:!0},baseZIndex:{type:Number,default:0},global:{type:Boolean,default:!1},breakpoint:{type:String,default:"960px"},tabindex:{type:Number,default:0},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:It,provide:function(){return{$pcContextMenu:this,$parentInstance:this}}},Se={name:"ContextMenuSub",hostName:"ContextMenu",extends:C,emits:["item-click","item-mouseenter","item-mousemove"],props:{items:{type:Array,default:null},menuId:{type:String,default:null},focusedItemId:{type:String,default:null},root:{type:Boolean,default:!1},visible:{type:Boolean,default:!1},level:{type:Number,default:0},templates:{type:Object,default:null},activeItemPath:{type:Object,default:null},tabindex:{type:Number,default:0}},methods:{getItemId:function(e){return"".concat(this.menuId,"_").concat(e.key)},getItemKey:function(e){return this.getItemId(e)},getItemProp:function(e,n,r){return e&&e.item?F(e.item[n],r):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},getItemLabelId:function(e){return"".concat(this.menuId,"_").concat(e.key,"_label")},getPTOptions:function(e,n,r){return this.ptm(e,{context:{item:n.item,active:this.isItemActive(n),focused:this.isItemFocused(n),disabled:this.isItemDisabled(n),index:r}})},isItemActive:function(e){return this.activeItemPath.some(function(n){return n.key===e.key})},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemFocused:function(e){return this.focusedItemId===this.getItemId(e)},isItemGroup:function(e){return I(e.items)},onItemClick:function(e,n){this.getItemProp(n,"command",{originalEvent:e,item:n.item}),this.$emit("item-click",{originalEvent:e,processedItem:n,isFocus:!0})},onItemMouseEnter:function(e,n){this.$emit("item-mouseenter",{originalEvent:e,processedItem:n})},onItemMouseMove:function(e,n){this.$emit("item-mousemove",{originalEvent:e,processedItem:n,isFocus:!0})},getAriaSetSize:function(){var e=this;return this.items.filter(function(n){return e.isItemVisible(n)&&!e.getItemProp(n,"separator")}).length},getAriaPosInset:function(e){var n=this;return e-this.items.slice(0,e).filter(function(r){return n.isItemVisible(r)&&n.getItemProp(r,"separator")}).length+1},onEnter:function(){Ie(this.$refs.container,this.level)},getMenuItemProps:function(e,n){return{action:l({class:this.cx("itemLink"),tabindex:-1},this.getPTOptions("itemLink",e,n)),icon:l({class:[this.cx("itemIcon"),this.getItemProp(e,"icon")]},this.getPTOptions("itemIcon",e,n)),label:l({class:this.cx("itemLabel")},this.getPTOptions("itemLabel",e,n)),submenuicon:l({class:this.cx("submenuIcon")},this.getPTOptions("submenuicon",e,n))}}},components:{AngleRightIcon:ee},directives:{ripple:q}},vt=["tabindex"],yt=["id","aria-label","aria-disabled","aria-expanded","aria-haspopup","aria-level","aria-setsize","aria-posinset","data-p-active","data-p-focused","data-p-disabled"],kt=["onClick","onMouseenter","onMousemove"],xt=["href","target"],Lt=["id"],Pt=["id"];function wt(t,e,n,r,a,i){var u=S("AngleRightIcon"),d=S("ContextMenuSub",!0),s=U("ripple");return m(),g(N,l({name:"p-contextmenusub",onEnter:i.onEnter},t.ptm("menu.transition")),{default:K(function(){return[n.root||n.visible?(m(),f("ul",l({key:0,ref:"container",tabindex:n.tabindex},t.ptm("rootList")),[(m(!0),f(P,null,D(n.items,function(o,c){return m(),f(P,{key:i.getItemKey(o)},[i.isItemVisible(o)&&!i.getItemProp(o,"separator")?(m(),f("li",l({key:0,id:i.getItemId(o),style:i.getItemProp(o,"style"),class:[t.cx("item",{processedItem:o}),i.getItemProp(o,"class")],role:"menuitem","aria-label":i.getItemLabel(o),"aria-disabled":i.isItemDisabled(o)||void 0,"aria-expanded":i.isItemGroup(o)?i.isItemActive(o):void 0,"aria-haspopup":i.isItemGroup(o)&&!i.getItemProp(o,"to")?"menu":void 0,"aria-level":n.level+1,"aria-setsize":i.getAriaSetSize(),"aria-posinset":i.getAriaPosInset(c)},{ref_for:!0},i.getPTOptions("item",o,c),{"data-p-active":i.isItemActive(o),"data-p-focused":i.isItemFocused(o),"data-p-disabled":i.isItemDisabled(o)}),[p("div",l({class:t.cx("itemContent"),onClick:function(v){return i.onItemClick(v,o)},onMouseenter:function(v){return i.onItemMouseEnter(v,o)},onMousemove:function(v){return i.onItemMouseMove(v,o)}},{ref_for:!0},i.getPTOptions("itemContent",o,c)),[n.templates.item?(m(),g(w(n.templates.item),{key:1,item:o.item,hasSubmenu:i.getItemProp(o,"items"),label:i.getItemLabel(o),props:i.getMenuItemProps(o,c)},null,8,["item","hasSubmenu","label","props"])):B((m(),f("a",l({key:0,href:i.getItemProp(o,"url"),class:t.cx("itemLink"),target:i.getItemProp(o,"target"),tabindex:"-1"},{ref_for:!0},i.getPTOptions("itemLink",o,c)),[n.templates.itemicon?(m(),g(w(n.templates.itemicon),{key:0,item:o.item,class:O(t.cx("itemIcon"))},null,8,["item","class"])):i.getItemProp(o,"icon")?(m(),f("span",l({key:1,class:[t.cx("itemIcon"),i.getItemProp(o,"icon")]},{ref_for:!0},i.getPTOptions("itemIcon",o,c)),null,16)):b("",!0),p("span",l({id:i.getItemLabelId(o),class:t.cx("itemLabel")},{ref_for:!0},i.getPTOptions("itemLabel",o,c)),V(i.getItemLabel(o)),17,Lt),i.getItemProp(o,"items")?(m(),f(P,{key:2},[n.templates.submenuicon?(m(),g(w(n.templates.submenuicon),{key:0,active:i.isItemActive(o),class:O(t.cx("submenuIcon"))},null,8,["active","class"])):(m(),g(u,l({key:1,class:t.cx("submenuIcon")},{ref_for:!0},i.getPTOptions("submenuicon",o,c)),null,16,["class"]))],64)):b("",!0)],16,xt)),[[s]])],16,kt),i.isItemVisible(o)&&i.isItemGroup(o)?(m(),g(d,l({key:0,id:i.getItemId(o)+"_list",role:"menu",class:t.cx("submenu"),menuId:n.menuId,focusedItemId:n.focusedItemId,items:o.items,templates:n.templates,activeItemPath:n.activeItemPath,level:n.level+1,visible:i.isItemActive(o)&&i.isItemGroup(o),pt:t.pt,unstyled:t.unstyled,onItemClick:e[0]||(e[0]=function(h){return t.$emit("item-click",h)}),onItemMouseenter:e[1]||(e[1]=function(h){return t.$emit("item-mouseenter",h)}),onItemMousemove:e[2]||(e[2]=function(h){return t.$emit("item-mousemove",h)}),"aria-labelledby":i.getItemLabelId(o)},{ref_for:!0},t.ptm("submenu")),null,16,["id","class","menuId","focusedItemId","items","templates","activeItemPath","level","visible","pt","unstyled","aria-labelledby"])):b("",!0)],16,yt)):b("",!0),i.isItemVisible(o)&&i.getItemProp(o,"separator")?(m(),f("li",l({key:1,id:i.getItemId(o),style:i.getItemProp(o,"style"),class:[t.cx("separator"),i.getItemProp(o,"class")],role:"separator"},{ref_for:!0},t.ptm("separator")),null,16,Pt)):b("",!0)],64)}),128))],16,vt)):b("",!0)]}),_:1},16,["onEnter"])}Se.render=wt;var Ce={name:"ContextMenu",extends:gt,inheritAttrs:!1,emits:["focus","blur","show","hide","before-show","before-hide"],target:null,outsideClickListener:null,resizeListener:null,documentContextMenuListener:null,matchMediaListener:null,pageX:null,pageY:null,container:null,list:null,data:function(){return{focused:!1,focusedItemInfo:{index:-1,level:0,parentKey:""},activeItemPath:[],visible:!1,submenuVisible:!1,query:null,queryMatches:!1}},watch:{activeItemPath:function(e){I(e)?(this.bindOutsideClickListener(),this.bindResizeListener()):this.visible||(this.unbindOutsideClickListener(),this.unbindResizeListener())}},mounted:function(){this.bindMatchMediaListener(),this.global&&this.bindDocumentContextMenuListener()},beforeUnmount:function(){this.unbindResizeListener(),this.unbindOutsideClickListener(),this.unbindDocumentContextMenuListener(),this.unbindMatchMediaListener(),this.container&&this.autoZIndex&&E.clear(this.container),this.target=null,this.container=null},methods:{getItemProp:function(e,n){return e?F(e[n]):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemGroup:function(e){return I(this.getItemProp(e,"items"))},isItemSeparator:function(e){return this.getItemProp(e,"separator")},getProccessedItemLabel:function(e){return e?this.getItemLabel(e.item):void 0},isProccessedItemGroup:function(e){return e&&I(e.items)},toggle:function(e){this.visible?this.hide():this.show(e)},show:function(e){this.$emit("before-show"),this.activeItemPath=[],this.focusedItemInfo={index:-1,level:0,parentKey:""},x(this.list),this.pageX=e.pageX,this.pageY=e.pageY,this.visible?this.position():this.visible=!0,e.stopPropagation(),e.preventDefault()},hide:function(){this.$emit("before-hide"),this.visible=!1,this.activeItemPath=[],this.focusedItemInfo={index:-1,level:0,parentKey:""}},onFocus:function(e){this.focused=!0,this.focusedItemInfo=this.focusedItemInfo.index!==-1?this.focusedItemInfo:{index:-1,level:0,parentKey:""},this.$emit("focus",e)},onBlur:function(e){this.focused=!1,this.focusedItemInfo={index:-1,level:0,parentKey:""},this.searchValue="",this.$emit("blur",e)},onKeyDown:function(e){var n=e.metaKey||e.ctrlKey;switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"Space":this.onSpaceKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"PageDown":case"PageUp":case"Backspace":case"ShiftLeft":case"ShiftRight":break;default:!n&&X(e.key)&&this.searchItems(e,e.key);break}},onItemChange:function(e,n){var r=e.processedItem,a=e.isFocus;if(!A(r)){var i=r.index,u=r.key,d=r.level,s=r.parentKey,o=r.items,c=I(o),h=this.activeItemPath.filter(function(v){return v.parentKey!==s&&v.parentKey!==u});c&&(h.push(r),this.submenuVisible=!0),this.focusedItemInfo={index:i,level:d,parentKey:s},a&&x(this.list),!(n==="hover"&&this.queryMatches)&&(this.activeItemPath=h)}},onItemClick:function(e){var n=e.processedItem,r=this.isProccessedItemGroup(n),a=this.isSelected(n);if(a){var i=n.index,u=n.key,d=n.level,s=n.parentKey;this.activeItemPath=this.activeItemPath.filter(function(o){return u!==o.key&&u.startsWith(o.key)}),this.focusedItemInfo={index:i,level:d,parentKey:s},x(this.list)}else r?this.onItemChange(e):this.hide()},onItemMouseEnter:function(e){this.onItemChange(e,"hover")},onItemMouseMove:function(e){this.focused&&this.changeFocusedItemIndex(e,e.processedItem.index)},onArrowDownKey:function(e){var n=this.focusedItemInfo.index!==-1?this.findNextItemIndex(this.focusedItemInfo.index):this.findFirstFocusedItemIndex();this.changeFocusedItemIndex(e,n),e.preventDefault()},onArrowUpKey:function(e){if(e.altKey){if(this.focusedItemInfo.index!==-1){var n=this.visibleItems[this.focusedItemInfo.index],r=this.isProccessedItemGroup(n);!r&&this.onItemChange({originalEvent:e,processedItem:n})}this.popup&&this.hide(),e.preventDefault()}else{var a=this.focusedItemInfo.index!==-1?this.findPrevItemIndex(this.focusedItemInfo.index):this.findLastFocusedItemIndex();this.changeFocusedItemIndex(e,a),e.preventDefault()}},onArrowLeftKey:function(e){var n=this,r=this.visibleItems[this.focusedItemInfo.index],a=this.activeItemPath.find(function(u){return u.key===r.parentKey}),i=A(r.parent);i||(this.focusedItemInfo={index:-1,parentKey:a?a.parentKey:""},this.searchValue="",this.onArrowDownKey(e)),this.activeItemPath=this.activeItemPath.filter(function(u){return u.parentKey!==n.focusedItemInfo.parentKey}),e.preventDefault()},onArrowRightKey:function(e){var n=this.visibleItems[this.focusedItemInfo.index],r=this.isProccessedItemGroup(n);r&&(this.onItemChange({originalEvent:e,processedItem:n}),this.focusedItemInfo={index:-1,parentKey:n.key},this.searchValue="",this.onArrowDownKey(e)),e.preventDefault()},onHomeKey:function(e){this.changeFocusedItemIndex(e,this.findFirstItemIndex()),e.preventDefault()},onEndKey:function(e){this.changeFocusedItemIndex(e,this.findLastItemIndex()),e.preventDefault()},onEnterKey:function(e){if(this.focusedItemInfo.index!==-1){var n=L(this.list,'li[id="'.concat("".concat(this.focusedItemIdx),'"]')),r=n&&L(n,'[data-pc-section="itemlink"]');r?r.click():n&&n.click();var a=this.visibleItems[this.focusedItemInfo.index],i=this.isProccessedItemGroup(a);!i&&(this.focusedItemInfo.index=this.findFirstFocusedItemIndex())}e.preventDefault()},onSpaceKey:function(e){this.onEnterKey(e)},onEscapeKey:function(e){this.hide(),!this.popup&&(this.focusedItemInfo.index=this.findFirstFocusedItemIndex()),e.preventDefault()},onTabKey:function(e){if(this.focusedItemInfo.index!==-1){var n=this.visibleItems[this.focusedItemInfo.index],r=this.isProccessedItemGroup(n);!r&&this.onItemChange({originalEvent:e,processedItem:n})}this.hide()},onEnter:function(e){se(e,{position:"absolute"}),this.position(),this.autoZIndex&&E.set("menu",e,this.baseZIndex+this.$primevue.config.zIndex.menu)},onAfterEnter:function(){this.bindOutsideClickListener(),this.bindResizeListener(),this.$emit("show"),x(this.list)},onLeave:function(){this.$emit("hide"),this.container=null},onAfterLeave:function(e){this.autoZIndex&&E.clear(e),this.unbindOutsideClickListener(),this.unbindResizeListener()},position:function(){var e=this.pageX+1,n=this.pageY+1,r=this.container.offsetParent?this.container.offsetWidth:rt(this.container),a=this.container.offsetParent?this.container.offsetHeight:at(this.container),i=st(),u=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,d=window.scrollX||document.documentElement.scrollLeft||document.body.scrollLeft||0;e+r-d>i.width&&(e-=r),n+a-u>i.height&&(n-=a),e<d&&(e=d),n<u&&(n=u),this.container.style.left=e+"px",this.container.style.top=n+"px"},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(n){var r=e.container&&!e.container.contains(n.target),a=e.visible?!(e.target&&(e.target===n.target||e.target.contains(n.target))):!0;r&&a&&e.hide()},document.addEventListener("click",this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&(document.removeEventListener("click",this.outsideClickListener,!0),this.outsideClickListener=null)},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(){e.visible&&!Y()&&e.hide()},window.addEventListener("resize",this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)},bindDocumentContextMenuListener:function(){var e=this;this.documentContextMenuListener||(this.documentContextMenuListener=function(n){n.button===2&&e.show(n)},document.addEventListener("contextmenu",this.documentContextMenuListener))},unbindDocumentContextMenuListener:function(){this.documentContextMenuListener&&(document.removeEventListener("contextmenu",this.documentContextMenuListener),this.documentContextMenuListener=null)},bindMatchMediaListener:function(){var e=this;if(!this.matchMediaListener){var n=matchMedia("(max-width: ".concat(this.breakpoint,")"));this.query=n,this.queryMatches=n.matches,this.matchMediaListener=function(){e.queryMatches=n.matches},this.query.addEventListener("change",this.matchMediaListener)}},unbindMatchMediaListener:function(){this.matchMediaListener&&(this.query.removeEventListener("change",this.matchMediaListener),this.matchMediaListener=null)},isItemMatched:function(e){var n;return this.isValidItem(e)&&((n=this.getProccessedItemLabel(e))===null||n===void 0?void 0:n.toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase()))},isValidItem:function(e){return!!e&&!this.isItemDisabled(e.item)&&!this.isItemSeparator(e.item)&&this.isItemVisible(e.item)},isValidSelectedItem:function(e){return this.isValidItem(e)&&this.isSelected(e)},isSelected:function(e){return this.activeItemPath.some(function(n){return n.key===e.key})},findFirstItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidItem(n)})},findLastItemIndex:function(){var e=this;return _(this.visibleItems,function(n){return e.isValidItem(n)})},findNextItemIndex:function(e){var n=this,r=e<this.visibleItems.length-1?this.visibleItems.slice(e+1).findIndex(function(a){return n.isValidItem(a)}):-1;return r>-1?r+e+1:e},findPrevItemIndex:function(e){var n=this,r=e>0?_(this.visibleItems.slice(0,e),function(a){return n.isValidItem(a)}):-1;return r>-1?r:e},findSelectedItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidSelectedItem(n)})},findFirstFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findFirstItemIndex():e},findLastFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findLastItemIndex():e},searchItems:function(e,n){var r=this;this.searchValue=(this.searchValue||"")+n;var a=-1,i=!1;return this.focusedItemInfo.index!==-1?(a=this.visibleItems.slice(this.focusedItemInfo.index).findIndex(function(u){return r.isItemMatched(u)}),a=a===-1?this.visibleItems.slice(0,this.focusedItemInfo.index).findIndex(function(u){return r.isItemMatched(u)}):a+this.focusedItemInfo.index):a=this.visibleItems.findIndex(function(u){return r.isItemMatched(u)}),a!==-1&&(i=!0),a===-1&&this.focusedItemInfo.index===-1&&(a=this.findFirstFocusedItemIndex()),a!==-1&&this.changeFocusedItemIndex(e,a),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(function(){r.searchValue="",r.searchTimeout=null},500),i},changeFocusedItemIndex:function(e,n){this.focusedItemInfo.index!==n&&(this.focusedItemInfo.index=n,this.scrollInView())},scrollInView:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:-1,n=e!==-1?"".concat(this.$id,"_").concat(e):this.focusedItemIdx,r=L(this.list,'li[id="'.concat(n,'"]'));r&&r.scrollIntoView&&r.scrollIntoView({block:"nearest",inline:"start"})},createProcessedItems:function(e){var n=this,r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"",u=[];return e&&e.forEach(function(d,s){var o=(i!==""?i+"_":"")+s,c={item:d,index:s,level:r,key:o,parent:a,parentKey:i};c.items=n.createProcessedItems(d.items,r+1,c,o),u.push(c)}),u},containerRef:function(e){this.container=e},listRef:function(e){this.list=e?e.$el:void 0}},computed:{processedItems:function(){return this.createProcessedItems(this.model||[])},visibleItems:function(){var e=this,n=this.activeItemPath.find(function(r){return r.key===e.focusedItemInfo.parentKey});return n?n.items:this.processedItems},focusedItemIdx:function(){return this.focusedItemInfo.index!==-1?"".concat(this.$id).concat(I(this.focusedItemInfo.parentKey)?"_"+this.focusedItemInfo.parentKey:"","_").concat(this.focusedItemInfo.index):null}},components:{ContextMenuSub:Se,Portal:ae}};function Kt(t,e,n,r,a,i){var u=S("ContextMenuSub"),d=S("Portal");return m(),g(d,{appendTo:t.appendTo},{default:K(function(){return[k(N,l({name:"p-contextmenu",onEnter:i.onEnter,onAfterEnter:i.onAfterEnter,onLeave:i.onLeave,onAfterLeave:i.onAfterLeave},t.ptm("transition")),{default:K(function(){return[a.visible?(m(),f("div",l({key:0,ref:i.containerRef,class:t.cx("root")},t.ptmi("root")),[k(u,{ref:i.listRef,id:t.$id+"_list",class:O(t.cx("rootList")),role:"menubar",root:!0,tabindex:t.tabindex,"aria-orientation":"vertical","aria-activedescendant":a.focused?i.focusedItemIdx:void 0,menuId:t.$id,focusedItemId:a.focused?i.focusedItemIdx:void 0,items:i.processedItems,templates:t.$slots,activeItemPath:a.activeItemPath,"aria-labelledby":t.ariaLabelledby,"aria-label":t.ariaLabel,level:0,visible:a.submenuVisible,pt:t.pt,unstyled:t.unstyled,onFocus:i.onFocus,onBlur:i.onBlur,onKeydown:i.onKeyDown,onItemClick:i.onItemClick,onItemMouseenter:i.onItemMouseEnter,onItemMousemove:i.onItemMouseMove},null,8,["id","class","tabindex","aria-activedescendant","menuId","focusedItemId","items","templates","activeItemPath","aria-labelledby","aria-label","visible","pt","unstyled","onFocus","onBlur","onKeydown","onItemClick","onItemMouseenter","onItemMousemove"])],16)):b("",!0)]}),_:1},16,["onEnter","onAfterEnter","onLeave","onAfterLeave"])]}),_:1},8,["appendTo"])}Ce.render=Kt;var Mt=`
    .p-megamenu {
        position: relative;
        display: flex;
        align-items: center;
        background: dt('megamenu.background');
        border: 1px solid dt('megamenu.border.color');
        border-radius: dt('megamenu.border.radius');
        color: dt('megamenu.color');
        gap: dt('megamenu.gap');
    }

    .p-megamenu-start,
    .p-megamenu-end {
        display: flex;
        align-items: center;
    }

    .p-megamenu-root-list {
        margin: 0;
        padding: 0;
        list-style: none;
        outline: 0 none;
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: dt('megamenu.gap');
    }

    .p-megamenu-root-list > .p-megamenu-item > .p-megamenu-item-content {
        border-radius: dt('megamenu.base.item.border.radius');
    }

    .p-megamenu-root-list > .p-megamenu-item > .p-megamenu-item-content > .p-megamenu-item-link {
        padding: dt('megamenu.base.item.padding');
    }

    .p-megamenu-item-content {
        transition:
            background dt('megamenu.transition.duration'),
            color dt('megamenu.transition.duration');
        border-radius: dt('megamenu.item.border.radius');
        color: dt('megamenu.item.color');
    }

    .p-megamenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('megamenu.item.padding');
        gap: dt('megamenu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .p-megamenu-item-label {
        line-height: 1;
    }

    .p-megamenu-item-icon {
        color: dt('megamenu.item.icon.color');
    }

    .p-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.color');
        font-size: dt('megamenu.submenu.icon.size');
        width: dt('megamenu.submenu.icon.size');
        height: dt('megamenu.submenu.icon.size');
    }

    .p-megamenu-item.p-focus > .p-megamenu-item-content {
        color: dt('megamenu.item.focus.color');
        background: dt('megamenu.item.focus.background');
    }

    .p-megamenu-item.p-focus > .p-megamenu-item-content .p-megamenu-item-icon {
        color: dt('megamenu.item.icon.focus.color');
    }

    .p-megamenu-item.p-focus > .p-megamenu-item-content .p-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.focus.color');
    }

    .p-megamenu-item:not(.p-disabled) > .p-megamenu-item-content:hover {
        color: dt('megamenu.item.focus.color');
        background: dt('megamenu.item.focus.background');
    }

    .p-megamenu-item:not(.p-disabled) > .p-megamenu-item-content:hover .p-megamenu-item-icon {
        color: dt('megamenu.item.icon.focus.color');
    }

    .p-megamenu-item:not(.p-disabled) > .p-megamenu-item-content:hover .p-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.focus.color');
    }

    .p-megamenu-item-active > .p-megamenu-item-content {
        color: dt('megamenu.item.active.color');
        background: dt('megamenu.item.active.background');
    }

    .p-megamenu-item-active > .p-megamenu-item-content .p-megamenu-item-icon {
        color: dt('megamenu.item.icon.active.color');
    }

    .p-megamenu-item-active > .p-megamenu-item-content .p-megamenu-submenu-icon {
        color: dt('megamenu.submenu.icon.active.color');
    }

    .p-megamenu-overlay {
        display: none;
        position: absolute;
        width: auto;
        z-index: 1;
        left: 0;
        min-width: 100%;
        padding: dt('megamenu.overlay.padding');
        background: dt('megamenu.overlay.background');
        color: dt('megamenu.overlay.color');
        border: 1px solid dt('megamenu.overlay.border.color');
        border-radius: dt('megamenu.overlay.border.radius');
        box-shadow: dt('megamenu.overlay.shadow');
    }

    .p-megamenu-overlay:dir(rtl) {
        left: auto;
        right: 0;
    }

    .p-megamenu-root-list > .p-megamenu-item-active > .p-megamenu-overlay {
        display: block;
    }

    .p-megamenu-submenu {
        margin: 0;
        list-style: none;
        padding: dt('megamenu.submenu.padding');
        min-width: 12.5rem;
        display: flex;
        flex-direction: column;
        gap: dt('megamenu.submenu.gap');
    }

    .p-megamenu-submenu-label {
        padding: dt('megamenu.submenu.label.padding');
        color: dt('megamenu.submenu.label.color');
        font-weight: dt('megamenu.submenu.label.font.weight');
        background: dt('megamenu.submenu.label.background');
    }

    .p-megamenu-separator {
        border-block-start: 1px solid dt('megamenu.separator.border.color');
    }

    .p-megamenu-horizontal {
        align-items: center;
        padding: dt('megamenu.horizontal.orientation.padding');
    }

    .p-megamenu-horizontal .p-megamenu-root-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: dt('megamenu.horizontal.orientation.gap');
    }

    .p-megamenu-horizontal .p-megamenu-end {
        margin-left: auto;
        align-self: center;
    }

    .p-megamenu-horizontal .p-megamenu-end:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-megamenu-vertical {
        display: inline-flex;
        min-width: 12.5rem;
        flex-direction: column;
        align-items: stretch;
        padding: dt('megamenu.vertical.orientation.padding');
    }

    .p-megamenu-vertical .p-megamenu-root-list {
        align-items: stretch;
        flex-direction: column;
        gap: dt('megamenu.vertical.orientation.gap');
    }

    .p-megamenu-vertical .p-megamenu-root-list > .p-megamenu-item-active > .p-megamenu-overlay {
        left: 100%;
        top: 0;
    }

    .p-megamenu-vertical .p-megamenu-root-list > .p-megamenu-item-active > .p-megamenu-overlay:dir(rtl) {
        left: auto;
        right: 100%;
    }

    .p-megamenu-vertical .p-megamenu-root-list > .p-megamenu-item > .p-megamenu-item-content .p-megamenu-submenu-icon {
        margin-left: auto;
    }

    .p-megamenu-vertical .p-megamenu-root-list > .p-megamenu-item > .p-megamenu-item-content .p-megamenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
        transform: rotate(180deg);
    }

    .p-megamenu-grid {
        display: flex;
    }

    .p-megamenu-col-2,
    .p-megamenu-col-3,
    .p-megamenu-col-4,
    .p-megamenu-col-6,
    .p-megamenu-col-12 {
        flex: 0 0 auto;
        padding: dt('megamenu.overlay.gap');
    }

    .p-megamenu-col-2 {
        width: 16.6667%;
    }

    .p-megamenu-col-3 {
        width: 25%;
    }

    .p-megamenu-col-4 {
        width: 33.3333%;
    }

    .p-megamenu-col-6 {
        width: 50%;
    }

    .p-megamenu-col-12 {
        width: 100%;
    }

    .p-megamenu-button {
        display: none;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: dt('megamenu.mobile.button.size');
        height: dt('megamenu.mobile.button.size');
        position: relative;
        color: dt('megamenu.mobile.button.color');
        border: 0 none;
        background: transparent;
        border-radius: dt('megamenu.mobile.button.border.radius');
        transition:
            background dt('megamenu.transition.duration'),
            color dt('megamenu.transition.duration'),
            outline-color dt('megamenu.transition.duration'),
            box-shadow dt('megamenu.transition.duration');
        outline-color: transparent;
    }

    .p-megamenu-button:hover {
        color: dt('megamenu.mobile.button.hover.color');
        background: dt('megamenu.mobile.button.hover.background');
    }

    .p-megamenu-button:focus-visible {
        box-shadow: dt('megamenu.mobile.button.focus.ring.shadow');
        outline: dt('megamenu.mobile.button.focus.ring.width') dt('megamenu.mobile.button.focus.ring.style') dt('megamenu.mobile.button.focus.ring.color');
        outline-offset: dt('megamenu.mobile.button.focus.ring.offset');
    }

    .p-megamenu-mobile {
        display: flex;
    }

    .p-megamenu-mobile .p-megamenu-button {
        display: flex;
    }

    .p-megamenu-mobile .p-megamenu-root-list {
        position: absolute;
        display: none;
        flex-direction: column;
        top: 100%;
        left: 0;
        z-index: 1;
        width: 100%;
        padding: dt('megamenu.submenu.padding');
        gap: dt('megamenu.submenu.gap');
        background: dt('megamenu.overlay.background');
        border: 1px solid dt('megamenu.overlay.border.color');
        box-shadow: dt('megamenu.overlay.shadow');
    }

    .p-megamenu-mobile .p-megamenu-root-list:dir(rtl) {
        left: auto;
        right: 0;
    }

    .p-megamenu-mobile-active .p-megamenu-root-list {
        display: block;
    }

    .p-megamenu-mobile .p-megamenu-root-list .p-megamenu-item {
        width: 100%;
        position: static;
    }

    .p-megamenu-mobile .p-megamenu-overlay {
        position: static;
        border: 0 none;
        border-radius: 0;
        box-shadow: none;
    }

    .p-megamenu-mobile .p-megamenu-grid {
        flex-wrap: wrap;
        overflow: auto;
        max-height: 90%;
    }

    .p-megamenu-mobile .p-megamenu-root-list > .p-megamenu-item > .p-megamenu-item-content .p-megamenu-submenu-icon {
        margin-left: auto;
        transition: transform 0.2s;
    }

    .p-megamenu-mobile .p-megamenu-root-list > .p-megamenu-item > .p-megamenu-item-content .p-megamenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-megamenu-mobile .p-megamenu-root-list > .p-megamenu-item-active > .p-megamenu-item-content .p-megamenu-submenu-icon {
        transform: rotate(-180deg);
    }
`,St={rootList:function(e){var n=e.props;return{"max-height":n.scrollHeight,overflow:"auto"}}},Ct={root:function(e){var n=e.instance;return["p-megamenu p-component",{"p-megamenu-mobile":n.queryMatches,"p-megamenu-mobile-active":n.mobileActive,"p-megamenu-horizontal":n.horizontal,"p-megamenu-vertical":n.vertical}]},start:"p-megamenu-start",button:"p-megamenu-button",rootList:"p-megamenu-root-list",submenuLabel:function(e){var n=e.instance,r=e.processedItem;return["p-megamenu-submenu-label",{"p-disabled":n.isItemDisabled(r)}]},item:function(e){var n=e.instance,r=e.processedItem;return["p-megamenu-item",{"p-megamenu-item-active":n.isItemActive(r),"p-focus":n.isItemFocused(r),"p-disabled":n.isItemDisabled(r)}]},itemContent:"p-megamenu-item-content",itemLink:"p-megamenu-item-link",itemIcon:"p-megamenu-item-icon",itemLabel:"p-megamenu-item-label",submenuIcon:"p-megamenu-submenu-icon",overlay:"p-megamenu-overlay",grid:"p-megamenu-grid",column:function(e){var n=e.instance,r=e.processedItem,a=n.isItemGroup(r)?r.items.length:0,i;if(n.$parentInstance.queryMatches)i="p-megamenu-col-12";else switch(a){case 2:i="p-megamenu-col-6";break;case 3:i="p-megamenu-col-4";break;case 4:i="p-megamenu-col-3";break;case 6:i="p-megamenu-col-2";break;default:i="p-megamenu-col-12";break}return i},submenu:"p-megamenu-submenu",separator:"p-megamenu-separator",end:"p-megamenu-end"},At=H.extend({name:"megamenu",style:Mt,classes:Ct,inlineStyles:St}),Et={name:"BaseMegaMenu",extends:C,props:{model:{type:Array,default:null},orientation:{type:String,default:"horizontal"},breakpoint:{type:String,default:"960px"},disabled:{type:Boolean,default:!1},tabindex:{type:Number,default:0},scrollHeight:{type:String,default:"20rem"},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:At,provide:function(){return{$pcMegaMenu:this,$parentInstance:this}}},Ae={name:"MegaMenuSub",hostName:"MegaMenu",extends:C,emits:["item-click","item-mouseenter"],props:{menuId:{type:String,default:null},focusedItemId:{type:String,default:null},horizontal:{type:Boolean,default:!1},submenu:{type:Object,default:null},mobileActive:{type:Boolean,default:!1},items:{type:Array,default:null},level:{type:Number,default:0},templates:{type:Object,default:null},activeItem:{type:Object,default:null},tabindex:{type:Number,default:0}},methods:{getSubListId:function(e){return"".concat(this.getItemId(e),"_list")},getSubListKey:function(e){return this.getSubListId(e)},getItemId:function(e){return"".concat(this.menuId,"_").concat(e.key)},getItemKey:function(e){return this.getItemId(e)},getItemProp:function(e,n,r){return e&&e.item?F(e.item[n],r):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},getPTOptions:function(e,n,r){return this.ptm(r,{context:{item:e.item,index:n,active:this.isItemActive(e),focused:this.isItemFocused(e),disabled:this.isItemDisabled(e)}})},isItemActive:function(e){return I(this.activeItem)?this.activeItem.key===e.key:!1},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemFocused:function(e){return this.focusedItemId===this.getItemId(e)},isItemGroup:function(e){return I(e.items)},onItemClick:function(e,n){this.getItemProp(n,"command",{originalEvent:e,item:n.item}),this.$emit("item-click",{originalEvent:e,processedItem:n,isFocus:!0})},onItemMouseEnter:function(e,n){this.$emit("item-mouseenter",{originalEvent:e,processedItem:n})},getAriaSetSize:function(){var e=this;return this.items.filter(function(n){return e.isItemVisible(n)&&!e.getItemProp(n,"separator")}).length},getAriaPosInset:function(e){var n=this;return e-this.items.slice(0,e).filter(function(r){return n.isItemVisible(r)&&n.getItemProp(r,"separator")}).length+1},getMenuItemProps:function(e,n){return{action:l({class:this.cx("itemLink"),tabindex:-1},this.getPTOptions(e,n,"itemLink")),icon:l({class:[this.cx("itemIcon"),this.getItemProp(e,"icon")]},this.getPTOptions(e,n,"itemIcon")),label:l({class:this.cx("label")},this.getPTOptions(e,n,"label")),submenuicon:l({class:this.cx("submenuIcon")},this.getPTOptions(e,n,"submenuIcon"))}}},components:{AngleRightIcon:ee,AngleDownIcon:we},directives:{ripple:q}},Ot=["tabindex"],Ft=["id","aria-label","aria-disabled","aria-expanded","aria-haspopup","aria-level","aria-setsize","aria-posinset","data-p-active","data-p-focused","data-p-disabled"],Tt=["onClick","onMouseenter"],Dt=["href","target"],Vt=["id"];function zt(t,e,n,r,a,i){var u=S("MegaMenuSub",!0),d=U("ripple");return m(),f("ul",l({class:n.level===0?t.cx("rootList"):t.cx("submenu"),tabindex:n.tabindex},n.level===0?t.ptm("rootList"):t.ptm("submenu")),[n.submenu?(m(),f("li",l({key:0,class:[t.cx("submenuLabel",{submenu:n.submenu}),i.getItemProp(n.submenu,"class")],style:i.getItemProp(n.submenu,"style"),role:"presentation"},t.ptm("submenuLabel")),V(i.getItemLabel(n.submenu)),17)):b("",!0),(m(!0),f(P,null,D(n.items,function(s,o){return m(),f(P,{key:i.getItemKey(s)},[i.isItemVisible(s)&&!i.getItemProp(s,"separator")?(m(),f("li",l({key:0,id:i.getItemId(s),style:i.getItemProp(s,"style"),class:[t.cx("item",{processedItem:s}),i.getItemProp(s,"class")],role:"menuitem","aria-label":i.getItemLabel(s),"aria-disabled":i.isItemDisabled(s)||void 0,"aria-expanded":i.isItemGroup(s)?i.isItemActive(s):void 0,"aria-haspopup":i.isItemGroup(s)&&!i.getItemProp(s,"to")?"menu":void 0,"aria-level":n.level+1,"aria-setsize":i.getAriaSetSize(),"aria-posinset":i.getAriaPosInset(o)},{ref_for:!0},i.getPTOptions(s,o,"item"),{"data-p-active":i.isItemActive(s),"data-p-focused":i.isItemFocused(s),"data-p-disabled":i.isItemDisabled(s)}),[p("div",l({class:t.cx("itemContent"),onClick:function(h){return i.onItemClick(h,s)},onMouseenter:function(h){return i.onItemMouseEnter(h,s)}},{ref_for:!0},i.getPTOptions(s,o,"itemContent")),[n.templates.item?(m(),g(w(n.templates.item),{key:1,item:s.item,hasSubmenu:i.isItemGroup(s),label:i.getItemLabel(s),props:i.getMenuItemProps(s,o)},null,8,["item","hasSubmenu","label","props"])):B((m(),f("a",l({key:0,href:i.getItemProp(s,"url"),class:t.cx("itemLink"),target:i.getItemProp(s,"target"),tabindex:"-1"},{ref_for:!0},i.getPTOptions(s,o,"itemLink")),[n.templates.itemicon?(m(),g(w(n.templates.itemicon),{key:0,item:s.item,class:O(t.cx("itemIcon"))},null,8,["item","class"])):i.getItemProp(s,"icon")?(m(),f("span",l({key:1,class:[t.cx("itemIcon"),i.getItemProp(s,"icon")]},{ref_for:!0},i.getPTOptions(s,o,"itemIcon")),null,16)):b("",!0),p("span",l({class:t.cx("itemLabel")},{ref_for:!0},i.getPTOptions(s,o,"itemLabel")),V(i.getItemLabel(s)),17),i.isItemGroup(s)?(m(),f(P,{key:2},[n.templates.submenuicon?(m(),g(w(n.templates.submenuicon),l({key:0,active:i.isItemActive(s),class:t.cx("submenuIcon")},{ref_for:!0},i.getPTOptions(s,o,"submenuIcon")),null,16,["active","class"])):(m(),g(w(n.horizontal||n.mobileActive?"AngleDownIcon":"AngleRightIcon"),l({key:1,class:t.cx("submenuIcon")},{ref_for:!0},i.getPTOptions(s,o,"submenuIcon")),null,16,["class"]))],64)):b("",!0)],16,Dt)),[[d]])],16,Tt),i.isItemVisible(s)&&i.isItemGroup(s)?(m(),f("div",l({key:0,class:t.cx("overlay")},{ref_for:!0},t.ptm("overlay")),[p("div",l({class:t.cx("grid")},{ref_for:!0},t.ptm("grid")),[(m(!0),f(P,null,D(s.items,function(c){return m(),f("div",l({key:i.getItemKey(c),class:t.cx("column",{processedItem:s})},{ref_for:!0},t.ptm("column")),[(m(!0),f(P,null,D(c,function(h){return m(),g(u,{key:i.getSubListKey(h),id:i.getSubListId(h),style:oe(t.sx("submenu",!0,{processedItem:s})),role:"menu",menuId:n.menuId,focusedItemId:n.focusedItemId,submenu:h,items:h.items,templates:n.templates,level:n.level+1,mobileActive:n.mobileActive,pt:t.pt,unstyled:t.unstyled,onItemClick:e[0]||(e[0]=function(v){return t.$emit("item-click",v)}),onItemMouseenter:e[1]||(e[1]=function(v){return t.$emit("item-mouseenter",v)})},null,8,["id","style","menuId","focusedItemId","submenu","items","templates","level","mobileActive","pt","unstyled"])}),128))],16)}),128))],16)],16)):b("",!0)],16,Ft)):b("",!0),i.isItemVisible(s)&&i.getItemProp(s,"separator")?(m(),f("li",l({key:1,id:i.getItemId(s),class:[t.cx("separator"),i.getItemProp(s,"class")],style:i.getItemProp(s,"style"),role:"separator"},{ref_for:!0},t.ptm("separator")),null,16,Vt)):b("",!0)],64)}),128))],16,Ot)}Ae.render=zt;var Ee={name:"MegaMenu",extends:Et,inheritAttrs:!1,emits:["focus","blur"],outsideClickListener:null,resizeListener:null,matchMediaListener:null,container:null,menubar:null,searchTimeout:null,searchValue:null,data:function(){return{mobileActive:!1,focused:!1,focusedItemInfo:{index:-1,key:"",parentKey:""},activeItem:null,dirty:!1,query:null,queryMatches:!1}},watch:{activeItem:function(e){I(e)?(this.bindOutsideClickListener(),this.bindResizeListener()):(this.unbindOutsideClickListener(),this.unbindResizeListener())}},mounted:function(){this.bindMatchMediaListener()},beforeUnmount:function(){this.mobileActive=!1,this.unbindOutsideClickListener(),this.unbindResizeListener(),this.unbindMatchMediaListener()},methods:{getItemProp:function(e,n){return e?F(e[n]):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemGroup:function(e){return I(this.getItemProp(e,"items"))},isItemSeparator:function(e){return this.getItemProp(e,"separator")},getProccessedItemLabel:function(e){return e?this.getItemLabel(e.item):void 0},isProccessedItemGroup:function(e){return e&&I(e.items)},toggle:function(e){var n=this;this.mobileActive?(this.mobileActive=!1,E.clear(this.menubar),this.hide()):(this.mobileActive=!0,E.set("menu",this.menubar,this.$primevue.config.zIndex.menu),setTimeout(function(){n.show()},1)),this.bindOutsideClickListener(),e.preventDefault()},show:function(){this.focusedItemInfo={index:this.findFirstFocusedItemIndex(),level:0,parentKey:""},x(this.menubar)},hide:function(e,n){var r=this;this.mobileActive&&(this.mobileActive=!1,setTimeout(function(){x(r.$refs.menubutton,{preventScroll:!0})},1)),this.activeItem=null,this.focusedItemInfo={index:-1,key:"",parentKey:""},n&&x(this.menubar),this.dirty=!1},onFocus:function(e){if(this.focused=!0,this.focusedItemInfo.index===-1){var n=this.findFirstFocusedItemIndex(),r=this.findVisibleItem(n);this.focusedItemInfo={index:n,key:r.key,parentKey:r.parentKey}}this.$emit("focus",e)},onBlur:function(e){this.focused=!1,this.focusedItemInfo={index:-1,key:"",parentKey:""},this.searchValue="",this.dirty=!1,this.$emit("blur",e)},onKeyDown:function(e){if(this.disabled){e.preventDefault();return}var n=e.metaKey||e.ctrlKey;switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"Space":this.onSpaceKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"PageDown":case"PageUp":case"Backspace":case"ShiftLeft":case"ShiftRight":break;default:!n&&X(e.key)&&this.searchItems(e,e.key);break}},onItemChange:function(e){var n=e.processedItem,r=e.isFocus;if(!A(n)){var a=n.index,i=n.key,u=n.parentKey,d=n.items,s=I(d);s&&(this.activeItem=n),this.focusedItemInfo={index:a,key:i,parentKey:u},s&&(this.dirty=!0),r&&x(this.menubar)}},onItemClick:function(e){var n=e.originalEvent,r=e.processedItem,a=this.isProccessedItemGroup(r),i=A(r.parent),u=this.isSelected(r);if(u){var d=r.index,s=r.key,o=r.parentKey;this.activeItem=null,this.focusedItemInfo={index:d,key:s,parentKey:o},this.dirty=!i,this.mobileActive||x(this.menubar,{preventScroll:!0})}else a?this.onItemChange(e):this.hide(n)},onItemMouseEnter:function(e){!this.mobileActive&&this.dirty&&this.onItemChange(e)},menuButtonClick:function(e){this.toggle(e)},menuButtonKeydown:function(e){(e.code==="Enter"||e.code==="NumpadEnter"||e.code==="Space")&&this.menuButtonClick(e)},onArrowDownKey:function(e){if(this.horizontal)if(I(this.activeItem)&&this.activeItem.key===this.focusedItemInfo.key)this.focusedItemInfo={index:-1,key:"",parentKey:this.activeItem.key};else{var n=this.findVisibleItem(this.focusedItemInfo.index),r=this.isProccessedItemGroup(n);r&&(this.onItemChange({originalEvent:e,processedItem:n}),this.focusedItemInfo={index:-1,key:n.key,parentKey:n.parentKey},this.searchValue="")}var a=this.focusedItemInfo.index!==-1?this.findNextItemIndex(this.focusedItemInfo.index):this.findFirstFocusedItemIndex();this.changeFocusedItemInfo(e,a),e.preventDefault()},onArrowUpKey:function(e){if(e.altKey&&this.horizontal){if(this.focusedItemInfo.index!==-1){var n=this.findVisibleItem(this.focusedItemInfo.index),r=this.isProccessedItemGroup(n);!r&&I(this.activeItem)&&(this.focusedItemInfo.index===0?(this.focusedItemInfo={index:this.activeItem.index,key:this.activeItem.key,parentKey:this.activeItem.parentKey},this.activeItem=null):this.changeFocusedItemInfo(e,this.findFirstItemIndex()))}e.preventDefault()}else{var a=this.focusedItemInfo.index!==-1?this.findPrevItemIndex(this.focusedItemInfo.index):this.findLastFocusedItemIndex();this.changeFocusedItemInfo(e,a),e.preventDefault()}},onArrowLeftKey:function(e){var n=this.findVisibleItem(this.focusedItemInfo.index),r=this.isProccessedItemGroup(n);if(r){if(this.horizontal){var a=this.focusedItemInfo.index!==-1?this.findPrevItemIndex(this.focusedItemInfo.index):this.findLastFocusedItemIndex();this.changeFocusedItemInfo(e,a)}}else{this.vertical&&I(this.activeItem)&&n.columnIndex===0&&(this.focusedItemInfo={index:this.activeItem.index,key:this.activeItem.key,parentKey:this.activeItem.parentKey},this.activeItem=null);var i=n.columnIndex-1,u=this.visibleItems.findIndex(function(d){return d.columnIndex===i});u!==-1&&this.changeFocusedItemInfo(e,u)}e.preventDefault()},onArrowRightKey:function(e){var n=this.findVisibleItem(this.focusedItemInfo.index),r=this.isProccessedItemGroup(n);if(r){if(this.vertical)if(I(this.activeItem)&&this.activeItem.key===n.key)this.focusedItemInfo={index:-1,key:"",parentKey:this.activeItem.key};else{var a=this.findVisibleItem(this.focusedItemInfo.index),i=this.isProccessedItemGroup(a);i&&(this.onItemChange({originalEvent:e,processedItem:a}),this.focusedItemInfo={index:-1,key:a.key,parentKey:a.parentKey},this.searchValue="")}var u=this.focusedItemInfo.index!==-1?this.findNextItemIndex(this.focusedItemInfo.index):this.findFirstFocusedItemIndex();this.changeFocusedItemInfo(e,u)}else{var d=n.columnIndex+1,s=this.visibleItems.findIndex(function(o){return o.columnIndex===d});s!==-1&&this.changeFocusedItemInfo(e,s)}e.preventDefault()},onHomeKey:function(e){this.changeFocusedItemInfo(e,this.findFirstItemIndex()),e.preventDefault()},onEndKey:function(e){this.changeFocusedItemInfo(e,this.findLastItemIndex()),e.preventDefault()},onEnterKey:function(e){if(this.focusedItemInfo.index!==-1){var n=L(this.menubar,'li[id="'.concat("".concat(this.focusedItemId),'"]')),r=n&&L(n,'a[data-pc-section="itemlink"]');r?r.click():n&&n.click();var a=this.visibleItems[this.focusedItemInfo.index],i=this.isProccessedItemGroup(a);!i&&this.changeFocusedItemInfo(e,this.findFirstFocusedItemIndex())}e.preventDefault()},onSpaceKey:function(e){this.onEnterKey(e)},onEscapeKey:function(e){I(this.activeItem)&&(this.focusedItemInfo={index:this.activeItem.index,key:this.activeItem.key},this.activeItem=null),e.preventDefault()},onTabKey:function(e){if(this.focusedItemInfo.index!==-1){var n=this.findVisibleItem(this.focusedItemInfo.index),r=this.isProccessedItemGroup(n);!r&&this.onItemChange({originalEvent:e,processedItem:n})}this.hide()},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(n){var r=e.container&&!e.container.contains(n.target),a=!(e.target&&(e.target===n.target||e.target.contains(n.target)));r&&a&&e.hide()},document.addEventListener("click",this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&(document.removeEventListener("click",this.outsideClickListener,!0),this.outsideClickListener=null)},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(n){Y()||e.hide(n,!0),e.mobileActive=!1},window.addEventListener("resize",this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)},bindMatchMediaListener:function(){var e=this;if(!this.matchMediaListener){var n=matchMedia("(max-width: ".concat(this.breakpoint,")"));this.query=n,this.queryMatches=n.matches,this.matchMediaListener=function(){e.queryMatches=n.matches,e.mobileActive=!1},this.query.addEventListener("change",this.matchMediaListener)}},unbindMatchMediaListener:function(){this.matchMediaListener&&(this.query.removeEventListener("change",this.matchMediaListener),this.matchMediaListener=null)},isItemMatched:function(e){var n;return this.isValidItem(e)&&((n=this.getProccessedItemLabel(e))===null||n===void 0?void 0:n.toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase()))},isValidItem:function(e){return!!e&&!this.isItemDisabled(e.item)&&!this.isItemSeparator(e.item)&&this.isItemVisible(e.item)},isValidSelectedItem:function(e){return this.isValidItem(e)&&this.isSelected(e)},isSelected:function(e){return I(this.activeItem)?this.activeItem.key===e.key:!1},findFirstItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidItem(n)})},findLastItemIndex:function(){var e=this;return _(this.visibleItems,function(n){return e.isValidItem(n)})},findNextItemIndex:function(e){var n=this,r=e<this.visibleItems.length-1?this.visibleItems.slice(e+1).findIndex(function(a){return n.isValidItem(a)}):-1;return r>-1?r+e+1:e},findPrevItemIndex:function(e){var n=this,r=e>0?_(this.visibleItems.slice(0,e),function(a){return n.isValidItem(a)}):-1;return r>-1?r:e},findSelectedItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidSelectedItem(n)})},findFirstFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findFirstItemIndex():e},findLastFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findLastItemIndex():e},findVisibleItem:function(e){return I(this.visibleItems)?this.visibleItems[e]:null},searchItems:function(e,n){var r=this;this.searchValue=(this.searchValue||"")+n;var a=-1,i=!1;return this.focusedItemInfo.index!==-1?(a=this.visibleItems.slice(this.focusedItemInfo.index).findIndex(function(u){return r.isItemMatched(u)}),a=a===-1?this.visibleItems.slice(0,this.focusedItemInfo.index).findIndex(function(u){return r.isItemMatched(u)}):a+this.focusedItemInfo.index):a=this.visibleItems.findIndex(function(u){return r.isItemMatched(u)}),a!==-1&&(i=!0),a===-1&&this.focusedItemInfo.index===-1&&(a=this.findFirstFocusedItemIndex()),a!==-1&&this.changeFocusedItemInfo(e,a),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(function(){r.searchValue="",r.searchTimeout=null},500),i},changeFocusedItemInfo:function(e,n){var r=this.findVisibleItem(n);this.focusedItemInfo.index=n,this.focusedItemInfo.key=I(r)?r.key:"",this.scrollInView()},scrollInView:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:-1,n=e!==-1?"".concat(this.$id,"_").concat(e):this.focusedItemId,r;n===null&&this.queryMatches?r=this.$refs.menubutton:r=L(this.menubar,'li[id="'.concat(n,'"]')),r&&r.scrollIntoView&&r.scrollIntoView({block:"nearest",inline:"nearest",behavior:"smooth"})},createProcessedItems:function(e){var n=this,r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"",u=arguments.length>4?arguments[4]:void 0,d=[];return e&&e.forEach(function(s,o){var c=(i!==""?i+"_":"")+(u!==void 0?u+"_":"")+o,h={item:s,index:o,level:r,key:c,parent:a,parentKey:i,columnIndex:u!==void 0?u:a.columnIndex!==void 0?a.columnIndex:o};h.items=r===0&&s.items&&s.items.length>0?s.items.map(function(v,te){return n.createProcessedItems(v,r+1,h,c,te)}):n.createProcessedItems(s.items,r+1,h,c),d.push(h)}),d},containerRef:function(e){this.container=e},menubarRef:function(e){this.menubar=e?e.$el:void 0}},computed:{processedItems:function(){return this.createProcessedItems(this.model||[])},visibleItems:function(){var e=I(this.activeItem)?this.activeItem:null;return e&&e.key===this.focusedItemInfo.parentKey?e.items.reduce(function(n,r){return r.forEach(function(a){a.items.forEach(function(i){n.push(i)})}),n},[]):this.processedItems},horizontal:function(){return this.orientation==="horizontal"},vertical:function(){return this.orientation==="vertical"},focusedItemId:function(){return I(this.focusedItemInfo.key)?"".concat(this.$id,"_").concat(this.focusedItemInfo.key):null}},components:{MegaMenuSub:Ae,BarsIcon:Pe}},Ht=["id"],Rt=["aria-haspopup","aria-expanded","aria-controls","aria-label"];function Bt(t,e,n,r,a,i){var u=S("BarsIcon"),d=S("MegaMenuSub");return m(),f("div",l({ref:i.containerRef,id:t.$id,class:t.cx("root")},t.ptmi("root")),[t.$slots.start?(m(),f("div",l({key:0,class:t.cx("start")},t.ptm("start")),[M(t.$slots,"start")],16)):b("",!0),M(t.$slots,t.$slots.button?"button":"menubutton",{id:t.$id,class:O(t.cx("button")),toggleCallback:function(o){return i.menuButtonClick(o)}},function(){var s;return[t.model&&t.model.length>0?(m(),f("a",l({key:0,ref:"menubutton",role:"button",tabindex:"0",class:t.cx("button"),"aria-haspopup":!!(t.model.length&&t.model.length>0),"aria-expanded":a.mobileActive,"aria-controls":t.$id,"aria-label":(s=t.$primevue.config.locale.aria)===null||s===void 0?void 0:s.navigation,onClick:e[0]||(e[0]=function(o){return i.menuButtonClick(o)}),onKeydown:e[1]||(e[1]=function(o){return i.menuButtonKeydown(o)})},t.ptm("button")),[M(t.$slots,t.$slots.buttonicon?"buttonicon":"menubuttonicon",{},function(){return[k(u,ge(ve(t.ptm("buttonIcon"))),null,16)]})],16,Rt)):b("",!0)]}),k(d,{ref:i.menubarRef,id:t.$id+"_list",tabindex:t.disabled?-1:t.tabindex,role:"menubar","aria-label":t.ariaLabel,"aria-labelledby":t.ariaLabelledby,"aria-disabled":t.disabled||void 0,"aria-orientation":t.orientation,"aria-activedescendant":a.focused?i.focusedItemId:void 0,menuId:t.$id,focusedItemId:a.focused?i.focusedItemId:void 0,items:i.processedItems,horizontal:i.horizontal,templates:t.$slots,activeItem:a.activeItem,mobileActive:a.mobileActive,level:0,style:oe(t.sx("rootList")),pt:t.pt,unstyled:t.unstyled,onFocus:i.onFocus,onBlur:i.onBlur,onKeydown:i.onKeyDown,onItemClick:i.onItemClick,onItemMouseenter:i.onItemMouseEnter},null,8,["id","tabindex","aria-label","aria-labelledby","aria-disabled","aria-orientation","aria-activedescendant","menuId","focusedItemId","items","horizontal","templates","activeItem","mobileActive","style","pt","unstyled","onFocus","onBlur","onKeydown","onItemClick","onItemMouseenter"]),t.$slots.end?(m(),f("div",l({key:1,class:t.cx("end")},t.ptm("end")),[M(t.$slots,"end")],16)):b("",!0)],16,Ht)}Ee.render=Bt;var _t=`
    .p-menu {
        background: dt('menu.background');
        color: dt('menu.color');
        border: 1px solid dt('menu.border.color');
        border-radius: dt('menu.border.radius');
        min-width: 12.5rem;
    }

    .p-menu-list {
        margin: 0;
        padding: dt('menu.list.padding');
        outline: 0 none;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: dt('menu.list.gap');
    }

    .p-menu-item-content {
        transition:
            background dt('menu.transition.duration'),
            color dt('menu.transition.duration');
        border-radius: dt('menu.item.border.radius');
        color: dt('menu.item.color');
        overflow: hidden;
    }

    .p-menu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('menu.item.padding');
        gap: dt('menu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .p-menu-item-label {
        line-height: 1;
    }

    .p-menu-item-icon {
        color: dt('menu.item.icon.color');
    }

    .p-menu-item.p-focus .p-menu-item-content {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item.p-focus .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-overlay {
        box-shadow: dt('menu.shadow');
    }

    .p-menu-submenu-label {
        background: dt('menu.submenu.label.background');
        padding: dt('menu.submenu.label.padding');
        color: dt('menu.submenu.label.color');
        font-weight: dt('menu.submenu.label.font.weight');
    }

    .p-menu-separator {
        border-block-start: 1px solid dt('menu.separator.border.color');
    }
`,Nt={root:function(e){var n=e.props;return["p-menu p-component",{"p-menu-overlay":n.popup}]},start:"p-menu-start",list:"p-menu-list",submenuLabel:"p-menu-submenu-label",separator:"p-menu-separator",end:"p-menu-end",item:function(e){var n=e.instance;return["p-menu-item",{"p-focus":n.id===n.focusedOptionId,"p-disabled":n.disabled()}]},itemContent:"p-menu-item-content",itemLink:"p-menu-item-link",itemIcon:"p-menu-item-icon",itemLabel:"p-menu-item-label"},Gt=H.extend({name:"menu",style:_t,classes:Nt}),jt={name:"BaseMenu",extends:C,props:{popup:{type:Boolean,default:!1},model:{type:Array,default:null},appendTo:{type:[String,Object],default:"body"},autoZIndex:{type:Boolean,default:!0},baseZIndex:{type:Number,default:0},tabindex:{type:Number,default:0},ariaLabel:{type:String,default:null},ariaLabelledby:{type:String,default:null}},style:Gt,provide:function(){return{$pcMenu:this,$parentInstance:this}}},Oe={name:"Menuitem",hostName:"Menu",extends:C,inheritAttrs:!1,emits:["item-click","item-mousemove"],props:{item:null,templates:null,id:null,focusedOptionId:null,index:null},methods:{getItemProp:function(e,n){return e&&e.item?F(e.item[n]):void 0},getPTOptions:function(e){return this.ptm(e,{context:{item:this.item,index:this.index,focused:this.isItemFocused(),disabled:this.disabled()}})},isItemFocused:function(){return this.focusedOptionId===this.id},onItemClick:function(e){var n=this.getItemProp(this.item,"command");n&&n({originalEvent:e,item:this.item.item}),this.$emit("item-click",{originalEvent:e,item:this.item,id:this.id})},onItemMouseMove:function(e){this.$emit("item-mousemove",{originalEvent:e,item:this.item,id:this.id})},visible:function(){return typeof this.item.visible=="function"?this.item.visible():this.item.visible!==!1},disabled:function(){return typeof this.item.disabled=="function"?this.item.disabled():this.item.disabled},label:function(){return typeof this.item.label=="function"?this.item.label():this.item.label},getMenuItemProps:function(e){return{action:l({class:this.cx("itemLink"),tabindex:"-1"},this.getPTOptions("itemLink")),icon:l({class:[this.cx("itemIcon"),e.icon]},this.getPTOptions("itemIcon")),label:l({class:this.cx("itemLabel")},this.getPTOptions("itemLabel"))}}},computed:{dataP:function(){return ue({focus:this.isItemFocused(),disabled:this.disabled()})}},directives:{ripple:q}},Ut=["id","aria-label","aria-disabled","data-p-focused","data-p-disabled","data-p"],qt=["data-p"],Wt=["href","target"],Zt=["data-p"],Yt=["data-p"];function Xt(t,e,n,r,a,i){var u=U("ripple");return i.visible()?(m(),f("li",l({key:0,id:n.id,class:[t.cx("item"),n.item.class],role:"menuitem",style:n.item.style,"aria-label":i.label(),"aria-disabled":i.disabled(),"data-p-focused":i.isItemFocused(),"data-p-disabled":i.disabled()||!1,"data-p":i.dataP},i.getPTOptions("item")),[p("div",l({class:t.cx("itemContent"),onClick:e[0]||(e[0]=function(d){return i.onItemClick(d)}),onMousemove:e[1]||(e[1]=function(d){return i.onItemMouseMove(d)}),"data-p":i.dataP},i.getPTOptions("itemContent")),[n.templates.item?n.templates.item?(m(),g(w(n.templates.item),{key:1,item:n.item,label:i.label(),props:i.getMenuItemProps(n.item)},null,8,["item","label","props"])):b("",!0):B((m(),f("a",l({key:0,href:n.item.url,class:t.cx("itemLink"),target:n.item.target,tabindex:"-1"},i.getPTOptions("itemLink")),[n.templates.itemicon?(m(),g(w(n.templates.itemicon),{key:0,item:n.item,class:O(t.cx("itemIcon"))},null,8,["item","class"])):n.item.icon?(m(),f("span",l({key:1,class:[t.cx("itemIcon"),n.item.icon],"data-p":i.dataP},i.getPTOptions("itemIcon")),null,16,Zt)):b("",!0),p("span",l({class:t.cx("itemLabel"),"data-p":i.dataP},i.getPTOptions("itemLabel")),V(i.label()),17,Yt)],16,Wt)),[[u]])],16,qt)],16,Ut)):b("",!0)}Oe.render=Xt;function ce(t){return en(t)||$t(t)||Jt(t)||Qt()}function Qt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Jt(t,e){if(t){if(typeof t=="string")return re(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?re(t,e):void 0}}function $t(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function en(t){if(Array.isArray(t))return re(t)}function re(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}var Fe={name:"Menu",extends:jt,inheritAttrs:!1,emits:["show","hide","focus","blur"],data:function(){return{overlayVisible:!1,focused:!1,focusedOptionIndex:-1,selectedOptionIndex:-1}},target:null,outsideClickListener:null,scrollHandler:null,resizeListener:null,container:null,list:null,mounted:function(){this.popup||(this.bindResizeListener(),this.bindOutsideClickListener())},beforeUnmount:function(){this.unbindResizeListener(),this.unbindOutsideClickListener(),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.target=null,this.container&&this.autoZIndex&&E.clear(this.container),this.container=null},methods:{itemClick:function(e){var n=e.item;this.disabled(n)||(n.command&&n.command(e),this.overlayVisible&&this.hide(),!this.popup&&this.focusedOptionIndex!==e.id&&(this.focusedOptionIndex=e.id))},itemMouseMove:function(e){this.focused&&(this.focusedOptionIndex=e.id)},onListFocus:function(e){this.focused=!0,!this.popup&&this.changeFocusedOptionIndex(0),this.$emit("focus",e)},onListBlur:function(e){this.focused=!1,this.focusedOptionIndex=-1,this.$emit("blur",e)},onListKeyDown:function(e){switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Space":this.onSpaceKey(e);break;case"Escape":this.popup&&(x(this.target),this.hide());case"Tab":this.overlayVisible&&this.hide();break}},onArrowDownKey:function(e){var n=this.findNextOptionIndex(this.focusedOptionIndex);this.changeFocusedOptionIndex(n),e.preventDefault()},onArrowUpKey:function(e){if(e.altKey&&this.popup)x(this.target),this.hide(),e.preventDefault();else{var n=this.findPrevOptionIndex(this.focusedOptionIndex);this.changeFocusedOptionIndex(n),e.preventDefault()}},onHomeKey:function(e){this.changeFocusedOptionIndex(0),e.preventDefault()},onEndKey:function(e){this.changeFocusedOptionIndex(z(this.container,'li[data-pc-section="item"][data-p-disabled="false"]').length-1),e.preventDefault()},onEnterKey:function(e){var n=L(this.list,'li[id="'.concat("".concat(this.focusedOptionIndex),'"]')),r=n&&L(n,'a[data-pc-section="itemlink"]');this.popup&&x(this.target),r?r.click():n&&n.click(),e.preventDefault()},onSpaceKey:function(e){this.onEnterKey(e)},findNextOptionIndex:function(e){var n=z(this.container,'li[data-pc-section="item"][data-p-disabled="false"]'),r=ce(n).findIndex(function(a){return a.id===e});return r>-1?r+1:0},findPrevOptionIndex:function(e){var n=z(this.container,'li[data-pc-section="item"][data-p-disabled="false"]'),r=ce(n).findIndex(function(a){return a.id===e});return r>-1?r-1:0},changeFocusedOptionIndex:function(e){var n=z(this.container,'li[data-pc-section="item"][data-p-disabled="false"]'),r=e>=n.length?n.length-1:e<0?0:e;r>-1&&(this.focusedOptionIndex=n[r].getAttribute("id"))},toggle:function(e,n){this.overlayVisible?this.hide():this.show(e,n)},show:function(e,n){this.overlayVisible=!0,this.target=n??e.currentTarget},hide:function(){this.overlayVisible=!1,this.target=null},onEnter:function(e){se(e,{position:"absolute",top:"0"}),this.alignOverlay(),this.bindOutsideClickListener(),this.bindResizeListener(),this.bindScrollListener(),this.autoZIndex&&E.set("menu",e,this.baseZIndex+this.$primevue.config.zIndex.menu),this.popup&&x(this.list),this.$emit("show")},onLeave:function(){this.unbindOutsideClickListener(),this.unbindResizeListener(),this.unbindScrollListener(),this.$emit("hide")},onAfterLeave:function(e){this.autoZIndex&&E.clear(e)},alignOverlay:function(){ye(this.container,this.target);var e=j(this.target);e>j(this.container)&&(this.container.style.minWidth=j(this.target)+"px")},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(n){var r=e.container&&!e.container.contains(n.target),a=!(e.target&&(e.target===n.target||e.target.contains(n.target)));e.overlayVisible&&r&&a?e.hide():!e.popup&&r&&a&&(e.focusedOptionIndex=-1)},document.addEventListener("click",this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&(document.removeEventListener("click",this.outsideClickListener,!0),this.outsideClickListener=null)},bindScrollListener:function(){var e=this;this.scrollHandler||(this.scrollHandler=new Me(this.target,function(){e.overlayVisible&&e.hide()})),this.scrollHandler.bindScrollListener()},unbindScrollListener:function(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(){e.overlayVisible&&!Y()&&e.hide()},window.addEventListener("resize",this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)},visible:function(e){return typeof e.visible=="function"?e.visible():e.visible!==!1},disabled:function(e){return typeof e.disabled=="function"?e.disabled():e.disabled},label:function(e){return typeof e.label=="function"?e.label():e.label},onOverlayClick:function(e){Ke.emit("overlay-click",{originalEvent:e,target:this.target})},containerRef:function(e){this.container=e},listRef:function(e){this.list=e}},computed:{focusedOptionId:function(){return this.focusedOptionIndex!==-1?this.focusedOptionIndex:null},dataP:function(){return ue({popup:this.popup})}},components:{PVMenuitem:Oe,Portal:ae}},tn=["id","data-p"],nn=["id","tabindex","aria-activedescendant","aria-label","aria-labelledby"],rn=["id"];function an(t,e,n,r,a,i){var u=S("PVMenuitem"),d=S("Portal");return m(),g(d,{appendTo:t.appendTo,disabled:!t.popup},{default:K(function(){return[k(N,l({name:"p-connected-overlay",onEnter:i.onEnter,onLeave:i.onLeave,onAfterLeave:i.onAfterLeave},t.ptm("transition")),{default:K(function(){return[!t.popup||a.overlayVisible?(m(),f("div",l({key:0,ref:i.containerRef,id:t.$id,class:t.cx("root"),onClick:e[3]||(e[3]=function(){return i.onOverlayClick&&i.onOverlayClick.apply(i,arguments)}),"data-p":i.dataP},t.ptmi("root")),[t.$slots.start?(m(),f("div",l({key:0,class:t.cx("start")},t.ptm("start")),[M(t.$slots,"start")],16)):b("",!0),p("ul",l({ref:i.listRef,id:t.$id+"_list",class:t.cx("list"),role:"menu",tabindex:t.tabindex,"aria-activedescendant":a.focused?i.focusedOptionId:void 0,"aria-label":t.ariaLabel,"aria-labelledby":t.ariaLabelledby,onFocus:e[0]||(e[0]=function(){return i.onListFocus&&i.onListFocus.apply(i,arguments)}),onBlur:e[1]||(e[1]=function(){return i.onListBlur&&i.onListBlur.apply(i,arguments)}),onKeydown:e[2]||(e[2]=function(){return i.onListKeyDown&&i.onListKeyDown.apply(i,arguments)})},t.ptm("list")),[(m(!0),f(P,null,D(t.model,function(s,o){return m(),f(P,{key:i.label(s)+o.toString()},[s.items&&i.visible(s)&&!s.separator?(m(),f(P,{key:0},[s.items?(m(),f("li",l({key:0,id:t.$id+"_"+o,class:[t.cx("submenuLabel"),s.class],role:"none"},{ref_for:!0},t.ptm("submenuLabel")),[M(t.$slots,t.$slots.submenulabel?"submenulabel":"submenuheader",{item:s},function(){return[R(V(i.label(s)),1)]})],16,rn)):b("",!0),(m(!0),f(P,null,D(s.items,function(c,h){return m(),f(P,{key:c.label+o+"_"+h},[i.visible(c)&&!c.separator?(m(),g(u,{key:0,id:t.$id+"_"+o+"_"+h,item:c,templates:t.$slots,focusedOptionId:i.focusedOptionId,unstyled:t.unstyled,onItemClick:i.itemClick,onItemMousemove:i.itemMouseMove,pt:t.pt},null,8,["id","item","templates","focusedOptionId","unstyled","onItemClick","onItemMousemove","pt"])):i.visible(c)&&c.separator?(m(),f("li",l({key:"separator"+o+h,class:[t.cx("separator"),s.class],style:c.style,role:"separator"},{ref_for:!0},t.ptm("separator")),null,16)):b("",!0)],64)}),128))],64)):i.visible(s)&&s.separator?(m(),f("li",l({key:"separator"+o.toString(),class:[t.cx("separator"),s.class],style:s.style,role:"separator"},{ref_for:!0},t.ptm("separator")),null,16)):(m(),g(u,{key:i.label(s)+o.toString(),id:t.$id+"_"+o,item:s,index:o,templates:t.$slots,focusedOptionId:i.focusedOptionId,unstyled:t.unstyled,onItemClick:i.itemClick,onItemMousemove:i.itemMouseMove,pt:t.pt},null,8,["id","item","index","templates","focusedOptionId","unstyled","onItemClick","onItemMousemove","pt"]))],64)}),128))],16,nn),t.$slots.end?(m(),f("div",l({key:1,class:t.cx("end")},t.ptm("end")),[M(t.$slots,"end")],16)):b("",!0)],16,tn)):b("",!0)]}),_:3},16,["onEnter","onLeave","onAfterLeave"])]}),_:3},8,["appendTo","disabled"])}Fe.render=an;var sn=`
    .p-menubar {
        display: flex;
        align-items: center;
        background: dt('menubar.background');
        border: 1px solid dt('menubar.border.color');
        border-radius: dt('menubar.border.radius');
        color: dt('menubar.color');
        padding: dt('menubar.padding');
        gap: dt('menubar.gap');
    }

    .p-menubar-start,
    .p-megamenu-end {
        display: flex;
        align-items: center;
    }

    .p-menubar-root-list,
    .p-menubar-submenu {
        display: flex;
        margin: 0;
        padding: 0;
        list-style: none;
        outline: 0 none;
    }

    .p-menubar-root-list {
        align-items: center;
        flex-wrap: wrap;
        gap: dt('menubar.gap');
    }

    .p-menubar-root-list > .p-menubar-item > .p-menubar-item-content {
        border-radius: dt('menubar.base.item.border.radius');
    }

    .p-menubar-root-list > .p-menubar-item > .p-menubar-item-content > .p-menubar-item-link {
        padding: dt('menubar.base.item.padding');
    }

    .p-menubar-item-content {
        transition:
            background dt('menubar.transition.duration'),
            color dt('menubar.transition.duration');
        border-radius: dt('menubar.item.border.radius');
        color: dt('menubar.item.color');
    }

    .p-menubar-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('menubar.item.padding');
        gap: dt('menubar.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .p-menubar-item-label {
        line-height: 1;
    }

    .p-menubar-item-icon {
        color: dt('menubar.item.icon.color');
    }

    .p-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.color');
        margin-left: auto;
        font-size: dt('menubar.submenu.icon.size');
        width: dt('menubar.submenu.icon.size');
        height: dt('menubar.submenu.icon.size');
    }

    .p-menubar-submenu .p-menubar-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-menubar-item.p-focus > .p-menubar-item-content {
        color: dt('menubar.item.focus.color');
        background: dt('menubar.item.focus.background');
    }

    .p-menubar-item.p-focus > .p-menubar-item-content .p-menubar-item-icon {
        color: dt('menubar.item.icon.focus.color');
    }

    .p-menubar-item.p-focus > .p-menubar-item-content .p-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.focus.color');
    }

    .p-menubar-item:not(.p-disabled) > .p-menubar-item-content:hover {
        color: dt('menubar.item.focus.color');
        background: dt('menubar.item.focus.background');
    }

    .p-menubar-item:not(.p-disabled) > .p-menubar-item-content:hover .p-menubar-item-icon {
        color: dt('menubar.item.icon.focus.color');
    }

    .p-menubar-item:not(.p-disabled) > .p-menubar-item-content:hover .p-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.focus.color');
    }

    .p-menubar-item-active > .p-menubar-item-content {
        color: dt('menubar.item.active.color');
        background: dt('menubar.item.active.background');
    }

    .p-menubar-item-active > .p-menubar-item-content .p-menubar-item-icon {
        color: dt('menubar.item.icon.active.color');
    }

    .p-menubar-item-active > .p-menubar-item-content .p-menubar-submenu-icon {
        color: dt('menubar.submenu.icon.active.color');
    }

    .p-menubar-submenu {
        display: none;
        position: absolute;
        min-width: 12.5rem;
        z-index: 1;
        background: dt('menubar.submenu.background');
        border: 1px solid dt('menubar.submenu.border.color');
        border-radius: dt('menubar.submenu.border.radius');
        box-shadow: dt('menubar.submenu.shadow');
        color: dt('menubar.submenu.color');
        flex-direction: column;
        padding: dt('menubar.submenu.padding');
        gap: dt('menubar.submenu.gap');
    }

    .p-menubar-submenu .p-menubar-separator {
        border-block-start: 1px solid dt('menubar.separator.border.color');
    }

    .p-menubar-submenu .p-menubar-item {
        position: relative;
    }

    .p-menubar-submenu > .p-menubar-item-active > .p-menubar-submenu {
        display: block;
        left: 100%;
        top: 0;
    }

    .p-menubar-end {
        margin-left: auto;
        align-self: center;
    }

    .p-menubar-end:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-menubar-button {
        display: none;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: dt('menubar.mobile.button.size');
        height: dt('menubar.mobile.button.size');
        position: relative;
        color: dt('menubar.mobile.button.color');
        border: 0 none;
        background: transparent;
        border-radius: dt('menubar.mobile.button.border.radius');
        transition:
            background dt('menubar.transition.duration'),
            color dt('menubar.transition.duration'),
            outline-color dt('menubar.transition.duration');
        outline-color: transparent;
    }

    .p-menubar-button:hover {
        color: dt('menubar.mobile.button.hover.color');
        background: dt('menubar.mobile.button.hover.background');
    }

    .p-menubar-button:focus-visible {
        box-shadow: dt('menubar.mobile.button.focus.ring.shadow');
        outline: dt('menubar.mobile.button.focus.ring.width') dt('menubar.mobile.button.focus.ring.style') dt('menubar.mobile.button.focus.ring.color');
        outline-offset: dt('menubar.mobile.button.focus.ring.offset');
    }

    .p-menubar-mobile {
        position: relative;
    }

    .p-menubar-mobile .p-menubar-button {
        display: flex;
    }

    .p-menubar-mobile .p-menubar-root-list {
        position: absolute;
        display: none;
        width: 100%;
        flex-direction: column;
        top: 100%;
        left: 0;
        z-index: 1;
        padding: dt('menubar.submenu.padding');
        background: dt('menubar.submenu.background');
        border: 1px solid dt('menubar.submenu.border.color');
        box-shadow: dt('menubar.submenu.shadow');
        border-radius: dt('menubar.submenu.border.radius');
        gap: dt('menubar.submenu.gap');
    }

    .p-menubar-mobile .p-menubar-root-list:dir(rtl) {
        left: auto;
        right: 0;
    }

    .p-menubar-mobile .p-menubar-root-list > .p-menubar-item > .p-menubar-item-content > .p-menubar-item-link {
        padding: dt('menubar.item.padding');
    }

    .p-menubar-mobile-active .p-menubar-root-list {
        display: flex;
    }

    .p-menubar-mobile .p-menubar-root-list .p-menubar-item {
        width: 100%;
        position: static;
    }

    .p-menubar-mobile .p-menubar-root-list .p-menubar-separator {
        border-block-start: 1px solid dt('menubar.separator.border.color');
    }

    .p-menubar-mobile .p-menubar-root-list > .p-menubar-item > .p-menubar-item-content .p-menubar-submenu-icon {
        margin-left: auto;
        transition: transform 0.2s;
    }

    .p-menubar-mobile .p-menubar-root-list > .p-menubar-item > .p-menubar-item-content .p-menubar-submenu-icon:dir(rtl),
    .p-menubar-mobile .p-menubar-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-menubar-mobile .p-menubar-root-list > .p-menubar-item-active > .p-menubar-item-content .p-menubar-submenu-icon {
        transform: rotate(-180deg);
    }

    .p-menubar-mobile .p-menubar-submenu .p-menubar-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .p-menubar-mobile .p-menubar-item-active > .p-menubar-item-content .p-menubar-submenu-icon {
        transform: rotate(-90deg);
    }

    .p-menubar-mobile .p-menubar-submenu {
        width: 100%;
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('menubar.submenu.mobile.indent');
        padding-inline-end: 0;
    }
`,on={submenu:function(e){var n=e.instance,r=e.processedItem;return{display:n.isItemActive(r)?"flex":"none"}}},un={root:function(e){var n=e.instance;return["p-menubar p-component",{"p-menubar-mobile":n.queryMatches,"p-menubar-mobile-active":n.mobileActive}]},start:"p-menubar-start",button:"p-menubar-button",rootList:"p-menubar-root-list",item:function(e){var n=e.instance,r=e.processedItem;return["p-menubar-item",{"p-menubar-item-active":n.isItemActive(r),"p-focus":n.isItemFocused(r),"p-disabled":n.isItemDisabled(r)}]},itemContent:"p-menubar-item-content",itemLink:"p-menubar-item-link",itemIcon:"p-menubar-item-icon",itemLabel:"p-menubar-item-label",submenuIcon:"p-menubar-submenu-icon",submenu:"p-menubar-submenu",separator:"p-menubar-separator",end:"p-menubar-end"},ln=H.extend({name:"menubar",style:sn,classes:un,inlineStyles:on}),mn={name:"BaseMenubar",extends:C,props:{model:{type:Array,default:null},buttonProps:{type:null,default:null},breakpoint:{type:String,default:"960px"},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:ln,provide:function(){return{$pcMenubar:this,$parentInstance:this}}},Te={name:"MenubarSub",hostName:"Menubar",extends:C,emits:["item-mouseenter","item-click","item-mousemove"],props:{items:{type:Array,default:null},root:{type:Boolean,default:!1},popup:{type:Boolean,default:!1},mobileActive:{type:Boolean,default:!1},templates:{type:Object,default:null},level:{type:Number,default:0},menuId:{type:String,default:null},focusedItemId:{type:String,default:null},activeItemPath:{type:Object,default:null}},list:null,methods:{getItemId:function(e){return"".concat(this.menuId,"_").concat(e.key)},getItemKey:function(e){return this.getItemId(e)},getItemProp:function(e,n,r){return e&&e.item?F(e.item[n],r):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},getItemLabelId:function(e){return"".concat(this.menuId,"_").concat(e.key,"_label")},getPTOptions:function(e,n,r){return this.ptm(r,{context:{item:e.item,index:n,active:this.isItemActive(e),focused:this.isItemFocused(e),disabled:this.isItemDisabled(e),level:this.level}})},isItemActive:function(e){return this.activeItemPath.some(function(n){return n.key===e.key})},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemFocused:function(e){return this.focusedItemId===this.getItemId(e)},isItemGroup:function(e){return I(e.items)},onItemClick:function(e,n){this.getItemProp(n,"command",{originalEvent:e,item:n.item}),this.$emit("item-click",{originalEvent:e,processedItem:n,isFocus:!0})},onItemMouseEnter:function(e,n){this.$emit("item-mouseenter",{originalEvent:e,processedItem:n})},onItemMouseMove:function(e,n){this.$emit("item-mousemove",{originalEvent:e,processedItem:n})},getAriaPosInset:function(e){return e-this.calculateAriaSetSize.slice(0,e).length+1},getMenuItemProps:function(e,n){return{action:l({class:this.cx("itemLink"),tabindex:-1},this.getPTOptions(e,n,"itemLink")),icon:l({class:[this.cx("itemIcon"),this.getItemProp(e,"icon")]},this.getPTOptions(e,n,"itemIcon")),label:l({class:this.cx("itemLabel")},this.getPTOptions(e,n,"itemLabel")),submenuicon:l({class:this.cx("submenuIcon")},this.getPTOptions(e,n,"submenuIcon"))}}},computed:{calculateAriaSetSize:function(){var e=this;return this.items.filter(function(n){return e.isItemVisible(n)&&e.getItemProp(n,"separator")})},getAriaSetSize:function(){var e=this;return this.items.filter(function(n){return e.isItemVisible(n)&&!e.getItemProp(n,"separator")}).length}},components:{AngleRightIcon:ee,AngleDownIcon:we},directives:{ripple:q}},dn=["id","aria-label","aria-disabled","aria-expanded","aria-haspopup","aria-setsize","aria-posinset","data-p-active","data-p-focused","data-p-disabled"],cn=["onClick","onMouseenter","onMousemove"],fn=["href","target"],hn=["id"],pn=["id"];function bn(t,e,n,r,a,i){var u=S("MenubarSub",!0),d=U("ripple");return m(),f("ul",l({class:n.level===0?t.cx("rootList"):t.cx("submenu")},n.level===0?t.ptm("rootList"):t.ptm("submenu")),[(m(!0),f(P,null,D(n.items,function(s,o){return m(),f(P,{key:i.getItemKey(s)},[i.isItemVisible(s)&&!i.getItemProp(s,"separator")?(m(),f("li",l({key:0,id:i.getItemId(s),style:i.getItemProp(s,"style"),class:[t.cx("item",{processedItem:s}),i.getItemProp(s,"class")],role:"menuitem","aria-label":i.getItemLabel(s),"aria-disabled":i.isItemDisabled(s)||void 0,"aria-expanded":i.isItemGroup(s)?i.isItemActive(s):void 0,"aria-haspopup":i.isItemGroup(s)&&!i.getItemProp(s,"to")?"menu":void 0,"aria-setsize":i.getAriaSetSize,"aria-posinset":i.getAriaPosInset(o)},{ref_for:!0},i.getPTOptions(s,o,"item"),{"data-p-active":i.isItemActive(s),"data-p-focused":i.isItemFocused(s),"data-p-disabled":i.isItemDisabled(s)}),[p("div",l({class:t.cx("itemContent"),onClick:function(h){return i.onItemClick(h,s)},onMouseenter:function(h){return i.onItemMouseEnter(h,s)},onMousemove:function(h){return i.onItemMouseMove(h,s)}},{ref_for:!0},i.getPTOptions(s,o,"itemContent")),[n.templates.item?(m(),g(w(n.templates.item),{key:1,item:s.item,root:n.root,hasSubmenu:i.getItemProp(s,"items"),label:i.getItemLabel(s),props:i.getMenuItemProps(s,o)},null,8,["item","root","hasSubmenu","label","props"])):B((m(),f("a",l({key:0,href:i.getItemProp(s,"url"),class:t.cx("itemLink"),target:i.getItemProp(s,"target"),tabindex:"-1"},{ref_for:!0},i.getPTOptions(s,o,"itemLink")),[n.templates.itemicon?(m(),g(w(n.templates.itemicon),{key:0,item:s.item,class:O(t.cx("itemIcon"))},null,8,["item","class"])):i.getItemProp(s,"icon")?(m(),f("span",l({key:1,class:[t.cx("itemIcon"),i.getItemProp(s,"icon")]},{ref_for:!0},i.getPTOptions(s,o,"itemIcon")),null,16)):b("",!0),p("span",l({id:i.getItemLabelId(s),class:t.cx("itemLabel")},{ref_for:!0},i.getPTOptions(s,o,"itemLabel")),V(i.getItemLabel(s)),17,hn),i.getItemProp(s,"items")?(m(),f(P,{key:2},[n.templates.submenuicon?(m(),g(w(n.templates.submenuicon),{key:0,root:n.root,active:i.isItemActive(s),class:O(t.cx("submenuIcon"))},null,8,["root","active","class"])):(m(),g(w(n.root?"AngleDownIcon":"AngleRightIcon"),l({key:1,class:t.cx("submenuIcon")},{ref_for:!0},i.getPTOptions(s,o,"submenuIcon")),null,16,["class"]))],64)):b("",!0)],16,fn)),[[d]])],16,cn),i.isItemVisible(s)&&i.isItemGroup(s)?(m(),g(u,{key:0,id:i.getItemId(s)+"_list",menuId:n.menuId,role:"menu",style:oe(t.sx("submenu",!0,{processedItem:s})),focusedItemId:n.focusedItemId,items:s.items,mobileActive:n.mobileActive,activeItemPath:n.activeItemPath,templates:n.templates,level:n.level+1,"aria-labelledby":i.getItemLabelId(s),pt:t.pt,unstyled:t.unstyled,onItemClick:e[0]||(e[0]=function(c){return t.$emit("item-click",c)}),onItemMouseenter:e[1]||(e[1]=function(c){return t.$emit("item-mouseenter",c)}),onItemMousemove:e[2]||(e[2]=function(c){return t.$emit("item-mousemove",c)})},null,8,["id","menuId","style","focusedItemId","items","mobileActive","activeItemPath","templates","level","aria-labelledby","pt","unstyled"])):b("",!0)],16,dn)):b("",!0),i.isItemVisible(s)&&i.getItemProp(s,"separator")?(m(),f("li",l({key:1,id:i.getItemId(s),class:[t.cx("separator"),i.getItemProp(s,"class")],style:i.getItemProp(s,"style"),role:"separator"},{ref_for:!0},t.ptm("separator")),null,16,pn)):b("",!0)],64)}),128))],16)}Te.render=bn;var De={name:"Menubar",extends:mn,inheritAttrs:!1,emits:["focus","blur"],matchMediaListener:null,data:function(){return{mobileActive:!1,focused:!1,focusedItemInfo:{index:-1,level:0,parentKey:""},activeItemPath:[],dirty:!1,query:null,queryMatches:!1}},watch:{activeItemPath:function(e){I(e)?(this.bindOutsideClickListener(),this.bindResizeListener()):(this.unbindOutsideClickListener(),this.unbindResizeListener())}},outsideClickListener:null,container:null,menubar:null,mounted:function(){this.bindMatchMediaListener()},beforeUnmount:function(){this.mobileActive=!1,this.unbindOutsideClickListener(),this.unbindResizeListener(),this.unbindMatchMediaListener(),this.container&&E.clear(this.container),this.container=null},methods:{getItemProp:function(e,n){return e?F(e[n]):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemGroup:function(e){return I(this.getItemProp(e,"items"))},isItemSeparator:function(e){return this.getItemProp(e,"separator")},getProccessedItemLabel:function(e){return e?this.getItemLabel(e.item):void 0},isProccessedItemGroup:function(e){return e&&I(e.items)},toggle:function(e){var n=this;this.mobileActive?(this.mobileActive=!1,E.clear(this.menubar),this.hide()):(this.mobileActive=!0,E.set("menu",this.menubar,this.$primevue.config.zIndex.menu),setTimeout(function(){n.show()},1)),this.bindOutsideClickListener(),e.preventDefault()},show:function(){x(this.menubar)},hide:function(e,n){var r=this;this.mobileActive&&(this.mobileActive=!1,setTimeout(function(){x(r.$refs.menubutton)},0)),this.activeItemPath=[],this.focusedItemInfo={index:-1,level:0,parentKey:""},n&&x(this.menubar),this.dirty=!1},onFocus:function(e){this.focused=!0,this.focusedItemInfo=this.focusedItemInfo.index!==-1?this.focusedItemInfo:{index:this.findFirstFocusedItemIndex(),level:0,parentKey:""},this.$emit("focus",e)},onBlur:function(e){this.focused=!1,this.focusedItemInfo={index:-1,level:0,parentKey:""},this.searchValue="",this.dirty=!1,this.$emit("blur",e)},onKeyDown:function(e){var n=e.metaKey||e.ctrlKey;switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"Space":this.onSpaceKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"PageDown":case"PageUp":case"Backspace":case"ShiftLeft":case"ShiftRight":break;default:!n&&X(e.key)&&this.searchItems(e,e.key);break}},onItemChange:function(e,n){var r=e.processedItem,a=e.isFocus;if(!A(r)){var i=r.index,u=r.key,d=r.level,s=r.parentKey,o=r.items,c=I(o),h=this.activeItemPath.filter(function(v){return v.parentKey!==s&&v.parentKey!==u});c&&h.push(r),this.focusedItemInfo={index:i,level:d,parentKey:s},c&&(this.dirty=!0),a&&x(this.menubar),!(n==="hover"&&this.queryMatches)&&(this.activeItemPath=h)}},onItemClick:function(e){var n=e.originalEvent,r=e.processedItem,a=this.isProccessedItemGroup(r),i=A(r.parent),u=this.isSelected(r);if(u){var d=r.index,s=r.key,o=r.level,c=r.parentKey;this.activeItemPath=this.activeItemPath.filter(function(v){return s!==v.key&&s.startsWith(v.key)}),this.focusedItemInfo={index:d,level:o,parentKey:c},this.dirty=!i,x(this.menubar)}else if(a)this.onItemChange(e);else{var h=i?r:this.activeItemPath.find(function(v){return v.parentKey===""});this.hide(n),this.changeFocusedItemIndex(n,h?h.index:-1),this.mobileActive=!1,x(this.menubar)}},onItemMouseEnter:function(e){this.dirty&&this.onItemChange(e,"hover")},onItemMouseMove:function(e){this.focused&&this.changeFocusedItemIndex(e,e.processedItem.index)},menuButtonClick:function(e){this.toggle(e)},menuButtonKeydown:function(e){(e.code==="Enter"||e.code==="NumpadEnter"||e.code==="Space")&&this.menuButtonClick(e)},onArrowDownKey:function(e){var n=this.visibleItems[this.focusedItemInfo.index],r=n?A(n.parent):null;if(r){var a=this.isProccessedItemGroup(n);a&&(this.onItemChange({originalEvent:e,processedItem:n}),this.focusedItemInfo={index:-1,parentKey:n.key},this.onArrowRightKey(e))}else{var i=this.focusedItemInfo.index!==-1?this.findNextItemIndex(this.focusedItemInfo.index):this.findFirstFocusedItemIndex();this.changeFocusedItemIndex(e,i)}e.preventDefault()},onArrowUpKey:function(e){var n=this,r=this.visibleItems[this.focusedItemInfo.index],a=A(r.parent);if(a){var i=this.isProccessedItemGroup(r);if(i){this.onItemChange({originalEvent:e,processedItem:r}),this.focusedItemInfo={index:-1,parentKey:r.key};var u=this.findLastItemIndex();this.changeFocusedItemIndex(e,u)}}else{var d=this.activeItemPath.find(function(o){return o.key===r.parentKey});if(this.focusedItemInfo.index===0)this.focusedItemInfo={index:-1,parentKey:d?d.parentKey:""},this.searchValue="",this.onArrowLeftKey(e),this.activeItemPath=this.activeItemPath.filter(function(o){return o.parentKey!==n.focusedItemInfo.parentKey});else{var s=this.focusedItemInfo.index!==-1?this.findPrevItemIndex(this.focusedItemInfo.index):this.findLastFocusedItemIndex();this.changeFocusedItemIndex(e,s)}}e.preventDefault()},onArrowLeftKey:function(e){var n=this,r=this.visibleItems[this.focusedItemInfo.index],a=r?this.activeItemPath.find(function(u){return u.key===r.parentKey}):null;if(a)this.onItemChange({originalEvent:e,processedItem:a}),this.activeItemPath=this.activeItemPath.filter(function(u){return u.parentKey!==n.focusedItemInfo.parentKey}),e.preventDefault();else{var i=this.focusedItemInfo.index!==-1?this.findPrevItemIndex(this.focusedItemInfo.index):this.findLastFocusedItemIndex();this.changeFocusedItemIndex(e,i),e.preventDefault()}},onArrowRightKey:function(e){var n=this.visibleItems[this.focusedItemInfo.index],r=n?this.activeItemPath.find(function(u){return u.key===n.parentKey}):null;if(r){var a=this.isProccessedItemGroup(n);a&&(this.onItemChange({originalEvent:e,processedItem:n}),this.focusedItemInfo={index:-1,parentKey:n.key},this.onArrowDownKey(e))}else{var i=this.focusedItemInfo.index!==-1?this.findNextItemIndex(this.focusedItemInfo.index):this.findFirstFocusedItemIndex();this.changeFocusedItemIndex(e,i),e.preventDefault()}},onHomeKey:function(e){this.changeFocusedItemIndex(e,this.findFirstItemIndex()),e.preventDefault()},onEndKey:function(e){this.changeFocusedItemIndex(e,this.findLastItemIndex()),e.preventDefault()},onEnterKey:function(e){if(this.focusedItemInfo.index!==-1){var n=L(this.menubar,'li[id="'.concat("".concat(this.focusedItemId),'"]')),r=n&&L(n,'a[data-pc-section="itemlink"]');r?r.click():n&&n.click();var a=this.visibleItems[this.focusedItemInfo.index],i=this.isProccessedItemGroup(a);!i&&(this.focusedItemInfo.index=this.findFirstFocusedItemIndex())}e.preventDefault()},onSpaceKey:function(e){this.onEnterKey(e)},onEscapeKey:function(e){if(this.focusedItemInfo.level!==0){var n=this.focusedItemInfo;this.hide(e,!1),this.focusedItemInfo={index:Number(n.parentKey.split("_")[0]),level:0,parentKey:""}}e.preventDefault()},onTabKey:function(e){if(this.focusedItemInfo.index!==-1){var n=this.visibleItems[this.focusedItemInfo.index],r=this.isProccessedItemGroup(n);!r&&this.onItemChange({originalEvent:e,processedItem:n})}this.hide()},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(n){var r=e.container&&!e.container.contains(n.target),a=!(e.target&&(e.target===n.target||e.target.contains(n.target)));r&&a&&e.hide()},document.addEventListener("click",this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&(document.removeEventListener("click",this.outsideClickListener,!0),this.outsideClickListener=null)},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(n){Y()||e.hide(n,!0),e.mobileActive=!1},window.addEventListener("resize",this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)},bindMatchMediaListener:function(){var e=this;if(!this.matchMediaListener){var n=matchMedia("(max-width: ".concat(this.breakpoint,")"));this.query=n,this.queryMatches=n.matches,this.matchMediaListener=function(){e.queryMatches=n.matches,e.mobileActive=!1},this.query.addEventListener("change",this.matchMediaListener)}},unbindMatchMediaListener:function(){this.matchMediaListener&&(this.query.removeEventListener("change",this.matchMediaListener),this.matchMediaListener=null)},isItemMatched:function(e){var n;return this.isValidItem(e)&&((n=this.getProccessedItemLabel(e))===null||n===void 0?void 0:n.toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase()))},isValidItem:function(e){return!!e&&!this.isItemDisabled(e.item)&&!this.isItemSeparator(e.item)&&this.isItemVisible(e.item)},isValidSelectedItem:function(e){return this.isValidItem(e)&&this.isSelected(e)},isSelected:function(e){return this.activeItemPath.some(function(n){return n.key===e.key})},findFirstItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidItem(n)})},findLastItemIndex:function(){var e=this;return _(this.visibleItems,function(n){return e.isValidItem(n)})},findNextItemIndex:function(e){var n=this,r=e<this.visibleItems.length-1?this.visibleItems.slice(e+1).findIndex(function(a){return n.isValidItem(a)}):-1;return r>-1?r+e+1:e},findPrevItemIndex:function(e){var n=this,r=e>0?_(this.visibleItems.slice(0,e),function(a){return n.isValidItem(a)}):-1;return r>-1?r:e},findSelectedItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidSelectedItem(n)})},findFirstFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findFirstItemIndex():e},findLastFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findLastItemIndex():e},searchItems:function(e,n){var r=this;this.searchValue=(this.searchValue||"")+n;var a=-1,i=!1;return this.focusedItemInfo.index!==-1?(a=this.visibleItems.slice(this.focusedItemInfo.index).findIndex(function(u){return r.isItemMatched(u)}),a=a===-1?this.visibleItems.slice(0,this.focusedItemInfo.index).findIndex(function(u){return r.isItemMatched(u)}):a+this.focusedItemInfo.index):a=this.visibleItems.findIndex(function(u){return r.isItemMatched(u)}),a!==-1&&(i=!0),a===-1&&this.focusedItemInfo.index===-1&&(a=this.findFirstFocusedItemIndex()),a!==-1&&this.changeFocusedItemIndex(e,a),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(function(){r.searchValue="",r.searchTimeout=null},500),i},changeFocusedItemIndex:function(e,n){this.focusedItemInfo.index!==n&&(this.focusedItemInfo.index=n,this.scrollInView())},scrollInView:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:-1,n=e!==-1?"".concat(this.$id,"_").concat(e):this.focusedItemId,r=L(this.menubar,'li[id="'.concat(n,'"]'));r&&r.scrollIntoView&&r.scrollIntoView({block:"nearest",inline:"start"})},createProcessedItems:function(e){var n=this,r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"",u=[];return e&&e.forEach(function(d,s){var o=(i!==""?i+"_":"")+s,c={item:d,index:s,level:r,key:o,parent:a,parentKey:i};c.items=n.createProcessedItems(d.items,r+1,c,o),u.push(c)}),u},containerRef:function(e){this.container=e},menubarRef:function(e){this.menubar=e?e.$el:void 0}},computed:{processedItems:function(){return this.createProcessedItems(this.model||[])},visibleItems:function(){var e=this,n=this.activeItemPath.find(function(r){return r.key===e.focusedItemInfo.parentKey});return n?n.items:this.processedItems},focusedItemId:function(){return this.focusedItemInfo.index!==-1?"".concat(this.$id).concat(I(this.focusedItemInfo.parentKey)?"_"+this.focusedItemInfo.parentKey:"","_").concat(this.focusedItemInfo.index):null}},components:{MenubarSub:Te,BarsIcon:Pe}};function W(t){"@babel/helpers - typeof";return W=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},W(t)}function fe(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable})),n.push.apply(n,r)}return n}function he(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?fe(Object(n),!0).forEach(function(r){In(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):fe(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function In(t,e,n){return(e=gn(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function gn(t){var e=vn(t,"string");return W(e)=="symbol"?e:e+""}function vn(t,e){if(W(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var r=n.call(t,e);if(W(r)!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var yn=["aria-haspopup","aria-expanded","aria-controls","aria-label"];function kn(t,e,n,r,a,i){var u=S("BarsIcon"),d=S("MenubarSub");return m(),f("div",l({ref:i.containerRef,class:t.cx("root")},t.ptmi("root")),[t.$slots.start?(m(),f("div",l({key:0,class:t.cx("start")},t.ptm("start")),[M(t.$slots,"start")],16)):b("",!0),M(t.$slots,t.$slots.button?"button":"menubutton",{id:t.$id,class:O(t.cx("button")),toggleCallback:function(o){return i.menuButtonClick(o)}},function(){var s;return[t.model&&t.model.length>0?(m(),f("a",l({key:0,ref:"menubutton",role:"button",tabindex:"0",class:t.cx("button"),"aria-haspopup":!!(t.model.length&&t.model.length>0),"aria-expanded":a.mobileActive,"aria-controls":t.$id,"aria-label":(s=t.$primevue.config.locale.aria)===null||s===void 0?void 0:s.navigation,onClick:e[0]||(e[0]=function(o){return i.menuButtonClick(o)}),onKeydown:e[1]||(e[1]=function(o){return i.menuButtonKeydown(o)})},he(he({},t.buttonProps),t.ptm("button"))),[M(t.$slots,t.$slots.buttonicon?"buttonicon":"menubuttonicon",{},function(){return[k(u,ge(ve(t.ptm("buttonicon"))),null,16)]})],16,yn)):b("",!0)]}),k(d,{ref:i.menubarRef,id:t.$id+"_list",role:"menubar",items:i.processedItems,templates:t.$slots,root:!0,mobileActive:a.mobileActive,tabindex:"0","aria-activedescendant":a.focused?i.focusedItemId:void 0,menuId:t.$id,focusedItemId:a.focused?i.focusedItemId:void 0,activeItemPath:a.activeItemPath,level:0,"aria-labelledby":t.ariaLabelledby,"aria-label":t.ariaLabel,pt:t.pt,unstyled:t.unstyled,onFocus:i.onFocus,onBlur:i.onBlur,onKeydown:i.onKeyDown,onItemClick:i.onItemClick,onItemMouseenter:i.onItemMouseEnter,onItemMousemove:i.onItemMouseMove},null,8,["id","items","templates","mobileActive","aria-activedescendant","menuId","focusedItemId","activeItemPath","aria-labelledby","aria-label","pt","unstyled","onFocus","onBlur","onKeydown","onItemClick","onItemMouseenter","onItemMousemove"]),t.$slots.end?(m(),f("div",l({key:1,class:t.cx("end")},t.ptm("end")),[M(t.$slots,"end")],16)):b("",!0)],16)}De.render=kn;var xn=`
    .p-panelmenu {
        display: flex;
        flex-direction: column;
        gap: dt('panelmenu.gap');
    }

    .p-panelmenu-panel {
        background: dt('panelmenu.panel.background');
        border-width: dt('panelmenu.panel.border.width');
        border-style: solid;
        border-color: dt('panelmenu.panel.border.color');
        color: dt('panelmenu.panel.color');
        border-radius: dt('panelmenu.panel.border.radius');
        padding: dt('panelmenu.panel.padding');
    }

    .p-panelmenu-panel:first-child {
        border-width: dt('panelmenu.panel.first.border.width');
        border-start-start-radius: dt('panelmenu.panel.first.top.border.radius');
        border-start-end-radius: dt('panelmenu.panel.first.top.border.radius');
    }

    .p-panelmenu-panel:last-child {
        border-width: dt('panelmenu.panel.last.border.width');
        border-end-start-radius: dt('panelmenu.panel.last.bottom.border.radius');
        border-end-end-radius: dt('panelmenu.panel.last.bottom.border.radius');
    }

    .p-panelmenu-header {
        outline: 0 none;
    }

    .p-panelmenu-header-content {
        border-radius: dt('panelmenu.item.border.radius');
        transition:
            background dt('panelmenu.transition.duration'),
            color dt('panelmenu.transition.duration'),
            outline-color dt('panelmenu.transition.duration'),
            box-shadow dt('panelmenu.transition.duration');
        outline-color: transparent;
        color: dt('panelmenu.item.color');
    }

    .p-panelmenu-header-link {
        display: flex;
        gap: dt('panelmenu.item.gap');
        padding: dt('panelmenu.item.padding');
        align-items: center;
        user-select: none;
        cursor: pointer;
        position: relative;
        text-decoration: none;
        color: inherit;
    }

    .p-panelmenu-header-icon,
    .p-panelmenu-item-icon {
        color: dt('panelmenu.item.icon.color');
    }

    .p-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.color');
    }

    .p-panelmenu-submenu-icon:dir(rtl) {
        transform: rotate(180deg);
    }

    .p-panelmenu-header:not(.p-disabled):focus-visible .p-panelmenu-header-content {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .p-panelmenu-header:not(.p-disabled):focus-visible .p-panelmenu-header-content .p-panelmenu-header-icon {
        color: dt('panelmenu.item.icon.focus.color');
    }

    .p-panelmenu-header:not(.p-disabled):focus-visible .p-panelmenu-header-content .p-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }

    .p-panelmenu-header:not(.p-disabled) .p-panelmenu-header-content:hover {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .p-panelmenu-header:not(.p-disabled) .p-panelmenu-header-content:hover .p-panelmenu-header-icon {
        color: dt('panelmenu.item.icon.focus.color');
    }

    .p-panelmenu-header:not(.p-disabled) .p-panelmenu-header-content:hover .p-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }

    .p-panelmenu-submenu {
        margin: 0;
        padding: 0 0 0 dt('panelmenu.submenu.indent');
        outline: 0;
        list-style: none;
    }

    .p-panelmenu-submenu:dir(rtl) {
        padding: 0 dt('panelmenu.submenu.indent') 0 0;
    }

    .p-panelmenu-item-link {
        display: flex;
        gap: dt('panelmenu.item.gap');
        padding: dt('panelmenu.item.padding');
        align-items: center;
        user-select: none;
        cursor: pointer;
        text-decoration: none;
        color: inherit;
        position: relative;
        overflow: hidden;
    }

    .p-panelmenu-item-label {
        line-height: 1;
    }

    .p-panelmenu-item-content {
        border-radius: dt('panelmenu.item.border.radius');
        transition:
            background dt('panelmenu.transition.duration'),
            color dt('panelmenu.transition.duration'),
            outline-color dt('panelmenu.transition.duration'),
            box-shadow dt('panelmenu.transition.duration');
        color: dt('panelmenu.item.color');
        outline-color: transparent;
    }

    .p-panelmenu-item.p-focus > .p-panelmenu-item-content {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .p-panelmenu-item.p-focus > .p-panelmenu-item-content .p-panelmenu-item-icon {
        color: dt('panelmenu.item.focus.color');
    }

    .p-panelmenu-item.p-focus > .p-panelmenu-item-content .p-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }

    .p-panelmenu-item:not(.p-disabled) > .p-panelmenu-item-content:hover {
        background: dt('panelmenu.item.focus.background');
        color: dt('panelmenu.item.focus.color');
    }

    .p-panelmenu-item:not(.p-disabled) > .p-panelmenu-item-content:hover .p-panelmenu-item-icon {
        color: dt('panelmenu.item.icon.focus.color');
    }

    .p-panelmenu-item:not(.p-disabled) > .p-panelmenu-item-content:hover .p-panelmenu-submenu-icon {
        color: dt('panelmenu.submenu.icon.focus.color');
    }
`,Ln={root:"p-panelmenu p-component",panel:"p-panelmenu-panel",header:function(e){var n=e.instance,r=e.item;return["p-panelmenu-header",{"p-panelmenu-header-active":n.isItemActive(r)&&!!r.items,"p-disabled":n.isItemDisabled(r)}]},headerContent:"p-panelmenu-header-content",headerLink:"p-panelmenu-header-link",headerIcon:"p-panelmenu-header-icon",headerLabel:"p-panelmenu-header-label",contentContainer:"p-panelmenu-content-container",content:"p-panelmenu-content",rootList:"p-panelmenu-root-list",item:function(e){var n=e.instance,r=e.processedItem;return["p-panelmenu-item",{"p-focus":n.isItemFocused(r),"p-disabled":n.isItemDisabled(r)}]},itemContent:"p-panelmenu-item-content",itemLink:"p-panelmenu-item-link",itemIcon:"p-panelmenu-item-icon",itemLabel:"p-panelmenu-item-label",submenuIcon:"p-panelmenu-submenu-icon",submenu:"p-panelmenu-submenu",separator:"p-menuitem-separator"},Pn=H.extend({name:"panelmenu",style:xn,classes:Ln}),wn={name:"BasePanelMenu",extends:C,props:{model:{type:Array,default:null},expandedKeys:{type:Object,default:null},multiple:{type:Boolean,default:!1},tabindex:{type:Number,default:0}},style:Pn,provide:function(){return{$pcPanelMenu:this,$parentInstance:this}}},Ve={name:"PanelMenuSub",hostName:"PanelMenu",extends:C,emits:["item-toggle","item-mousemove"],props:{panelId:{type:String,default:null},focusedItemId:{type:String,default:null},items:{type:Array,default:null},level:{type:Number,default:0},templates:{type:Object,default:null},activeItemPath:{type:Object,default:null},tabindex:{type:Number,default:-1}},methods:{getItemId:function(e){return"".concat(this.panelId,"_").concat(e.key)},getItemKey:function(e){return this.getItemId(e)},getItemProp:function(e,n,r){return e&&e.item?F(e.item[n],r):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},getPTOptions:function(e,n,r){return this.ptm(e,{context:{item:n.item,index:r,active:this.isItemActive(n),focused:this.isItemFocused(n),disabled:this.isItemDisabled(n)}})},isItemActive:function(e){return this.activeItemPath.some(function(n){return n.key===e.key})},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemFocused:function(e){return this.focusedItemId===this.getItemId(e)},isItemGroup:function(e){return I(e.items)},onItemClick:function(e,n){this.getItemProp(n,"command",{originalEvent:e,item:n.item}),this.$emit("item-toggle",{processedItem:n,expanded:!this.isItemActive(n)})},onItemToggle:function(e){this.$emit("item-toggle",e)},onItemMouseMove:function(e,n){this.$emit("item-mousemove",{originalEvent:e,processedItem:n})},getAriaSetSize:function(){var e=this;return this.items.filter(function(n){return e.isItemVisible(n)&&!e.getItemProp(n,"separator")}).length},getAriaPosInset:function(e){var n=this;return e-this.items.slice(0,e).filter(function(r){return n.isItemVisible(r)&&n.getItemProp(r,"separator")}).length+1},getMenuItemProps:function(e,n){return{action:l({class:this.cx("itemLink"),tabindex:-1},this.getPTOptions("itemLink",e,n)),icon:l({class:[this.cx("itemIcon"),this.getItemProp(e,"icon")]},this.getPTOptions("itemIcon",e,n)),label:l({class:this.cx("itemLabel")},this.getPTOptions("itemLabel",e,n)),submenuicon:l({class:this.cx("submenuIcon")},this.getPTOptions("submenuicon",e,n))}}},components:{ChevronRightIcon:Le,ChevronDownIcon:xe},directives:{ripple:q}},Kn=["tabindex"],Mn=["id","aria-label","aria-expanded","aria-level","aria-setsize","aria-posinset","data-p-focused","data-p-disabled"],Sn=["onClick","onMousemove"],Cn=["href","target"];function An(t,e,n,r,a,i){var u=S("PanelMenuSub",!0),d=U("ripple");return m(),f("ul",{class:O(t.cx("submenu")),tabindex:n.tabindex},[(m(!0),f(P,null,D(n.items,function(s,o){return m(),f(P,{key:i.getItemKey(s)},[i.isItemVisible(s)&&!i.getItemProp(s,"separator")?(m(),f("li",l({key:0,id:i.getItemId(s),class:[t.cx("item",{processedItem:s}),i.getItemProp(s,"class")],style:i.getItemProp(s,"style"),role:"treeitem","aria-label":i.getItemLabel(s),"aria-expanded":i.isItemGroup(s)?i.isItemActive(s):void 0,"aria-level":n.level+1,"aria-setsize":i.getAriaSetSize(),"aria-posinset":i.getAriaPosInset(o)},{ref_for:!0},i.getPTOptions("item",s,o),{"data-p-focused":i.isItemFocused(s),"data-p-disabled":i.isItemDisabled(s)}),[p("div",l({class:t.cx("itemContent"),onClick:function(h){return i.onItemClick(h,s)},onMousemove:function(h){return i.onItemMouseMove(h,s)}},{ref_for:!0},i.getPTOptions("itemContent",s,o)),[n.templates.item?(m(),g(w(n.templates.item),{key:1,item:s.item,root:!1,active:i.isItemActive(s),hasSubmenu:i.isItemGroup(s),label:i.getItemLabel(s),props:i.getMenuItemProps(s,o)},null,8,["item","active","hasSubmenu","label","props"])):B((m(),f("a",l({key:0,href:i.getItemProp(s,"url"),class:t.cx("itemLink"),target:i.getItemProp(s,"target"),tabindex:"-1"},{ref_for:!0},i.getPTOptions("itemLink",s,o)),[i.isItemGroup(s)?(m(),f(P,{key:0},[n.templates.submenuicon?(m(),g(w(n.templates.submenuicon),l({key:0,class:t.cx("submenuIcon"),active:i.isItemActive(s)},{ref_for:!0},i.getPTOptions("submenuIcon",s,o)),null,16,["class","active"])):(m(),g(w(i.isItemActive(s)?"ChevronDownIcon":"ChevronRightIcon"),l({key:1,class:t.cx("submenuIcon")},{ref_for:!0},i.getPTOptions("submenuIcon",s,o)),null,16,["class"]))],64)):b("",!0),n.templates.itemicon?(m(),g(w(n.templates.itemicon),{key:1,item:s.item,class:O(t.cx("itemIcon"))},null,8,["item","class"])):i.getItemProp(s,"icon")?(m(),f("span",l({key:2,class:[t.cx("itemIcon"),i.getItemProp(s,"icon")]},{ref_for:!0},i.getPTOptions("itemIcon",s,o)),null,16)):b("",!0),p("span",l({class:t.cx("itemLabel")},{ref_for:!0},i.getPTOptions("itemLabel",s,o)),V(i.getItemLabel(s)),17)],16,Cn)),[[d]])],16,Sn),k(N,l({name:"p-toggleable-content"},{ref_for:!0},t.ptm("transition")),{default:K(function(){return[B(p("div",l({class:t.cx("contentContainer")},{ref_for:!0},t.ptm("contentContainer")),[i.isItemVisible(s)&&i.isItemGroup(s)?(m(),g(u,l({key:0,id:i.getItemId(s)+"_list",role:"group",panelId:n.panelId,focusedItemId:n.focusedItemId,items:s.items,level:n.level+1,templates:n.templates,activeItemPath:n.activeItemPath,onItemToggle:i.onItemToggle,onItemMousemove:e[0]||(e[0]=function(c){return t.$emit("item-mousemove",c)}),pt:t.pt,unstyled:t.unstyled},{ref_for:!0},t.ptm("submenu")),null,16,["id","panelId","focusedItemId","items","level","templates","activeItemPath","onItemToggle","pt","unstyled"])):b("",!0)],16),[[ke,i.isItemActive(s)]])]}),_:2},1040)],16,Mn)):b("",!0),i.isItemVisible(s)&&i.getItemProp(s,"separator")?(m(),f("li",l({key:1,style:i.getItemProp(s,"style"),class:[t.cx("separator"),i.getItemProp(s,"class")],role:"separator"},{ref_for:!0},t.ptm("separator")),null,16)):b("",!0)],64)}),128))],10,Kn)}Ve.render=An;function En(t,e){return Dn(t)||Tn(t,e)||Fn(t,e)||On()}function On(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Fn(t,e){if(t){if(typeof t=="string")return pe(t,e);var n={}.toString.call(t).slice(8,-1);return n==="Object"&&t.constructor&&(n=t.constructor.name),n==="Map"||n==="Set"?Array.from(t):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?pe(t,e):void 0}}function pe(t,e){(e==null||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function Tn(t,e){var n=t==null?null:typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"];if(n!=null){var r,a,i,u,d=[],s=!0,o=!1;try{if(i=(n=n.call(t)).next,e!==0)for(;!(s=(r=i.call(n)).done)&&(d.push(r.value),d.length!==e);s=!0);}catch(c){o=!0,a=c}finally{try{if(!s&&n.return!=null&&(u=n.return(),Object(u)!==u))return}finally{if(o)throw a}}return d}}function Dn(t){if(Array.isArray(t))return t}var ze={name:"PanelMenuList",hostName:"PanelMenu",extends:C,emits:["item-toggle","header-focus"],props:{panelId:{type:String,default:null},items:{type:Array,default:null},templates:{type:Object,default:null},expandedKeys:{type:Object,default:null}},searchTimeout:null,searchValue:null,data:function(){return{focused:!1,focusedItem:null,activeItemPath:[]}},watch:{expandedKeys:function(e){this.autoUpdateActiveItemPath(e)}},created:function(){this.autoUpdateActiveItemPath(this.expandedKeys)},methods:{getItemProp:function(e,n){return e&&e.item?F(e.item[n]):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemActive:function(e){return this.activeItemPath.some(function(n){return n.key===e.parentKey})},isItemGroup:function(e){return I(e.items)},onFocus:function(e){this.focused=!0,this.focusedItem=this.focusedItem||(this.isElementInPanel(e,e.relatedTarget)?this.findFirstItem():this.findLastItem())},onBlur:function(){this.focused=!1,this.focusedItem=null,this.searchValue=""},onKeyDown:function(e){var n=e.metaKey||e.ctrlKey;switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"Space":this.onSpaceKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":case"Tab":case"PageDown":case"PageUp":case"Backspace":case"ShiftLeft":case"ShiftRight":break;default:!n&&X(e.key)&&this.searchItems(e,e.key);break}},onArrowDownKey:function(e){var n=I(this.focusedItem)?this.findNextItem(this.focusedItem):this.findFirstItem();this.changeFocusedItem({originalEvent:e,processedItem:n,focusOnNext:!0}),e.preventDefault()},onArrowUpKey:function(e){var n=I(this.focusedItem)?this.findPrevItem(this.focusedItem):this.findLastItem();this.changeFocusedItem({originalEvent:e,processedItem:n,selfCheck:!0}),e.preventDefault()},onArrowLeftKey:function(e){var n=this;if(I(this.focusedItem)){var r=this.activeItemPath.some(function(a){return a.key===n.focusedItem.key});r?this.activeItemPath=this.activeItemPath.filter(function(a){return a.key!==n.focusedItem.key}):this.focusedItem=I(this.focusedItem.parent)?this.focusedItem.parent:this.focusedItem,e.preventDefault()}},onArrowRightKey:function(e){var n=this;if(I(this.focusedItem)){var r=this.isItemGroup(this.focusedItem);if(r){var a=this.activeItemPath.some(function(i){return i.key===n.focusedItem.key});a?this.onArrowDownKey(e):(this.activeItemPath=this.activeItemPath.filter(function(i){return i.parentKey!==n.focusedItem.parentKey}),this.activeItemPath.push(this.focusedItem))}e.preventDefault()}},onHomeKey:function(e){this.changeFocusedItem({originalEvent:e,processedItem:this.findFirstItem(),allowHeaderFocus:!1}),e.preventDefault()},onEndKey:function(e){this.changeFocusedItem({originalEvent:e,processedItem:this.findLastItem(),focusOnNext:!0,allowHeaderFocus:!1}),e.preventDefault()},onEnterKey:function(e){if(I(this.focusedItem)){var n=L(this.$el,'li[id="'.concat("".concat(this.focusedItemId),'"]')),r=n&&(L(n,'[data-pc-section="itemlink"]')||L(n,"a,button"));r?r.click():n&&n.click()}e.preventDefault()},onSpaceKey:function(e){this.onEnterKey(e)},onItemToggle:function(e){var n=e.processedItem,r=e.expanded;this.expandedKeys?this.$emit("item-toggle",{item:n.item,expanded:r}):(this.activeItemPath=this.activeItemPath.filter(function(a){return a.parentKey!==n.parentKey}),r&&this.activeItemPath.push(n)),this.focusedItem=n,x(this.$el)},onItemMouseMove:function(e){this.focused&&(this.focusedItem=e.processedItem)},isElementInPanel:function(e,n){var r=e.currentTarget.closest('[data-pc-section="panel"]');return r&&r.contains(n)},isItemMatched:function(e){var n;return this.isValidItem(e)&&((n=this.getItemLabel(e))===null||n===void 0?void 0:n.toLocaleLowerCase(this.searchLocale).startsWith(this.searchValue.toLocaleLowerCase(this.searchLocale)))},isVisibleItem:function(e){return!!e&&(e.level===0||this.isItemActive(e))&&this.isItemVisible(e)},isValidItem:function(e){return!!e&&!this.isItemDisabled(e)&&!this.getItemProp(e,"separator")},findFirstItem:function(){var e=this;return this.visibleItems.find(function(n){return e.isValidItem(n)})},findLastItem:function(){var e=this;return de(this.visibleItems,function(n){return e.isValidItem(n)})},findNextItem:function(e){var n=this,r=this.visibleItems.findIndex(function(i){return i.key===e.key}),a=r<this.visibleItems.length-1?this.visibleItems.slice(r+1).find(function(i){return n.isValidItem(i)}):void 0;return a||e},findPrevItem:function(e){var n=this,r=this.visibleItems.findIndex(function(i){return i.key===e.key}),a=r>0?de(this.visibleItems.slice(0,r),function(i){return n.isValidItem(i)}):void 0;return a||e},searchItems:function(e,n){var r=this;this.searchValue=(this.searchValue||"")+n;var a=null,i=!1;if(I(this.focusedItem)){var u=this.visibleItems.findIndex(function(d){return d.key===r.focusedItem.key});a=this.visibleItems.slice(u).find(function(d){return r.isItemMatched(d)}),a=A(a)?this.visibleItems.slice(0,u).find(function(d){return r.isItemMatched(d)}):a}else a=this.visibleItems.find(function(d){return r.isItemMatched(d)});return I(a)&&(i=!0),A(a)&&A(this.focusedItem)&&(a=this.findFirstItem()),I(a)&&this.changeFocusedItem({originalEvent:e,processedItem:a,allowHeaderFocus:!1}),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(function(){r.searchValue="",r.searchTimeout=null},500),i},changeFocusedItem:function(e){var n=e.originalEvent,r=e.processedItem,a=e.focusOnNext,i=e.selfCheck,u=e.allowHeaderFocus,d=u===void 0?!0:u;I(this.focusedItem)&&this.focusedItem.key!==r.key?(this.focusedItem=r,this.scrollInView()):d&&this.$emit("header-focus",{originalEvent:n,focusOnNext:a,selfCheck:i})},scrollInView:function(){var e=L(this.$el,'li[id="'.concat("".concat(this.focusedItemId),'"]'));e&&e.scrollIntoView&&e.scrollIntoView({block:"nearest",inline:"start"})},autoUpdateActiveItemPath:function(e){var n=this;this.activeItemPath=Object.entries(e||{}).reduce(function(r,a){var i=En(a,2),u=i[0],d=i[1];if(d){var s=n.findProcessedItemByItemKey(u);s&&r.push(s)}return r},[])},findProcessedItemByItemKey:function(e,n){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0;if(n=n||r===0&&this.processedItems,!n)return null;for(var a=0;a<n.length;a++){var i=n[a];if(this.getItemProp(i,"key")===e)return i;var u=this.findProcessedItemByItemKey(e,i.items,r+1);if(u)return u}},createProcessedItems:function(e){var n=this,r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"",u=[];return e&&e.forEach(function(d,s){var o=(i!==""?i+"_":"")+s,c={item:d,index:s,level:r,key:o,parent:a,parentKey:i};c.items=n.createProcessedItems(d.items,r+1,c,o),u.push(c)}),u},flatItems:function(e){var n=this,r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];return e&&e.forEach(function(a){n.isVisibleItem(a)&&(r.push(a),n.flatItems(a.items,r))}),r}},computed:{processedItems:function(){return this.createProcessedItems(this.items||[])},visibleItems:function(){return this.flatItems(this.processedItems)},focusedItemId:function(){return I(this.focusedItem)?"".concat(this.panelId,"_").concat(this.focusedItem.key):null}},components:{PanelMenuSub:Ve}};function Vn(t,e,n,r,a,i){var u=S("PanelMenuSub");return m(),g(u,l({id:n.panelId+"_list",class:t.cx("rootList"),role:"tree",tabindex:-1,"aria-activedescendant":a.focused?i.focusedItemId:void 0,panelId:n.panelId,focusedItemId:a.focused?i.focusedItemId:void 0,items:i.processedItems,templates:n.templates,activeItemPath:a.activeItemPath,onFocus:i.onFocus,onBlur:i.onBlur,onKeydown:i.onKeyDown,onItemToggle:i.onItemToggle,onItemMousemove:i.onItemMouseMove,pt:t.pt,unstyled:t.unstyled},t.ptm("rootList")),null,16,["id","class","aria-activedescendant","panelId","focusedItemId","items","templates","activeItemPath","onFocus","onBlur","onKeydown","onItemToggle","onItemMousemove","pt","unstyled"])}ze.render=Vn;function Z(t){"@babel/helpers - typeof";return Z=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Z(t)}function be(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable})),n.push.apply(n,r)}return n}function zn(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?be(Object(n),!0).forEach(function(r){Hn(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):be(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}function Hn(t,e,n){return(e=Rn(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Rn(t){var e=Bn(t,"string");return Z(e)=="symbol"?e:e+""}function Bn(t,e){if(Z(t)!="object"||!t)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var r=n.call(t,e);if(Z(r)!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}var He={name:"PanelMenu",extends:wn,inheritAttrs:!1,emits:["update:expandedKeys","panel-open","panel-close"],data:function(){return{activeItem:null,activeItems:[]}},methods:{getItemProp:function(e,n){return e?F(e[n]):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},getPTOptions:function(e,n,r){return this.ptm(e,{context:{index:r,active:this.isItemActive(n),focused:this.isItemFocused(n),disabled:this.isItemDisabled(n)}})},isItemActive:function(e){return this.expandedKeys?this.expandedKeys[this.getItemProp(e,"key")]:this.multiple?this.activeItems.some(function(n){return G(e,n)}):G(e,this.activeItem)},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemFocused:function(e){return G(e,this.activeItem)},isItemGroup:function(e){return I(e.items)},getPanelId:function(e){return"".concat(this.$id,"_").concat(e)},getPanelKey:function(e){return this.getPanelId(e)},getHeaderId:function(e){return"".concat(this.getPanelId(e),"_header")},getContentId:function(e){return"".concat(this.getPanelId(e),"_content")},onHeaderClick:function(e,n){if(this.isItemDisabled(n)){e.preventDefault();return}n.command&&n.command({originalEvent:e,item:n}),this.changeActiveItem(e,n),x(e.currentTarget)},onHeaderKeyDown:function(e,n){switch(e.code){case"ArrowDown":this.onHeaderArrowDownKey(e);break;case"ArrowUp":this.onHeaderArrowUpKey(e);break;case"Home":this.onHeaderHomeKey(e);break;case"End":this.onHeaderEndKey(e);break;case"Enter":case"NumpadEnter":case"Space":this.onHeaderEnterKey(e,n);break}},onHeaderArrowDownKey:function(e){var n=J(e.currentTarget,"data-p-active")===!0?L(e.currentTarget.nextElementSibling,'[data-pc-section="rootlist"]'):null;n?x(n):this.updateFocusedHeader({originalEvent:e,focusOnNext:!0}),e.preventDefault()},onHeaderArrowUpKey:function(e){var n=this.findPrevHeader(e.currentTarget.parentElement)||this.findLastHeader(),r=J(n,"data-p-active")===!0?L(n.nextElementSibling,'[data-pc-section="rootlist"]'):null;r?x(r):this.updateFocusedHeader({originalEvent:e,focusOnNext:!1}),e.preventDefault()},onHeaderHomeKey:function(e){this.changeFocusedHeader(e,this.findFirstHeader()),e.preventDefault()},onHeaderEndKey:function(e){this.changeFocusedHeader(e,this.findLastHeader()),e.preventDefault()},onHeaderEnterKey:function(e,n){var r=L(e.currentTarget,'[data-pc-section="headerlink"]');r?r.click():this.onHeaderClick(e,n),e.preventDefault()},findNextHeader:function(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,r=n?e:e.nextElementSibling,a=L(r,'[data-pc-section="header"]');return a?J(a,"data-p-disabled")?this.findNextHeader(a.parentElement):a:null},findPrevHeader:function(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,r=n?e:e.previousElementSibling,a=L(r,'[data-pc-section="header"]');return a?J(a,"data-p-disabled")?this.findPrevHeader(a.parentElement):a:null},findFirstHeader:function(){return this.findNextHeader(this.$el.firstElementChild,!0)},findLastHeader:function(){return this.findPrevHeader(this.$el.lastElementChild,!0)},updateFocusedHeader:function(e){var n=e.originalEvent,r=e.focusOnNext,a=e.selfCheck,i=n.currentTarget.closest('[data-pc-section="panel"]'),u=a?L(i,'[data-pc-section="header"]'):r?this.findNextHeader(i):this.findPrevHeader(i);u?this.changeFocusedHeader(n,u):r?this.onHeaderHomeKey(n):this.onHeaderEndKey(n)},changeActiveItem:function(e,n){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1;if(!this.isItemDisabled(n)){var a=this.isItemActive(n),i=a?"panel-close":"panel-open";this.activeItem=r?n:this.activeItem&&G(n,this.activeItem)?null:n,this.multiple&&(this.activeItems.some(function(u){return G(n,u)})?this.activeItems=this.activeItems.filter(function(u){return!G(n,u)}):this.activeItems.push(n)),this.changeExpandedKeys({item:n,expanded:!a}),this.$emit(i,{originalEvent:e,item:n})}},changeExpandedKeys:function(e){var n=e.item,r=e.expanded,a=r===void 0?!1:r;if(this.expandedKeys){var i=zn({},this.expandedKeys);a?i[n.key]=!0:delete i[n.key],this.$emit("update:expandedKeys",i)}},changeFocusedHeader:function(e,n){n&&x(n)},getMenuItemProps:function(e,n){return{icon:l({class:[this.cx("headerIcon"),this.getItemProp(e,"icon")]},this.getPTOptions("headerIcon",e,n)),label:l({class:this.cx("headerLabel")},this.getPTOptions("headerLabel",e,n))}}},components:{PanelMenuList:ze,ChevronRightIcon:Le,ChevronDownIcon:xe}},_n=["id"],Nn=["id","tabindex","aria-label","aria-expanded","aria-controls","aria-disabled","onClick","onKeydown","data-p-active","data-p-disabled"],Gn=["href"],jn=["id","aria-labelledby"];function Un(t,e,n,r,a,i){var u=S("PanelMenuList");return m(),f("div",l({id:t.$id,class:t.cx("root")},t.ptmi("root")),[(m(!0),f(P,null,D(t.model,function(d,s){return m(),f(P,{key:i.getPanelKey(s)},[i.isItemVisible(d)?(m(),f("div",l({key:0,style:i.getItemProp(d,"style"),class:[t.cx("panel"),i.getItemProp(d,"class")]},{ref_for:!0},t.ptm("panel")),[p("div",l({id:i.getHeaderId(s),class:[t.cx("header",{item:d}),i.getItemProp(d,"headerClass")],tabindex:i.isItemDisabled(d)?-1:t.tabindex,role:"button","aria-label":i.getItemLabel(d),"aria-expanded":i.isItemActive(d),"aria-controls":i.getContentId(s),"aria-disabled":i.isItemDisabled(d),onClick:function(c){return i.onHeaderClick(c,d)},onKeydown:function(c){return i.onHeaderKeyDown(c,d)}},{ref_for:!0},i.getPTOptions("header",d,s),{"data-p-active":i.isItemActive(d),"data-p-disabled":i.isItemDisabled(d)}),[p("div",l({class:t.cx("headerContent")},{ref_for:!0},i.getPTOptions("headerContent",d,s)),[t.$slots.item?(m(),g(w(t.$slots.item),{key:1,item:d,root:!0,active:i.isItemActive(d),hasSubmenu:i.isItemGroup(d),label:i.getItemLabel(d),props:i.getMenuItemProps(d,s)},null,8,["item","active","hasSubmenu","label","props"])):(m(),f("a",l({key:0,href:i.getItemProp(d,"url"),class:t.cx("headerLink"),tabindex:-1},{ref_for:!0},i.getPTOptions("headerLink",d,s)),[i.getItemProp(d,"items")?M(t.$slots,"submenuicon",{key:0,active:i.isItemActive(d)},function(){return[(m(),g(w(i.isItemActive(d)?"ChevronDownIcon":"ChevronRightIcon"),l({class:t.cx("submenuIcon")},{ref_for:!0},i.getPTOptions("submenuIcon",d,s)),null,16,["class"]))]}):b("",!0),t.$slots.headericon?(m(),g(w(t.$slots.headericon),{key:1,item:d,class:O([t.cx("headerIcon"),i.getItemProp(d,"icon")])},null,8,["item","class"])):i.getItemProp(d,"icon")?(m(),f("span",l({key:2,class:[t.cx("headerIcon"),i.getItemProp(d,"icon")]},{ref_for:!0},i.getPTOptions("headerIcon",d,s)),null,16)):b("",!0),p("span",l({class:t.cx("headerLabel")},{ref_for:!0},i.getPTOptions("headerLabel",d,s)),V(i.getItemLabel(d)),17)],16,Gn))],16)],16,Nn),k(N,l({name:"p-toggleable-content"},{ref_for:!0},t.ptm("transition")),{default:K(function(){return[B(p("div",l({id:i.getContentId(s),class:t.cx("contentContainer"),role:"region","aria-labelledby":i.getHeaderId(s)},{ref_for:!0},t.ptm("contentContainer")),[i.getItemProp(d,"items")?(m(),f("div",l({key:0,class:t.cx("content")},{ref_for:!0},t.ptm("content")),[k(u,{panelId:i.getPanelId(s),items:i.getItemProp(d,"items"),templates:t.$slots,expandedKeys:t.expandedKeys,onItemToggle:i.changeExpandedKeys,onHeaderFocus:i.updateFocusedHeader,pt:t.pt,unstyled:t.unstyled},null,8,["panelId","items","templates","expandedKeys","onItemToggle","onHeaderFocus","pt","unstyled"])],16)):b("",!0)],16,jn),[[ke,i.isItemActive(d)]])]}),_:2},1040)],16)):b("",!0)],64)}),128))],16,_n)}He.render=Un;var qn=`
    .p-tieredmenu {
        background: dt('tieredmenu.background');
        color: dt('tieredmenu.color');
        border: 1px solid dt('tieredmenu.border.color');
        border-radius: dt('tieredmenu.border.radius');
        min-width: 12.5rem;
    }

    .p-tieredmenu-root-list,
    .p-tieredmenu-submenu {
        margin: 0;
        padding: dt('tieredmenu.list.padding');
        list-style: none;
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('tieredmenu.list.gap');
    }

    .p-tieredmenu-submenu {
        position: absolute;
        min-width: 100%;
        z-index: 1;
        background: dt('tieredmenu.background');
        color: dt('tieredmenu.color');
        border: 1px solid dt('tieredmenu.border.color');
        border-radius: dt('tieredmenu.border.radius');
        box-shadow: dt('tieredmenu.shadow');
    }

    .p-tieredmenu-item {
        position: relative;
    }

    .p-tieredmenu-item-content {
        transition:
            background dt('tieredmenu.transition.duration'),
            color dt('tieredmenu.transition.duration');
        border-radius: dt('tieredmenu.item.border.radius');
        color: dt('tieredmenu.item.color');
    }

    .p-tieredmenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('tieredmenu.item.padding');
        gap: dt('tieredmenu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .p-tieredmenu-item-label {
        line-height: 1;
    }

    .p-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.color');
    }

    .p-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.color');
        margin-left: auto;
        font-size: dt('tieredmenu.submenu.icon.size');
        width: dt('tieredmenu.submenu.icon.size');
        height: dt('tieredmenu.submenu.icon.size');
    }

    .p-tieredmenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-tieredmenu-item.p-focus > .p-tieredmenu-item-content {
        color: dt('tieredmenu.item.focus.color');
        background: dt('tieredmenu.item.focus.background');
    }

    .p-tieredmenu-item.p-focus > .p-tieredmenu-item-content .p-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.focus.color');
    }

    .p-tieredmenu-item.p-focus > .p-tieredmenu-item-content .p-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.focus.color');
    }

    .p-tieredmenu-item:not(.p-disabled) > .p-tieredmenu-item-content:hover {
        color: dt('tieredmenu.item.focus.color');
        background: dt('tieredmenu.item.focus.background');
    }

    .p-tieredmenu-item:not(.p-disabled) > .p-tieredmenu-item-content:hover .p-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.focus.color');
    }

    .p-tieredmenu-item:not(.p-disabled) > .p-tieredmenu-item-content:hover .p-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.focus.color');
    }

    .p-tieredmenu-item-active > .p-tieredmenu-item-content {
        color: dt('tieredmenu.item.active.color');
        background: dt('tieredmenu.item.active.background');
    }

    .p-tieredmenu-item-active > .p-tieredmenu-item-content .p-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.active.color');
    }

    .p-tieredmenu-item-active > .p-tieredmenu-item-content .p-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.active.color');
    }

    .p-tieredmenu-separator {
        border-block-start: 1px solid dt('tieredmenu.separator.border.color');
    }

    .p-tieredmenu-overlay {
        box-shadow: dt('tieredmenu.shadow');
    }

    .p-tieredmenu-enter-from,
    .p-tieredmenu-leave-active {
        opacity: 0;
    }

    .p-tieredmenu-enter-active {
        transition: opacity 250ms;
    }

    .p-tieredmenu-mobile .p-tieredmenu-submenu {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .p-tieredmenu-mobile .p-tieredmenu-submenu:dir(rtl) {
        padding-inline-start: 0;
        padding-inline-end: dt('tieredmenu.submenu.mobile.indent');
    }

    .p-tieredmenu-mobile .p-tieredmenu-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .p-tieredmenu-mobile .p-tieredmenu-item-active > .p-tieredmenu-item-content .p-tieredmenu-submenu-icon {
        transform: rotate(-90deg);
    }
`,Wn={submenu:function(e){var n=e.instance,r=e.processedItem;return{display:n.isItemActive(r)?"flex":"none"}}},Zn={root:function(e){var n=e.props,r=e.instance;return["p-tieredmenu p-component",{"p-tieredmenu-overlay":n.popup,"p-tieredmenu-mobile":r.queryMatches}]},start:"p-tieredmenu-start",rootList:"p-tieredmenu-root-list",item:function(e){var n=e.instance,r=e.processedItem;return["p-tieredmenu-item",{"p-tieredmenu-item-active":n.isItemActive(r),"p-focus":n.isItemFocused(r),"p-disabled":n.isItemDisabled(r)}]},itemContent:"p-tieredmenu-item-content",itemLink:"p-tieredmenu-item-link",itemIcon:"p-tieredmenu-item-icon",itemLabel:"p-tieredmenu-item-label",submenuIcon:"p-tieredmenu-submenu-icon",submenu:"p-tieredmenu-submenu",separator:"p-tieredmenu-separator",end:"p-tieredmenu-end"},Yn=H.extend({name:"tieredmenu",style:qn,classes:Zn,inlineStyles:Wn}),Xn={name:"BaseTieredMenu",extends:C,props:{popup:{type:Boolean,default:!1},model:{type:Array,default:null},appendTo:{type:[String,Object],default:"body"},breakpoint:{type:String,default:"960px"},autoZIndex:{type:Boolean,default:!0},baseZIndex:{type:Number,default:0},disabled:{type:Boolean,default:!1},tabindex:{type:Number,default:0},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:Yn,provide:function(){return{$pcTieredMenu:this,$parentInstance:this}}},Re={name:"TieredMenuSub",hostName:"TieredMenu",extends:C,emits:["item-click","item-mouseenter","item-mousemove"],container:null,props:{menuId:{type:String,default:null},focusedItemId:{type:String,default:null},items:{type:Array,default:null},visible:{type:Boolean,default:!1},level:{type:Number,default:0},templates:{type:Object,default:null},activeItemPath:{type:Object,default:null},tabindex:{type:Number,default:0}},methods:{getItemId:function(e){return"".concat(this.menuId,"_").concat(e.key)},getItemKey:function(e){return this.getItemId(e)},getItemProp:function(e,n,r){return e&&e.item?F(e.item[n],r):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},getItemLabelId:function(e){return"".concat(this.menuId,"_").concat(e.key,"_label")},getPTOptions:function(e,n,r){return this.ptm(r,{context:{item:e.item,index:n,active:this.isItemActive(e),focused:this.isItemFocused(e),disabled:this.isItemDisabled(e)}})},isItemActive:function(e){return this.activeItemPath.some(function(n){return n.key===e.key})},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemFocused:function(e){return this.focusedItemId===this.getItemId(e)},isItemGroup:function(e){return I(e.items)},onEnter:function(){Ie(this.container,this.level)},onItemClick:function(e,n){this.getItemProp(n,"command",{originalEvent:e,item:n.item}),this.$emit("item-click",{originalEvent:e,processedItem:n,isFocus:!0})},onItemMouseEnter:function(e,n){this.$emit("item-mouseenter",{originalEvent:e,processedItem:n})},onItemMouseMove:function(e,n){this.$emit("item-mousemove",{originalEvent:e,processedItem:n})},getAriaSetSize:function(){var e=this;return this.items.filter(function(n){return e.isItemVisible(n)&&!e.getItemProp(n,"separator")}).length},getAriaPosInset:function(e){var n=this;return e-this.items.slice(0,e).filter(function(r){return n.isItemVisible(r)&&n.getItemProp(r,"separator")}).length+1},getMenuItemProps:function(e,n){return{action:l({class:this.cx("itemLink"),tabindex:-1},this.getPTOptions(e,n,"itemLink")),icon:l({class:[this.cx("itemIcon"),this.getItemProp(e,"icon")]},this.getPTOptions(e,n,"itemIcon")),label:l({class:this.cx("itemLabel")},this.getPTOptions(e,n,"itemLabel")),submenuicon:l({class:this.cx("submenuIcon")},this.getPTOptions(e,n,"submenuIcon"))}},containerRef:function(e){this.container=e}},components:{AngleRightIcon:ee},directives:{ripple:q}},Qn=["tabindex"],Jn=["id","aria-label","aria-disabled","aria-expanded","aria-haspopup","aria-level","aria-setsize","aria-posinset","data-p-active","data-p-focused","data-p-disabled"],$n=["onClick","onMouseenter","onMousemove"],ei=["href","target"],ti=["id"],ni=["id"];function ii(t,e,n,r,a,i){var u=S("AngleRightIcon"),d=S("TieredMenuSub",!0),s=U("ripple");return m(),g(N,l({name:"p-tieredmenu",onEnter:i.onEnter},t.ptm("menu.transition")),{default:K(function(){return[n.level===0||n.visible?(m(),f("ul",{key:0,ref:i.containerRef,tabindex:n.tabindex},[(m(!0),f(P,null,D(n.items,function(o,c){return m(),f(P,{key:i.getItemKey(o)},[i.isItemVisible(o)&&!i.getItemProp(o,"separator")?(m(),f("li",l({key:0,id:i.getItemId(o),style:i.getItemProp(o,"style"),class:[t.cx("item",{processedItem:o}),i.getItemProp(o,"class")],role:"menuitem","aria-label":i.getItemLabel(o),"aria-disabled":i.isItemDisabled(o)||void 0,"aria-expanded":i.isItemGroup(o)?i.isItemActive(o):void 0,"aria-haspopup":i.isItemGroup(o)&&!i.getItemProp(o,"to")?"menu":void 0,"aria-level":n.level+1,"aria-setsize":i.getAriaSetSize(),"aria-posinset":i.getAriaPosInset(c)},{ref_for:!0},i.getPTOptions(o,c,"item"),{"data-p-active":i.isItemActive(o),"data-p-focused":i.isItemFocused(o),"data-p-disabled":i.isItemDisabled(o)}),[p("div",l({class:t.cx("itemContent"),onClick:function(v){return i.onItemClick(v,o)},onMouseenter:function(v){return i.onItemMouseEnter(v,o)},onMousemove:function(v){return i.onItemMouseMove(v,o)}},{ref_for:!0},i.getPTOptions(o,c,"itemContent")),[n.templates.item?(m(),g(w(n.templates.item),{key:1,item:o.item,hasSubmenu:i.getItemProp(o,"items"),label:i.getItemLabel(o),props:i.getMenuItemProps(o,c)},null,8,["item","hasSubmenu","label","props"])):B((m(),f("a",l({key:0,href:i.getItemProp(o,"url"),class:t.cx("itemLink"),target:i.getItemProp(o,"target"),tabindex:"-1"},{ref_for:!0},i.getPTOptions(o,c,"itemLink")),[n.templates.itemicon?(m(),g(w(n.templates.itemicon),{key:0,item:o.item,class:O(t.cx("itemIcon"))},null,8,["item","class"])):i.getItemProp(o,"icon")?(m(),f("span",l({key:1,class:[t.cx("itemIcon"),i.getItemProp(o,"icon")]},{ref_for:!0},i.getPTOptions(o,c,"itemIcon")),null,16)):b("",!0),p("span",l({id:i.getItemLabelId(o),class:t.cx("itemLabel")},{ref_for:!0},i.getPTOptions(o,c,"itemLabel")),V(i.getItemLabel(o)),17,ti),i.getItemProp(o,"items")?(m(),f(P,{key:2},[n.templates.submenuicon?(m(),g(w(n.templates.submenuicon),l({key:0,class:t.cx("submenuIcon"),active:i.isItemActive(o)},{ref_for:!0},i.getPTOptions(o,c,"submenuIcon")),null,16,["class","active"])):(m(),g(u,l({key:1,class:t.cx("submenuIcon")},{ref_for:!0},i.getPTOptions(o,c,"submenuIcon")),null,16,["class"]))],64)):b("",!0)],16,ei)),[[s]])],16,$n),i.isItemVisible(o)&&i.isItemGroup(o)?(m(),g(d,l({key:0,id:i.getItemId(o)+"_list",class:t.cx("submenu"),style:t.sx("submenu",!0,{processedItem:o}),"aria-labelledby":i.getItemLabelId(o),role:"menu",menuId:n.menuId,focusedItemId:n.focusedItemId,items:o.items,templates:n.templates,activeItemPath:n.activeItemPath,level:n.level+1,visible:i.isItemActive(o)&&i.isItemGroup(o),pt:t.pt,unstyled:t.unstyled,onItemClick:e[0]||(e[0]=function(h){return t.$emit("item-click",h)}),onItemMouseenter:e[1]||(e[1]=function(h){return t.$emit("item-mouseenter",h)}),onItemMousemove:e[2]||(e[2]=function(h){return t.$emit("item-mousemove",h)})},{ref_for:!0},t.ptm("submenu")),null,16,["id","class","style","aria-labelledby","menuId","focusedItemId","items","templates","activeItemPath","level","visible","pt","unstyled"])):b("",!0)],16,Jn)):b("",!0),i.isItemVisible(o)&&i.getItemProp(o,"separator")?(m(),f("li",l({key:1,id:i.getItemId(o),style:i.getItemProp(o,"style"),class:[t.cx("separator"),i.getItemProp(o,"class")],role:"separator"},{ref_for:!0},t.ptm("separator")),null,16,ni)):b("",!0)],64)}),128))],8,Qn)):b("",!0)]}),_:1},16,["onEnter"])}Re.render=ii;var Be={name:"TieredMenu",extends:Xn,inheritAttrs:!1,emits:["focus","blur","before-show","before-hide","hide","show"],outsideClickListener:null,matchMediaListener:null,scrollHandler:null,resizeListener:null,target:null,container:null,menubar:null,searchTimeout:null,searchValue:null,data:function(){return{focused:!1,focusedItemInfo:{index:-1,level:0,parentKey:""},activeItemPath:[],visible:!this.popup,submenuVisible:!1,dirty:!1,query:null,queryMatches:!1}},watch:{activeItemPath:function(e){this.popup||(I(e)?(this.bindOutsideClickListener(),this.bindResizeListener()):(this.unbindOutsideClickListener(),this.unbindResizeListener()))}},mounted:function(){this.bindMatchMediaListener()},beforeUnmount:function(){this.unbindOutsideClickListener(),this.unbindResizeListener(),this.unbindMatchMediaListener(),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.container&&this.autoZIndex&&E.clear(this.container),this.target=null,this.container=null},methods:{getItemProp:function(e,n){return e?F(e[n]):void 0},getItemLabel:function(e){return this.getItemProp(e,"label")},isItemDisabled:function(e){return this.getItemProp(e,"disabled")},isItemVisible:function(e){return this.getItemProp(e,"visible")!==!1},isItemGroup:function(e){return I(this.getItemProp(e,"items"))},isItemSeparator:function(e){return this.getItemProp(e,"separator")},getProccessedItemLabel:function(e){return e?this.getItemLabel(e.item):void 0},isProccessedItemGroup:function(e){return e&&I(e.items)},toggle:function(e){this.visible?this.hide(e,!0):this.show(e)},show:function(e,n){this.popup&&(this.$emit("before-show"),this.visible=!0,this.target=this.target||e.currentTarget,this.relatedTarget=e.relatedTarget||null),n&&x(this.menubar)},hide:function(e,n){this.popup&&(this.$emit("before-hide"),this.visible=!1),this.activeItemPath=[],this.focusedItemInfo={index:-1,level:0,parentKey:""},n&&x(this.relatedTarget||this.target||this.menubar),this.dirty=!1},onFocus:function(e){this.focused=!0,this.popup||(this.focusedItemInfo=this.focusedItemInfo.index!==-1?this.focusedItemInfo:{index:this.findFirstFocusedItemIndex(),level:0,parentKey:""}),this.$emit("focus",e)},onBlur:function(e){this.focused=!1,this.focusedItemInfo={index:-1,level:0,parentKey:""},this.searchValue="",this.dirty=!1,this.$emit("blur",e)},onKeyDown:function(e){if(this.disabled){e.preventDefault();return}var n=e.metaKey||e.ctrlKey;switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e);break;case"ArrowLeft":this.onArrowLeftKey(e);break;case"ArrowRight":this.onArrowRightKey(e);break;case"Home":this.onHomeKey(e);break;case"End":this.onEndKey(e);break;case"Space":this.onSpaceKey(e);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"PageDown":case"PageUp":case"Backspace":case"ShiftLeft":case"ShiftRight":break;default:!n&&X(e.key)&&this.searchItems(e,e.key);break}},onItemChange:function(e,n){var r=e.processedItem,a=e.isFocus;if(!A(r)){var i=r.index,u=r.key,d=r.level,s=r.parentKey,o=r.items,c=I(o),h=this.activeItemPath.filter(function(v){return v.parentKey!==s&&v.parentKey!==u});c&&(h.push(r),this.submenuVisible=!0),this.focusedItemInfo={index:i,level:d,parentKey:s},c&&(this.dirty=!0),a&&x(this.menubar),!(n==="hover"&&this.queryMatches)&&(this.activeItemPath=h)}},onOverlayClick:function(e){Ke.emit("overlay-click",{originalEvent:e,target:this.target})},onItemClick:function(e){var n=e.originalEvent,r=e.processedItem,a=this.isProccessedItemGroup(r),i=A(r.parent),u=this.isSelected(r);if(u){var d=r.index,s=r.key,o=r.level,c=r.parentKey;this.activeItemPath=this.activeItemPath.filter(function(v){return s!==v.key&&s.startsWith(v.key)}),this.focusedItemInfo={index:d,level:o,parentKey:c},this.dirty=!i,x(this.menubar)}else if(a)this.onItemChange(e);else{var h=i?r:this.activeItemPath.find(function(v){return v.parentKey===""});this.hide(n),this.changeFocusedItemIndex(n,h?h.index:-1),x(this.menubar)}},onItemMouseEnter:function(e){this.dirty&&this.onItemChange(e,"hover")},onItemMouseMove:function(e){this.focused&&this.changeFocusedItemIndex(e,e.processedItem.index)},onArrowDownKey:function(e){var n=this.focusedItemInfo.index!==-1?this.findNextItemIndex(this.focusedItemInfo.index):this.findFirstFocusedItemIndex();this.changeFocusedItemIndex(e,n),e.preventDefault()},onArrowUpKey:function(e){if(e.altKey){if(this.focusedItemInfo.index!==-1){var n=this.visibleItems[this.focusedItemInfo.index],r=this.isProccessedItemGroup(n);!r&&this.onItemChange({originalEvent:e,processedItem:n})}this.popup&&this.hide(e,!0),e.preventDefault()}else{var a=this.focusedItemInfo.index!==-1?this.findPrevItemIndex(this.focusedItemInfo.index):this.findLastFocusedItemIndex();this.changeFocusedItemIndex(e,a),e.preventDefault()}},onArrowLeftKey:function(e){var n=this,r=this.visibleItems[this.focusedItemInfo.index],a=this.activeItemPath.find(function(u){return u.key===r.parentKey}),i=A(r.parent);i||(this.focusedItemInfo={index:-1,parentKey:a?a.parentKey:""},this.searchValue="",this.onArrowDownKey(e)),this.activeItemPath=this.activeItemPath.filter(function(u){return u.parentKey!==n.focusedItemInfo.parentKey}),e.preventDefault()},onArrowRightKey:function(e){var n=this.visibleItems[this.focusedItemInfo.index],r=this.isProccessedItemGroup(n);r&&(this.onItemChange({originalEvent:e,processedItem:n}),this.focusedItemInfo={index:-1,parentKey:n.key},this.searchValue="",this.onArrowDownKey(e)),e.preventDefault()},onHomeKey:function(e){this.changeFocusedItemIndex(e,this.findFirstItemIndex()),e.preventDefault()},onEndKey:function(e){this.changeFocusedItemIndex(e,this.findLastItemIndex()),e.preventDefault()},onEnterKey:function(e){if(this.focusedItemInfo.index!==-1){var n=L(this.menubar,'li[id="'.concat("".concat(this.focusedItemId),'"]')),r=n&&L(n,'[data-pc-section="itemlink"]');if(r?r.click():n&&n.click(),!this.popup){var a=this.visibleItems[this.focusedItemInfo.index],i=this.isProccessedItemGroup(a);!i&&(this.focusedItemInfo.index=this.findFirstFocusedItemIndex())}}e.preventDefault()},onSpaceKey:function(e){this.onEnterKey(e)},onEscapeKey:function(e){if(this.popup||this.focusedItemInfo.level!==0){var n=this.focusedItemInfo;this.hide(e,!1),this.focusedItemInfo={index:Number(n.parentKey.split("_")[0]),level:0,parentKey:""},this.popup&&x(this.target)}e.preventDefault()},onTabKey:function(e){if(this.focusedItemInfo.index!==-1){var n=this.visibleItems[this.focusedItemInfo.index],r=this.isProccessedItemGroup(n);!r&&this.onItemChange({originalEvent:e,processedItem:n})}this.hide()},onEnter:function(e){this.autoZIndex&&E.set("menu",e,this.baseZIndex+this.$primevue.config.zIndex.menu),se(e,{position:"absolute",top:"0"}),this.alignOverlay(),x(this.menubar),this.scrollInView()},onAfterEnter:function(){this.bindOutsideClickListener(),this.bindScrollListener(),this.bindResizeListener(),this.$emit("show")},onLeave:function(){this.unbindOutsideClickListener(),this.unbindScrollListener(),this.unbindResizeListener(),this.$emit("hide"),this.container=null,this.dirty=!1},onAfterLeave:function(e){this.autoZIndex&&E.clear(e)},alignOverlay:function(){ye(this.container,this.target);var e=j(this.target);e>j(this.container)&&(this.container.style.minWidth=j(this.target)+"px")},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(n){var r=e.container&&!e.container.contains(n.target),a=e.popup?!(e.target&&(e.target===n.target||e.target.contains(n.target))):!0;r&&a&&e.hide()},document.addEventListener("click",this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&(document.removeEventListener("click",this.outsideClickListener,!0),this.outsideClickListener=null)},bindScrollListener:function(){var e=this;this.scrollHandler||(this.scrollHandler=new Me(this.target,function(n){e.hide(n,!0)})),this.scrollHandler.bindScrollListener()},unbindScrollListener:function(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(n){Y()||e.hide(n,!0)},window.addEventListener("resize",this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)},bindMatchMediaListener:function(){var e=this;if(!this.matchMediaListener){var n=matchMedia("(max-width: ".concat(this.breakpoint,")"));this.query=n,this.queryMatches=n.matches,this.matchMediaListener=function(){e.queryMatches=n.matches},this.query.addEventListener("change",this.matchMediaListener)}},unbindMatchMediaListener:function(){this.matchMediaListener&&(this.query.removeEventListener("change",this.matchMediaListener),this.matchMediaListener=null)},isItemMatched:function(e){var n;return this.isValidItem(e)&&((n=this.getProccessedItemLabel(e))===null||n===void 0?void 0:n.toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase()))},isValidItem:function(e){return!!e&&!this.isItemDisabled(e.item)&&!this.isItemSeparator(e.item)&&this.isItemVisible(e.item)},isValidSelectedItem:function(e){return this.isValidItem(e)&&this.isSelected(e)},isSelected:function(e){return this.activeItemPath.some(function(n){return n.key===e.key})},findFirstItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidItem(n)})},findLastItemIndex:function(){var e=this;return _(this.visibleItems,function(n){return e.isValidItem(n)})},findNextItemIndex:function(e){var n=this,r=e<this.visibleItems.length-1?this.visibleItems.slice(e+1).findIndex(function(a){return n.isValidItem(a)}):-1;return r>-1?r+e+1:e},findPrevItemIndex:function(e){var n=this,r=e>0?_(this.visibleItems.slice(0,e),function(a){return n.isValidItem(a)}):-1;return r>-1?r:e},findSelectedItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(n){return e.isValidSelectedItem(n)})},findFirstFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findFirstItemIndex():e},findLastFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findLastItemIndex():e},searchItems:function(e,n){var r=this;this.searchValue=(this.searchValue||"")+n;var a=-1,i=!1;return this.focusedItemInfo.index!==-1?(a=this.visibleItems.slice(this.focusedItemInfo.index).findIndex(function(u){return r.isItemMatched(u)}),a=a===-1?this.visibleItems.slice(0,this.focusedItemInfo.index).findIndex(function(u){return r.isItemMatched(u)}):a+this.focusedItemInfo.index):a=this.visibleItems.findIndex(function(u){return r.isItemMatched(u)}),a!==-1&&(i=!0),a===-1&&this.focusedItemInfo.index===-1&&(a=this.findFirstFocusedItemIndex()),a!==-1&&this.changeFocusedItemIndex(e,a),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(function(){r.searchValue="",r.searchTimeout=null},500),i},changeFocusedItemIndex:function(e,n){this.focusedItemInfo.index!==n&&(this.focusedItemInfo.index=n,this.scrollInView())},scrollInView:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:-1,n=e!==-1?"".concat(this.$id,"_").concat(e):this.focusedItemId,r=L(this.menubar,'li[id="'.concat(n,'"]'));r&&r.scrollIntoView&&r.scrollIntoView({block:"nearest",inline:"start"})},createProcessedItems:function(e){var n=this,r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"",u=[];return e&&e.forEach(function(d,s){var o=(i!==""?i+"_":"")+s,c={item:d,index:s,level:r,key:o,parent:a,parentKey:i};c.items=n.createProcessedItems(d.items,r+1,c,o),u.push(c)}),u},containerRef:function(e){this.container=e},menubarRef:function(e){this.menubar=e?e.$el:void 0}},computed:{processedItems:function(){return this.createProcessedItems(this.model||[])},visibleItems:function(){var e=this,n=this.activeItemPath.find(function(r){return r.key===e.focusedItemInfo.parentKey});return n?n.items:this.processedItems},focusedItemId:function(){return this.focusedItemInfo.index!==-1?"".concat(this.$id).concat(I(this.focusedItemInfo.parentKey)?"_"+this.focusedItemInfo.parentKey:"","_").concat(this.focusedItemInfo.index):null}},components:{TieredMenuSub:Re,Portal:ae}},ri=["id"];function ai(t,e,n,r,a,i){var u=S("TieredMenuSub"),d=S("Portal");return m(),g(d,{appendTo:t.appendTo,disabled:!t.popup},{default:K(function(){return[k(N,l({name:"p-connected-overlay",onEnter:i.onEnter,onAfterEnter:i.onAfterEnter,onLeave:i.onLeave,onAfterLeave:i.onAfterLeave},t.ptm("transition")),{default:K(function(){return[a.visible?(m(),f("div",l({key:0,ref:i.containerRef,id:t.$id,class:t.cx("root"),onClick:e[0]||(e[0]=function(){return i.onOverlayClick&&i.onOverlayClick.apply(i,arguments)})},t.ptmi("root")),[t.$slots.start?(m(),f("div",l({key:0,class:t.cx("start")},t.ptm("start")),[M(t.$slots,"start")],16)):b("",!0),k(u,l({ref:i.menubarRef,id:t.$id+"_list",class:t.cx("rootList"),tabindex:t.disabled?-1:t.tabindex,role:"menubar","aria-label":t.ariaLabel,"aria-labelledby":t.ariaLabelledby,"aria-disabled":t.disabled||void 0,"aria-orientation":"vertical","aria-activedescendant":a.focused?i.focusedItemId:void 0,menuId:t.$id,focusedItemId:a.focused?i.focusedItemId:void 0,items:i.processedItems,templates:t.$slots,activeItemPath:a.activeItemPath,level:0,visible:a.submenuVisible,pt:t.pt,unstyled:t.unstyled,onFocus:i.onFocus,onBlur:i.onBlur,onKeydown:i.onKeyDown,onItemClick:i.onItemClick,onItemMouseenter:i.onItemMouseEnter,onItemMousemove:i.onItemMouseMove},t.ptm("rootList")),null,16,["id","class","tabindex","aria-label","aria-labelledby","aria-disabled","aria-activedescendant","menuId","focusedItemId","items","templates","activeItemPath","visible","pt","unstyled","onFocus","onBlur","onKeydown","onItemClick","onItemMouseenter","onItemMousemove"]),t.$slots.end?(m(),f("div",l({key:1,class:t.cx("end")},t.ptm("end")),[M(t.$slots,"end")],16)):b("",!0)],16,ri)):b("",!0)]}),_:3},16,["onEnter","onAfterEnter","onLeave","onAfterLeave"])]}),_:3},8,["appendTo","disabled"])}Be.render=ai;var si={root:function(e){var n=e.instance;return["p-step",{"p-step-active":n.active,"p-disabled":n.isStepDisabled}]},header:"p-step-header",number:"p-step-number",title:"p-step-title"},oi=H.extend({name:"step",classes:si}),_e={name:"StepperSeparator",hostName:"Stepper",extends:C,inject:{$pcStepper:{default:null}}};function ui(t,e,n,r,a,i){return m(),f("span",l({class:t.cx("separator")},t.ptmo(i.$pcStepper.pt,"separator")),null,16)}_e.render=ui;var li={name:"BaseStep",extends:C,props:{value:{type:[String,Number],default:void 0},disabled:{type:Boolean,default:!1},asChild:{type:Boolean,default:!1},as:{type:[String,Object],default:"DIV"}},style:oi,provide:function(){return{$pcStep:this,$parentInstance:this}}},Ne={name:"Step",extends:li,inheritAttrs:!1,inject:{$pcStepper:{default:null},$pcStepList:{default:null},$pcStepItem:{default:null}},data:function(){return{isSeparatorVisible:!1,isCompleted:!1}},mounted:function(){if(this.$el&&this.$pcStepList){var e=$(this.$el,z(this.$pcStepper.$el,'[data-pc-name="step"]')),n=$(L(this.$pcStepper.$el,'[data-pc-name="step"][data-p-active="true"]'),z(this.$pcStepper.$el,'[data-pc-name="step"]')),r=z(this.$pcStepper.$el,'[data-pc-name="step"]').length;this.isSeparatorVisible=e!==r-1,this.isCompleted=e<n}},updated:function(){var e=$(this.$el,z(this.$pcStepper.$el,'[data-pc-name="step"]')),n=$(L(this.$pcStepper.$el,'[data-pc-name="step"][data-p-active="true"]'),z(this.$pcStepper.$el,'[data-pc-name="step"]'));this.isCompleted=e<n},methods:{getPTOptions:function(e){var n=e==="root"?this.ptmi:this.ptm;return n(e,{context:{active:this.active,disabled:this.isStepDisabled}})},onStepClick:function(){this.$pcStepper.updateValue(this.activeValue)}},computed:{active:function(){return this.$pcStepper.isStepActive(this.activeValue)},activeValue:function(){var e;return this.$pcStepItem?(e=this.$pcStepItem)===null||e===void 0?void 0:e.value:this.value},isStepDisabled:function(){return!this.active&&(this.$pcStepper.isStepDisabled()||this.disabled)},id:function(){var e;return"".concat((e=this.$pcStepper)===null||e===void 0?void 0:e.$id,"_step_").concat(this.activeValue)},ariaControls:function(){var e;return"".concat((e=this.$pcStepper)===null||e===void 0?void 0:e.$id,"_steppanel_").concat(this.activeValue)},a11yAttrs:function(){return{root:{role:"presentation","aria-current":this.active?"step":void 0,"data-pc-name":"step","data-pc-section":"root","data-p-disabled":this.isStepDisabled,"data-p-active":this.active},header:{id:this.id,role:"tab",taindex:this.disabled?-1:void 0,"aria-controls":this.ariaControls,"data-pc-section":"header",disabled:this.isStepDisabled,onClick:this.onStepClick}}},dataP:function(){return ue({disabled:this.isStepDisabled,readonly:this.$pcStepper.linear,active:this.active,completed:this.isCompleted,vertical:this.$pcStepItem!=null})}},components:{StepperSeparator:_e}},mi=["id","tabindex","aria-controls","disabled","data-p"],di=["data-p"],ci=["data-p"];function fi(t,e,n,r,a,i){var u=S("StepperSeparator");return t.asChild?M(t.$slots,"default",{key:1,class:O(t.cx("root")),active:i.active,value:t.value,a11yAttrs:i.a11yAttrs,activateCallback:i.onStepClick}):(m(),g(w(t.as),l({key:0,class:t.cx("root"),"aria-current":i.active?"step":void 0,role:"presentation","data-p-active":i.active,"data-p-disabled":i.isStepDisabled,"data-p":i.dataP},i.getPTOptions("root")),{default:K(function(){return[p("button",l({id:i.id,class:t.cx("header"),role:"tab",type:"button",tabindex:i.isStepDisabled?-1:void 0,"aria-controls":i.ariaControls,disabled:i.isStepDisabled,onClick:e[0]||(e[0]=function(){return i.onStepClick&&i.onStepClick.apply(i,arguments)}),"data-p":i.dataP},i.getPTOptions("header")),[p("span",l({class:t.cx("number"),"data-p":i.dataP},i.getPTOptions("number")),V(i.activeValue),17,di),p("span",l({class:t.cx("title"),"data-p":i.dataP},i.getPTOptions("title")),[M(t.$slots,"default")],16,ci)],16,mi),a.isSeparatorVisible?(m(),g(u,{key:0,"data-p":i.dataP},null,8,["data-p"])):b("",!0)]}),_:3},16,["class","aria-current","data-p-active","data-p-disabled","data-p"]))}Ne.render=fi;var hi={root:"p-steplist"},pi=H.extend({name:"steplist",classes:hi}),bi={name:"BaseStepList",extends:C,style:pi,provide:function(){return{$pcStepList:this,$parentInstance:this}}},Ge={name:"StepList",extends:bi,inheritAttrs:!1};function Ii(t,e,n,r,a,i){return m(),f("div",l({class:t.cx("root")},t.ptmi("root")),[M(t.$slots,"default")],16)}Ge.render=Ii;var gi=`
    .p-steplist {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 0;
        list-style-type: none;
        overflow-x: auto;
    }

    .p-step {
        position: relative;
        display: flex;
        flex: 1 1 auto;
        align-items: center;
        gap: dt('stepper.step.gap');
        padding: dt('stepper.step.padding');
    }

    .p-step:last-of-type {
        flex: initial;
    }

    .p-step-header {
        border: 0 none;
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        cursor: pointer;
        transition:
            background dt('stepper.transition.duration'),
            color dt('stepper.transition.duration'),
            border-color dt('stepper.transition.duration'),
            outline-color dt('stepper.transition.duration'),
            box-shadow dt('stepper.transition.duration');
        border-radius: dt('stepper.step.header.border.radius');
        outline-color: transparent;
        background: transparent;
        padding: dt('stepper.step.header.padding');
        gap: dt('stepper.step.header.gap');
    }

    .p-step-header:focus-visible {
        box-shadow: dt('stepper.step.header.focus.ring.shadow');
        outline: dt('stepper.step.header.focus.ring.width') dt('stepper.step.header.focus.ring.style') dt('stepper.step.header.focus.ring.color');
        outline-offset: dt('stepper.step.header.focus.ring.offset');
    }

    .p-stepper.p-stepper-readonly .p-step {
        cursor: auto;
    }

    .p-step-title {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        color: dt('stepper.step.title.color');
        font-weight: dt('stepper.step.title.font.weight');
        transition:
            background dt('stepper.transition.duration'),
            color dt('stepper.transition.duration'),
            border-color dt('stepper.transition.duration'),
            box-shadow dt('stepper.transition.duration'),
            outline-color dt('stepper.transition.duration');
    }

    .p-step-number {
        display: flex;
        align-items: center;
        justify-content: center;
        color: dt('stepper.step.number.color');
        border: 2px solid dt('stepper.step.number.border.color');
        background: dt('stepper.step.number.background');
        min-width: dt('stepper.step.number.size');
        height: dt('stepper.step.number.size');
        line-height: dt('stepper.step.number.size');
        font-size: dt('stepper.step.number.font.size');
        z-index: 1;
        border-radius: dt('stepper.step.number.border.radius');
        position: relative;
        font-weight: dt('stepper.step.number.font.weight');
    }

    .p-step-number::after {
        content: ' ';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: dt('stepper.step.number.border.radius');
        box-shadow: dt('stepper.step.number.shadow');
    }

    .p-step-active .p-step-header {
        cursor: default;
    }

    .p-step-active .p-step-number {
        background: dt('stepper.step.number.active.background');
        border-color: dt('stepper.step.number.active.border.color');
        color: dt('stepper.step.number.active.color');
    }

    .p-step-active .p-step-title {
        color: dt('stepper.step.title.active.color');
    }

    .p-step:not(.p-disabled):focus-visible {
        outline: dt('focus.ring.width') dt('focus.ring.style') dt('focus.ring.color');
        outline-offset: dt('focus.ring.offset');
    }

    .p-step:has(~ .p-step-active) .p-stepper-separator {
        background: dt('stepper.separator.active.background');
    }

    .p-stepper-separator {
        flex: 1 1 0;
        background: dt('stepper.separator.background');
        width: 100%;
        height: dt('stepper.separator.size');
        transition:
            background dt('stepper.transition.duration'),
            color dt('stepper.transition.duration'),
            border-color dt('stepper.transition.duration'),
            box-shadow dt('stepper.transition.duration'),
            outline-color dt('stepper.transition.duration');
    }

    .p-steppanels {
        padding: dt('stepper.steppanels.padding');
    }

    .p-steppanel {
        background: dt('stepper.steppanel.background');
        color: dt('stepper.steppanel.color');
    }

    .p-stepper:has(.p-stepitem) {
        display: flex;
        flex-direction: column;
    }

    .p-stepitem {
        display: flex;
        flex-direction: column;
        flex: initial;
    }

    .p-stepitem.p-stepitem-active {
        flex: 1 1 auto;
    }

    .p-stepitem .p-step {
        flex: initial;
    }

    .p-stepitem .p-steppanel-content {
        width: 100%;
        padding: dt('stepper.steppanel.padding');
        margin-inline-start: 1rem;
    }

    .p-stepitem .p-steppanel {
        display: flex;
        flex: 1 1 auto;
    }

    .p-stepitem .p-stepper-separator {
        flex: 0 0 auto;
        width: dt('stepper.separator.size');
        height: auto;
        margin: dt('stepper.separator.margin');
        position: relative;
        left: calc(-1 * dt('stepper.separator.size'));
    }

    .p-stepitem .p-stepper-separator:dir(rtl) {
        left: calc(-9 * dt('stepper.separator.size'));
    }

    .p-stepitem:has(~ .p-stepitem-active) .p-stepper-separator {
        background: dt('stepper.separator.active.background');
    }

    .p-stepitem:last-of-type .p-steppanel {
        padding-inline-start: dt('stepper.step.number.size');
    }
`,vi={root:function(e){var n=e.props;return["p-stepper p-component",{"p-readonly":n.linear}]},separator:"p-stepper-separator"},yi=H.extend({name:"stepper",style:gi,classes:vi}),ki={name:"BaseStepper",extends:C,props:{value:{type:[String,Number],default:void 0},linear:{type:Boolean,default:!1}},style:yi,provide:function(){return{$pcStepper:this,$parentInstance:this}}},je={name:"Stepper",extends:ki,inheritAttrs:!1,emits:["update:value"],data:function(){return{d_value:this.value}},watch:{value:function(e){this.d_value=e}},methods:{updateValue:function(e){this.d_value!==e&&(this.d_value=e,this.$emit("update:value",e))},isStepActive:function(e){return this.d_value===e},isStepDisabled:function(){return this.linear}}};function xi(t,e,n,r,a,i){return m(),f("div",l({class:t.cx("root"),role:"tablist"},t.ptmi("root")),[t.$slots.start?M(t.$slots,"start",{key:0}):b("",!0),M(t.$slots,"default"),t.$slots.end?M(t.$slots,"end",{key:1}):b("",!0)],16)}je.render=xi;const Li={class:"card"},Pi={class:"card"},wi={class:"flex flex-col md:flex-row gap-8"},Ki={class:"md:w-1/2"},Mi={class:"card"},Si={class:"md:w-1/2"},Ci={class:"card"},Ai={class:"flex flex-col md:flex-row gap-8 mt-6"},Ei={class:"md:w-1/3"},Oi={class:"card"},Fi={class:"md:w-1/3"},Ti={class:"card"},Di={class:"md:w-1/3"},Vi={class:"card"},zi={class:"flex flex-col md:flex-row gap-8 mt-8"},Hi={class:"md:w-1/2"},Ri={class:"card"},Bi={class:"md:w-1/2"},_i={class:"card"},$i={__name:"MenuDoc",setup(t){const e=T(null),n=T(null),r=T([{label:"Customers",icon:"pi pi-fw pi-table",items:[{label:"New",icon:"pi pi-fw pi-user-plus",items:[{label:"Customer",icon:"pi pi-fw pi-plus"},{label:"Duplicate",icon:"pi pi-fw pi-copy"}]},{label:"Edit",icon:"pi pi-fw pi-user-edit"}]},{label:"Orders",icon:"pi pi-fw pi-shopping-cart",items:[{label:"View",icon:"pi pi-fw pi-list"},{label:"Search",icon:"pi pi-fw pi-search"}]},{label:"Shipments",icon:"pi pi-fw pi-envelope",items:[{label:"Tracker",icon:"pi pi-fw pi-compass"},{label:"Map",icon:"pi pi-fw pi-map-marker"},{label:"Manage",icon:"pi pi-fw pi-pencil"}]},{label:"Profile",icon:"pi pi-fw pi-user",items:[{label:"Settings",icon:"pi pi-fw pi-cog"},{label:"Billing",icon:"pi pi-fw pi-file"}]},{label:"Quit",icon:"pi pi-fw pi-sign-out"}]),a=T({icon:"pi pi-home",to:"/"}),i=T([{label:"Computer"},{label:"Notebook"},{label:"Accessories"},{label:"Backpacks"},{label:"Item"}]),u=T([{label:"Customers",icon:"pi pi-fw pi-table",items:[{label:"New",icon:"pi pi-fw pi-user-plus",items:[{label:"Customer",icon:"pi pi-fw pi-plus"},{label:"Duplicate",icon:"pi pi-fw pi-copy"}]},{label:"Edit",icon:"pi pi-fw pi-user-edit"}]},{label:"Orders",icon:"pi pi-fw pi-shopping-cart",items:[{label:"View",icon:"pi pi-fw pi-list"},{label:"Search",icon:"pi pi-fw pi-search"}]},{label:"Shipments",icon:"pi pi-fw pi-envelope",items:[{label:"Tracker",icon:"pi pi-fw pi-compass"},{label:"Map",icon:"pi pi-fw pi-map-marker"},{label:"Manage",icon:"pi pi-fw pi-pencil"}]},{label:"Profile",icon:"pi pi-fw pi-user",items:[{label:"Settings",icon:"pi pi-fw pi-cog"},{label:"Billing",icon:"pi pi-fw pi-file"}]},{separator:!0},{label:"Quit",icon:"pi pi-fw pi-sign-out"}]),d=T([{label:"Save",icon:"pi pi-save"},{label:"Update",icon:"pi pi-refresh"},{label:"Delete",icon:"pi pi-trash"},{separator:!0},{label:"Home",icon:"pi pi-home"}]),s=T([{label:"Customers",items:[{label:"New",icon:"pi pi-fw pi-plus"},{label:"Edit",icon:"pi pi-fw pi-user-edit"}]},{label:"Orders",items:[{label:"View",icon:"pi pi-fw pi-list"},{label:"Search",icon:"pi pi-fw pi-search"}]}]),o=T([{label:"Save",icon:"pi pi-save"},{label:"Update",icon:"pi pi-refresh"},{label:"Delete",icon:"pi pi-trash"},{separator:!0},{label:"Options",icon:"pi pi-cog"}]),c=T([{label:"Fashion",icon:"pi pi-fw pi-tag",items:[[{label:"Woman",items:[{label:"Woman Item"},{label:"Woman Item"},{label:"Woman Item"}]},{label:"Men",items:[{label:"Men Item"},{label:"Men Item"},{label:"Men Item"}]}],[{label:"Kids",items:[{label:"Kids Item"},{label:"Kids Item"}]},{label:"Luggage",items:[{label:"Luggage Item"},{label:"Luggage Item"},{label:"Luggage Item"}]}]]},{label:"Electronics",icon:"pi pi-fw pi-desktop",items:[[{label:"Computer",items:[{label:"Computer Item"},{label:"Computer Item"}]},{label:"Camcorder",items:[{label:"Camcorder Item"},{label:"Camcorder Item"},{label:"Camcorder Item"}]}],[{label:"TV",items:[{label:"TV Item"},{label:"TV Item"}]},{label:"Audio",items:[{label:"Audio Item"},{label:"Audio Item"},{label:"Audio Item"}]}],[{label:"Sports.7",items:[{label:"Sports.7.1"},{label:"Sports.7.2"}]}]]},{label:"Furniture",icon:"pi pi-fw pi-image",items:[[{label:"Living Room",items:[{label:"Living Room Item"},{label:"Living Room Item"}]},{label:"Kitchen",items:[{label:"Kitchen Item"},{label:"Kitchen Item"},{label:"Kitchen Item"}]}],[{label:"Bedroom",items:[{label:"Bedroom Item"},{label:"Bedroom Item"}]},{label:"Outdoor",items:[{label:"Outdoor Item"},{label:"Outdoor Item"},{label:"Outdoor Item"}]}]]},{label:"Sports",icon:"pi pi-fw pi-star",items:[[{label:"Basketball",items:[{label:"Basketball Item"},{label:"Basketball Item"}]},{label:"Football",items:[{label:"Football Item"},{label:"Football Item"},{label:"Football Item"}]}],[{label:"Tennis",items:[{label:"Tennis Item"},{label:"Tennis Item"}]}]]}]),h=T([{label:"Customers",icon:"pi pi-fw pi-table",items:[{label:"New",icon:"pi pi-fw pi-user-plus",items:[{label:"Customer",icon:"pi pi-fw pi-plus"},{label:"Duplicate",icon:"pi pi-fw pi-copy"}]},{label:"Edit",icon:"pi pi-fw pi-user-edit"}]},{label:"Orders",icon:"pi pi-fw pi-shopping-cart",items:[{label:"View",icon:"pi pi-fw pi-list"},{label:"Search",icon:"pi pi-fw pi-search"}]},{label:"Shipments",icon:"pi pi-fw pi-envelope",items:[{label:"Tracker",icon:"pi pi-fw pi-compass"},{label:"Map",icon:"pi pi-fw pi-map-marker"},{label:"Manage",icon:"pi pi-fw pi-pencil"}]},{label:"Profile",icon:"pi pi-fw pi-user",items:[{label:"Settings",icon:"pi pi-fw pi-cog"},{label:"Billing",icon:"pi pi-fw pi-file"}]}]);function v(Q){e.value.toggle(Q)}function te(Q){n.value.show(Q)}return(Q,y)=>{const Ue=ft,qe=ht,We=ct,Ze=De,Ye=dt,ne=Ne,Xe=Ge,Qe=je,ie=mt,Je=lt,$e=ut,et=Be,le=Fe,tt=ot,nt=Ce,me=Ee,it=He;return m(),f(P,null,[p("div",Li,[y[0]||(y[0]=p("div",{class:"font-semibold text-xl mb-4"},"Menubar",-1)),k(Ze,{model:r.value},{end:K(()=>[k(We,{iconPosition:"left"},{default:K(()=>[k(Ue,{class:"pi pi-search"}),k(qe,{type:"text",placeholder:"Search"})]),_:1})]),_:1},8,["model"])]),p("div",Pi,[y[1]||(y[1]=p("div",{class:"font-semibold text-xl mb-4"},"Breadcrumb",-1)),k(Ye,{home:a.value,model:i.value},null,8,["home","model"])]),p("div",wi,[p("div",Ki,[p("div",Mi,[y[5]||(y[5]=p("div",{class:"font-semibold text-xl mb-4"},"Steps",-1)),k(Qe,{value:"1"},{default:K(()=>[k(Xe,null,{default:K(()=>[k(ne,{value:"1"},{default:K(()=>[...y[2]||(y[2]=[R("Header I",-1)])]),_:1}),k(ne,{value:"2"},{default:K(()=>[...y[3]||(y[3]=[R("Header II",-1)])]),_:1}),k(ne,{value:"3"},{default:K(()=>[...y[4]||(y[4]=[R("Header III",-1)])]),_:1})]),_:1})]),_:1})])]),p("div",Si,[p("div",Ci,[y[9]||(y[9]=p("div",{class:"font-semibold text-xl mb-4"},"TabMenu",-1)),k($e,{value:"0"},{default:K(()=>[k(Je,null,{default:K(()=>[k(ie,{value:"0"},{default:K(()=>[...y[6]||(y[6]=[R("Header I",-1)])]),_:1}),k(ie,{value:"1"},{default:K(()=>[...y[7]||(y[7]=[R("Header II",-1)])]),_:1}),k(ie,{value:"2"},{default:K(()=>[...y[8]||(y[8]=[R("Header III",-1)])]),_:1})]),_:1})]),_:1})])])]),p("div",Ai,[p("div",Ei,[p("div",Oi,[y[10]||(y[10]=p("div",{class:"font-semibold text-xl mb-4"},"Tiered Menu",-1)),k(et,{model:u.value},null,8,["model"])])]),p("div",Fi,[p("div",Ti,[y[11]||(y[11]=p("div",{class:"font-semibold text-xl mb-4"},"Plain Menu",-1)),k(le,{model:s.value},null,8,["model"])])]),p("div",Di,[p("div",Vi,[y[12]||(y[12]=p("div",{class:"font-semibold text-xl mb-4"},"Overlay Menu",-1)),k(le,{ref_key:"menu",ref:e,model:d.value,popup:!0},null,8,["model"]),k(tt,{type:"button",label:"Options",icon:"pi pi-angle-down",onClick:v,style:{width:"auto"}})]),p("div",{class:"card",onContextmenu:te},[y[13]||(y[13]=p("div",{class:"font-semibold text-xl mb-4"},"Context Menu",-1)),y[14]||(y[14]=R(" Right click to display. ",-1)),k(nt,{ref_key:"contextMenu",ref:n,model:o.value},null,8,["model"])],32)])]),p("div",zi,[p("div",Hi,[p("div",Ri,[y[15]||(y[15]=p("div",{class:"font-semibold text-xl mb-4"},"MegaMenu | Horizontal",-1)),k(me,{model:c.value},null,8,["model"]),y[16]||(y[16]=p("div",{class:"font-semibold text-xl mb-4 mt-8"},"MegaMenu | Vertical",-1)),k(me,{model:c.value,orientation:"vertical"},null,8,["model"])])]),p("div",Bi,[p("div",_i,[y[17]||(y[17]=p("div",{class:"font-semibold text-xl mb-4"},"PanelMenu",-1)),k(it,{model:h.value},null,8,["model"])])])])],64)}}};export{$i as default};
