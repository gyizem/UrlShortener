import { useState} from "react";

export default function CopyButton({ textToCopy}){
    const [copied, setCopied] = useState(false);

    const handleCopy = async ()=> {
        const toCopy = textToCopy ?? window.location.href;
        try{
            await navigator.clipboard.writeText(toCopy);
            setCopied(true);
            setTimeout(()=> setCopied(false),1500);
        } catch(err){
            console.error(`Copy failed`,err);
        }
    };

return (
    <button
        onClick={handleCopy}
        className={`
           px-4 py-2 transition-colors duration-150 rounded-lg
           trainsition-colors duration-150
           ${copied ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}
           text-white font-medium 
            `}
    >
        {copied
        ? <span> Succesfully copied!</span>
        : <span> Copy dashboard url</span>    
    }
    </button>
);
}
