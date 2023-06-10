export default function StringToJSON(data: string) {
    try {
        const json = JSON.parse(data);
        return json;
    } catch (error) {
        console.log(error);
        return;
    }
}