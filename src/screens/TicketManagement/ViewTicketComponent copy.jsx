import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { _base, userSessionData } from '../../settings/constants';
import { Spinner, Modal } from 'react-bootstrap';
import Alert from '../../components/Common/Alert';
import Attachment from '../../components/Common/Attachment';
import { _attachmentUrl } from "../../settings/constants";
import { getAttachment } from "../../services/OtherService/AttachmentService";
import ErrorLogService from "../../services/ErrorLogService";
import MyTicketService from "../../services/TicketService/MyTicketService";
import ReportService from '../../services/ReportService/ReportService'
import PageHeader from "../../components/Common/PageHeader";
import { getCurrentDate, getDateTime } from "../../components/Utilities/Functions";
import StatusCard from "../../components/Ticket/StatusCard";
import TicketChat from "../../components/Ticket/TicketChat";
import Chart from "react-apexcharts";
import { ExportToExcel } from "../../components/Utilities/Table/ExportToExcel";
import CommentData from "./CommentData";

//TAGGING
import { EditorState } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";
import "draft-js/dist/Draft.css";
import "draft-js-mention-plugin/lib/plugin.css";
import mentions from "./mentions";
import { convertToHTML } from "draft-convert";
import editorStyles from './SimpleMentionEditor.module.css';

import DesignationService from "../../services/MastersService/DesignationService";
import Select from 'react-select';


const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin];

