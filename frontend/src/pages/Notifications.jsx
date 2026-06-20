export default function Notifications() {
const notifications = [
{
id: 1,
message: "Smart Match Found for Samsung Phone",
time: "2 minutes ago",
},
{
id: 2,
message: "New Found Item Added",
time: "10 minutes ago",
},
{
id: 3,
message: "Claim Verification Successful",
time: "1 hour ago",
},
];

return ( <div className="space-y-6"> <h1 className="text-3xl font-bold">
Notifications </h1>

```
  {notifications.map((notification) => (
    <div
      key={notification.id}
      className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow"
    >
      <h3 className="font-semibold">
        {notification.message}
      </h3>

      <p className="text-sm text-gray-500 mt-2">
        {notification.time}
      </p>
    </div>
  ))}
</div>

);
}
