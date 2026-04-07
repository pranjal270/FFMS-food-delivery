export const fetchtenantFlags=async(clientKey)=>{
    const response=await fetch("http://localhost:5000/api/flags",{
        method:"GET",
        headers:{
            "Content-Type": "application/json",
            "x-client-key": clientKey,

        }
    })

  if (!response.ok) {
    throw new Error("Failed to fetch tenant flags");
  }
    const data = await response.json();
    return data;
}