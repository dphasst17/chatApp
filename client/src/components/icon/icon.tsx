import { StateContext } from '@/context/state';
import React, { use } from 'react';
import type { SVGProps } from 'react';

export function UserEdit(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 50 50" {...props}><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path stroke="#344054" d="m43.146 33.52l-10.23 10.23h-5.833v-5.833l10.23-10.23a2.084 2.084 0 0 1 2.916 0l2.917 2.917a2.084 2.084 0 0 1 0 2.917"></path><path stroke="#306cfe" d="M35.417 19.313q.015-.282 0-.563A12.5 12.5 0 1 0 22 31.25"></path><path stroke="#306cfe" d="M18.75 43.75c-9.27-.77-12.5-4.167-12.5-4.167V37.5a10.42 10.42 0 0 1 7.27-9.896"></path></g></svg>);
}

export function GroupLine(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" fillRule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="#3a83bb" d="M13 13a4 4 0 0 1 4 4v2a1 1 0 1 1-2 0v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2a1 1 0 1 1-2 0v-2a4 4 0 0 1 4-4zm6 0a3 3 0 0 1 3 3v2a1 1 0 1 1-2 0v-2a1 1 0 0 0-1-1h-1.416a5 5 0 0 0-1.583-2zM9.5 3a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9M18 6a3 3 0 1 1 0 6a3 3 0 0 1 0-6M9.5 5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5M18 8a1 1 0 1 0 0 2a1 1 0 0 0 0-2"></path></g></svg>);
}

export function UserSearch(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}><g fill="none" stroke="#000" strokeLinejoin="round" strokeWidth={4}><path fill="#2f88ff" d="M19 20C22.866 20 26 16.866 26 13C26 9.13401 22.866 6 19 6C15.134 6 12 9.13401 12 13C12 16.866 15.134 20 19 20Z"></path><path strokeLinecap="round" d="M27 28H18.8C14.3196 28 12.0794 28 10.3681 28.8719C8.86278 29.6389 7.63893 30.8628 6.87195 32.3681C6 34.0794 6 36.3196 6 40.8V42H27"></path><path strokeLinecap="round" d="M39.9997 41.0002L36.8281 37.8286"></path><path fill="#2f88ff" strokeLinecap="round" d="M38 35C38 36.1046 37.5523 37.1046 36.8284 37.8284C36.1046 38.5523 35.1046 39 34 39C31.7909 39 30 37.2091 30 35C30 32.7909 31.7909 31 34 31C36.2091 31 38 32.7909 38 35Z"></path></g></svg>);
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}><g fill="none" strokeLinejoin="round" strokeWidth={4}><path fill="#2f88ff" stroke="#000" d="M21 38C30.3888 38 38 30.3888 38 21C38 11.6112 30.3888 4 21 4C11.6112 4 4 11.6112 4 21C4 30.3888 11.6112 38 21 38Z"></path><path stroke="#fff" strokeLinecap="round" d="M26.657 14.3431C25.2093 12.8954 23.2093 12 21.0001 12C18.791 12 16.791 12.8954 15.3433 14.3431"></path><path stroke="#000" strokeLinecap="round" d="M33.2216 33.2217L41.7069 41.707"></path></g></svg>);
}

export function FriendAdd(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="#3a83bb" fillRule="evenodd" d="M7.832 12.35C7.096 11.478 6.5 9.85 6.5 8.71V7a4 4 0 0 1 8 0v1.71c0 1.14-.6 2.773-1.332 3.642l-.361.428c-.59.699-.406 1.588.419 1.99l5.66 2.762c.615.3 1.114 1.093 1.114 1.783v.687a1 1 0 0 1-1.001.998H2a1 1 0 0 1-1-.998v-.687c0-.685.498-1.483 1.114-1.784l5.66-2.762c.821-.4 1.012-1.288.42-1.99zM2.2 19.8h16.6v-.485c0-.229-.235-.605-.44-.705l-5.66-2.76c-1.527-.745-1.904-2.546-.81-3.843l.36-.428c.552-.654 1.05-2.014 1.05-2.868V7c0-1.545-1.254-2.8-2.8-2.8A2.803 2.803 0 0 0 7.7 7v1.71c0 .856.496 2.21 1.05 2.866l.36.429c1.097 1.299.715 3.099-.81 3.843L2.64 18.61c-.203.099-.44.479-.44.705zm16.7-8.9V8h1.2v2.9H23v1.2h-2.9V15h-1.2v-2.9H16v-1.2z"></path></svg>);
}

