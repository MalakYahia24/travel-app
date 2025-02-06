const { getRdays }=require("../js/getRdays");

test ("cheking if date is available" , ()=> {
    expect(getRdays(new Date())).toBe(0);
});
