import { useNavigate } from "react-router-dom"

export default function LeadTiles({ tileCounts }) {
  const navigate = useNavigate()

  const tiles = [
    { label: "Total Leads", value: tileCounts.TotalCount, bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-400", link: "/leads/total" },
    { label: "Open Leads", value: tileCounts.OpenCount, bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellowBorder", link: "/leads/open" },
    { label: "Lost", value: tileCounts.LostCount, bg: "bg-red-100", text: "text-red-800", border: "border-red-400", link: "/leads/lost" },
    { label: "Confirmed", value: tileCounts.ConfirmedCount, bg: "bg-green-100", text: "text-green-800", border: "border-green-400", link: "/leads/confirmed" },
    { label: "Postponed Leads", value: tileCounts.PostponedCount, bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-400", link: "/leads/postponed" },
  ]

  return (
    <div className="p-4">
      <div className="grid grid-cols-5 gap-4">
        {tiles.map((tile, i) => (
          <button
            key={i}
            onClick={() => navigate(tile.link)}
            className={`${tile.bg} ${tile.border} ${tile.text} 
              border-2 p-4 rounded-xl shadow-sm w-full h-28 
              flex flex-col justify-center items-center 
              hover:shadow-md hover:scale-105 transition transform duration-200`}
          >
            <h2 className="text-md font-bold">{tile.label}</h2>
            <p className="text-xl font-bold">{tile.value}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