export function MessageCircle(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><circle cx={12} cy={12} r={1} fill="#3a83bb"></circle><circle cx={16} cy={12} r={1} fill="#3a83bb"></circle><circle cx={8} cy={12} r={1} fill="#3a83bb"></circle><path fill="#3a83bb" d="M19.07 4.93a10 10 0 0 0-16.28 11a1.06 1.06 0 0 1 .09.64L2 20.8a1 1 0 0 0 .27.91A1 1 0 0 0 3 22h.2l4.28-.86a1.26 1.26 0 0 1 .64.09a10 10 0 0 0 11-16.28Zm.83 8.36a8 8 0 0 1-11 6.08a3.3 3.3 0 0 0-1.25-.26a3.4 3.4 0 0 0-.56.05l-2.82.57l.57-2.82a3.1 3.1 0 0 0-.21-1.81a8 8 0 0 1 6.08-11a8 8 0 0 1 9.19 9.19"></path></svg>);
}

export function ChatSquare(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 50 50" {...props}><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path stroke="#344054" d="M14.583 41.667h-6.25a2.083 2.083 0 0 1-2.083-2.084V16.667M22.917 25h12.5m-12.5-8.333h12.5z"></path><path stroke="#306cfe" d="M41.667 8.333h-25a2.083 2.083 0 0 0-2.084 2.084V31.25a2.083 2.083 0 0 0 2.084 2.083h6.25v6.25l10.416-6.25h8.334a2.083 2.083 0 0 0 2.083-2.083V10.417a2.083 2.083 0 0 0-2.083-2.084"></path></g></svg>);
}

export function ImageIcon(props: SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}><g fill="none"><path fill="url(#fluentColorImage482)" d="M6 12.25A6.25 6.25 0 0 1 12.25 6h23.5A6.25 6.25 0 0 1 42 12.25v23.5A6.25 6.25 0 0 1 35.75 42h-23.5A6.25 6.25 0 0 1 6 35.75z"></path><path fill="url(#fluentColorImage480)" d="m40.835 39.385l-14.36-14.36a3.5 3.5 0 0 0-4.95 0l-14.36 14.36A6.24 6.24 0 0 0 12.25 42h23.5a6.24 6.24 0 0 0 5.085-2.615"></path><path fill="url(#fluentColorImage481)" d="M27 17a4 4 0 1 1 8 0a4 4 0 0 1-8 0"></path><defs><linearGradient id="fluentColorImage480" x1={19.19} x2={23.289} y1={24} y2={42.935} gradientUnits="userSpaceOnUse"><stop stopColor="#b3e0ff"></stop><stop offset={1} stopColor="#8cd0ff"></stop></linearGradient><linearGradient id="fluentColorImage481" x1={29.4} x2={32.323} y1={12.111} y2={22.633} gradientUnits="userSpaceOnUse"><stop stopColor="#fdfdfd"></stop><stop offset={1} stopColor="#b3e0ff"></stop></linearGradient><radialGradient id="fluentColorImage482" cx={0} cy={0} r={1} gradientTransform="matrix(61.71419 78.10727 -71.04382 56.1332 -8.142 -14.25)" gradientUnits="userSpaceOnUse"><stop offset={0.338} stopColor="#0fafff"></stop><stop offset={0.529} stopColor="#367af2"></stop></radialGradient></defs></g></svg>
}

export function EmojiIcon(props: SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" {...props}><ellipse cx={32} cy={31.964} fill="#fbbf67" rx={32} ry={31.961}></ellipse><path fill="#633d19" d="M52.1 39.35c0 10.996-8.932 19.921-19.947 19.921c-11.01 0-19.941-8.925-19.941-19.921m17.181-14.2c-1.371-3.738-4.481-7.317-8.775-7.232c-4 .076-6.419 4.308-7.725 7.512c-.814 2 2.428 2.861 3.234.89c.838-2.057 2.073-4.329 4.339-5.02c2.594-.794 4.968 2.764 5.692 4.739c.737 2.01 3.978 1.144 3.235-.891m5.827-.028c1.371-3.739 4.479-7.316 8.774-7.234c4.01.078 6.417 4.309 7.723 7.512c.817 2-2.428 2.863-3.232.892c-.838-2.059-2.075-4.329-4.338-5.02c-2.597-.792-4.971 2.767-5.693 4.741c-.738 2.01-3.979 1.138-3.234-.892"></path><path fill="#fff" d="M48.688 41.35c0 4.392-7.553 7.958-16.863 7.958c-9.303 0-16.858-3.566-16.858-7.958"></path></svg>
}

