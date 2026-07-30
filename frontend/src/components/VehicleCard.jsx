export default function VehicleCard({ car, isAdmin, onPurchase, onRestock, onEdit, onDelete }) {
  const isOutOfStock = (car.quantity ?? 1) === 0;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{car.make}</h3>
          <p className="mt-1 text-sm text-slate-600">{car.model}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isOutOfStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {isOutOfStock ? 'Out of Stock' : `Qty: ${car.quantity ?? 1}`}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{car.year}</p>
      <p className="text-xs text-slate-500">{car.category || 'Sedan'}</p>
      <p className="text-sm font-medium text-slate-800">{car.price}</p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => onPurchase(car._id)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white transition ${
            isOutOfStock
              ? 'cursor-not-allowed bg-slate-300 text-slate-500'
              : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </button>

        {isAdmin ? (
          <>
            <button
              type="button"
              onClick={() => onRestock(car._id)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Restock
            </button>
            <button
              type="button"
              onClick={() => onEdit(car)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(car._id)}
              className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}
