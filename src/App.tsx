import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VisualizationCanvas from './components/VisualizationCanvas';
import AIInsightsPanel from './components/AIInsightsPanel';
import { type Session } from '@supabase/supabase-js';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data:{subscription}} = supabase.auth.onAuthStateChange((_event,session)=>{
      setSession(session);
    })

    return ()=>subscription.unsubscribe();

  }, []);

  if(loading){
    return(
<div className="h-screen w-full flex items-center justify-center bg-pin-charcoal">
        <div className="w-8 h-8 border-4 border-pin-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session){
    return <Login/>
  }

  return (
    <div className="flex h-screen w-full bg-pin-gray overflow-hidden">
      <Sidebar />
      {/* Reduced padding on mobile (p-2), full padding on desktop (md:p-8) */}
      <main className="flex-1 flex flex-col p-2 md:p-8 relative">
        <Header />
        <div className="flex-1 rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-black/5 relative">
          <VisualizationCanvas />
        </div>
        <AIInsightsPanel />
      </main>
    </div>
  );
}