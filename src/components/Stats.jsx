export const Stats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
