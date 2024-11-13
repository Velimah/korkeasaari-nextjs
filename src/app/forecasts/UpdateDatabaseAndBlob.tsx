
import { Button } from "@/components/ui/button";
import UpdateCombinedDataBlob from "@/utils/UpdateCombinedDataBlob";
import UpdateEnkoraDatabase from "@/utils/UpdateEnkoraDatabase";
import UpdateFMIDatabase from "@/utils/UpdateFMIDatabase";

export default function UpdateDatabaseAndBlob() {

    async function updateData() {
        await UpdateFMIDatabase();
        await UpdateEnkoraDatabase();
        //await UpdateCombinedDataBlob();
    };

    return (
        <Button className="w-64 selection:p-2 m-2" onClick={updateData}>Update Database and BLOB</Button>
    );
}