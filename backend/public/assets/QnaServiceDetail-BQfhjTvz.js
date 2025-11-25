import{B as I,L as A,G as K,H as E,c as G,e as u,o as c,p as n,g as p,n as h,f as w,j as P,m as r,t as v,q as S,d as q,u as T,w as y,am as F,i as N,D as _,r as H,ax as Q,Z as z,aD as J,aE as U,X as $,a1 as X,aF as O,aJ as g,ae as Z,F as W,aG as Y,aH as ee,a3 as te}from"./index-CIvZqnG9.js";import{s as ne}from"./index-CVVAIkGy.js";import{s as M}from"./index-DRZUHWhE.js";import{s as V}from"./index-m-AAtQFb.js";import{s as oe}from"./index-Cq2nnSLM.js";var le=`
    .p-fieldset {
        background: dt('fieldset.background');
        border: 1px solid dt('fieldset.border.color');
        border-radius: dt('fieldset.border.radius');
        color: dt('fieldset.color');
        padding: dt('fieldset.padding');
        margin: 0;
    }

    .p-fieldset-legend {
        background: dt('fieldset.legend.background');
        border-radius: dt('fieldset.legend.border.radius');
        border-width: dt('fieldset.legend.border.width');
        border-style: solid;
        border-color: dt('fieldset.legend.border.color');
        padding: dt('fieldset.legend.padding');
        transition:
            background dt('fieldset.transition.duration'),
            color dt('fieldset.transition.duration'),
            outline-color dt('fieldset.transition.duration'),
            box-shadow dt('fieldset.transition.duration');
    }

    .p-fieldset-toggleable > .p-fieldset-legend {
        padding: 0;
    }

    .p-fieldset-toggle-button {
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        text-decoration: none;
        display: flex;
        gap: dt('fieldset.legend.gap');
        align-items: center;
        justify-content: center;
        padding: dt('fieldset.legend.padding');
        background: transparent;
        border: 0 none;
        border-radius: dt('fieldset.legend.border.radius');
        transition:
            background dt('fieldset.transition.duration'),
            color dt('fieldset.transition.duration'),
            outline-color dt('fieldset.transition.duration'),
            box-shadow dt('fieldset.transition.duration');
        outline-color: transparent;
    }

    .p-fieldset-legend-label {
        font-weight: dt('fieldset.legend.font.weight');
    }

    .p-fieldset-toggle-button:focus-visible {
        box-shadow: dt('fieldset.legend.focus.ring.shadow');
        outline: dt('fieldset.legend.focus.ring.width') dt('fieldset.legend.focus.ring.style') dt('fieldset.legend.focus.ring.color');
        outline-offset: dt('fieldset.legend.focus.ring.offset');
    }

    .p-fieldset-toggleable > .p-fieldset-legend:hover {
        color: dt('fieldset.legend.hover.color');
        background: dt('fieldset.legend.hover.background');
    }

    .p-fieldset-toggle-icon {
        color: dt('fieldset.toggle.icon.color');
        transition: color dt('fieldset.transition.duration');
    }

    .p-fieldset-toggleable > .p-fieldset-legend:hover .p-fieldset-toggle-icon {
        color: dt('fieldset.toggle.icon.hover.color');
    }

    .p-fieldset .p-fieldset-content {
        padding: dt('fieldset.content.padding');
    }
`,ae={root:function(t){var o=t.props;return["p-fieldset p-component",{"p-fieldset-toggleable":o.toggleable}]},legend:"p-fieldset-legend",legendLabel:"p-fieldset-legend-label",toggleButton:"p-fieldset-toggle-button",toggleIcon:"p-fieldset-toggle-icon",contentContainer:"p-fieldset-content-container",content:"p-fieldset-content"},re=I.extend({name:"fieldset",style:le,classes:ae}),se={name:"BaseFieldset",extends:K,props:{legend:String,toggleable:Boolean,collapsed:Boolean,toggleButtonProps:{type:null,default:null}},style:re,provide:function(){return{$pcFieldset:this,$parentInstance:this}}},B={name:"Fieldset",extends:se,inheritAttrs:!1,emits:["update:collapsed","toggle"],data:function(){return{d_collapsed:this.collapsed}},watch:{collapsed:function(t){this.d_collapsed=t}},methods:{toggle:function(t){this.d_collapsed=!this.d_collapsed,this.$emit("update:collapsed",this.d_collapsed),this.$emit("toggle",{originalEvent:t,value:this.d_collapsed})},onKeyDown:function(t){(t.code==="Enter"||t.code==="NumpadEnter"||t.code==="Space")&&(this.toggle(t),t.preventDefault())}},computed:{buttonAriaLabel:function(){return this.toggleButtonProps&&this.toggleButtonProps.ariaLabel?this.toggleButtonProps.ariaLabel:this.legend},dataP:function(){return E({toggleable:this.toggleable})}},directives:{ripple:A},components:{PlusIcon:V,MinusIcon:M}};function k(e){"@babel/helpers - typeof";return k=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},k(e)}function L(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),o.push.apply(o,s)}return o}function x(e){for(var t=1;t<arguments.length;t++){var o=arguments[t]!=null?arguments[t]:{};t%2?L(Object(o),!0).forEach(function(s){de(e,s,o[s])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):L(Object(o)).forEach(function(s){Object.defineProperty(e,s,Object.getOwnPropertyDescriptor(o,s))})}return e}function de(e,t,o){return(t=ie(t))in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function ie(e){var t=ce(e,"string");return k(t)=="symbol"?t:t+""}function ce(e,t){if(k(e)!="object"||!e)return e;var o=e[Symbol.toPrimitive];if(o!==void 0){var s=o.call(e,t);if(k(s)!="object")return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}var pe=["data-p"],ue=["data-p"],ge=["id"],fe=["id","aria-controls","aria-expanded","aria-label"],be=["id","aria-labelledby"];function me(e,t,o,s,i,l){var d=G("ripple");return c(),u("fieldset",r({class:e.cx("root"),"data-p":l.dataP},e.ptmi("root")),[n("legend",r({class:e.cx("legend"),"data-p":l.dataP},e.ptm("legend")),[h(e.$slots,"legend",{toggleCallback:l.toggle},function(){return[e.toggleable?w("",!0):(c(),u("span",r({key:0,id:e.$id+"_header",class:e.cx("legendLabel")},e.ptm("legendLabel")),v(e.legend),17,ge)),e.toggleable?P((c(),u("button",r({key:1,id:e.$id+"_header",type:"button","aria-controls":e.$id+"_content","aria-expanded":!i.d_collapsed,"aria-label":l.buttonAriaLabel,class:e.cx("toggleButton"),onClick:t[0]||(t[0]=function(){return l.toggle&&l.toggle.apply(l,arguments)}),onKeydown:t[1]||(t[1]=function(){return l.onKeyDown&&l.onKeyDown.apply(l,arguments)})},x(x({},e.toggleButtonProps),e.ptm("toggleButton"))),[h(e.$slots,e.$slots.toggleicon?"toggleicon":"togglericon",{collapsed:i.d_collapsed,class:S(e.cx("toggleIcon"))},function(){return[(c(),q(T(i.d_collapsed?"PlusIcon":"MinusIcon"),r({class:e.cx("toggleIcon")},e.ptm("toggleIcon")),null,16,["class"]))]}),n("span",r({class:e.cx("legendLabel")},e.ptm("legendLabel")),v(e.legend),17)],16,fe)),[[d]]):w("",!0)]})],16,ue),p(N,r({name:"p-toggleable-content"},e.ptm("transition")),{default:y(function(){return[P(n("div",r({id:e.$id+"_content",class:e.cx("contentContainer"),role:"region","aria-labelledby":e.$id+"_header"},e.ptm("contentContainer")),[n("div",r({class:e.cx("content")},e.ptm("content")),[h(e.$slots,"default")],16)],16,be),[[F,!i.d_collapsed]])]}),_:3},16)],16,pe)}B.render=me;var he=`
    .p-panel {
        display: block;
        border: 1px solid dt('panel.border.color');
        border-radius: dt('panel.border.radius');
        background: dt('panel.background');
        color: dt('panel.color');
    }

    .p-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: dt('panel.header.padding');
        background: dt('panel.header.background');
        color: dt('panel.header.color');
        border-style: solid;
        border-width: dt('panel.header.border.width');
        border-color: dt('panel.header.border.color');
        border-radius: dt('panel.header.border.radius');
    }

    .p-panel-toggleable .p-panel-header {
        padding: dt('panel.toggleable.header.padding');
    }

    .p-panel-title {
        line-height: 1;
        font-weight: dt('panel.title.font.weight');
    }

    .p-panel-content {
        padding: dt('panel.content.padding');
    }

    .p-panel-footer {
        padding: dt('panel.footer.padding');
    }
`,ve={root:function(t){var o=t.props;return["p-panel p-component",{"p-panel-toggleable":o.toggleable}]},header:"p-panel-header",title:"p-panel-title",headerActions:"p-panel-header-actions",pcToggleButton:"p-panel-toggle-button",contentContainer:"p-panel-content-container",content:"p-panel-content",footer:"p-panel-footer"},ye=I.extend({name:"panel",style:he,classes:ve}),we={name:"BasePanel",extends:K,props:{header:String,toggleable:Boolean,collapsed:Boolean,toggleButtonProps:{type:Object,default:function(){return{severity:"secondary",text:!0,rounded:!0}}}},style:ye,provide:function(){return{$pcPanel:this,$parentInstance:this}}},D={name:"Panel",extends:we,inheritAttrs:!1,emits:["update:collapsed","toggle"],data:function(){return{d_collapsed:this.collapsed}},watch:{collapsed:function(t){this.d_collapsed=t}},methods:{toggle:function(t){this.d_collapsed=!this.d_collapsed,this.$emit("update:collapsed",this.d_collapsed),this.$emit("toggle",{originalEvent:t,value:this.d_collapsed})},onKeyDown:function(t){(t.code==="Enter"||t.code==="NumpadEnter"||t.code==="Space")&&(this.toggle(t),t.preventDefault())}},computed:{buttonAriaLabel:function(){return this.toggleButtonProps&&this.toggleButtonProps.ariaLabel?this.toggleButtonProps.ariaLabel:this.header},dataP:function(){return E({toggleable:this.toggleable})}},components:{PlusIcon:V,MinusIcon:M,Button:_},directives:{ripple:A}},ke=["data-p"],Pe=["data-p"],$e=["id"],_e=["id","aria-labelledby"];function Be(e,t,o,s,i,l){var d=H("Button");return c(),u("div",r({class:e.cx("root"),"data-p":l.dataP},e.ptmi("root")),[n("div",r({class:e.cx("header"),"data-p":l.dataP},e.ptm("header")),[h(e.$slots,"header",{id:e.$id+"_header",class:S(e.cx("title")),collapsed:i.d_collapsed},function(){return[e.header?(c(),u("span",r({key:0,id:e.$id+"_header",class:e.cx("title")},e.ptm("title")),v(e.header),17,$e)):w("",!0)]}),n("div",r({class:e.cx("headerActions")},e.ptm("headerActions")),[h(e.$slots,"icons"),e.toggleable?h(e.$slots,"togglebutton",{key:0,collapsed:i.d_collapsed,toggleCallback:function(b){return l.toggle(b)},keydownCallback:function(b){return l.onKeyDown(b)}},function(){return[p(d,r({id:e.$id+"_header",class:e.cx("pcToggleButton"),"aria-label":l.buttonAriaLabel,"aria-controls":e.$id+"_content","aria-expanded":!i.d_collapsed,unstyled:e.unstyled,onClick:t[0]||(t[0]=function(f){return l.toggle(f)}),onKeydown:t[1]||(t[1]=function(f){return l.onKeyDown(f)})},e.toggleButtonProps,{pt:e.ptm("pcToggleButton")}),{icon:y(function(f){return[h(e.$slots,e.$slots.toggleicon?"toggleicon":"togglericon",{collapsed:i.d_collapsed},function(){return[(c(),q(T(i.d_collapsed?"PlusIcon":"MinusIcon"),r({class:f.class},e.ptm("pcToggleButton").icon),null,16,["class"]))]})]}),_:3},16,["id","class","aria-label","aria-controls","aria-expanded","unstyled","pt"])]}):w("",!0)],16)],16,Pe),p(N,r({name:"p-toggleable-content"},e.ptm("transition")),{default:y(function(){return[P(n("div",r({id:e.$id+"_content",class:e.cx("contentContainer"),role:"region","aria-labelledby":e.$id+"_header"},e.ptm("contentContainer")),[n("div",r({class:e.cx("content")},e.ptm("content")),[h(e.$slots,"default")],16),e.$slots.footer?(c(),u("div",r({key:0,class:e.cx("footer")},e.ptm("footer")),[h(e.$slots,"footer")],16)):w("",!0)],16,_e),[[F,!i.d_collapsed]])]}),_:3},16)],16,ke)}D.render=Be;const De={class:"p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto"},Se={key:0,class:"flex flex-col items-center justify-center h-64"},je={key:1,class:"flex flex-col gap-6"},Ce={class:"grid grid-cols-1 sm:grid-cols-2 gap-4"},Oe={class:"flex flex-col"},Le={class:"p-3 border rounded-lg bg-surface-50 shadow-sm text-lg font-medium"},xe={class:"flex flex-col"},Ie={class:"p-3 border rounded-lg bg-surface-50 shadow-sm"},Ae={class:"flex flex-col"},Ke={class:"p-3 border rounded-lg bg-surface-50 shadow-sm"},Ee={class:"flex flex-col"},qe={class:"whitespace-pre-wrap text-base p-4 bg-surface-50 border rounded-lg min-h-[100px]"},Te={key:0,class:"whitespace-pre-wrap text-base p-4 bg-blue-50 border rounded-lg min-h-[100px]"},Fe={key:1},Ne={key:2,class:"text-gray-500 italic p-4 bg-surface-50 border rounded-lg min-h-[100px] flex items-center justify-center"},Me={class:"flex justify-end pt-4"},Ve={__name:"QnaServiceDetail",setup(e){const t=z(),o=J(),s=Y(),l=U().params.question_no,d=$(null),f=$(!0),b=$("");X(async()=>{try{const m=await O.get(`/api/qna/question-detail/${l}`);d.value=m.data}catch(m){console.error("질문 상세 조회 실패:",m),t.add({severity:"error",summary:"알림",detail:"질문 상세 조회에 실패했습니다.",life:3e3})}finally{f.value=!1}});function j(m){return m?new Date(m).toLocaleString("ko-KR",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}):""}async function R(){if(!b.value.trim()){t.add({severity:"warn",summary:"알림",detail:"답변 내용을 입력하세요.",life:3e3});return}try{await O.post("/api/qna/answer",{question_no:l,content:b.value,writer:o.user.name,user_id:o.user.id}),t.add({severity:"success",summary:"알림",detail:"답변이 성공적으로 저장되었습니다.",life:3e3}),d.value.answer_content=b.value,d.value.answer_created_at=new Date,b.value=""}catch(m){console.error(m),t.add({severity:"error",summary:"알림",detail:"답변 저장에 실패했습니다.",life:3e3})}}return(m,a)=>(c(),u(W,null,[p(g(Z)),n("div",De,[p(g(ne),{class:"rounded-xl shadow-2xl p-fluid"},{title:y(()=>[...a[2]||(a[2]=[n("div",{class:"flex items-center text-primary-600 dark:text-primary-400"},[n("i",{class:"pi pi-question-circle text-2xl mr-3"}),n("h2",{class:"text-2xl font-bold"},"질문 상세 정보")],-1)])]),content:y(()=>[f.value?(c(),u("div",Se,[p(g(oe)),a[3]||(a[3]=n("span",{class:"mt-3 text-lg text-gray-600"},"데이터 로딩 중...",-1))])):d.value?(c(),u("div",je,[p(g(B),{legend:"기본 정보",toggleable:!1},{default:y(()=>[n("div",Ce,[n("div",Oe,[a[4]||(a[4]=n("label",{class:"font-semibold mb-1"},"제목",-1)),n("div",Le,v(d.value.title),1)]),n("div",xe,[a[5]||(a[5]=n("label",{class:"font-semibold mb-1"},"문의자",-1)),n("div",Ie,v(d.value.writer),1)]),n("div",Ae,[a[6]||(a[6]=n("label",{class:"font-semibold mb-1"},"질문일시",-1)),n("div",Ke,v(j(d.value.created_at)),1)]),n("div",Ee,[a[7]||(a[7]=n("label",{class:"font-semibold mb-1"},"답변일시",-1)),n("div",{class:S(["p-3 border rounded-lg shadow-sm",d.value.answer_created_at?"bg-green-100 text-green-800 border-green-300":"bg-orange-100 text-orange-800 border-orange-300"])},v(j(d.value.answer_created_at)||"미답변"),3)])])]),_:1}),p(g(D),{header:"질문 내용",class:"mt-4 shadow-md"},{default:y(()=>[n("div",qe,v(d.value.content),1)]),_:1}),p(g(D),{header:"답변 내용",class:"mt-4 shadow-md"},{default:y(()=>[d.value.answer_content?(c(),u("div",Te,v(d.value.answer_content),1)):["2a","3a"].includes(g(o).user.role)?(c(),u("div",Fe,[p(g(B),{legend:"답변 작성"},{default:y(()=>[P(n("textarea",{"onUpdate:modelValue":a[0]||(a[0]=C=>b.value=C),class:"p-inputtextarea w-full h-32",placeholder:"여기에 답변을 작성하세요."},null,512),[[ee,b.value]]),p(g(_),{label:"답변 저장",icon:"pi pi-check",class:"mt-2",onClick:R})]),_:1})])):(c(),u("div",Ne,[...a[8]||(a[8]=[n("i",{class:"pi pi-info-circle mr-2"},null,-1),te(" 아직 답변이 등록되지 않았습니다. 관리자의 답변을 기다려 주세요. ",-1)])]))]),_:1}),n("div",Me,[p(g(_),{label:"목록으로 돌아가기",icon:"pi pi-arrow-left",severity:"secondary",class:"p-button-sm p-button-outlined rounded-full",onClick:a[1]||(a[1]=C=>g(s).push("/qna"))})])])):w("",!0)]),_:1})])],64))}},Je=Q(Ve,[["__scopeId","data-v-a3f481c2"]]);export{Je as default};
