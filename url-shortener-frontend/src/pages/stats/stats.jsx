import { useState, useEffect} from "react";
import { useParams} from "react-router-dom";

export function Stats(){
    const { alias } = useParams();
    const [stats,setStats] = useState(null);
    const [loading, setLoading]= useState(true);
    const [error,setError] = useState("");

    useEffect(()=>{
        const fetchStats = async()=>{
            try{
                const res = await fetch(`/stats/${alias}`);
                const data = await res.json();
                if(!res.ok) throw new Error(data.error || "Fetch hatası");
                setStats(data);
            } catch(err){
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    },[alias]);

    if(loading) return <p> Yükleniyor..</p>;
    if(error) return <p className="text-red-500">{error}</p>;

    return(
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Stats for: {stats.alias}</h2>
            <p>Total Clicks: {stats.totalClicks}</p>

            <h3 className="font-semibold mt-4">By Country:</h3>
            <ul className="list-disc list-inside">
                {stats.byCountry.map(({country, count})=> (
                    <li key={country}>{country}: {count}</li>
                ))}
            </ul>

            <h3 className="font-semibold mt-4">By City:</h3>
            <ul className="list-disc list-inside">
                {stats.byCity.map(({city,count})=> (
                    <li key={city}>{city}: {count}</li>
                ))}
            </ul>
        </div>
    );
}