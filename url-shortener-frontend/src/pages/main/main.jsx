import "./main.css"
import { ShortenForm } from "../../components/ShortenForm";

export function Main(){
    return (
        <div className="min-h-screen flex items-center justify-center h-screen">
            <div className="w-full flex h-screen">
                <div className="hidden md:flex h-screen flex-1 items-center justify-center">
                    <p className="text-2xl text-gray-800 text-center p-2">
                        Uzun URL'ni buraya yapıştır, anında paylaşılabilir bir bağlantı al.
                    </p>
                </div>
                {/*Sağ:Form kartı*/}
                <div className="flex flex-1 h-screen items-center justify-center">
                    {<ShortenForm/>}
                </div>
            </div>
        </div>
    );
}