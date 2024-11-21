import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";

interface InputField {
  id: number;
  content: string;
  value: number;
  isAdding: boolean;
}

interface DataItem {
  _id: string;
  title: string;
  inputs: InputField[];
}

interface DataToSend {
  componentName: string;
  title: string;
  inputs: InputField[];
  result: number | null;
}

interface InputsBoxProps {
  componentName: string;
  selectedCategory: string;
  onDataFromInputsBox: (data: DataToSend) => void;
  handleMain?: () => void;
}
import { API_BASE_URL } from '@/config';
const MAX_INPUTS = 5;

const InputsBox: React.FC<InputsBoxProps> = ({
  componentName,
  selectedCategory,
  onDataFromInputsBox,
  handleMain,
}) => {
  const [inputs, setInputs] = useState<InputField[]>([
    { id: 1, content: "Cost($)", value: 0, isAdding: false },
    { id: 2, content: "Prob(%)", value: 0, isAdding: true },
  ]);
  const [data, setData] = useState<DataItem | null>(null);

  const [error, setError] = useState<string | null>(null);
  console.log(error)
  useEffect(() => {
    const fetchData = async () => {

      setError(null);
      try {
        const response = await axios.get<DataItem>(
          `${API_BASE_URL}/api/data/${selectedCategory}/${componentName}`
        );
        if (response.data) {
          const initialInputs = response.data.inputs
            .slice(0, MAX_INPUTS)
            .map((input, index) => ({
              id: index + 1,
              content: input.content,
              value: input.value,
              isAdding: false,
            }));
          setInputs(initialInputs);
          setData(response.data);
        }
        console.log(response.data)
      } catch (err) {
        setError("Error loading data");
        console.error(err);
      } finally {
      }
    };

    fetchData();
  }, [selectedCategory, componentName]);


  const handleTitleChange = (value: string) => {
    setData((prevData) =>
      prevData ? { ...prevData, title: value } : { _id: "", title: value, inputs: [] }
    );
  };

  const handleInputChange = (
    id: number,
    field: "content" | "value",
    value: string | number
  ) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id
          ? { ...input, [field]: field === "value" ? Number(value) : value }
          : input
      )
    );
  };

  useEffect(() => {
    const costInput = inputs.find((input) => input.content === "Cost($)");
    const probInput = inputs.find((input) => input.content === "Prob(%)");

    const result =
  costInput && probInput && costInput.value !== null && probInput.value !== null
    ? (costInput.value * probInput.value) / 100
    : null;


    const dataToSend = {
      componentName,
      title: data ? data.title : "",
      inputs: inputs.map((input) => ({
        id: input.id,
        content: input.content,
        value: input.value,
        isAdding: input.isAdding,
      })),
      result: result,
    };

    onDataFromInputsBox(dataToSend);
  }, [inputs, data, componentName]);

  return (
    <section id="next-section" aria-label="Next Section">
      <div className="w-screen-2xl border-b border-gray-200">
        <div className="flex items-center justify-between md:p-2 border-b rounded-t dark:border-gray-600">
          <h2 className="text-3xl font-bold mb-6">{componentName}</h2>
        </div>
        <div
          className="p-0 px-1.5 py-1 rounded-full bg-gray-200 w-fit absolute right-2 top-2 cursor-pointer"
          onClick={handleMain}
        >
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            data-modal-hide="top-left-modal"
          >
            <IoClose />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="py-4 md:p-5 space-y-4">
          <div className="col-span-2">
            <label className="block mb-2 text-2xl font-medium">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Type Title"
              value={data ? data.title : ""}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="border border-gray-300 text-gray-900 text-2xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>
          <label className="block mb-2 text-2xl font-medium">
            Values
          </label>
          {inputs.map((input) => (
            <div
              key={input.id}
              className="relative flex gap-2 mt-4 rounded-lg shadow-sm"
            >
              <input
                type="text"
                placeholder="Content"
                value={input.content}
                onChange={(e) =>
                  handleInputChange(input.id, "content", e.target.value)
                }
                className="flex w-1/4 bg-gray-50 rounded-lg border-0 py-3 px-4 text-gray-900 text-xl ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:border-primary-600"
              />
              <input
                type="text"
                value={input.value == 0 ? "": input.value}
                onChange={(e) =>
                  handleInputChange(input.id, "value", e.target.value)
                }
                className="flex w-3/4 rounded-lg border-0 py-3 px-4 text-gray-900 text-2xl ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:border-primary-600"
              />
             
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default InputsBox;