export default function ViewTicketComponent({ match }) {

    const history = useNavigate();
    const ticketId = match.params.id;
    const [notify, setNotify] = useState(null);
    const [rangeBar, SetRangeBar] = useState(null);
    const [showLoaderModal, setShowLoaderModal] = useState(false);

    const [suggestions, setSuggestions] = useState(mentions);
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const editor = useRef(null);

    const onSearchChange = ({ value }) => {
        setSuggestions(defaultSuggestionsFilter(value, mentions));
    };

    const [idCount, setIdCount] = useState([]);

    const onAddMention = (e) => {
        setIdCount(idCount => [...idCount, e.id]);
    };

    const focusEditor = () => {
        editor.current.focus();
    };
    const [commentData, setCommentData] = useState({
        ticketId: ticketId,
        userId: localStorage.getItem("id"),
        comments: [],
    });
    const [ba, setBa] = useState(null)
    const [dev, setDev] = useState(null)
    const [tester, setTester] = useState(null)
    const [convertedContent, setConvertedContent] = useState(null);

    const [data, setData] = useState(null);
    const [attachment, setAttachment] = useState(null);

    const [isSolved, setIsSolved] = useState(false);
    const current = new Date();
    const todayDate = `${current.getFullYear()}-${(current.getMonth() + 1 < 10) ? "0" + current.getMonth() + 1 : current.getMonth() + 1}-${current.getDate()}`;
    const [chart, setChart] = useState(null);

    const [allUsers, setAllUsers] = useState();
    const [allUsersString, setAllUsersString] = useState();

    const loadData = async () => {
        setShowLoaderModal(true);

        const allTempUser = mentions.map(d => d.name);
        var tempString = "";
        allTempUser.forEach((d) => {
            tempString = tempString + d;
        })

        setAllUsers(allTempUser);
        setAllUsersString(tempString);
        //console.log(allTempUser);
        await new MyTicketService().getTicketById(ticketId).then(res => {
            setShowLoaderModal(null);
            if (allUsersString) {
                setShowLoaderModal(false);
            } else {
                alert("data not loaded");
            }
            if (res.status === 200) {
                const data = res.data.data;
                if (data.status_id == 3) {
                    setIsSolved(true);
                }
                setData(null);
                setData(data);

                new ReportService().getTimeLineReport({ ticket_id: res.data.data.ticket_id }).then(res => {
                    if (res.status === 200) {
                        const data = res.data.data;
                        setChart(null);
                        setChart(data);
                    }
                })

                handleAttachment("GetAttachment", ticketId);
            }
        });
        loadComments();


        await new DesignationService().getdesignatedDropdown().then((res) => {
            if (res.status === 200) {
                if (res.data.status == 1) {
                    const deta = res.data.data
                    setBa(deta.BA.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name })));
                    setDev(deta.DEV.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name })));
                    setTester(deta.TESTER.map(d => ({ value: d.id, label: d.first_name + "-" + d.last_name })));
                }
            }
        })
    }

    const loadComments = async () => {
        await new MyTicketService().getComments(match.params.id).then((res) => {
            if (res.status === 200) {
                setCommentData(res.data.data);
            }
        });
    }

    const handleAttachment = (type, ticket_id, attachmentId = null) => {
        getAttachment(ticket_id, 'TICKET').then(res => {
            if (res.status === 200) {
                const data = res.data.data;
                const temp = [];
                data.forEach(d => {
                    if (userSessionData.account_for === "CUSTOMER" && d.show_to_customer === 1) {
                        temp.push(d);
                    } else {
                        temp.push(d);
                    }
                })

                setAttachment(data);
            }
        })
    }

    const handleForm = async (e) => {
        e.preventDefault();

        const convertContentToHTML = () => {
            //console.log("Edi:"+editorState.getCurrentContent());
            let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
            // console.log("Com :"+commentData);   
            var comment = currentContentAsHTML;
            //console.log("HTML :"+comment);

            var ticket_id = ticketId;
            // var comment1 = currentContentAsHTML.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");.replace("\r\n", "<br />");
            // console.log("com1 :"+comment1);
            // var comment = comment1.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
            // // var comment = currentContentAsHTML.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "");
            // console.log("com2 :"+comment);

            var mentions_id = idCount.reduce((acc, curr) => `${acc}${curr},`, '');
            if (comment != '') {
                new MyTicketService().postComment({ ticket_id, comment, mentions_id }).then((res) => {
                    if (res.status === 200) {
                        loadComments();
                        // setCommentData({
                        // ...commentData,
                        //     comments: [{
                        //         cmt: comment,
                        //         time: getDateTime(),
                        //         user_id: localStorage.getItem("name"),
                        //     },
                        //     ...commentData.comments,
                        //     ],
                        //     });
                        setEditorState(EditorState.createEmpty());
                    }
                });
            }

        };
        convertContentToHTML();
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <div className="container-xxl">

            <PageHeader headerTitle={`Ticket - ${data ? data.ticket_id : ""}`} />

            {notify && <Alert alertData={notify} />}

            <div className="row g-3 mt-2">

                <div className="col-xxl-8 col-xl-8 col-lg-12 col-md-12">

                    <div className="row g-3 mb-3">
                        <div className="col-md-3">
                            <StatusCard progress={data ? data.status : ""}
                                progressBg="bg-warning" iconClass="icofont-optic fs-4" iconbg="bg-lightyellow" title="Status" />
                        </div>
                        <div className="col-md-3">
                            <StatusCard progress={data ? data.created_by : ""}
                                progressBg="bg-info"
                                iconClass="icofont-user fs-4"
                                iconbg="bg-lightblue"
                                title="Created By" />
                        </div>
                        <div className="col-md-3">
                            <StatusCard progress={data ? data.priority : ""}
                                progressBg="bg-danger" details="" iconClass="icofont-price fs-4" iconbg="bg-lightgreen" title="Priority" />
                        </div>
                        <div className="col-md-4">
                            <StatusCard progress={data ? data.passed_status : ''}
                                progressBg="bg-success"
                                iconClass="icofont-user fs-4"
                                iconbg="bg-lightblue"
                                title="Passing Status" />
                        </div>
                    </div>
                    <div className="form-group row mb-3">
                        <div className="col-md ">
                            <label className="col-form-label">
                                <b>Business Analyst : </b>
                            </label>
                            {ba &&
                                <div className="col-md">
                                    <Select
                                        id="ba_id"
                                        name="ba_id"
                                        isDisabled={true}
                                        options={ba}

                                    />
                                </div>
                            }
                        </div>

                        <div className="col-md">
                            <label className="col-form-label">
                                <b>Developer : </b>
                            </label>
                            <div className="col-md">
                                <Select id="dev_id" name="dev_id"
                                    options={dev}
                                    isDisabled={true}

                                />
                            </div>
                        </div>


                        <div className="col-md">
                            <label className="col-form-label">
                                <b>Tester : </b>
                            </label>
                            <div className="col-md">
                                <Select id="tester_id" name="tester_id"
                                    options={tester}
                                    isDisabled={true}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 mb-3">
                        <div className="col-md-12">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h6 className="fw-bold mb-3 text-danger">Description</h6>
                                    <p>{data ? data.description : ""}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-3 ">
                        <div className="col-lg-6 col-md-6">
                            {/* <AttechedCard data={BugImageAttechedData} /> */}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-12">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h6 className="fw-bold mb-3 text-danger">Attachments</h6>
                                    {/* <Attachment refId={data ? data.id : ""}/> */}
                                    {attachment && <div className="flex-grow-1">{
                                        attachment.map((data, i) => {
                                            return <div key={"cuhdus" + i} className=" d-flex align-items-center border-bottom">

                                                <div className="d-flex ms-3 align-items-center flex-fill">
                                                    <span className={`avatar lg fw-bold  rounded-circle text-center d-flex align-items-center justify-content-center`}>
                                                        {i + 1})
                                                    </span>
                                                    <div className="d-flex flex-column ">
                                                        <h6 className="fw-bold mb-0 small-14">{data.name}</h6>
                                                    </div>
                                                </div>
                                                <div className="mr-1">
                                                    {/* <a href={`${_attachmentUrl}${data.path}`}
                                                    target='_blank'
                                                    download="ABC.png"
                                                    className='btn btn-primary btn-sm'
                                                >
                                                    <i class="icofont-download"></i> View
                                                </a> */}

                                                    <a href={`${_attachmentUrl}${data.path}`}
                                                        target='_blank'
                                                        download="ABC.png"
                                                        className='btn btn-primary btn-sm'
                                                    >
                                                        <i class="icofont-download"></i> Download
                                                    </a>
                                                </div>
                                                {/* <button type="button" className="btn btn-sm btn-primary">Download</button> */}
                                            </div>
                                        })
                                    }
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>




                </div> {/*  COL */}

                <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12">
                    <div className="card">
                        <div className="card-body card-body-height py-4">
                            <div className="row">
                                <div className="col-lg-12 col-md-12">
                                    <h6 className="mb-0 fw-bold mb-3">Ticket Chat</h6>
                                    <div className="card mb-2">
                                        <div className="card-body">
                                            <div className="post" id="post">
                                                <form onSubmit={handleForm}>
                                                    <div
                                                        className={editorStyles.editor}
                                                        onClick={() => {
                                                            focusEditor();
                                                        }}
                                                    >
                                                        <Editor
                                                            ref={editor}
                                                            editorState={editorState}
                                                            plugins={plugins}
                                                            onChange={(editorState) =>
                                                                setEditorState(editorState)
                                                            }
                                                            placeholder={"Comment here..."}
                                                            id="comment"
                                                        />
                                                        <MentionSuggestions
                                                            style={{ color: "light-blue" }}
                                                            onSearchChange={onSearchChange}
                                                            suggestions={suggestions}
                                                            onAddMention={onAddMention}
                                                        />
                                                    </div>

                                                    <div className="py-3">
                                                        {/* <a href="#!" className="px-3 " title="upload images"><i className="icofont-ui-camera"></i></a>
                                                    <a href="#!" className="px-3 " title="upload video"><i className="icofont-video-cam"></i></a>
                                                    <a href="#!" className="px-3 " title="Send for signuture"><i className="icofont-pen-alt-2"></i></a> */}
                                                        <button type="submit" className="btn btn-primary float-sm-end  mt-2 mt-sm-0">Send</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="list-unstyled res-set">
                                        <li className="card mb-2">
                                            <div className="card-body">

                                                {allUsers && allUsersString && commentData && commentData.comments.map((ele, i) => {
                                                    return (
                                                        <div key={i}>
                                                            <div className="d-flex mt-3 pt-3 border-top">
                                                                {/* <img
                                                    className="avatar rounded-circle"
                                                    src="assets/images/xs/avatar2.jpg"
                                                    alt=""
                                                    /> */}
                                                                <span className="flex-fill ms-3 text-truncate">


                                                                    <h4 className="mb-0" style={{ whiteSpace: 'pre-line', overflowWrap: 'break-word', fontSize: '14px' }}>

                                                                        <CommentData data={ele.cmt}
                                                                            allUsers={allUsers}
                                                                            allUsersString={allUsersString}

                                                                        />
                                                                    </h4>

                                                                    <span className="text-muted d-flex justify-content-between">
                                                                        <span>{ele.user_id}  </span>
                                                                        <small className="msg-time">
                                                                            {ele.time}
                                                                        </small>
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h6 className="fw-bold mb-3 text-danger">
                                    Timeline
                                </h6>

                                {chart && <Chart
                                    options={chart.options}
                                    series={chart.series}
                                    type="rangeBar"
                                    height={chart.options.chart.height} />
                                }
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <Modal show={showLoaderModal} centered >
                <Modal.Body className="text-center">
                    <Spinner animation="grow" variant="primary" />
                    <Spinner animation="grow" variant="secondary" />
                    <Spinner animation="grow" variant="success" />
                    <Spinner animation="grow" variant="danger" />
                    <Spinner animation="grow" variant="warning" />
                    <Spinner animation="grow" variant="info" />
                    <Spinner animation="grow" variant="dark" />
                </Modal.Body>
            </Modal>

        </div>
    )
}

