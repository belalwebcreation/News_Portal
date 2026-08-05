import { useNavigate } from 'react-router-dom';
import { MdOutlinePostAdd, MdOutlineEdit } from 'react-icons/md';

// আগে এখানে editor/edit/delete — তিনটা আলাদা card ছিল। Edit আর Delete এখন
// একই "Manage News" page-এ (ManageNews.jsx), তাই hub-এ মাত্র দুইটা option।
const OPTIONS = [
  {
    key: 'editor',
    title: 'Open Editor',
    description: 'Start a fresh article in the rich text editor.',
    icon: MdOutlinePostAdd,
    to: '/dashboard/writer/add-news/editor',
    tone: 'primary',
  },
  {
    key: 'manage',
    title: 'Manage News',
    description: 'Edit or delete one of your existing articles.',
    icon: MdOutlineEdit,
    to: '/dashboard/writer/add-news/manage',
    tone: 'secondary',
  },
];

export function CreateNewsHub() {
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wide text-amber-800">
          Writer workspace
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 sm:text-4xl">Create News</h1>
        <p className="mt-2 text-slate-600">Choose what you&apos;d like to do.</p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {OPTIONS.map(({ key, title, description, icon: Icon, to, tone }) => (
          <button
            key={key}
            type="button"
            onClick={() => navigate(to)}
            className={`group flex flex-col items-start gap-4 rounded-2xl border p-6 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 ${
              tone === 'primary'
                ? 'border-amber-900 bg-amber-900 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg'
                : 'border-slate-200 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-amber-900 hover:shadow-md'
            }`}
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                tone === 'primary' ? 'bg-white/15' : 'bg-amber-50 text-amber-900'
              }`}
            >
              <Icon size={24} />
            </span>

            <span>
              <span className="block text-lg font-semibold">{title}</span>
              <span
                className={`mt-1 block text-sm ${
                  tone === 'primary' ? 'text-white/80' : 'text-slate-500'
                }`}
              >
                {description}
              </span>
            </span>

            <span
              className={`mt-auto text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                tone === 'primary' ? 'text-white' : 'text-amber-900'
              }`}
            >
              Continue →
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}

export default CreateNewsHub;