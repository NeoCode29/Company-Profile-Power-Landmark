import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
const snap = new midtransClient.Snap({
    isProduction : process.env.NODE_ENV === "production",
    serverKey : process.env.MIDTRANS_SERVER_KEY
});

export async function POST(req: Request) {
  try {
    const { name, email, phone, address, code, nominal } = await req.json();
    
    if (!name || !email || !phone || !address || !code || !nominal) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }
    
    if(code !== "123456"){
        return NextResponse.json({ message: 'invalid code' }, {status : 400})
    }

    if(nominal < 10000){
        return NextResponse.json({ message: 'The payment amount must be at least 10,000.' }, {status : 400})
    }

    const parameter = {
        "transaction_details": {
            "order_id": "order-" + Date.now().toString(),
            "gross_amount": nominal
        },
        "credit_card":{
            "secure" : true
        },
        "customer_details": {
            "first_name": name,
            "email": email,
            "phone": phone,
            "address" : address
        }
    };

    try {
        const transaction = await snap.createTransaction(parameter)
        return NextResponse.json({url: transaction.redirect_url});
    } catch (error) {
        return NextResponse.json({ message: "error make transaction" , error : error }, { status: 500 });
    }
    
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' , error : error }, { status: 500 });
  }
}
