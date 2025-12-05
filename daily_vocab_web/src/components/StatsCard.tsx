type Props = {
    title: string;
    value: string;
}

export default function StatsCard({ title, value }: Props) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300 ease-in-out">
            <h3 className="text-gray-500 text-base font-medium mb-2">{title}</h3>
            <p className="text-4xl font-bold text-primary">{value}</p>
        </div>
    )
}
