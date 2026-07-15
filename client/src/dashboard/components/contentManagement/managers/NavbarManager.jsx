import ListManager from "./ListManager";

const NavbarManager = ({
  settings,
  refreshSettings,
}) => {

  const data =
    settings?.navbar || [];

  const handleAdd = () => {

    console.log("Add Navbar");

  };

  const handleEdit = (item) => {

    console.log(item);

  };

  const handleDelete = (item) => {

    console.log(item);

  };

  return (

    <ListManager

      title="Navbar"

      description="Manage navigation menu."

      data={data}

      onAdd={handleAdd}

      onEdit={handleEdit}

      onDelete={handleDelete}

    />

  );

};

export default NavbarManager;