export function TagMore(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="#3a83bb" d="M9 20q-.475 0-.9-.213t-.7-.587L2 12l5.4-7.2q.275-.375.7-.587T9 4h11q.825 0 1.413.587T22 6v12q0 .825-.587 1.413T20 20zm-4.5-8L9 18h11V6H9zm5.5 1q.425 0 .713-.288T11 12t-.288-.712T10 11t-.712.288T9 12t.288.713T10 13m3.5 0q.425 0 .713-.288T14.5 12t-.288-.712T13.5 11t-.712.288T12.5 12t.288.713t.712.287m3.5 0q.425 0 .713-.288T18 12t-.288-.712T17 11t-.712.288T16 12t.288.713T17 13m-2.5-1"></path></svg>);
}

export function FileIcon(props: SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}><path fill="#ffa000" d="M40 12H22l-4-4H8c-2.2 0-4 1.8-4 4v8h40v-4c0-2.2-1.8-4-4-4"></path><path fill="#ffca28" d="M40 12H8c-2.2 0-4 1.8-4 4v20c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V16c0-2.2-1.8-4-4-4"></path></svg>
}

export function MessageUpload(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 3.034a33 33 0 0 0-3.67.037c-4.184.278-7.516 3.657-7.79 7.9a20 20 0 0 0 0 2.52c.1 1.545.783 2.976 1.588 4.184c.467.845.159 1.9-.328 2.823c-.35.665-.526.997-.385 1.237c.14.24.455.248 1.084.263c1.245.03 2.084-.322 2.75-.813c.377-.279.566-.418.696-.434s.387.09.899.3c.46.19.995.307 1.485.34c1.425.094 2.914.094 4.342 0c4.183-.278 7.515-3.658 7.789-7.9q.031-.492.038-.991M8.5 15h7m-7-5H12m5-5.5c.491-.506 1.8-2.5 2.5-2.5M22 4.5c-.491-.506-1.8-2.5-2.5-2.5m0 0v8" color="#3a83bb"></path></svg>);
}

export function ChatInfo(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="#3a83bb" d="M12 6.616q.271 0 .443-.173q.173-.172.173-.443t-.173-.443T12 5.385t-.443.172t-.173.443t.173.443t.443.173m-.5 7.807h1V8.346h-1zM3 20.077V4.616q0-.691.463-1.153T4.615 3h14.77q.69 0 1.152.463T21 4.616v10.769q0 .69-.463 1.153T19.385 17H6.077zM5.65 16h13.735q.23 0 .423-.192t.192-.423V4.615q0-.23-.192-.423T19.385 4H4.615q-.23 0-.423.192T4 4.615v13.03zM4 16V4z"></path></svg>);
}

export function VideoCall(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}><path fill="#1d8cc3" d="M8 12h22c2.2 0 4 1.8 4 4v16c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V16c0-2.2 1.8-4 4-4"></path><path fill="#1d8cc3" d="m44 35l-10-6V19l10-6z"></path></svg>);
}

export function ReactionIcon(props: SVGProps<SVGSVGElement>) {
    const { mode } = use(StateContext)
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
        <path fill={`${mode === 'dark' ? '#fff' : '#000'}`} d="M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51q.709-1.643 1.924-2.859T8.49 3.709T12 3q.998 0 1.94.203q.943.203 1.79.603V4.92q-.836-.442-1.773-.682Q13.019 4 12 4Q8.675 4 6.337 6.338T4 12t2.338 5.663T12 20t5.663-2.337T20 12q0-.723-.124-1.406t-.36-1.325h1.073q.205.648.308 1.323T21 12q0 1.868-.708 3.51t-1.923 2.858t-2.857 1.923t-3.509.709M20.5 6.5v-2h-2v-1h2v-2h1v2h2v1h-2v2zm-5.188 4.116q.467 0 .789-.327t.322-.793t-.326-.79q-.327-.321-.794-.321t-.789.326t-.322.793t.327.79q.326.322.793.322m-6.615 0q.466 0 .788-.327q.323-.327.323-.793q0-.467-.327-.79q-.327-.321-.793-.321q-.467 0-.789.326q-.322.327-.322.793q0 .467.326.79q.327.322.794.322M12 16.884q1.459 0 2.65-.789q1.19-.79 1.796-2.095H7.554q.605 1.306 1.796 2.095t2.65.79"></path></svg>);
}

