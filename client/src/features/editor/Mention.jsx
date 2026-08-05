import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  Users,
  PenSquare,
  User,
  Crown,
} from "lucide-react";


const roleConfig = {
  admin: {
    label: "Admin",
    icon: Crown,
    className:
      "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-300 border border-yellow-400/40",
  },

  writer: {
    label: "Writer",
    icon: PenSquare,
    className:
      "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  },

  reader: {
    label: "Member",
    icon: User,
    className:
      "bg-slate-600/30 text-slate-300 border border-slate-500/30",
  },
};


export const MentionList = forwardRef(
  ({ items = [], command }, ref) => {

    const [selectedIndex, setSelectedIndex] = useState(0);


    const selectItem = useCallback(
      (index) => {

        const user = items[index];

        if (!user) return;


        command({
          id: user._id,
          label: user.username,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
        });

      },
      [command, items]
    );


    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);


    useImperativeHandle(ref, () => ({

      onKeyDown({ event }) {

        if (event.key === "ArrowUp") {

          setSelectedIndex(
            (prev) =>
              (prev - 1 + items.length) %
              items.length
          );

          return true;
        }


        if (event.key === "ArrowDown") {

          setSelectedIndex(
            (prev) =>
              (prev + 1) %
              items.length
          );

          return true;
        }


        if (
          event.key === "Enter" ||
          event.key === "Tab"
        ) {

          selectItem(selectedIndex);

          return true;
        }


        return false;
      },

    }));


    if (!items.length) {

      return (
        <div className="p-3 text-xs text-slate-400 bg-slate-900 border rounded-xl">
          কোনো ইউজার পাওয়া যায়নি...
        </div>
      );

    }


    return (

      <div className="
        w-72 max-h-72 overflow-y-auto
        bg-slate-900/95
        border border-slate-700
        rounded-xl
        shadow-xl
        p-2
      ">


        <div className="
          flex items-center gap-2
          px-3 py-2
          border-b border-slate-700
        ">

          <Users size={15}/>

          <span className="text-sm font-bold">
            Mention User
          </span>

        </div>



        {
          items.map((user,index)=>{


            const selected =
              index === selectedIndex;


            const role =
              roleConfig[user.role] ||
              roleConfig.reader;


            const Icon = role.icon;



            return (

              <button

                key={
                  user._id ||
                  index
                }

                onClick={()=>
                  selectItem(index)
                }


                className={`
                  w-full flex items-center gap-3
                  px-3 py-2 rounded-lg
                  ${
                    selected
                    ?
                    "bg-indigo-600 text-white"
                    :
                    "hover:bg-slate-800 text-slate-300"
                  }
                `}

              >


                {/* Avatar */}

                <div className="
                  w-9 h-9 rounded-full
                  overflow-hidden
                  border-2 border-slate-600
                  bg-slate-800
                  shrink-0
                ">


                  {
                    user.avatar?.url
                    ?

                    <img
                      src={user.avatar.url}
                      className="
                        w-full h-full object-cover
                      "
                    />

                    :

                    <span className="
                      flex items-center justify-center
                      h-full text-xs font-bold
                    ">
                      {
                        user.name
                        ?.charAt(0)
                        ||
                        "U"
                      }
                    </span>

                  }


                </div>



                {/* Info */}

                <div className="flex-1 text-left">


                  <div className="text-sm font-semibold">
                    {user.name}
                  </div>


                  <div className="
                    flex items-center
                    justify-between
                    mt-1
                  ">


                    <span className="
                      text-xs text-slate-400
                    ">
                      @{user.username}
                    </span>



                    <span
                      className={`
                        flex items-center gap-1
                        px-2 py-0.5
                        rounded-full
                        text-[10px]
                        ${role.className}
                      `}
                    >

                      <Icon size={10}/>

                      {role.label}

                    </span>


                  </div>


                </div>


              </button>

            );


          })
        }


      </div>

    );

  }
);


MentionList.displayName = "MentionList";
export default MentionList;