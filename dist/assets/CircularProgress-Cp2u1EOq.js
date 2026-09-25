import{r as e,t}from"./jsx-runtime-DAs1UGHr.js";import{C as n,E as r,H as i,O as a,P as o,S as s,U as c,V as l,at as u,ot as d,ut as f,w as p}from"./Typography-C0aLz4wF.js";function m(e){return i(`MuiCircularProgress`,e)}l(`MuiCircularProgress`,[`root`,`determinate`,`indeterminate`,`colorPrimary`,`colorSecondary`,`svg`,`track`,`circle`,`circleDeterminate`,`circleIndeterminate`,`circleDisableShrink`]);var h=e(f()),g=t(),_=44,v=d`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,y=d`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: -126px;
  }
`,b=typeof v==`string`?null:u`
        animation: ${v} 1.4s linear infinite;
      `,x=typeof y==`string`?null:u`
        animation: ${y} 1.4s ease-in-out infinite;
      `,S=e=>{let{classes:t,variant:r,color:i,disableShrink:a}=e;return o({root:[`root`,r,`color${n(i)}`],svg:[`svg`],track:[`track`],circle:[`circle`,`circle${n(r)}`,a&&`circleDisableShrink`]},m,t)},C=a(`span`,{name:`MuiCircularProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:r}=e;return[t.root,t[r.variant],t[`color${n(r.color)}`]]}})(p(({theme:e})=>({display:`inline-block`,variants:[{props:{variant:`determinate`},style:{transition:e.transitions.create(`transform`)}},{props:{variant:`indeterminate`},style:b||{animation:`${v} 1.4s linear infinite`}},...Object.entries(e.palette).filter(s()).map(([t])=>({props:{color:t},style:{color:(e.vars||e).palette[t].main}}))]}))),w=a(`svg`,{name:`MuiCircularProgress`,slot:`Svg`})({display:`block`}),T=a(`circle`,{name:`MuiCircularProgress`,slot:`Circle`,overridesResolver:(e,t)=>{let{ownerState:r}=e;return[t.circle,t[`circle${n(r.variant)}`],r.disableShrink&&t.circleDisableShrink]}})(p(({theme:e})=>({stroke:`currentColor`,variants:[{props:{variant:`determinate`},style:{transition:e.transitions.create(`stroke-dashoffset`)}},{props:{variant:`indeterminate`},style:{strokeDasharray:`80px, 200px`,strokeDashoffset:0}},{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:x||{animation:`${y} 1.4s ease-in-out infinite`}}]}))),E=a(`circle`,{name:`MuiCircularProgress`,slot:`Track`})(p(({theme:e})=>({stroke:`currentColor`,opacity:(e.vars||e).palette.action.activatedOpacity}))),D=h.forwardRef(function(e,t){let n=r({props:e,name:`MuiCircularProgress`}),{className:i,color:a=`primary`,disableShrink:o=!1,enableTrackSlot:s=!1,size:l=40,style:u,thickness:d=3.6,value:f=0,variant:p=`indeterminate`,...m}=n,h={...n,color:a,disableShrink:o,size:l,thickness:d,value:f,variant:p,enableTrackSlot:s},v=S(h),y={},b={},x={};if(p===`determinate`){let e=2*Math.PI*((_-d)/2);y.strokeDasharray=e.toFixed(3),x[`aria-valuenow`]=Math.round(f),y.strokeDashoffset=`${((100-f)/100*e).toFixed(3)}px`,b.transform=`rotate(-90deg)`}return(0,g.jsx)(C,{className:c(v.root,i),style:{width:l,height:l,...b,...u},ownerState:h,ref:t,role:`progressbar`,...x,...m,children:(0,g.jsxs)(w,{className:v.svg,ownerState:h,viewBox:`${_/2} ${_/2} ${_} ${_}`,children:[s?(0,g.jsx)(E,{className:v.track,ownerState:h,cx:_,cy:_,r:(_-d)/2,fill:`none`,strokeWidth:d,"aria-hidden":`true`}):null,(0,g.jsx)(T,{className:v.circle,style:y,ownerState:h,cx:_,cy:_,r:(_-d)/2,fill:`none`,strokeWidth:d})]})})});export{D as t};