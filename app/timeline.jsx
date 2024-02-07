"use client"

import React from "react"
import { Chart } from "react-google-charts"

export default function Timeline(props) {

    return (<Chart chartType="Timeline" data={props.data} width="100%" height="150%" options={{ allowHtml: true }} />)

}