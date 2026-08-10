// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import {
//     ClassicEditor,

//     Essentials,
//     Paragraph,
//     Bold,
//     Italic,
//     Underline,

//     Heading,

//     Font,
//     Alignment,

//     List,

//     Link,

//     Table,
//     TableToolbar,

//     BlockQuote,

//     Image,
//     ImageToolbar,
//     ImageCaption,
//     ImageResize,
//     ImageStyle,
//     ImageUpload,

//     MediaEmbed,

//     Undo
// } from "ckeditor5";

// import "ckeditor5/ckeditor5.css";

// import { editorConfig } from "./editorConfig";

// const Editor = ({ value, onChange }) => {

//     return (

//         <CKEditor

//             editor={ClassicEditor}

//             config={{

//                 plugins: [

//                     Essentials,

//                     Paragraph,

//                     Heading,

//                     Bold,
//                     Italic,
//                     Underline,

//                     Font,

//                     Alignment,

//                     List,

//                     Link,

//                     Table,
//                     TableToolbar,

//                     BlockQuote,

//                     Image,
//                     ImageToolbar,
//                     ImageCaption,
//                     ImageResize,
//                     ImageStyle,
//                     ImageUpload,

//                     MediaEmbed,

//                     Undo

//                 ],

//                 ...editorConfig

//             }}

//             data={value}

//             onChange={(event, editor) => {

//                 const data = editor.getData();

//                 onChange(data);

//             }}

//         />

//     );

// };

// export default Editor;