export function EditImageIcon(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" {...props}><path fill="#8cbcd6" d="M31 41H8c-2.2 0-4-1.8-4-4V11c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4v17c0 7.2-5.8 13-13 13"></path><circle cx={35} cy={16} r={3} fill="#b3ddf5"></circle><path fill="#9ac9e3" d="M20 16L9 32h22z"></path><path fill="#b3ddf5" d="m31 22l-8 10h16z"></path><path fill="#e57373" d="m47.7 29.1l-2.8-2.8c-.4-.4-1.1-.4-1.6 0L42 27.6l4.4 4.4l1.3-1.3c.4-.4.4-1.1 0-1.6"></path><path fill="#ff9800" d="M27.467 42.167L39.77 29.865l4.384 4.384L31.85 46.55z"></path><path fill="#b0bec5" d="m46.4 32.038l-2.192 2.192l-4.383-4.384l2.192-2.191z"></path><path fill="#ffc107" d="M27.5 42.2L26 48l5.8-1.5z"></path><path fill="#37474f" d="m26.7 45l-.7 3l3-.7z"></path></svg>);
}

export function EditIcon(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 50 50" {...props}><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path stroke="#344054" d="M42.52 13.354L36.647 7.48a2.083 2.083 0 0 0-2.959 0l-6 6l8.834 8.834l6-6a2.084 2.084 0 0 0 0-2.959"></path><path stroke="#306cfe" d="m21.813 19.354l8.833 8.834L15.083 43.75H6.25v-8.833z"></path></g></svg>);
}
export function BackIcon(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="0.5em" height="1em" viewBox="0 0 12 24" {...props}><path fill="#3a83bb" fillRule="evenodd" d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"></path></svg>);
}

export function MessageReply(props: SVGProps<SVGSVGElement>) {
    const { mode } = use(StateContext)
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
        <path fill={`${mode === 'dark' ? '#fff' : '#000'}`} d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2m0 15.2L18.8 16H4V4h16z"></path></svg>);
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="red" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg>);
}

