import { useState } from "react";
import logo from "../assets/logo.png"



export function ShortenForm() {
    const [originalUrl, setOriginalUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedMessage, setCopiedMessage] = useState("");

    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        setShortUrl("");
        setLoading(true);

        let url = originalUrl.trim();
        if(!/^https?:\/\//i.test(url)){
            url= `https://${url}`;
        }

        try {
            const res = await fetch("/shorten",{
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    original_url: url,
                    alias: alias.trim() || undefined
                })
            });
        const data = await res.json();
        if(!res.ok) throw new Error(data.error || "Bilinmeyen bir hata oluştu");

        setShortUrl(data.short_url);
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }   
    };
    const handleCopyClick = () => {
        if(!shortUrl) return;
        navigator.clipboard.writeText(shortUrl)
        .then(()=> {
            setCopiedMessage("Link copied successfully!");
            setTimeout(()=> setCopiedMessage(""),1500);
        })
        .catch((err) => {
            console.error("Copy failed:",err);
        });
    };
    return (
        <div className="w-full max-w-md md:max-w-lg bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col items-center justify-center text-center gap-3 mb-6">
            <img src={logo} alt="logo" className="w-32 h-32 rounded-full shadow-md"/>
            <p className="text-sm md:text-base text-black italic tracking-wide"> Fast. Simple. Elegant.</p>
            </div>
            <form className="flex flex-col gap-4 md:gap-6 w-full mt-6" onSubmit={handleSubmit}>
                <input type="text" placeholder="Type or paste a link (URL)" className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                       value={originalUrl} onChange={(e)=> setOriginalUrl(e.target.value)}/>
                <input type="text" placeholder="Enter preferred url (optional)" 
                                   className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 md:py-3 text-sm md:text-base text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                   value={alias} onChange={(e)=> setAlias(e.target.value)} />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 md:py-3 font-semibold text-sm md:text-base transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>{loading ? "Shortening" : "Shorten It!"}</button>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {shortUrl && (
                <div className="mt-6 md:mt-8 ">
                    <div onClick={handleCopyClick}
                    className="
                        w-full
                        md:w-1/2
                        mx-auto
                        p-3
                        border-2 border-dashed border-gray-400
                        rounded-md
                        cursor-pointer
                        text-center" >
                    <p className="font-mono break-all test-sm text-black">{shortUrl}</p>
                </div>
                {copiedMessage && (
                    <p className="text-green-500 text-sm mt-2 text-center">
                        {copiedMessage}
                    </p>
                )}
            </div>
            )}
          </div>
    );
}




/*
return (
        <div className="w-2/3 min-h-100 h-1/2 rounded-md p-2 bg-white">
            <h1 className="text-black text-center font-bold text-2xl">GİZEM SHORT</h1>
            <form className="flex flex-col gap-2 items-center w-full mt-5">
                <input type="text" className="text-black border-black border-1 h-9 rounded-md w-1/2" />
                <button type="submit" className="text-black border-black border-1 rounded-md p-1.5 cursor-pointer h-9 w-1/2">Shorten It!</button>
            </form>
        </div>
    )


*/