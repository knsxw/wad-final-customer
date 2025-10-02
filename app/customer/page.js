"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

export default function CustomerPage() {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    const { register, handleSubmit, reset } = useForm();

    const [customers, setCustomers] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const fetchCustomers = async () => {
        try {
            const res = await fetch(`${API_BASE}/customer`);
            const data = await res.json();
            const formatted = data.map((c) => ({
                ...c,
                dateOfBirth: c.dateOfBirth
                    ? new Date(c.dateOfBirth).toISOString().split("T")[0]
                    : "",
            }));
            setCustomers(formatted);
        } catch (err) {
            console.error("Failed to fetch customers:", err);
        }
    };

    const saveCustomer = async (data) => {
        try {
            if (editMode) {
                await fetch(`${API_BASE}/customer/${data._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                stopEditMode();
            } else {
                await fetch(`${API_BASE}/customer`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
            }
            fetchCustomers();
        } catch (err) {
            console.error("Failed to save customer:", err);
        }
    };


    const deleteCustomer = async (id) => {
        if (!confirm("Are you sure you want to delete this customer?")) return;
        await fetch(`${API_BASE}/customer/${id}`, { method: "DELETE" });
        fetchCustomers();
    };


    const startEditMode = (customer) => {
        reset(customer);
        setEditMode(true);
    };

    const stopEditMode = () => {
        reset({
            name: "",
            dateOfBirth: "",
            memberNumber: "",
            interests: "",
        });
        setEditMode(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <main className="m-4 flex flex-col gap-6">
            {/* ----------------- FORM ----------------- */}
            <form
                onSubmit={handleSubmit(saveCustomer)}
                className="border p-4 w-full max-w-md"
            >
                <h2 className="text-lg font-bold mb-4">
                    {editMode ? "Edit Customer" : "Add Customer"}
                </h2>

                <div className="mb-2">
                    <label className="block">Name:</label>
                    <input
                        {...register("name", { required: true })}
                        className="border w-full p-1"
                    />
                </div>

                <div className="mb-2">
                    <label className="block">Date of Birth:</label>
                    <input
                        type="date"
                        {...register("dateOfBirth", { required: true })}
                        className="border w-full p-1"
                    />
                </div>

                <div className="mb-2">
                    <label className="block">Member Number:</label>
                    <input
                        type="number"
                        {...register("memberNumber", { required: true })}
                        className="border w-full p-1"
                    />
                </div>

                <div className="mb-2">
                    <label className="block">Interests:</label>
                    <input
                        {...register("interests", { required: true })}
                        className="border w-full p-1"
                    />
                </div>

                <div className="mt-4 flex gap-2">
                    <button
                        type="submit"
                        className={`px-4 py-2 font-bold text-white rounded ${editMode ? "bg-blue-700" : "bg-green-700"
                            }`}
                    >
                        {editMode ? "Update" : "Add"}
                    </button>
                    {editMode && (
                        <button
                            type="button"
                            onClick={stopEditMode}
                            className="px-4 py-2 font-bold text-white rounded bg-gray-700"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* ----------------- TABLE ----------------- */}
            <table className="w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Date of Birth</th>
                        <th className="border p-2">Member #</th>
                        <th className="border p-2">Interests</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((c) => (
                        <tr key={c._id}>
                            {/* Name clickable */}
                            <td className="border p-2 text-blue-600 cursor-pointer hover:underline">
                                <Link href={`/customer/${c._id}`}>{c.name}</Link>
                            </td>
                            <td className="border p-2">{c.dateOfBirth}</td>
                            <td className="border p-2">{c.memberNumber}</td>
                            <td className="border p-2">{c.interests}</td>
                            <td className="border p-2 flex gap-2">
                                <button
                                    onClick={() => startEditMode(c)}
                                    className="px-2 py-1 bg-blue-700 text-white rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteCustomer(c._id)}
                                    className="px-2 py-1 bg-red-700 text-white rounded"
                                >
                                    Delete
                                </button>
                                <Link
                                    href={`/customer/${c._id}`}
                                    className="px-2 py-1 bg-gray-700 text-white rounded"
                                >
                                    🔗
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {customers.length === 0 && (
                        <tr>
                            <td colSpan={5} className="border p-2 text-center">
                                No customers found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

        </main>
    );
}
