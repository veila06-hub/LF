import { useParams } from "react-router-dom";

export default function FoundItemDetail() {
const { id } = useParams();

return ( <div className="p-6"> <div className="bg-white rounded-2xl shadow-lg p-6"> <h1 className="text-3xl font-bold text-blue-600">
Found Item Details </h1>

```
    <p className="mt-4">
      Item ID: {id}
    </p>
  </div>
</div>


);
}
