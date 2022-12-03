import { ReactNode } from "react";
import AssociationGraph from "../src/components/AssociationGraph";

export default function Home() {
  return (
    <div className='px-4 py-2 flex flex-wrap gap-4'>
      <Card>
        <AssociationGraph />
      </Card>
    </div>
  )
}

function Card ({children}: {children: ReactNode}) {
  return <div className="rounded-md shadow flex-1 h-[100vh]">
    {children}
  </div>
}