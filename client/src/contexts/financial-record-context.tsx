import { useUser } from '@clerk/clerk-react';
import { createContext, useState, useContext, useEffect } from 'react';


export interface FinancialRecord {
    id?: string;
    userId: string;
    date: Date;
    description: string;
    amount: Number;
    category: string;
    paymentMethod: string;
}

interface FinancialRecordContextType{
    records: FinancialRecord[];
    addRecord: (record: FinancialRecord) => void;
    // updateRecord: (id: string, newRecorde: FinancialRecord) => void;
    // delteRecord: (id: string) => void;
}

export const FinancialRecordProvider = ({children}: {children: React.ReactNode}) =>{

    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const { user } = useUser();

    const fetchRecords = async () => {
        if(!user) return;
        const response = await fetch(`http://localhost:3002/financial-records/getAllByUserID/${user?.id}`);
        if(response.ok){
            const records = await response.json();
            setRecords(records);
            console.log(records)
        }
    }

    useEffect(() => {
        fetchRecords();
    },[user]);
        

    const addRecord = async (record: FinancialRecord) => {
        const response = await fetch('http://localhost:3002/financial-records', {
            method : "POST",
            body: JSON.stringify(record),
            headers: {
                'Content-Type': 'application/json'
            }
        });

    try{
        if(response.ok){
            const newRecord = await response.json();
            setRecords((prev) => [...prev, newRecord]);
        }
    }
    catch(err){
        console.error(err);
    }
    

    };

    return (
        <FinancialRecordContext.Provider value={{records, addRecord}}>
            {children}
        </FinancialRecordContext.Provider>
    )
}


export const FinancialRecordContext = createContext<FinancialRecordContextType | undefined>(undefined);

export const useFinancialRecords = () => {
    const context = useContext<FinancialRecordContextType | undefined>(
      FinancialRecordContext
    );
  
    if (!context) {
      throw new Error(
        "useFinancialRecords must be used within a FinancialRecordsProvider"
      );
    }
  
    return context;
  };