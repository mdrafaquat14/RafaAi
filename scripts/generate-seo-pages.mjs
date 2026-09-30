import fs from 'node:fs'
import path from 'node:path'

const dist=path.resolve('dist')
const sourcePath=path.join(dist,'index.html')
if(!fs.existsSync(sourcePath)) throw new Error('dist/index.html not found')
const source=fs.readFileSync(sourcePath,'utf8')

const pages={
  about:{title:'About RafaAi — Student AI Assistant',description:'Learn what RafaAi is, who created it, what it can do for students, and how it is designed as a student-first AI learning assistant.',heading:'About RafaAi',intro:'RafaAi is a student-first AI assistant created by Md Rafaquat to make learning, problem solving, studying, writing, and everyday questions easier.',canonical:'https://rafaaii.vercel.app/about'},
  privacy:{title:'Privacy Policy — RafaAi',description:'Read the RafaAi Privacy Policy covering account information, chat history, AI requests, browser storage, security, retention, and user choices.',heading:'Privacy Policy',intro:'This Privacy Policy explains what information the current RafaAi website can handle, why it is used, where it is stored, and what choices are available.',canonical:'https://rafaaii.vercel.app/privacy'},
  terms:{title:'Terms of Use — RafaAi',description:'Read the RafaAi Terms of Use covering accounts, AI-generated answers, academic integrity, files, misuse, usage limits, availability, and third-party services.',heading:'Terms of Use',intro:'These Terms of Use describe the basic rules for using RafaAi. Use the service responsibly and follow applicable laws and school rules.',canonical:'https://rafaaii.vercel.app/terms'}
}
for(const [route,page] of Object.entries(pages)){
 let html=source
 html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${page.title}</title>`)
 html=html.replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/i,`<meta name="description" content="${page.description}" />`)
 html=html.replace(/<link rel="canonical" href="[^"]*"\s*\/?\s*>/i,`<link rel="canonical" href="${page.canonical}" />`)
 html=html.replace(/<meta property="og:title" content="[^"]*"\s*\/?\s*>/i,`<meta property="og:title" content="${page.title}" />`)
 html=html.replace(/<meta property="og:description" content="[^"]*"\s*\/?\s*>/i,`<meta property="og:description" content="${page.description}" />`)
 html=html.replace(/<meta property="og:url" content="[^"]*"\s*\/?\s*>/i,`<meta property="og:url" content="${page.canonical}" />`)
 html=html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?\s*>/i,`<meta name="twitter:title" content="${page.title}" />`)
 html=html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?\s*>/i,`<meta name="twitter:description" content="${page.description}" />`)
 html=html.replace(/<h1>RafaAi — Student AI Assistant<\/h1>/i,`<h1>${page.heading}</h1>`)
 html=html.replace(/<p>RafaAi is a student-first AI assistant for learning, solving questions, studying, writing, and understanding difficult topics\.<\/p>/i,`<p>${page.intro}</p>`)
 const outDir=path.join(dist,route)
 fs.mkdirSync(outDir,{recursive:true})
 fs.writeFileSync(path.join(outDir,'index.html'),html)
}
