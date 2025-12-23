import { useRef, useState } from "react";
import { FiImage } from "react-icons/fi";
import { RiDeleteBinFill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import "./App.css";

function App() {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [toDo, setToDo] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleAddTask = () => {
    if (!taskName) return;

    if (editingTaskId) {
      // Edit existing task
      setToDo(
        toDo.map((task) =>
          task.id === editingTaskId
            ? { ...task, name: taskName, image: image }
            : task
        )
      );
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        name: taskName,
        image: image,
      };
      setToDo([...toDo, newTask]);
    }

    setTaskName("");
    setImage(null);
    setEditingTaskId(null);
    document.getElementById("my_modal_3").close();
  };

  const handleDeleteTask = (id) => {
    setToDo(toDo.filter((task) => task.id !== id));
    setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
  };

  const handleEditTask = (task) => {
    setTaskName(task.name);
    setImage(task.image);
    setEditingTaskId(task.id);
    document.getElementById("my_modal_3").showModal();
  };

  const toggleSelectTask = (id) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };

  const handleDeleteSelected = () => {
    setToDo(toDo.filter((task) => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
  };

  const filteredTasks = toDo.filter((task) =>
    task.name.toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <div className="bg-[#FAF0EF] min-h-screen flex flex-col">
      {/* MAIN CONTENT */}
      <div className="flex justify-center pt-8 flex-1">
        <div className="w-3/5">
          <input
            type="text"
            placeholder="Search To Do List Title"
            className="w-full bg-transparent border-0 border-b-2 border-[#9D8065] text-[#0A1F56] text-2xl placeholder-[#0A1F56] focus:outline-none focus:ring-0"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />

          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`mt-5 rounded-full p-4 flex items-center relative transition-colors duration-200 ${
                  selectedTasks.includes(task.id) ? "bg-blue-200" : "bg-white"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 mr-4 cursor-pointer flex items-center justify-center ${
                    selectedTasks.includes(task.id)
                      ? "bg-[#0A1F56] border-[#0A1F56]"
                      : "border-[#C7B29A]"
                  }`}
                  onClick={() => toggleSelectTask(task.id)}
                />

                {/* Image icon */}
                <div className="w-10 h-10 bg-[#C7B29A] rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
                  {task.image ? (
                    <img
                      src={task.image}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiImage className="text-white text-lg" />
                  )}
                </div>

                {/* Task name */}
                <h3
                  className={`ml-4 flex-1 text-3xl bg-transparent border-0 border-b border-[#9D8065] focus:outline-none ${
                    selectedTasks.includes(task.id)
                      ? "text-white"
                      : "text-[#0A1F56]"
                  }`}
                >
                  {task.name}
                </h3>

                {/* Edit & Delete buttons */}
                <div className="flex ml-4 gap-2">
                  <div
                    className="w-8 h-8 bg-[#0A1F56] text-white rounded-full flex items-center justify-center cursor-pointer shadow-md"
                    onClick={() => handleEditTask(task)}
                  >
                    <MdEdit />
                  </div>
                  <div
                    className="w-8 h-8 bg-[#C7B29A] text-white rounded-full flex items-center justify-center cursor-pointer shadow-md"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <RiDeleteBinFill />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-transparent rounded-full border border-[#9D8065] text-xl p-5 mt-5">
              There are no tasks yet. <span className="underline text-[#9D8065]">Edit</span> to start.
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="flex justify-center pb-6 flex-col items-center">
        <div className="w-3/5 flex flex-col items-end">
          <hr className="w-full border-[#9D8065]" />

          {/* Delete selected button */}
          <div className="flex gap-2">
            {selectedTasks.length > 0 && (
              <button
                className="btn mt-4 self-end px-8 py-2 border border-[#0A1F56] cursor-pointer text-[#0A1F56] rounded-full text-md hover:bg-[#0A1F56] hover:text-white transition"
                onClick={handleDeleteSelected}
              >
                Remove All Done Tasks
              </button>
            )}

            {/* Add/Edit button */}
            <button
              className="btn mt-4 self-end px-8 py-2 border bg-[#9D8065] border-[#9D8065] cursor-pointer text-white rounded-full text-md hover:bg-[#9D8065] hover:text-white transition"
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              {toDo.length > 0 ? "Add" : "Edit"}
            </button>
          </div>
        </div>

        {/* MODAL */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <h1>{editingTaskId ? "Edit Task" : "Add a new task"}</h1>
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>

            <div className="mt-2 bg-white rounded-full p-4 flex items-center relative">
              <div
                onClick={handleIconClick}
                className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#C7B29A] rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
              >
                {image ? (
                  <img
                    src={image}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiImage className="text-white text-lg" />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />

              <input
                type="text"
                placeholder="Enter new task here"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="ml-10 flex-1 bg-transparent border-0 border-b border-[#9D8065] focus:outline-none text-[#0A1F56]"
              />
            </div>

            <div className="flex justify-end mt-3">
              <button
                className="rounded-full border-black border mr-1 px-5 py-1"
                onClick={() => {
                  document.getElementById("my_modal_3").close();
                  setTaskName("");
                  setImage(null);
                  setEditingTaskId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-[#9D8065] border-[#9D8065] cursor-pointer text-white border mr-2 px-5 py-1"
                onClick={handleAddTask}
              >
                Save
              </button>
            </div>
          </div>
        </dialog>
      </footer>
    </div>
  );
}

export default App;
