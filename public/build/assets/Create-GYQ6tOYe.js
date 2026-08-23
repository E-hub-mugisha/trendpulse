import{b as j,u as k,r as m,j as e,H as w}from"./app-DOtvjv6q.js";import N from"./PublicLayout-CaLy4wTr.js";import"./x-DbJj0Fxb.js";import"./mail-Bwoug2SA.js";import"./arrow-right-hDxmtHVa.js";const i=[{image:"/assets/images/story-carousel/family-1.jpg",caption:"Every family carries a story worth telling."},{image:"/assets/images/story-carousel/community-1.jpg",caption:"Stories that travel from one generation to the next."},{image:"/assets/images/story-carousel/elders-1.jpg",caption:"Wisdom, shared out loud."},{image:"/assets/images/story-carousel/children-1.jpg",caption:"The next chapter starts with you."}];function z({categories:u}){const{flash:t}=j().props,{data:r,setData:o,post:x,processing:g,errors:n,reset:b}=k({name:"",email:"",title:"",story:"",allow_contact:!1,allow_publication:!0}),y=a=>{a.preventDefault(),x("/share-your-story",{onSuccess:()=>b()})},h=r.story.trim().length,f=h>=50,[c,d]=m.useState(0),l=m.useRef(null);m.useEffect(()=>(l.current=setInterval(()=>{d(a=>(a+1)%i.length)},5e3),()=>clearInterval(l.current)),[]);const v=a=>{clearInterval(l.current),d(a),l.current=setInterval(()=>{d(s=>(s+1)%i.length)},5e3)};return e.jsxs(N,{title:"Share Your Story",children:[e.jsxs(w,{children:[e.jsx("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),e.jsx("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"true"}),e.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,340;0,9..144,480;0,9..144,600;1,9..144,480&family=Inter:wght@400;500;600;700&display=swap",rel:"stylesheet"}),e.jsx("style",{children:`
                    .story-page {
                        --paper: #FFFFFF;
                        --paper-line: #E4E9EF;
                        --ink: #0A0A0A;
                        --ink-soft: #4A4A4A;
                        --blue: #0A599E;
                        --blue-dark: #07406F;
                        --blue-tint: #EAF1F8;
                        --card: #FFFFFF;
                        font-family: 'Inter', sans-serif;
                        background: var(--paper);
                        color: var(--ink);
                    }

                    .story-page .display {
                        font-family: 'Fraunces', serif;
                    }

                    .story-page .eyebrow {
                        font-family: 'Inter', sans-serif;
                        font-weight: 600;
                        font-size: 0.72rem;
                        letter-spacing: 0.22em;
                        text-transform: uppercase;
                        color: var(--blue);
                    }

                    .story-page .hero-rule {
                        width: 46px;
                        height: 2px;
                        background: var(--ink);
                    }

                    .story-page .quote-mark {
                        font-family: 'Fraunces', serif;
                        font-size: 3.25rem;
                        line-height: 1;
                        color: var(--blue);
                        opacity: 0.4;
                    }

                    .story-page .reason-card {
                        border-top: 2px solid var(--ink);
                        background: transparent;
                    }

                    .story-page .manuscript-card {
                        background: var(--card);
                        border: 1px solid #E1E5EA;
                        box-shadow: 0 30px 60px -35px rgba(10, 10, 10, 0.25);
                        position: relative;
                    }

                    .story-page label.field-label {
                        font-family: 'Fraunces', serif;
                        font-weight: 500;
                        font-size: 0.95rem;
                        color: var(--ink);
                    }

                    .story-page .field-input {
                        width: 100%;
                        background: transparent;
                        border: none;
                        border-bottom: 1.5px solid #D8DDE3;
                        padding: 0.6rem 0.1rem;
                        outline: none;
                        font-family: 'Inter', sans-serif;
                        font-size: 0.98rem;
                        color: var(--ink);
                        transition: border-color 0.15s ease;
                    }

                    .story-page .field-input::placeholder {
                        color: #9AA1A8;
                    }

                    .story-page .field-input:focus {
                        border-color: var(--blue);
                    }

                    .story-page select.field-input {
                        appearance: none;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%234A4A4A'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E");
                        background-repeat: no-repeat;
                        background-position: right 0.2rem center;
                        background-size: 1.1rem;
                        padding-right: 1.5rem;
                    }

                    .story-page .manuscript-textarea {
                        width: 100%;
                        min-height: 260px;
                        border: none;
                        outline: none;
                        resize: vertical;
                        font-family: 'Fraunces', serif;
                        font-weight: 340;
                        font-size: 1.05rem;
                        line-height: 2.15rem;
                        color: var(--ink);
                        background-image: repeating-linear-gradient(
                            to bottom,
                            transparent 0,
                            transparent 2.1rem,
                            var(--paper-line) 2.1rem,
                            var(--paper-line) calc(2.1rem + 1px)
                        );
                        background-position: 0 0.9rem;
                        padding-top: 0.15rem;
                    }

                    .story-page .manuscript-textarea::placeholder {
                        color: #A6ADB4;
                        font-style: italic;
                    }

                    .story-page .checkbox-row input[type='checkbox'] {
                        appearance: none;
                        width: 1.1rem;
                        height: 1.1rem;
                        border: 1.5px solid #C4CAD1;
                        border-radius: 3px;
                        flex-shrink: 0;
                        margin-top: 2px;
                        display: inline-grid;
                        place-content: center;
                        cursor: pointer;
                    }

                    .story-page .checkbox-row input[type='checkbox']::before {
                        content: '';
                        width: 0.6rem;
                        height: 0.6rem;
                        transform: scale(0);
                        transition: transform 0.1s ease-in;
                        box-shadow: inset 1rem 1rem var(--blue);
                        clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                    }

                    .story-page .checkbox-row input[type='checkbox']:checked::before {
                        transform: scale(1);
                    }

                    .story-page .submit-btn {
                        background: var(--blue);
                        transition: background 0.15s ease, transform 0.1s ease;
                    }

                    .story-page .submit-btn:hover:not(:disabled) {
                        background: var(--blue-dark);
                    }

                    .story-page .submit-btn:active:not(:disabled) {
                        transform: scale(0.99);
                    }

                    /* --- Banner carousel --- */
                    .story-page .banner-carousel {
                        position: relative;
                        height: 62vh;
                        min-height: 420px;
                        max-height: 620px;
                        overflow: hidden;
                        background: var(--ink);
                    }

                    .story-page .banner-slide {
                        position: absolute;
                        inset: 0;
                        background-size: cover;
                        background-position: center;
                        opacity: 0;
                        transition: opacity 1s ease-in-out;
                    }

                    .story-page .banner-slide.is-active {
                        opacity: 1;
                    }

                    .story-page .banner-overlay {
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(
                            180deg,
                            rgba(10, 10, 10, 0.35) 0%,
                            rgba(10, 10, 10, 0.15) 40%,
                            rgba(10, 10, 10, 0.75) 100%
                        );
                    }

                    .story-page .banner-content {
                        position: relative;
                        z-index: 2;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                        padding: 3rem 1.5rem 3.5rem;
                        color: #fff;
                    }

                    .story-page .banner-caption {
                        font-family: 'Fraunces', serif;
                        font-weight: 480;
                        font-style: italic;
                        font-size: 1.15rem;
                        opacity: 0.9;
                        min-height: 1.6em;
                    }

                    .story-page .banner-dots {
                        position: absolute;
                        z-index: 3;
                        right: 1.5rem;
                        bottom: 1.75rem;
                        display: flex;
                        gap: 0.5rem;
                    }

                    .story-page .banner-dot {
                        width: 8px;
                        height: 8px;
                        border-radius: 999px;
                        background: rgba(255, 255, 255, 0.4);
                        border: none;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        padding: 0;
                    }

                    .story-page .banner-dot.is-active {
                        width: 22px;
                        background: #fff;
                    }

                    .story-page .image-credit {
                        font-size: 0.68rem;
                        color: #9AA1A8;
                        letter-spacing: 0.02em;
                    }

                    .story-page .content-col {
                        position: relative;
                    }

                    @media (min-width: 1024px) {
                        .story-page .form-col {
                            position: sticky;
                            top: 2rem;
                            align-self: start;
                        }
                    }
                `})]}),e.jsxs("div",{className:"story-page",children:[e.jsxs("div",{className:"banner-carousel",children:[i.map((a,s)=>e.jsx("div",{className:`banner-slide${s===c?" is-active":""}`,style:{backgroundImage:`url(${a.image})`}},a.image)),e.jsx("div",{className:"banner-overlay"}),e.jsxs("div",{className:"banner-content mx-auto w-full max-w-5xl",children:[e.jsx("p",{className:"eyebrow",style:{color:"#fff",opacity:.85},children:"Your voice matters"}),e.jsxs("h1",{className:"display mt-3 text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl",children:["Every life writes a chapter"," ",e.jsx("span",{style:{fontStyle:"italic"},children:"worth reading"}),"."]}),e.jsx("p",{className:"banner-caption mt-4",children:i[c].caption})]}),e.jsx("div",{className:"banner-dots",children:i.map((a,s)=>e.jsx("button",{type:"button","aria-label":`Go to slide ${s+1}`,className:`banner-dot${s===c?" is-active":""}`,onClick:()=>v(s)},a.image))})]}),e.jsx("p",{className:"image-credit mx-auto max-w-5xl px-5 pt-2 sm:px-6 lg:px-8",children:"Photos via Freepik"}),e.jsxs("section",{className:"mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8",children:[t?.success&&e.jsx("div",{className:"mb-8 rounded-lg border px-5 py-4 text-sm font-medium",style:{borderColor:"var(--blue)",background:"var(--blue-tint)",color:"var(--blue-dark)"},children:t.success}),t?.error&&e.jsx("div",{className:"mb-8 rounded-lg border px-5 py-4 text-sm font-medium",style:{borderColor:"#c0392b",background:"#fdecea",color:"#c0392b"},children:t.error}),e.jsxs("div",{className:"grid gap-12 lg:grid-cols-5 lg:gap-16",children:[e.jsxs("div",{className:"content-col lg:col-span-2",children:[e.jsx("p",{className:"eyebrow",children:"Why share your story"}),e.jsx("div",{className:"hero-rule mt-4 mb-8"}),e.jsx("p",{className:"text-lg leading-8",style:{color:"var(--ink-soft)"},children:"Tell us about a relationship, a turning point, a lesson learned the hard way, or a journey still in progress. We read every submission, and yours could be the one that reaches someone who needs it."}),e.jsxs("div",{className:"mt-10 space-y-8",children:[e.jsxs("div",{className:"reason-card pt-5",children:[e.jsx("span",{className:"quote-mark",children:'"'}),e.jsx("p",{className:"display mt-1 text-lg leading-snug",children:"Your journey might be the exact encouragement someone else is looking for today."})]}),e.jsxs("div",{className:"reason-card pt-5",children:[e.jsx("span",{className:"quote-mark",children:'"'}),e.jsx("p",{className:"display mt-1 text-lg leading-snug",children:"Join a community that treats every kind of experience as worth telling."})]}),e.jsxs("div",{className:"reason-card pt-5",children:[e.jsx("span",{className:"quote-mark",children:'"'}),e.jsx("p",{className:"display mt-1 text-lg leading-snug",children:"What you've lived through can become someone else's wisdom further down the road."})]})]})]}),e.jsx("div",{className:"form-col lg:col-span-3",children:e.jsxs("form",{onSubmit:y,className:"manuscript-card rounded-2xl p-6 sm:p-10",children:[e.jsx("p",{className:"eyebrow mb-8",children:"Share your story"}),e.jsxs("div",{className:"grid gap-8 sm:grid-cols-2",children:[e.jsx(p,{label:"Your name",error:n.name,children:e.jsx("input",{value:r.name,onChange:a=>o("name",a.target.value),type:"text",placeholder:"Jane Doe",className:"field-input"})}),e.jsx(p,{label:"Email",error:n.email,children:e.jsx("input",{value:r.email,onChange:a=>o("email",a.target.value),type:"email",placeholder:"you@example.com",className:"field-input"})})]}),e.jsx("div",{className:"mt-8",children:e.jsx(p,{label:"Story title",error:n.title,children:e.jsx("input",{value:r.title,onChange:a=>o("title",a.target.value),type:"text",placeholder:"Give your story a title",className:"field-input"})})}),e.jsxs("div",{className:"mt-10",children:[e.jsxs("div",{className:"flex items-baseline justify-between",children:[e.jsx("label",{className:"field-label",children:"Your story"}),e.jsxs("span",{className:"text-xs",style:{color:f?"var(--blue)":"#A6ADB4"},children:[h,"/50 characters minimum"]})]}),e.jsx("div",{className:"mt-3",children:e.jsx("textarea",{value:r.story,onChange:a=>o("story",a.target.value),placeholder:"Once upon a time…",className:"manuscript-textarea"})}),n.story&&e.jsx("p",{className:"mt-2 text-sm",style:{color:"var(--blue)"},children:n.story})]}),e.jsxs("div",{className:"mt-10 space-y-4 border-t pt-8",style:{borderColor:"#E1E5EA"},children:[e.jsxs("label",{className:"checkbox-row flex cursor-pointer gap-3",children:[e.jsx("input",{type:"checkbox",checked:r.allow_publication,onChange:a=>o("allow_publication",a.target.checked)}),e.jsx("span",{className:"text-sm leading-6",style:{color:"var(--ink-soft)"},children:"I agree that my story may be published after review."})]}),e.jsxs("label",{className:"checkbox-row flex cursor-pointer gap-3",children:[e.jsx("input",{type:"checkbox",checked:r.allow_contact,onChange:a=>o("allow_contact",a.target.checked)}),e.jsx("span",{className:"text-sm leading-6",style:{color:"var(--ink-soft)"},children:"You may contact me about my submission."})]})]}),e.jsx("button",{type:"submit",disabled:g,className:"submit-btn mt-10 w-full rounded-full px-6 py-4 text-sm font-semibold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-10",children:g?"Sending…":"Submit my story"})]})})]})]})]})]})}function p({label:u,error:t,children:r}){return e.jsxs("div",{children:[e.jsx("label",{className:"field-label",children:u}),e.jsx("div",{className:"mt-2",children:r}),t&&e.jsx("p",{className:"mt-2 text-sm",style:{color:"var(--blue)"},children:t})]})}export{z as default};
