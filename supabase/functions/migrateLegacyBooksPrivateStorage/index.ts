const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const FIREBASE_API_KEY = "AIzaSyAQXJDGfsd7RgcYKm9wfuh6nOth7dWo-v4";
const ADMIN_UID = "1GO7dRdFUFg2NwYwzOwjvtWfpAS2";
const BOOKS = [
 ["legado-o-eixo","https://res.cloudinary.com/dcbarseus/image/upload/v1795165614/01_O_Eixo_Arquitetura_da_Essencia_xxwxry.pdf"],
 ["legado-casa-digital","https://res.cloudinary.com/dcbarseus/image/upload/v1795165614/02_Casa_Digital_Imperio_Digital_kw6gif.pdf"],
 ["legado-dinheiro-com-criterio","https://res.cloudinary.com/dcbarseus/image/upload/v1795165614/03_Dinheiro_com_Criterio_Alinhamento_Financeiro_qqtjky.pdf"],
 ["legado-pontes","https://res.cloudinary.com/dcbarseus/image/upload/v1795166920/04_Pontes_Expansao_uoxtnj.pdf"],
 ["legado-o-que-permanece","https://res.cloudinary.com/dcbarseus/image/upload/v1795165614/05_O_Que_Permanece_Legado_qhjvnv.pdf"]
];
const cors = {
 "Access-Control-Allow-Origin":"https://akashahub.com.br",
 "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
 "Access-Control-Allow-Methods":"POST, OPTIONS",
 "Content-Type":"application/json",
 "Cache-Control":"no-store"
};
async function getUser(token:string) {
 const r=await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="+FIREBASE_API_KEY,{
  method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToken:token})
 });
 if(!r.ok)return null; const d=await r.json(); const u=d.users?.[0];
 return u?.localId&&!u.disabled?u:null;
}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 if(req.method!=="POST")return Response.json({error:"method_not_allowed"},{status:405,headers:cors});
 const bearer=req.headers.get("Authorization")||"";
 const user=await getUser(bearer.startsWith("Bearer ")?bearer.slice(7):"");
 if(!user||user.localId!==ADMIN_UID)return Response.json({error:"admin_only"},{status:403,headers:cors});
 if(!SUPABASE_URL||!SERVICE_KEY)return Response.json({error:"storage_not_configured"},{status:503,headers:cors});
 const results=[];
 for(const [sku,url] of BOOKS){
  try{
   const file=await fetch(url,{redirect:"follow"});
   if(!file.ok)throw new Error("source_http_"+file.status);
   const bytes=new Uint8Array(await file.arrayBuffer());
   if(new TextDecoder().decode(bytes.slice(0,5))!=="%PDF-"||bytes.length<1000)throw new Error("invalid_pdf_payload");
   const path="arquitetura-legado/"+sku+".pdf";
   const uploaded=await fetch(SUPABASE_URL+"/storage/v1/object/livros/"+path,{
    method:"POST",headers:{apikey:SERVICE_KEY,Authorization:"Bearer "+SERVICE_KEY,"Content-Type":"application/pdf","Cache-Control":"no-store","x-upsert":"false"},body:bytes
   });
   if(!uploaded.ok){
    const detail=await uploaded.text();
    if(uploaded.status===409||/already exists|duplicate/i.test(detail)){results.push({sku,status:"already_exists",bytes:bytes.length});continue;}
    throw new Error("storage_upload_"+uploaded.status+":"+detail.slice(0,180));
   }
   results.push({sku,status:"uploaded",bytes:bytes.length});
  }catch(e){results.push({sku,status:"failed",error:String(e instanceof Error?e.message:e)});}
 }
 return Response.json({ok:results.every(x=>x.status==="uploaded"||x.status==="already_exists"),results},{headers:cors});
});