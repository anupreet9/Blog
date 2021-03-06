import React, { useState, useEffect, useRef } from 'react';
import { getAllEmails, sendEmail } from '../../services/mails';
import { Editor } from '@tinymce/tinymce-react';
import domain from '../domain';

function SendEmail() {

    var config = {
        selector: "#editor",
        height: 1000,
        autosave_ask_before_unload: false,
        powerpaste_allow_local_images: true,
        plugins: [
            '  advlist anchor autolink codesample fullscreen help image imagetools tinydrive',
            ' lists link media noneditable  preview quickbars ',
            ' searchreplace table template visualblocks wordcount print hr'
        ],
        toolbar: "undo redo print | styleselect hr | fontselect fontsizeselect bold italics underline | forecolor backcolor | link image | alignleft aligncenter alignright alignjustify |lineheight | numlist bullist indent outdent | removeformat",
        content_css: "document",
        skin: "material-classic",
        icons: "material",
        spellchecker_dialog: true,
        spellchecker_whitelist: ['Ephox', 'Moxiecode'],
        tinydrive_demo_files_url: '/docs/demo/tiny-drive-demo/demo_files.json',
        tinydrive_token_provider: function (success, failure) {
            success({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huZG9lIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Ks_BdfH4CWilyzLNk8S2gDARFhuxIauLa8PwhdEQhEo' });
        },
        content_style: "@import url('@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap');'); body { font-family: 'Libre Baskerville', Georgia, serif; font-size: 16pt; color: #292929; }",
        quickbars_selection_toolbar: "bold italic underline link | forecolor backcolor | alignleft aligncenter | fontsizeselect",
        quickbars_insert_toolbar: "image media styleselect hr",
        relative_urls: false,
        remove_script_host: false,
        document_base_url: domain,
        force_br_newlines: true,
        inline_styles: true,
        branding: false,
        style_formats: [
            {
                title: 'Button', inline: 'span', styles: {
                    'background-color': 'rgb(182, 84, 122)', 'border': 'none',
                    'border-radius': '4px', 'box-sizing': 'border-box',
                    'color': '#ffffff',
                    'display': 'inline-block', 'outline': 'none',
                    'padding': '6px 20px',
                    'text-decoration': 'none'
                }
            },
            {
                title: 'Line', selector: 'hr', styles: {
                    'width': '80%',
                    'border-top': '1.5px solid lightgrey'
                }
            },
            {
                title: 'No underline', selector: 'a', styles: {
                    'text-decoration': 'none',
                    'box-shadow': 'none'
                }
            },
            {
                title: 'Div', selector: 'p,h1,h2,h3,h4,h5,h6,div',
                styles: {
                    'background-color': '#bcbcbc',
                    'border': 'none',
                    'box-sizing': 'border-box',
                    'display': 'block',
                    'padding': '40px',
                    'margin': '0',
                    'line-spacing': '2px'
                }
            }

        ]
    };

    const [to, setTo] = useState([]);
    const [subject, setSubject] = useState("");
    const [alert, setAlert] = useState({
        status: false,
        text: ""
    });
    const [html, setHtml] = useState(`<div><a href="${domain}/home"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://i.ibb.co/q07rnNh/Untitled-1-November-2020-01-43-36-6.jpg" alt="" width="318" height="216" /></a></div> <div>&nbsp;</div> <div>&nbsp;</div> <div style="text-align: center;">&nbsp;</div> <div style="text-align: center;">&nbsp;</div> <div style="text-align: center;">&nbsp;</div> <div style="text-align: center;">&nbsp;</div> <div style="text-align: center;"><hr style="width: 80%; border-top: 1.5px solid lightgrey;" /> <h5 class="subtitle" style="box-sizing: border-box; margin-top: 0px; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2; color: #212529; font-size: 1.25rem; padding-top: 25px;">A regular curly haired</h5> <h5 class="subtitle" style="box-sizing: border-box; margin-top: 0px; margin-bottom: 0.5rem; font-weight: 500; line-height: 1.2; color: #212529; font-size: 1.25rem; padding-top: 25px;"><span style="background-color: #ffffff; color: #000000;"><a style="text-decoration: none; box-shadow: none; background-color: #ffffff; color: #000000;" href="${domain}/unsubscribe/{{randomString}}"><span style="font-size: 10pt; background-color: #ffffff;">Unsubscribe&nbsp;</span></a></span></h5> <p><span style="font-size: 10pt;"><em>Connect with us<br /><br /><a href="https://www.facebook.com/CurlyHairedEscapade/"><img src="https://i.ibb.co/dsN5try/iconfinder-Circled-Facebook-svg-5279111.png" alt="" width="27" height="27" /></a>&nbsp; &nbsp;<a href="https://instagram.com/acurlyhairedescapade?igshid=1chwyyomvc5bv"><img src="https://i.ibb.co/JrZQ3YN/iconfinder-38-instagram-1161953.png" alt="" width="28" height="28" /></a> &nbsp; <br /></em></span></p> </div>`);
    const mounted = useRef(true);

    useEffect(() => {
        document.title = "Send Email Newletter | Curly Haired Escapade"
    }, [])

    useEffect(() => {
        if (alert.status) {
            setTimeout(() => {
                if (mounted.current) {
                    setAlert({
                        status: false,
                        text: ""

                    });
                }
            }, 2000)
        }
    }, [alert]);

    useEffect(() => {
        getAllEmails()
            .then(items => {
                let array = Object.values(items).filter(item => item.confirm === true);
                setTo(array)
            })
    }, []);

    function handleOtherChange(content) {
        setHtml(content);
    }

    function handleChange(event) {
        const { value } = event.target;
        setSubject(value)
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log(to);
        to.map(function (email) {
            sendEmail(email.email, subject, html, email.randomString)
                .then((text) => {
                    setAlert({
                        status: true,
                        text: text
                    });
                    setHtml("");
                    setTo([]);
                    setSubject("");
                })
                
            return 1;
        })

    }

    return (
        <div className="centered">
            <h1 className="text-center">Send Email Newsletter</h1>
            <form className="email-form">
                <div className="form-group ">
                    <label htmlFor="subject">Enter subject of email</label>
                    <input type="text" className="form-control" name="subject" placeholder="Subject" value={subject} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="editor">Enter body of email</label>
                    <Editor apiKey={`${process.env.REACT_APP_TINY_API_KEY}`} id="editor" init={config} onEditorChange={handleOtherChange} value={html} />
                </div>
                <div className="form-group">
                    {alert.status && <h2> {alert.text}</h2>}
                    <button type="submit" className="btn btn-dark" onClick={handleSubmit}>Submit</button>
                </div>
            </form>
        </div>
    )
}
export default SendEmail;