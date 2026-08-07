--
-- PostgreSQL database dump
--

\restrict haOMygJQEe21z3KBspBaEJ36pf2ZYFsOq1o3tTYyrH29cEkWZvWIP5K1zPLLWZ5

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-08-04 22:42:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 227 (class 1259 OID 24725)
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    appointment_id character varying(10) NOT NULL,
    patient_id character varying(10),
    doctor_id character varying(10),
    appointment_date date,
    appointment_time time without time zone,
    reason_for_visit character varying(255),
    status character varying(30)
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24739)
-- Name: billing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.billing (
    bill_id character varying(10) NOT NULL,
    patient_id character varying(10),
    treatment_id character varying(10),
    bill_date date,
    amount numeric(10,2),
    payment_method character varying(50),
    payment_status character varying(30)
);


ALTER TABLE public.billing OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24655)
-- Name: consents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consents (
    consent_id integer NOT NULL,
    patient_id character varying(10) NOT NULL,
    consent_type character varying(100),
    consent_given boolean,
    consent_date date,
    expiry_date date
);


ALTER TABLE public.consents OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24654)
-- Name: consents_consent_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consents_consent_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consents_consent_id_seq OWNER TO postgres;

--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 223
-- Name: consents_consent_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consents_consent_id_seq OWNED BY public.consents.consent_id;


--
-- TOC entry 226 (class 1259 OID 24719)
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    doctor_id character varying(10) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    specialization character varying(100),
    phone_number character varying(20),
    years_experience integer,
    hospital_branch character varying(100),
    email character varying(100)
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24698)
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    patient_id character varying(10) NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    gender character varying(10),
    date_of_birth date,
    contact_number character varying(20),
    address text,
    registration_date date,
    insurance_provider character varying(100),
    insurance_number character varying(50),
    email character varying(100)
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 24731)
-- Name: treatments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.treatments (
    treatment_id character varying(10) NOT NULL,
    appointment_id character varying(10),
    treatment_name character varying(100),
    treatment_description text,
    cost numeric(10,2),
    treatment_date date
);


ALTER TABLE public.treatments OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24578)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    full_name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    specialization character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'DOCTOR'::character varying, 'PATIENT'::character varying, 'RECEPTIONIST'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24577)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 222 (class 1259 OID 24640)
-- Name: vitals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vitals (
    vital_id integer NOT NULL,
    patient_id character varying(10) NOT NULL,
    heart_rate integer,
    spo2 integer,
    systolic_bp integer,
    diastolic_bp integer,
    temperature numeric(4,1),
    recorded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vitals OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24639)
-- Name: vitals_vital_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vitals_vital_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vitals_vital_id_seq OWNER TO postgres;

--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 221
-- Name: vitals_vital_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vitals_vital_id_seq OWNED BY public.vitals.vital_id;


--
-- TOC entry 4890 (class 2604 OID 24658)
-- Name: consents consent_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consents ALTER COLUMN consent_id SET DEFAULT nextval('public.consents_consent_id_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 24581)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4888 (class 2604 OID 24643)
-- Name: vitals vital_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vitals ALTER COLUMN vital_id SET DEFAULT nextval('public.vitals_vital_id_seq'::regclass);


--
-- TOC entry 5072 (class 0 OID 24725)
-- Dependencies: 227
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5074 (class 0 OID 24739)
-- Dependencies: 229
-- Data for Name: billing; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5069 (class 0 OID 24655)
-- Dependencies: 224
-- Data for Name: consents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5071 (class 0 OID 24719)
-- Dependencies: 226
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5070 (class 0 OID 24698)
-- Dependencies: 225
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5073 (class 0 OID 24731)
-- Dependencies: 228
-- Data for Name: treatments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5065 (class 0 OID 24578)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5067 (class 0 OID 24640)
-- Dependencies: 222
-- Data for Name: vitals; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 223
-- Name: consents_consent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consents_consent_id_seq', 1, false);


--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 221
-- Name: vitals_vital_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vitals_vital_id_seq', 1, false);


--
-- TOC entry 4905 (class 2606 OID 24730)
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (appointment_id);


--
-- TOC entry 4909 (class 2606 OID 24744)
-- Name: billing billing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing
    ADD CONSTRAINT billing_pkey PRIMARY KEY (bill_id);


--
-- TOC entry 4899 (class 2606 OID 24662)
-- Name: consents consents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consents
    ADD CONSTRAINT consents_pkey PRIMARY KEY (consent_id);


--
-- TOC entry 4903 (class 2606 OID 24724)
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (doctor_id);


--
-- TOC entry 4901 (class 2606 OID 24705)
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (patient_id);


--
-- TOC entry 4907 (class 2606 OID 24738)
-- Name: treatments treatments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatments
    ADD CONSTRAINT treatments_pkey PRIMARY KEY (treatment_id);


--
-- TOC entry 4893 (class 2606 OID 24594)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4895 (class 2606 OID 24592)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4897 (class 2606 OID 24648)
-- Name: vitals vitals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vitals
    ADD CONSTRAINT vitals_pkey PRIMARY KEY (vital_id);


--
-- TOC entry 4912 (class 2606 OID 24760)
-- Name: appointments fk_appointments_doctor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id);


--
-- TOC entry 4913 (class 2606 OID 24755)
-- Name: appointments fk_appointments_patient; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id);


--
-- TOC entry 4915 (class 2606 OID 24770)
-- Name: billing fk_billing_patient; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing
    ADD CONSTRAINT fk_billing_patient FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id);


--
-- TOC entry 4916 (class 2606 OID 24775)
-- Name: billing fk_billing_treatment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing
    ADD CONSTRAINT fk_billing_treatment FOREIGN KEY (treatment_id) REFERENCES public.treatments(treatment_id);


--
-- TOC entry 4911 (class 2606 OID 24780)
-- Name: consents fk_consents_patient; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consents
    ADD CONSTRAINT fk_consents_patient FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id);


--
-- TOC entry 4914 (class 2606 OID 24765)
-- Name: treatments fk_treatments_appointment; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.treatments
    ADD CONSTRAINT fk_treatments_appointment FOREIGN KEY (appointment_id) REFERENCES public.appointments(appointment_id);


--
-- TOC entry 4910 (class 2606 OID 24785)
-- Name: vitals fk_vitals_patient; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vitals
    ADD CONSTRAINT fk_vitals_patient FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id);


-- Completed on 2026-08-04 22:42:21

--
-- PostgreSQL database dump complete
--

\unrestrict haOMygJQEe21z3KBspBaEJ36pf2ZYFsOq1o3tTYyrH29cEkWZvWIP5K1zPLLWZ5

