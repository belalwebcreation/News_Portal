import TopHeadline from "../models/TopHeadline.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";


/*
|--------------------------------------------------------------------------
| Get Or Create Top Headline
|--------------------------------------------------------------------------
*/

const getOrCreateHeadline = async () => {
  let headline = await TopHeadline.findOne();

  if (!headline) {
    headline = await TopHeadline.create({
      label: "সর্বশেষ",
      date: "",
      showDate: true,
      visible: true,
      speed: 40,
      items: [],
    });
  }

  return headline;
};



/*
|--------------------------------------------------------------------------
| GET TOP HEADLINE
|--------------------------------------------------------------------------
*/

export const getTopHeadline = async (req, res) => {
  try {

    const headline = await getOrCreateHeadline();

    headline.items.sort(
      (a, b) => a.order - b.order
    );


    res.status(200).json({
      success: true,
      headline,
    });


  } catch (error) {

    console.error(
      "GET TOP HEADLINE ERROR:",
      error
    );


    res.status(500).json({
      success: false,
      message: "Failed to fetch headline.",
    });

  }
};




/*
|--------------------------------------------------------------------------
| UPDATE TOP HEADLINE
|--------------------------------------------------------------------------
*/

export const updateTopHeadline = async (req, res) => {

  try {

    const {
      label,
      date,
      showDate,
      visible,
      speed,
      items,
    } = req.body;



    const headline =
      await getOrCreateHeadline();



    headline.label =
      label?.trim() || "সর্বশেষ";


    headline.date =
      date?.trim() || "";


    headline.showDate =
      showDate ?? true;


    headline.visible =
      visible ?? true;


    headline.speed =
      Number(speed) || 40;



    if (Array.isArray(items)) {

      headline.items =
        items.map((item, index) => ({

          _id: item._id,

          title:
            item.title?.trim() || "",


          slug:
            item.slug?.trim() || "",


          image:
            item.image || "",


          imagePublicId:
            item.imagePublicId || "",


          visible:
            item.visible ?? true,


          order:
            item.order ?? index + 1,

        }));

    }



    await headline.save();



    res.status(200).json({

      success: true,

      message:
        "Top headline updated successfully.",

      headline,

    });



  } catch (error) {


    console.error(
      "UPDATE TOP HEADLINE ERROR:",
      error
    );


    res.status(500).json({

      success:false,

      message:
        "Failed to update headline.",

    });


  }

};




/*
|--------------------------------------------------------------------------
| ADD HEADLINE
|--------------------------------------------------------------------------
*/

export const addHeadline = async (req,res)=>{

  try {


    const {
      title,
      slug,
    } = req.body;



    if(
      !title?.trim() ||
      !slug?.trim()
    ){

      return res.status(400).json({

        success:false,

        message:
          "Title and slug are required.",

      });

    }



    const headline =
      await getOrCreateHeadline();



    headline.items.push({

      title:
        title.trim(),


      slug:
        slug.trim(),


      image:"",

      imagePublicId:"",

      visible:true,

      order:
        headline.items.length + 1,

    });



    await headline.save();



    res.status(201).json({

      success:true,

      message:
        "Headline added successfully.",

      item:
        headline.items[
          headline.items.length - 1
        ],

    });



  } catch(error){

    console.error(
      "ADD HEADLINE ERROR:",
      error
    );


    res.status(500).json({

      success:false,

      message:
        "Failed to add headline.",

    });

  }

};





/*
|--------------------------------------------------------------------------
| DELETE HEADLINE
|--------------------------------------------------------------------------
*/

export const deleteHeadline = async(req,res)=>{

  try{

    const {id}=req.params;


    const headline =
      await getOrCreateHeadline();



    const item =
      headline.items.id(id);



    if(!item){

      return res.status(404).json({

        success:false,

        message:
          "Headline not found.",

      });

    }



    if(item.imagePublicId){

      await deleteFromCloudinary(
        item.imagePublicId
      );

    }



    item.deleteOne();


    await headline.save();



    res.status(200).json({

      success:true,

      message:
        "Headline deleted successfully.",

    });



  }catch(error){

    console.error(
      "DELETE HEADLINE ERROR:",
      error
    );


    res.status(500).json({

      success:false,

      message:
        "Failed to delete headline.",

    });

  }

};





/*
|--------------------------------------------------------------------------
| TOGGLE VISIBILITY
|--------------------------------------------------------------------------
*/

export const toggleHeadlineVisibility = async(
req,
res
)=>{


try{


const {id}=req.params;


const headline =
 await getOrCreateHeadline();



const item =
 headline.items.id(id);



if(!item){

return res.status(404).json({

success:false,

message:"Headline not found."

});

}



item.visible =
 !item.visible;



await headline.save();



res.status(200).json({

success:true,

message:
"Visibility updated.",

item

});



}catch(error){


console.error(
"TOGGLE ERROR:",
error
);


res.status(500).json({

success:false,

message:
"Failed to toggle visibility."

});


}


};





/*
|--------------------------------------------------------------------------
| UPLOAD / REPLACE IMAGE
|--------------------------------------------------------------------------
*/

export const uploadHeadlineImage =
async(req,res)=>{


try{


const {id}=req.params;



if(!req.file){

return res.status(400).json({

success:false,

message:
"Image is required."

});

}



if(
!req.file.mimetype.startsWith("image")
){

return res.status(400).json({

success:false,

message:
"Only image files allowed."

});

}




const headline =
 await getOrCreateHeadline();



const item =
 headline.items.id(id);



if(!item){

return res.status(404).json({

success:false,

message:
"Headline not found."

});

}



if(item.imagePublicId){

await deleteFromCloudinary(
item.imagePublicId
);

}



const uploadedImage =
 await uploadToCloudinary(
   req.file.buffer,
   "top-headlines"
 );



item.image =
 uploadedImage.secure_url;


item.imagePublicId =
 uploadedImage.public_id;



await headline.save();



res.status(200).json({

success:true,

message:
"Image uploaded successfully.",


image:{

secure_url:
uploadedImage.secure_url,


public_id:
uploadedImage.public_id

}

});



}catch(error){


console.error(
"UPLOAD IMAGE ERROR:",
error
);


res.status(500).json({

success:false,

message:
"Failed to upload image."

});


}

};





/*
|--------------------------------------------------------------------------
| DELETE IMAGE ONLY
|--------------------------------------------------------------------------
*/

export const deleteHeadlineImage =
async(req,res)=>{


try{


const {id}=req.params;



const headline =
 await getOrCreateHeadline();



const item =
 headline.items.id(id);



if(!item){

return res.status(404).json({

success:false,

message:
"Headline not found."

});

}



if(item.imagePublicId){

await deleteFromCloudinary(
item.imagePublicId
);

}



item.image="";
item.imagePublicId="";



await headline.save();



res.status(200).json({

success:true,

message:
"Image deleted successfully."

});



}catch(error){


console.error(
"DELETE IMAGE ERROR:",
error
);


res.status(500).json({

success:false,

message:
"Failed to delete image."

});


}

};