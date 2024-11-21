"use client";
import React, { useMemo, useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import MediumModal from "../../components/mediumModal";
import { IoClose } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import InputsBox from "../../components/modalBox";
import { useCategory } from "../path/to/CategoryContext";
import Notification from "@/components/Alert";
import { API_BASE_URL } from '@/config';

interface Input {
  id: number;
  content: string;
  value: number | null;
  isAdding: boolean;
}

interface ItemInput {
  _id: string;
  title: string;
  componentName: string;
  inputs: Input[];
  result: number | null;
  TotalResult: number | null;
}

interface BoxComponent {
  _id: string;
  componentName: string;
  title: string;
  inputs: Input[];
  result: number;
  TotalResult: number;
  parentComponentName: string;
}

interface DataToSend {
  componentName: string;
  title: string;
  inputs: {
    id: number;
    content: string;
    value: number | null;
    isAdding: boolean;
  }[];
  result: number | null;
}

export default function Edit() {

  const [savedCategory, setSavedCategory] = useState<string>("");
  const [boxComponents, setBoxComponents] = useState<BoxComponent[]>([]);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [data, setData] = useState<{ [key: string]: ItemInput[] }>({});
  const [selectedComponentName, setSelectedComponentName] =
    useState<string>("");
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [categories, setCategories] = useState<string[]>([""]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] =
    useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  const [dataFromChild, setDataFromChild] = useState<DataToSend | null>(null);
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "warning" | "info";
  } | null>(null);

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning" | "info"
  ) => {
    setNotification({ message, type });
  };

  const handleDataFromInputsBox = (data: DataToSend) => {
    setDataFromChild(data);
  };

  const addComponent = () => {
    const newBoxName = `${boxComponents.length + 1}`;
    setBoxComponents((prev) => [
      ...prev,
      {
        _id: new Date().toISOString(),
        title: "",
        componentName: newBoxName,
        parentComponentName: "root",
        inputs: [],
        result: 0,
        TotalResult: 0,
      },
    ]);
  };

  const deleteComponentFromServer = async (componentName: string) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/data/${savedCategory}/${componentName}`
      );
      console.log(API_BASE_URL);
      showNotification(
        `Category ${componentName} deleted successfully.`,
        "success"
      );
    } catch (error) {
      console.error("Error deleting component:", error);
    }
  };
  useEffect(() => {
    // Ensure localStorage is accessed only in the browser
    if (typeof window !== "undefined") {
      const category = localStorage.getItem("Current Collection:") || "default";

      setSavedCategory(category);
      const fetchAllComponents = async () => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/data/${category}/allcomponents`
          );

          const components = response.data.components || [];
          console.log(response.data)
          const dataByComponent: { [key: string]: ItemInput[] } = {};

          components.forEach((component: BoxComponent) => {
            if (!dataByComponent[component.componentName]) {
              dataByComponent[component.componentName] = [];
            }

            dataByComponent[component.componentName].push({
              _id: component._id,
              title: component.title || "initial",
              componentName: component.componentName,
              inputs: component.inputs || [
                { content: " ", value: 0, id: 0, isAdding: false },
              ],
              result: component.result || 0,
              TotalResult: component.TotalResult || 0,
            });
          });

          setBoxComponents(components);
          setData(dataByComponent);
        } catch (error) {
          console.error("Error fetching components data:", error);
        }
      };

      fetchAllComponents();
    }
  }, [selectedCategory, editModal, updateData]);


  const groupComponentsByParent = (components: BoxComponent[]) => {
    return components.reduce((acc, component) => {
      const { parentComponentName } = component;
      if (!acc[parentComponentName]) {
        acc[parentComponentName] = [];
      }
      acc[parentComponentName].push(component);
      return acc;
    }, {} as { [key: string]: BoxComponent[] });
  };

  const sortedComponents = useMemo(() => {
    return boxComponents.sort((a, b) => {
      const nameA = a.componentName || ""; // Default to empty string if undefined or null
      const nameB = b.componentName || ""; // Default to empty string if undefined or null
      return nameA.localeCompare(nameB, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [boxComponents]);

  const [collections, setCollections] = useState([]);
  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/category/collections`);
      if (!response.ok) {
        throw new Error("Failed to fetch collections");
      }
      const data = await response.json();

      setCollections(data);
    } catch (error) {
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || "Error fetching collections";
      }
      showNotification(errorMessage, "error");
    }
  };

  const groupedComponents = groupComponentsByParent(sortedComponents);

  const handleAddCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/category/categories/add`,
          { Category: newCategory }
        );
        if (response.status === 201) {
          setCategories((prevCategories) => [...prevCategories, newCategory]);
          setNewCategory("");
          setIsAddCategoryModalOpen(false);

          showNotification("Success Adding category", "success");
          setSelectedCategory(newCategory);
          localStorage.setItem("Current Collection:", newCategory);
        }
      } catch (error) {
        let errorMessage = "An unknown error occurred. Please try again.";
        if (error instanceof AxiosError) {
          errorMessage =
            error.response?.data?.message || "Error Adding Category";
        }
        showNotification(errorMessage, "error");
      }
    }
  };

  const removeComponent = async (
    event: React.MouseEvent<HTMLButtonElement>,
    componentName: string
  ) => {
    // event.stopPropagation();
    await deleteComponentFromServer(componentName);
    setBoxComponents((prev) =>
      prev.filter((box) => box.componentName !== componentName)
    );
    window.location.reload();
  };

  const renderComponents = (parentName: string) => {
    const components = groupedComponents[parentName] || [];

    return components.map((component) => (
      <div key={component._id} className="flex flex-col items-center">
        <Box
          removeBox={removeComponent}
          componentName={component.componentName}
          data={data}
          inputs={component.inputs}
          result={component.result}
          TotalResult={component.TotalResult}
          setEditModal={setEditModal}
          setSelectedComponentName={setSelectedComponentName}
          childBoxes={
            groupedComponents[component.componentName]?.map(
              (child) => child.componentName
            ) || []
          }
          groupedComponents={groupedComponents}
        />
      </div>
    ));
  };

  const deleteCategory = async (selectedCategory: string) => {
    // Check if the selected category is 'default' and display the notification
    if (selectedCategory === "default") {
      showNotification("You cannot delete the default category.", "error");
      return; // Stop the execution here, no API call is made
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/category/categories/${selectedCategory}`
      );
      showNotification(response.data.message, "success");
      if(response) window.location.reload();

      localStorage.setItem("Current Collection:", "default");
    } catch (error) {
      let errorMessage = "An unknown error occurred. Please try again.";

      // Check if the error is an Axios error
      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message || "Error deleting category";
      }

      showNotification(errorMessage, "error");
    }
  };


  const handleCategoryClick = (collection: string) => {

    setSelectedCategory(collection);

    window.location.reload();

    if (collection) localStorage.setItem("Current Collection:", collection);
    else localStorage.setItem("Current Collection:", "default");

  };

  const handleModalMain = async () => {
    setUpdateData((prev) => !prev);
    setEditModal(false);
    if (!dataFromChild) return;

    const dataToSend: DataToSend = {
      componentName: dataFromChild.componentName,
      title: dataFromChild.title,
      inputs: dataFromChild.inputs.map((input) => ({
        id: input.id,
        content: input.content,
        value: input.value,
        isAdding: input.isAdding,
      })),
      result: dataFromChild.result,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/data/${savedCategory}`,
        dataToSend
      );
      console.log(response);

      if (response) window.location.reload();
    } catch (error) {
      console.error("Failed to save input data:", error);
    }
  };

  const handleModalClose = async (
    event?: React.MouseEvent<HTMLButtonElement>,
    componentName?: string
  ) => {
    if (event) event.stopPropagation();
    setEditModal(false);

    if (componentName) {
      // Type assertion to tell TypeScript that event will not be undefined
      await removeComponent(
        event as React.MouseEvent<HTMLButtonElement>,
        componentName
      );
    }
    window.location.reload();
  };

  return (
    <div className="flex flex-col mx-auto items-center p-8 min-h-screen text-base-content">
      <div className="absolute flex top-20 right-[40px]">
        <button
          className="btn btn-outline mt-1 w-30"
          onClick={() => setIsAddCategoryModalOpen(true)}
        >
          Add Project
        </button>

        <details className="dropdown-top dropdown-end mb-1 w-30">
          <summary className="btn m-1 w-30" onClick={fetchCollections}>
            Select Project
          </summary>
          {/* {isOpen && ( */}
          <ul className="menu dropdown-content bg-base-100 rounded-box w-30 p-2 shadow">
            {collections.map((collection) => (
              <li key={collection} >
                <a
                  onClick={() => handleCategoryClick(collection)}
                  className="relative  block "
                >
                  {collection}
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory("default");
                    deleteCategory(collection);
                    fetchCollections();
                  }}
                  className="absolute right-2 top-1 text-black/80 hover:text-black transition duration-200 transform hover:scale-110"
                >
                  <IoClose />
                </button>
              </li>
            ))}
          </ul>
          {/* )} */}
        </details>
      </div>

      <div className="mt-20 text-2xl font-bold mb-5">
        <p className="hidden md:block">Selected Project: {savedCategory}</p>
      </div>


      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex flex-col items-center">
        {renderComponents("root")}
      </div>

      <div className="block my-4">
        {boxComponents.length < 2 && ( // Render the button only if there are fewer than 2 components
          <button
            type="button"
            onClick={addComponent}
            className="flex w-full justify-center btn btn-neutral text-sm font-semibold leading-6 shadow-lg hover:bg-primary-focus transition duration-200"
          >
            Add Main Box
          </button>
        )}
      </div>

      <MediumModal
        isOpen={editModal}
        closeModal={() => handleModalClose(undefined, selectedComponentName)}
        handleMainTitle="Save"
        handleCloseTitle="Delete"
        handleMain={handleModalMain}
      >
        <InputsBox
          componentName={selectedComponentName}
          selectedCategory={savedCategory}
          onDataFromInputsBox={handleDataFromInputsBox}
          handleMain={handleModalMain}
        />
      </MediumModal>

      {isAddCategoryModalOpen && (
        <MediumModal
          isOpen={isAddCategoryModalOpen}
          closeModal={() => setIsAddCategoryModalOpen(false)}
          handleMainTitle="Add"
          handleCloseTitle="Cancel"
          handleMain={handleAddCategory}
        >
          <div className="flex items-center justify-between pb-4 px-3 border-b rounded-t dark:border-gray-600">
            <h3 className="text-2xl font-semibold ">
              Create New Product
            </h3>
          </div>
          {/* <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Type New Project Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          /> */}
          <div className="grid gap-4 grid-cols-2 border-b border-gray-200 px-3">
            <div className="col-span-2">
              <label className="block mb-2 mt-3 text-xl font-medium ">
                Project Name
              </label>
              <input
                type="text"
                name="name"
                className="w-[350px] border mb-3 border-gray-300 text-md rounded-sm focus:ring-primary-600 focus:border-primary-600 block p-3.5 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type New Project Name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
          </div>
        </MediumModal>
      )}
    </div>
  );
}

