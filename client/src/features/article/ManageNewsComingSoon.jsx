import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdOutlineConstruction } from 'react-icons/md';

// Edit News আর Delete News — দুটো hub card-ই আপাতত এখানে আসে।
// আসল article-list + edit/delete flow তৈরি হলে এই ফাইলটাই বদলে
// দিলেই হবে, route/navigation বদলানোর দরকার নেই।
const COPY = {
  edit: {
    title: 'Edit News',
    body: "This is where you'll pick one of your articles and update it. Not wired up yet.",
  },
  delete: {
    title: 'Delete News',
    body: "This is where you'll pick one of your articles and remove it. Not wired up yet.",
  },
};

export function ManageNewsComingSoon() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') === 'delete' ? 'delete' : 'edit';
  const { title, body } = COPY[mode];

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-900">
        <MdOutlineConstruction size={28} />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{body}</p>
      <button
        type="button"
        onClick={() => navigate('/dashboard/writer/add-news')}
        className="mt-6 rounded-xl bg-amber-900 px-5 py-2.5 font-medium text-white transition-colors duration-300 hover:bg-amber-800"
      >
        ← Back to Create News
      </button>
    </main>
  );
}

export default ManageNewsComingSoon;
