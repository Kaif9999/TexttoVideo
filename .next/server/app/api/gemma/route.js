(()=>{var e={};e.id=81,e.ids=[81],e.modules={848:e=>{function r(e){var r=Error("Cannot find module '"+e+"'");throw r.code="MODULE_NOT_FOUND",r}r.keys=()=>[],r.resolve=r,r.id=848,e.exports=r},846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},9592:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>x,routeModule:()=>d,serverHooks:()=>m,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>g});var s={};t.r(s),t.d(s,{POST:()=>c});var o=t(2706),n=t(8203),i=t(5994),a=t(9187),u=t(1996);let p=new(t.n(u)())({auth:process.env.REPLICATE_API_KEY||""});async function c(e){try{let{prompt:r,action:t}=await e.json();if(!r)return a.NextResponse.json({error:"Prompt is required!"},{status:400});if(!["generateLyrics"].includes(t))return a.NextResponse.json({error:"Invalid action provided!"},{status:400});if("generateLyrics"===t){let e=await p.run("google-deepmind/gemma-2b-it:dff94eaf770e1fc211e425a50b51baa8e4cac6c39ef074681f9e39d778773626",{input:{prompt:`Write song lyrics based on the following idea in not more than 200 words: "${r}"`}});if(console.log(e),console.log(e),!e||!Array.isArray(e))return a.NextResponse.json({error:"Failed to generate lyrics."},{status:500});return e.join("\n"),a.NextResponse.json({message:"Lyrics and music generated successfully!",lyrics:e})}return a.NextResponse.json({error:"Invalid action provided!"},{status:400})}catch(e){return console.error("Error while generating lyrics and music:",e),a.NextResponse.json({error:"An error occurred while processing your request."},{status:500})}}let d=new o.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/gemma/route",pathname:"/api/gemma",filename:"route",bundlePath:"app/api/gemma/route"},resolvedPagePath:"/home/kaif9999/genvr/TexttoVideo/src/app/api/gemma/route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:l,workUnitAsyncStorage:g,serverHooks:m}=d;function x(){return(0,i.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:g})}},6487:()=>{},8335:()=>{}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[989,452,996],()=>t(9592));module.exports=s})();