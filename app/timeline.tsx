"use client"

import React from "react"
import { useRouter } from 'next/navigation'
import { Chart, ReactGoogleChartEvent } from "react-google-charts"


export default function Timeline(props) {
    const router = useRouter()

    const chartEvents: ReactGoogleChartEvent[] = [
        {
            eventName: "select",
            callback: ({ chartWrapper }) => {
                const chart = chartWrapper.getChart()
                const selection = chart.getSelection()
                if (selection.length === 1) {
                    const [selectedItem] = selection;
                    const dataTable = chartWrapper.getDataTable();
                    const { row, column } = selectedItem;

                    const link: string = dataTable?.getValue(row, 5) as string;
                    console.log("You selected:", {
                        row,
                        column,
                        value:link,
                    });
                    router.push(link, { scroll: false });
                }
            },
        },
    ]

    return (<Chart chartType="Timeline" data={props.data} width="100%" height="150%" options={{ allowHtml: true }} chartEvents={chartEvents} />)

}