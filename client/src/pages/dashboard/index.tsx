import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";

export const Dashboard = () =>{
    const {user} = useUser();
    return(
        <div className="dashboard-container">
            <h2>Welcome {user?.firstName}! Here are your finances: </h2>
            <FinancialRecordForm/>
            <FinancialRecordList/>
        </div>
    )
}