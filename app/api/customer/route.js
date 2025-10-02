import Customer from "@/models/Customer";

// GET all customers
export async function GET() {
    return Response.json(await Customer.find());
}

// CREATE new customer
export async function POST(request) {
    const body = await request.json();
    const customer = new Customer(body);
    await customer.save();
    return Response.json(customer);
}
