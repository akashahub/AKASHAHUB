const BOOKS: Record<string, { name: string; filename: string; legacyUrl: string }> = {
 "legado-o-eixo": { name:"O Eixo — Arquitetura da Essência", filename:"01_O_Eixo_Arquitetura_da_Essencia.pdf", legacyUrl:"https://res.cloudinary.com/dcbarseus/image/upload/v1795165614/01_O_Eixo_Arquitetura_da_Essencia_xxwxry.pdf" },
 "legado-casa-digital": { name:"Casa Digital — Império Digital", filename:"02_Casa_Digital_Imperio_Digital.pdf", legacyUrl:"https://res.cloudinary.com/dcbarseus/image/upload/v1795165614/02_Casa_Digital_Imperio_Digital_kw6gif.pdf" },
 "legado-dinheiro-com-criterio": { name:"Dinheiro com Critério — Alinhamento Financeiro", filename:"03_Dinheiro_com_Criterio_Alinhamento_Financeiro.pdf", legacyUrl:"https://res.cloudinary.com/dcbarseus/image/upload/v1795165614/03_Dinheiro_com_Criterio_Alinhamento_Financeiro_qqtjky.pdf" },
 "legado-pontes": { name:"Pontes — Expansão", filename:"04_Pontes_Expansao.pdf", legacyUrl:"https://res.cloudinary.com/dcbarseus/image/upload/v1795166920/04_Pontes_Expansao_uoxtnj.pdf" },
 "legado-o-que-permanece": { name:"O Que Permanece — Legado", filename:"05_O_Que_Permanece_Legado.pdf", legacyUrl:"https://res.cloudinary.com/dcbarseus/image/upload/v1795165614/05_O_Que_Permanece_Legado_qhjvnv.pdf" }
};
const cors = {
 "Access-Control-Allow-Origin":"https://akashahub.com.br",
 "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
 "Access-Control-Allow-Methods":"GET, OPTIONS"
};
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="GET")return Response.json({error:"method_not_allowed"},{status:405,headers:cors});
 const sessionId=new URL(req.url).searchParams.get("session_id")||"";
 if(!/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(sessionId))return Response.json({error:"invalid_session"},{status:400,headers:cors});
 const stripeKey=Deno.env.get("STRIPE_SECRET_KEY")||"";
 if(!stripeKey)return Response.json({error:"payments_not_configured"},{status:503,headers:cors});
 const stripeResponse=await fetch("https://api.stripe.com/v1/checkout/sessions/"+encodeURIComponent(sessionId),{headers:{Authorization:"Bearer "+stripeKey}});
 const session=await stripeResponse.json();
 if(!stripeResponse.ok)return Response.json({error:"session_not_found"},{status:404,headers:cors});
 if(session.mode!=="payment"||session.payment_status!=="paid"||session.metadata?.source!=="akasha-store")return Response.json({error:"payment_not_confirmed"},{status:402,headers:cors});
 const sku=String(session.metadata?.sku||"");
 const book=BOOKS[sku];
 if(!book)return Response.json({error:"book_not_found"},{status:404,headers:cors});
 const supabaseUrl=Deno.env.get("SUPABASE_URL")||"";
 const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
 if(supabaseUrl&&serviceKey){
  const path="arquitetura-legado/"+sku+".pdf";
  const signed=await fetch(supabaseUrl+"/storage/v1/object/sign/livros/"+path,{
   method:"POST",headers:{apikey:serviceKey,Authorization:"Bearer "+serviceKey,"Content-Type":"application/json"},
   body:JSON.stringify({expiresIn:300,download:book.filename})
  });
  if(signed.ok){
   const data=await signed.json();
   const raw=String(data.signedURL||data.signedUrl||"");
   if(raw){
    const url=raw.startsWith("http")?raw:(supabaseUrl+"/storage/v1"+(raw.startsWith("/")?raw:"/"+raw));
    return Response.json({name:book.name,url,filename:book.filename,delivery:"private_signed_url"},{headers:{...cors,"Cache-Control":"no-store"}});
   }
  }else if(signed.status!==400&&signed.status!==404){
   console.error("[getStoreBookDownload] storage signing failed",signed.status,await signed.text());
   return Response.json({error:"private_download_temporarily_unavailable"},{status:503,headers:cors});
  }
 }
 // Temporary fallback while the five source PDFs are being copied into the private bucket.
 return Response.json({name:book.name,url:book.legacyUrl,filename:book.filename,delivery:"legacy_public_fallback"},{headers:{...cors,"Cache-Control":"no-store"}});
});