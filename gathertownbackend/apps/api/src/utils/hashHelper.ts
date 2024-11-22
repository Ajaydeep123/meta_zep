import  bcrypt from 'bcrypt';


export const hashData = async (data: string) => {
    const hashedData = await bcrypt.hash(data, 10);
    return hashedData;
}

export const compareHash = async (data: string, hashedData: string) => {
    const isMatch = await bcrypt.compare(data, hashedData);
    return isMatch;
}