export function DeleteIcon(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="#3a83bb" d="M19 3a3 3 0 0 1 2.995 2.824L22 6v12a3 3 0 0 1-2.824 2.995L19 21H8.108a3 3 0 0 1-2.436-1.25l-.108-.16l-4.08-6.53a2 2 0 0 1-.087-1.967l.086-.153l4.081-6.53a3 3 0 0 1 2.351-1.404L8.108 3zm0 2H8.108a1 1 0 0 0-.773.366l-.075.104L3.18 12l4.08 6.53a1 1 0 0 0 .72.462l.128.008H19a1 1 0 0 0 .993-.883L20 18V6a1 1 0 0 0-.883-.993zm-8.121 3.464l2.12 2.122l2.122-2.122a1 1 0 1 1 1.414 1.415L14.415 12l2.12 2.121a1 1 0 0 1-1.414 1.415L13 13.414l-2.121 2.122a1 1 0 1 1-1.415-1.415L11.586 12L9.464 9.879a1 1 0 0 1 1.415-1.415"></path></g></svg>);
}
export function SunIcon(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="none" stroke="#edda07" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><circle cx={12} cy={32} r={6} fill="#edda07"><animate fill="freeze" attributeName="cy" dur="0.6s" values="32;12"></animate></circle><g><path strokeDasharray={2} strokeDashoffset={2} d="M12 19v1M19 12h1M12 5v-1M5 12h-1"><animate fill="freeze" attributeName="d" begin="0.7s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"></animate><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="2;0"></animate></path><path strokeDasharray={2} strokeDashoffset={2} d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5"><animate fill="freeze" attributeName="d" begin="0.9s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"></animate><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.9s" dur="0.2s" values="2;0"></animate></path><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform></g></g></svg>);
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><g fill="#00426b" fillOpacity={0}><path d="M15.22 6.03l2.53-1.94L14.56 4L13.5 1l-1.06 3l-3.19.09l2.53 1.94l-.91 3.06l2.63-1.81l2.63 1.81z"><animate id="lineMdMoonRisingTwotoneLoop0" fill="freeze" attributeName="fill-opacity" begin="0.7s;lineMdMoonRisingTwotoneLoop0.begin+6s" dur="0.4s" values="0;1"></animate><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingTwotoneLoop0.begin+2.2s" dur="0.4s" values="1;0"></animate></path><path d="M13.61 5.25L15.25 4l-2.06-.05L12.5 2l-.69 1.95L9.75 4l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingTwotoneLoop0.begin+3s" dur="0.4s" values="0;1"></animate><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingTwotoneLoop0.begin+5.2s" dur="0.4s" values="1;0"></animate></path><path d="M19.61 12.25L21.25 11l-2.06-.05L18.5 9l-.69 1.95l-2.06.05l1.64 1.25l-.59 1.98l1.7-1.17l1.7 1.17z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingTwotoneLoop0.begin+0.4s" dur="0.4s" values="0;1"></animate><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingTwotoneLoop0.begin+2.8s" dur="0.4s" values="1;0"></animate></path><path d="M20.828 9.731l1.876-1.439l-2.366-.067L19.552 6l-.786 2.225l-2.366.067l1.876 1.439L17.601 12l1.951-1.342L21.503 12z"><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingTwotoneLoop0.begin+3.4s" dur="0.4s" values="0;1"></animate><animate fill="freeze" attributeName="fill-opacity" begin="lineMdMoonRisingTwotoneLoop0.begin+5.6s" dur="0.4s" values="1;0"></animate></path></g><path fill="#00426b" fillOpacity={0.3} stroke="#00426b" strokeLinecap="round" strokeLinejoin="round" d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z" transform="translate(0 22)"><animateMotion fill="freeze" calcMode="linear" dur="0.6s" path="M0 0v-22"></animateMotion></path></svg>);
}

export function NotificationIcon(props: SVGProps<SVGSVGElement>) {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="#3a83bb" d="M5 18.77v-1h1.616V9.845q0-1.96 1.24-3.447T11 4.546V4q0-.417.291-.708q.291-.292.707-.292t.709.292T13 4v.546q1.904.365 3.144 1.853t1.24 3.447v7.923H19v1zm6.997 2.615q-.668 0-1.14-.475t-.472-1.14h3.23q0 .67-.475 1.142q-.476.472-1.143.472M7.616 17.77h8.769V9.846q0-1.823-1.281-3.104T12 5.462t-3.104 1.28t-1.28 3.104z"></path></svg>);
}

export const LogOutIcon = (props: SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}><g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path strokeDasharray={36} strokeDashoffset={36} d="M12 4h-7c-0.55 0 -1 0.45 -1 1v14c0 0.55 0.45 1 1 1h7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="36;0"></animate></path><path strokeDasharray={14} strokeDashoffset={14} d="M9 12h11.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;0"></animate></path><path strokeDasharray={6} strokeDashoffset={6} d="M20.5 12l-3.5 -3.5M20.5 12l-3.5 3.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="6;0"></animate></path></g></svg>

export const DeleteChatIcon = (props: SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}><path fill="#f20b0b" d="M21 6h-2v6.1c1.2.2 2.2.7 3 1.4V7c0-.5-.5-1-1-1M6 17c0 .5.5 1 1 1h5c0-1.1.3-2.1.8-3H6zM16 2H3c-.5 0-1 .5-1 1v14l4-4h8.7c.7-.5 1.5-.8 2.3-.9V3c0-.5-.5-1-1-1m-1 9H5.2L4 12.2V4h11zm5.12 3.46l1.42 1.42L19.41 18l2.13 2.12l-1.42 1.42L18 19.41l-2.12 2.13l-1.41-1.42L16.59 18l-2.12-2.12l1.41-1.41L18 16.59z"></path></svg>