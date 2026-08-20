import{u as x,b as h,j as e,H as g}from"./app-BMfjkqbX.js";import b from"./PublicLayout-DpdZH7mn.js";import"./x-D7Y5cvfi.js";import"./mail-D3DX8mWR.js";import"./arrow-right-CDyIXwbY.js";function w({categories:n}){const{flash:s}=x().props,{data:r,setData:t,post:d,processing:i,errors:o,reset:m}=h({name:"",email:"",title:"",story:"",allow_contact:!1,allow_publication:!0}),p=a=>{a.preventDefault(),d("/share-your-story",{onSuccess:()=>m()})},c=r.story.trim().length,u=c>=50;return e.jsxs(b,{title:"Share Your Story",children:[e.jsxs(g,{children:[e.jsx("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),e.jsx("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"true"}),e.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,340;0,9..144,480;0,9..144,600;1,9..144,480&family=Inter:wght@400;500;600;700&display=swap",rel:"stylesheet"}),e.jsx("style",{children:`
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

                    // .story-page .manuscript-card::before {
                    //     content: '';
                    //     position: absolute;
                    //     top: 0;
                    //     left: 34px;
                    //     width: 1px;
                    //     height: 100%;
                    //     background: var(--blue-tint);
                    // }

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
                `})]}),e.jsxs("div",{className:"story-page",children:[e.jsx("section",{className:"mx-auto max-w-5xl px-5 pt-20 pb-16 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"max-w-2xl",children:[e.jsx("p",{className:"eyebrow",children:"Your voice matters"}),e.jsx("div",{className:"hero-rule mt-4 mb-6"}),e.jsxs("h1",{className:"display mt-2 text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl",children:["Every life",e.jsx("br",{}),"writes a chapter"," ",e.jsx("span",{style:{color:"var(--blue)",fontStyle:"italic"},children:"worth reading"}),"."]}),e.jsx("p",{className:"mt-6 text-lg leading-8",style:{color:"var(--ink-soft)"},children:"Tell us about a relationship, a turning point, a lesson learned the hard way, or a journey still in progress. We read every submission, and yours could be the one that reaches someone who needs it."})]})}),e.jsx("section",{className:"mx-auto max-w-5xl px-5 pb-16 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"grid gap-10 sm:grid-cols-3",children:[e.jsxs("div",{className:"reason-card pt-5",children:[e.jsx("span",{className:"quote-mark",children:"“"}),e.jsx("p",{className:"display mt-1 text-lg leading-snug",children:"Your journey might be the exact encouragement someone else is looking for today."})]}),e.jsxs("div",{className:"reason-card pt-5",children:[e.jsx("span",{className:"quote-mark",children:"“"}),e.jsx("p",{className:"display mt-1 text-lg leading-snug",children:"Join a community that treats every kind of experience as worth telling."})]}),e.jsxs("div",{className:"reason-card pt-5",children:[e.jsx("span",{className:"quote-mark",children:"“"}),e.jsx("p",{className:"display mt-1 text-lg leading-snug",children:"What you've lived through can become someone else's wisdom further down the road."})]})]})}),e.jsxs("section",{className:"mx-auto max-w-4xl px-5 pb-24 sm:px-6 lg:px-8",children:[s?.success&&e.jsx("div",{className:"mb-8 rounded-lg border px-5 py-4 text-sm font-medium",style:{borderColor:"var(--blue)",background:"var(--blue-tint)",color:"var(--blue-dark)"},children:s.success}),s?.error&&e.jsx("div",{className:"mb-8 rounded-lg border px-5 py-4 text-sm font-medium",style:{borderColor:"#c0392b",background:"#fdecea",color:"#c0392b"},children:s.error}),e.jsxs("form",{onSubmit:p,className:"manuscript-card rounded-2xl p-6 sm:p-12",children:[e.jsx("p",{className:"eyebrow mb-8",children:"Write your story"}),e.jsxs("div",{className:"grid gap-8 sm:grid-cols-2",children:[e.jsx(l,{label:"Your name",error:o.name,children:e.jsx("input",{value:r.name,onChange:a=>t("name",a.target.value),type:"text",placeholder:"Jane Doe",className:"field-input"})}),e.jsx(l,{label:"Email",error:o.email,children:e.jsx("input",{value:r.email,onChange:a=>t("email",a.target.value),type:"email",placeholder:"you@example.com",className:"field-input"})})]}),e.jsx("div",{className:"mt-8",children:e.jsx(l,{label:"Story title",error:o.title,children:e.jsx("input",{value:r.title,onChange:a=>t("title",a.target.value),type:"text",placeholder:"Give your story a title",className:"field-input"})})}),e.jsxs("div",{className:"mt-10",children:[e.jsxs("div",{className:"flex items-baseline justify-between",children:[e.jsx("label",{className:"field-label",children:"Your story"}),e.jsxs("span",{className:"text-xs",style:{color:u?"var(--blue)":"#A6ADB4"},children:[c,"/50 characters minimum"]})]}),e.jsx("div",{className:"mt-3",children:e.jsx("textarea",{value:r.story,onChange:a=>t("story",a.target.value),placeholder:"Once upon a time…",className:"manuscript-textarea"})}),o.story&&e.jsx("p",{className:"mt-2 text-sm",style:{color:"var(--blue)"},children:o.story})]}),e.jsxs("div",{className:"mt-10 space-y-4 border-t pt-8",style:{borderColor:"#E1E5EA"},children:[e.jsxs("label",{className:"checkbox-row flex cursor-pointer gap-3",children:[e.jsx("input",{type:"checkbox",checked:r.allow_publication,onChange:a=>t("allow_publication",a.target.checked)}),e.jsx("span",{className:"text-sm leading-6",style:{color:"var(--ink-soft)"},children:"I agree that my story may be published after review."})]}),e.jsxs("label",{className:"checkbox-row flex cursor-pointer gap-3",children:[e.jsx("input",{type:"checkbox",checked:r.allow_contact,onChange:a=>t("allow_contact",a.target.checked)}),e.jsx("span",{className:"text-sm leading-6",style:{color:"var(--ink-soft)"},children:"You may contact me about my submission."})]})]}),e.jsx("button",{type:"submit",disabled:i,className:"submit-btn mt-10 w-full rounded-full px-6 py-4 text-sm font-semibold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-10",children:i?"Sending…":"Submit my story"})]})]})]})]})}function l({label:n,error:s,children:r}){return e.jsxs("div",{children:[e.jsx("label",{className:"field-label",children:n}),e.jsx("div",{className:"mt-2",children:r}),s&&e.jsx("p",{className:"mt-2 text-sm",style:{color:"var(--blue)"},children:s})]})}export{w as default};
