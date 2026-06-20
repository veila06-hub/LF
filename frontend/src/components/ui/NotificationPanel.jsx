export default function NotificationPanel() {
const notifications = [
{
id: 1,
text: "Match found for Samsung Phone",
},
{
id: 2,
text: "Claim verified successfully",
},
{
id: 3,
text: "New found item added",
},
];

return ( <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-xl p-4 z-50"> <h3 className="font-bold mb-3">
Notifications </h3>

```
  {notifications.map((n) => (
    <div
      key={n.id}
      className="border-b py-3 last:border-none"
    >
      {n.text}
    </div>
  ))}
</div>

);
}
