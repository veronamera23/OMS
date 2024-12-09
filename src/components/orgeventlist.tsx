
export default function OrgEventList() {
    return (
        <div>
            {/* Repeat this code tas update lng desciption and images */}
            <div 
                className="grid lg:grid-cols-2 m-auto text-black h-auto w-full"
                style={{ gridTemplateColumns: "40% 60%"}}
            >
                <div className="lg:col-start-1">
                    <div className="mb-4 w-60 h-20 rounded bg-gray-200"></div>
                </div>

                <div className="lg:col-start-2">
                    <div className=" ml-4 w-auto h-20 rounded">
                        <p style={{fontSize: '24px', fontFamily: 'Inter'}}><b>Elek Event</b></p>
                        <p style={{fontSize: '12px', fontFamily: 'Inter', lineHeight: '0.5'}}>Event Description</p>

                        <div className="flex mt-4">
                            <img src="/assets/thumb_up.svg"/><p className="mx-1" style={{fontSize: '16px', fontFamily: 'Inter'}}>#</p>
                            <img className="mx-1" src="/assets/thumb_down.svg"/><p className="mx-1" style={{fontSize: '16px', fontFamily: 'Inter'}}>#</p>
                            <img className="ml-10 mr-1" src="/assets/group_add.svg"/><p className="mx-1" style={{fontSize: '14px', fontFamily: 'Inter'}}>Interested?</p>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="border-black mb-4"/>
        </div>
    );
}