interface BoxProps {
  removeBox: (
    event: React.MouseEvent<HTMLButtonElement>,
    componentName: string
  ) => void;
  componentName: string;
  data: { [key: string]: ItemInput[] };
  result: number;
  TotalResult: number;
  setEditModal: (value: boolean) => void;
  setSelectedComponentName: (value: string) => void;
  childBoxes: string[];
  inputs: Input[];
  groupedComponents: GroupedComponents;
}

interface Child {
  componentName: string;
}

interface GroupedComponents {
  [key: string]: Child[];
}

function Box({
  // removeBox,
  componentName,
  data,
  result,
  TotalResult,
  setEditModal,
  setSelectedComponentName,
  childBoxes,
  groupedComponents,
}: BoxProps) {
  const [childComponents, setChildComponents] = useState<string[]>(childBoxes);

  const addComponent = (event: React.MouseEvent) => {
    event.stopPropagation();
    const newChildNumber = `${componentName}>${childComponents.length + 1}`;
    setChildComponents((prev) => [...prev, newChildNumber]);
  };

  const removeChildBox = (
    event: React.MouseEvent<HTMLButtonElement>,
    childName: string
  ) => {
    event.stopPropagation();
    setChildComponents((prev) => prev.filter((name) => name !== childName));
  };

  const handleEditProfile = (componentName: string) => {
    setSelectedComponentName(componentName);
    setEditModal(true);
  };

  const currentComponentData = data[componentName] || [];

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative z-0 flex flex-col mr-5 items-center w-50 min-h-[150px] items-center px-7 border rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer group bg-base-100"
        onClick={() => handleEditProfile(componentName)}
      >
        {/* <button
          type="button"
          onClick={(event) => removeBox(event, componentName)}
          className="absolute top-2 right-2 text-black/80 hover:text-black transition duration-200 transform hover:scale-110"
        >
          <IoClose />
        </button> */}

        <h2 className="text-2xl mt-3 items-center w-40 font-bold leading-7 rounded-lg tracking-tight text-black group-hover:scale-105 transform transition duration-200">
          {componentName}
        </h2>

        {currentComponentData.map((item) => (
          <div
            key={item._id}
            className="p-3 mb-2 bg-white/20 border rounded-lg px-3 text-center shadow-md group-hover:shadow-lg transition duration-200"
          >
            <span className="text-2xl font-bold font-semibold rounded-lg bg-white/70 px-3 tracking-tight text-orange">
              {item.title || "No Title"}
            </span>

            {item.inputs.length > 0 ? (
              item.inputs.map((input) => (
                <div key={input.id} className="relative mt-2">
                  <span className="flex w-full px-2 rounded-lg bg-white/30 text-black text-sm sm:text-lg tracking-tight">
                    {input.content || "No Content"}: {input.value || 0}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-base py-2">No Inputs</div>
            )}

            <div className="text-xl mt-3 font-bold leading-7 rounded-lg tracking-tight text-black group-hover:scale-105 transform transition duration-200">
              TotalResult: {item.TotalResult}
            </div>
          </div>
        ))}

        <div className="absolute -bottom-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
          <button
            type="button"
            className="px-2 z-5 bg-white border text-3xl font-bold rounded-lg shadow-md hover:bg-slate-300 hover:text-slate-700 transition duration-300"
            onClick={addComponent}
          >
            <IoMdAddCircle />
          </button>
        </div>
      </div>

      {childComponents.length > 0 && (
        <div className="flex flex-row space-x-4 mt-10">
          {childComponents.map((childName) => (
            <Box
              key={childName}
              removeBox={removeChildBox}
              componentName={childName}
              result={result}
              TotalResult={TotalResult}
              inputs={data[childName]?.[0]?.inputs || []}
              data={data}
              setEditModal={setEditModal}
              setSelectedComponentName={setSelectedComponentName}
              childBoxes={
                groupedComponents[childName]?.map(
                  (child) => child.componentName
                ) || []
              }
              groupedComponents={groupedComponents}
            />
          ))}
        </div>
      )}
    </div>
  );
}
